import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { TaskModel, ITaskRepository } from '../src/index.js';
import {
  TaskStatus,
  TaskPriority,
  TaskStateMachine,
  CancellationSource,
  RetryPolicy,
  InMemoryEventBus,
  BullMQEventBus,
  Scheduler,
  ExecutionContext,
  IllegalStateTransitionError,
  TaskNotFoundError,
  TenantContextError,
  DuplicateTaskError,
  EventBusError,
  EventTopic,
} from '../src/index.js';
import { NullLogger } from '@agent-xai/shared';
import type { CancellationToken } from '../src/cancellation/index.js';
import type { ICredentialResolver } from '../src/context/index.js';
import { TaskContextBuilder } from '../src/context/task-context-builder.js';
import { Worker } from 'bullmq';

const mockCredentialResolver: ICredentialResolver = {
  resolve: vi.fn().mockResolvedValue('mock-secret'),
};

// Mock bullmq and ioredis for BullMQEventBus tests
vi.mock('bullmq', () => {
  const QueueMock = vi.fn().mockImplementation(() => ({
    add: vi.fn().mockResolvedValue({ id: 'job-1' }),
    close: vi.fn().mockResolvedValue(undefined),
  }));
  const WorkerMock = vi.fn().mockImplementation(() => ({
    close: vi.fn().mockResolvedValue(undefined),
  }));
  return { Queue: QueueMock, Worker: WorkerMock };
});

vi.mock('ioredis', () => {
  const Redis = vi.fn().mockImplementation(() => ({
    quit: vi.fn().mockResolvedValue(undefined),
  }));
  return { default: Redis, Redis };
});

const mockLogger = new NullLogger();
const mockResolver = mockCredentialResolver;

const createMockTask = (id: string, status = TaskStatus.CREATED): TaskModel => ({
  id,
  orgId: 'org-1',
  goal: 'test goal',
  status,
  priority: TaskPriority.NORMAL,
  rootTaskId: id,
  dependsOn: [],
  traceId: 'trace-1',
  metadata: { retryCount: 0 },
  context: { variables: {}, history: [] },
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe('Errors', () => {
  it('instantiates all custom errors', () => {
    expect(new DuplicateTaskError('t1')).toBeInstanceOf(Error);
    expect(new EventBusError('err')).toBeInstanceOf(Error);
  });
});

describe('Task State Machine', () => {
  it('transitions through valid paths and rejects illegal paths', () => {
    let task = createMockTask('t1');
    expect(task.status).toBe(TaskStatus.CREATED);

    task = TaskStateMachine.transition(task, TaskStatus.QUEUED);
    expect(task.status).toBe(TaskStatus.QUEUED);

    task = TaskStateMachine.transition(task, TaskStatus.RUNNING);
    expect(task.status).toBe(TaskStatus.RUNNING);

    task = TaskStateMachine.transition(task, TaskStatus.WAITING_APPROVAL);
    expect(task.status).toBe(TaskStatus.WAITING_APPROVAL);

    task = TaskStateMachine.transition(task, TaskStatus.RUNNING);
    expect(task.status).toBe(TaskStatus.RUNNING);

    task = TaskStateMachine.transition(task, TaskStatus.COMPLETED);
    expect(task.status).toBe(TaskStatus.COMPLETED);

    expect(() => TaskStateMachine.transition(task, TaskStatus.RUNNING)).toThrow(
      IllegalStateTransitionError,
    );
  });

  it('allows cancel from any state', () => {
    let task = createMockTask('t1', TaskStatus.RUNNING);
    task = TaskStateMachine.transition(task, TaskStatus.CANCELLED);
    expect(task.status).toBe(TaskStatus.CANCELLED);
  });

  it('handles canTransition fallback for invalid statuses or terminal checks', () => {
    expect(TaskStateMachine.canTransition(TaskStatus.COMPLETED, TaskStatus.RUNNING)).toBe(false);
    expect(
      TaskStateMachine.canTransition('INVALID' as unknown as TaskStatus, TaskStatus.RUNNING),
    ).toBe(false);
  });
});

describe('Cancellation Engine', () => {
  it('aborts token execution and propagates nested cancel events', () => {
    const source = new CancellationSource();
    const token = source.token;
    expect(token.isCancelled).toBe(false);

    const child = token.fork();
    expect(child.isCancelled).toBe(false);

    source.cancel('shutdown requested');
    expect(token.isCancelled).toBe(true);
    expect(token.reason).toBe('shutdown requested');
    expect(child.isCancelled).toBe(true);
    expect(child.reason).toBe('Parent cancelled: shutdown requested');

    expect(() => token.checkCancellation()).toThrow('Operation cancelled: shutdown requested');
  });
});

describe('Retry Engine', () => {
  it('calculates backoff delays for exponential, linear, and constant methods', () => {
    const constant = new RetryPolicy({ type: 'constant', initialDelayMs: 100 });
    const constDelay = constant.calculateDelay(0);
    expect(constDelay).toBeGreaterThanOrEqual(80);
    expect(constDelay).toBeLessThanOrEqual(120);

    const linear = new RetryPolicy({ type: 'linear', initialDelayMs: 100 });
    const linearDelay = linear.calculateDelay(1);
    expect(linearDelay).toBeGreaterThanOrEqual(160);
    expect(linearDelay).toBeLessThanOrEqual(240);

    const exponential = new RetryPolicy({
      type: 'exponential',
      initialDelayMs: 100,
      backoffMultiplier: 2.0,
    });
    const expDelay = exponential.calculateDelay(2);
    expect(expDelay).toBeGreaterThanOrEqual(320);
    expect(expDelay).toBeLessThanOrEqual(480);
  });

  it('bounds delay using maxDelayMs', () => {
    const policy = new RetryPolicy({ type: 'constant', initialDelayMs: 1000, maxDelayMs: 50 });
    const delay = policy.calculateDelay(0);
    expect(delay).toBeGreaterThanOrEqual(0);
    expect(delay).toBeLessThanOrEqual(60);
  });

  it('classifies retryable errors', () => {
    const policy = new RetryPolicy();
    expect(policy.isRetryable(new Error('ETIMEDOUT: Connection timed out'))).toBe(true);
    expect(policy.isRetryable(new Error('API Rate Limit Exceeded (429)'))).toBe(true);
    expect(policy.isRetryable(new Error('Fatal compile error'))).toBe(false);
  });

  it('runs operations with retry and propagates failures', async () => {
    const policy = new RetryPolicy({ maxAttempts: 1, initialDelayMs: 5 });

    const successVal = await policy.execute(async () => 'ok');
    expect(successVal).toBe('ok');

    let calls = 0;
    const failVal = policy.execute(async () => {
      calls++;
      throw new Error('ETIMEDOUT');
    });
    await expect(failVal).rejects.toThrow('ETIMEDOUT');
    expect(calls).toBe(2);

    let callsNon = 0;
    const nonVal = policy.execute(async () => {
      callsNon++;
      throw new Error('FATAL');
    });
    await expect(nonVal).rejects.toThrow('FATAL');
    expect(callsNon).toBe(1);
  });

  it('propagates raw errors in execute loop when non-error is thrown', async () => {
    const policy = new RetryPolicy({ maxAttempts: 0 });
    await expect(
      policy.execute(async () => {
        throw 'string_error';
      }),
    ).rejects.toThrow('string_error');
  });

  it('aborts retry execution if cancellation is triggered', async () => {
    const policy = new RetryPolicy({ maxAttempts: 5, initialDelayMs: 1000 });
    const source = new CancellationSource();
    source.cancel('stop');

    await expect(
      policy.execute(async () => 'ok', source.token as unknown as CancellationToken),
    ).rejects.toThrow('Operation cancelled: stop');
  });
});

describe('InMemoryEventBus', () => {
  it('implements publish, subscribe, request, reply, and broadcast', async () => {
    const bus = new InMemoryEventBus();
    const mockHandler = vi.fn();

    await bus.subscribe('test.topic', mockHandler);
    await bus.publish('test.topic', { message: 'hello' }, 'trace-1');

    await new Promise((r) => setTimeout(r, 10));
    expect(mockHandler).toHaveBeenCalledTimes(1);
    expect(mockHandler.mock.calls[0][0].traceId).toBe('trace-1');
    expect(mockHandler.mock.calls[0][0].payload.message).toBe('hello');

    // Request/Reply
    void bus.reply('service.greet', async (event) => {
      return { reply: `Hello, ${String((event.payload as Record<string, unknown>).name)}` };
    });

    const replyEvent = await bus.request<Record<string, unknown>, Record<string, unknown>>(
      'service.greet',
      { name: 'Claude' },
      'trace-2',
    );
    expect((replyEvent.payload as Record<string, unknown>).reply).toBe('Hello, Claude');

    // Duplicate event deduplication
    await bus.subscribe('dup.topic', mockHandler);
    const eventEnv = {
      id: 'dup-1',
      topic: 'dup.topic',
      traceId: 't',
      timestamp: new Date(),
      version: '1',
      sourceModule: 't',
      payload: {},
    };
    await (
      bus as unknown as { dispatch: (topic: string, event: unknown) => Promise<void> }
    ).dispatch('dup.topic', eventEnv);
    await (
      bus as unknown as { dispatch: (topic: string, event: unknown) => Promise<void> }
    ).dispatch('dup.topic', eventEnv); // Redundant dispatch
    expect(mockHandler).toHaveBeenCalledTimes(2);
  });

  it('catches and logs handler exceptions safely', async () => {
    const bus = new InMemoryEventBus();
    const mockConsole = vi.spyOn(console, 'error').mockImplementation(() => {});
    await bus.subscribe('error.topic', async () => {
      throw new Error('Handler crashed');
    });
    await bus.publish('error.topic', {}, 'tr');
    await new Promise((r) => setTimeout(r, 5));
    expect(mockConsole).toHaveBeenCalled();
    mockConsole.mockRestore();
  });

  it('broadcasts messages successfully', async () => {
    const bus = new InMemoryEventBus();
    const mockHandler = vi.fn();
    await bus.subscribe('test.broadcast', mockHandler);
    await bus.broadcast('test.broadcast', { message: 'hello' }, 'trace-1');
    await new Promise((r) => setTimeout(r, 10));
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });
});

describe('BullMQEventBus', () => {
  it('publishes and subscribes using mocked BullMQ infrastructure', async () => {
    const bus = new BullMQEventBus();
    await bus.publish('topic-a', { test: 1 }, 'tr-1');

    let received: unknown;
    await bus.subscribe('topic-a', async (event) => {
      received = event;
    });

    // Manually trigger the mock worker handler to cover subscribe and deduplication
    const mockWorkerConstructor = vi.mocked(Worker);
    const handler = mockWorkerConstructor.mock.calls[0][1] as (job: unknown) => Promise<unknown>;

    const mockJob = {
      data: { id: 'job-unique-1', topic: 'topic-a', traceId: 'tr-1', payload: { test: 1 } },
    };
    await handler(mockJob);
    expect((received as Record<string, unknown>).payload.test).toBe(1);

    // Call duplicate to test deduplication branch
    await handler(mockJob);

    // Test unsubscribe
    await bus.unsubscribe('topic-a');

    // Test close
    await bus.close();
  });

  it('handles request/reply using mocked BullMQ infrastructure', async () => {
    const bus = new BullMQEventBus();

    // Setup request/reply loop
    const _requestPromise = bus.request<Record<string, unknown>, Record<string, unknown>>(
      'service.test',
      { val: 42 },
      'tr-1',
      100,
    );

    // Simulate a reply worker manually
    const mockWorkerConstructor = vi.mocked(Worker);
    const _replyHandler = mockWorkerConstructor.mock.calls[0][1] as (
      job: unknown,
    ) => Promise<unknown>;

    // Retrieve replyTo channel
    const mockJob = {
      data: {
        id: 'job-req-1',
        topic: 'service.test',
        traceId: 'tr-1',
        payload: { val: 42 },
        metadata: { replyTo: 'service.test.reply.xxx' },
      },
    };

    await bus.reply('service.test', async (event) => {
      return { val: ((event.payload as Record<string, unknown>).val as number) + 1 };
    });

    // Manually trigger the reply handler
    const responseWorkerHandler = mockWorkerConstructor.mock.calls[1][1] as (
      job: unknown,
    ) => Promise<unknown>;
    await responseWorkerHandler(mockJob);

    // Trigger error path in reply handler to cover catch block
    const mockConsole = vi.spyOn(console, 'error').mockImplementation(() => {});
    await bus.reply('service.error', async () => {
      throw new Error('fail');
    });
    const errWorkerHandler = mockWorkerConstructor.mock.calls[3][1] as (
      job: unknown,
    ) => Promise<unknown>;
    await errWorkerHandler({ data: { id: 'job-err-1', topic: 'service.error', payload: {} } });

    // Also test replyTo without publish
    await errWorkerHandler({
      data: {
        id: 'job-err-2',
        topic: 'service.error',
        payload: {},
        metadata: { replyTo: undefined },
      },
    });

    expect(mockConsole).toHaveBeenCalled();
    mockConsole.mockRestore();

    // Trigger request timeout path
    await expect(bus.request('service.timeout', {}, 'tr-1', 1)).rejects.toThrow(
      'Request timed out for topic service.timeout',
    );

    // Trigger broadcast
    await bus.broadcast('test.broadcast', { message: 'hello' }, 'trace-1');

    // Trigger double subscribe error
    await bus.subscribe('topic-dup', async () => {});
    await expect(bus.subscribe('topic-dup', async () => {})).rejects.toThrow(
      'Already subscribed to topic topic-dup',
    );

    // Clean up
    await bus.close();
  });
});

describe('Scheduler', () => {
  let bus: InMemoryEventBus;
  let repo: ITaskRepository;
  let scheduler: Scheduler;

  beforeEach(() => {
    bus = new InMemoryEventBus();
    const tasks = new Map<string, TaskModel>();
    repo = {
      save: async (orgId, task) => {
        const existing = tasks.get(task.id);
        if (existing && existing.orgId !== orgId) throw new Error('Task organization mismatch');
        tasks.set(task.id, { ...task, orgId });
      },
      findById: async (orgId, id) => {
        const task = tasks.get(id);
        return task?.orgId === orgId ? task : undefined;
      },
      findByRootId: async (orgId, rootId) =>
        Array.from(tasks.values()).filter((t) => t.orgId === orgId && t.rootTaskId === rootId),
      getAll: async (orgId) => Array.from(tasks.values()).filter((t) => t.orgId === orgId),
    };
    scheduler = new Scheduler(bus, repo, { maxParallelAgents: 1 });
  });

  it('runs tasks in FIFO order and obeys concurrency limits', async () => {
    const t1 = createMockTask('t1');
    const t2 = createMockTask('t2');

    await scheduler.enqueue('org-1', t1);
    await scheduler.enqueue('org-1', t2);

    const saved1 = await repo.findById('org-1', 't1');
    const saved2 = await repo.findById('org-1', 't2');

    expect(saved1?.status).toBe(TaskStatus.RUNNING);
    expect(saved2?.status).toBe(TaskStatus.QUEUED);

    await scheduler.completeTask('org-1', 't1', { status: 'ok' });
    const saved1Post = await repo.findById('org-1', 't1');
    const saved2Post = await repo.findById('org-1', 't2');

    expect(saved1Post?.status).toBe(TaskStatus.COMPLETED);
    expect(saved2Post?.status).toBe(TaskStatus.RUNNING);
  });

  it('enqueues tasks with FAILED and RETRYING status', async () => {
    const tFailed = createMockTask('t-failed', TaskStatus.FAILED);
    await scheduler.enqueue('org-1', tFailed);
    const savedFailed = await repo.findById('org-1', 't-failed');
    // Task transitions QUEUED -> RUNNING immediately since maxParallel allows it
    expect(savedFailed?.status).toBe(TaskStatus.RUNNING);

    await scheduler.completeTask('org-1', 't-failed', { status: 'ok' });

    const tRetrying = createMockTask('t-retrying', TaskStatus.RETRYING);
    await scheduler.enqueue('org-1', tRetrying);
    const savedRetrying = await repo.findById('org-1', 't-retrying');
    expect(savedRetrying?.status).toBe(TaskStatus.RUNNING);
  });

  it('handles pause, resume, and cancel operations', async () => {
    const t = createMockTask('t1');
    await scheduler.enqueue('org-1', t);

    await scheduler.pause('org-1', 't1');
    const paused = await repo.findById('org-1', 't1');
    expect(paused?.status).toBe(TaskStatus.WAITING_APPROVAL);

    await scheduler.resume('org-1', 't1');
    const resumed = await repo.findById('org-1', 't1');
    expect(resumed?.status).toBe(TaskStatus.RUNNING);

    await scheduler.cancel('org-1', 't1', 'test cancellation');
    const cancelled = await repo.findById('org-1', 't1');
    expect(cancelled?.status).toBe(TaskStatus.CANCELLED);
    expect(cancelled?.cancellation?.reason).toBe('test cancellation');
  });

  it('does not allow another organization to control an in-flight task', async () => {
    const t = createMockTask('tenant-task');
    await scheduler.enqueue('org-1', t);

    await expect(scheduler.pause('org-b', 'tenant-task')).rejects.toThrow(TaskNotFoundError);
    await expect(scheduler.cancel('org-b', 'tenant-task', 'cross-tenant')).rejects.toThrow(
      TaskNotFoundError,
    );
    expect((await repo.findById('org-1', 'tenant-task'))?.status).toBe(TaskStatus.RUNNING);
    expect(await scheduler.getTask('org-b', 'tenant-task')).toBeUndefined();
  });

  it('does not let another organization complete or fail an in-flight task', async () => {
    const t = createMockTask('lifecycle-task');
    await scheduler.enqueue('org-1', t);

    await scheduler.completeTask('org-b', 'lifecycle-task', { status: 'hijacked' });
    await scheduler.failTask('org-b', 'lifecycle-task', { message: 'hijacked' });

    const owned = await repo.findById('org-1', 'lifecycle-task');
    expect(owned?.status).toBe(TaskStatus.RUNNING);
    expect(owned?.result).toBeUndefined();
    expect(owned?.error).toBeUndefined();

    await scheduler.completeTask('org-1', 'lifecycle-task', { status: 'ok' });
    expect((await repo.findById('org-1', 'lifecycle-task'))?.status).toBe(TaskStatus.COMPLETED);
  });

  it('rejects enqueue without organization context or with a mismatched task org', async () => {
    await expect(scheduler.enqueue('   ', createMockTask('no-org'))).rejects.toThrow(
      TenantContextError,
    );
    await expect(scheduler.enqueue('org-b', createMockTask('foreign-task'))).rejects.toThrow(
      TenantContextError,
    );
    expect(await repo.findById('org-1', 'foreign-task')).toBeUndefined();
    expect(await repo.findById('org-b', 'foreign-task')).toBeUndefined();
  });

  it('does not leak lifecycle events to another organization', async () => {
    const received: string[] = [];
    await bus.subscribe(EventTopic.TASK_COMPLETED, async (envelope) => {
      received.push((envelope.payload as TaskModel).orgId ?? 'none');
    });

    await scheduler.enqueue('org-1', createMockTask('event-task'));
    await scheduler.completeTask('org-b', 'event-task', { status: 'hijacked' });
    await new Promise((r) => setTimeout(r, 10));
    expect(received).toHaveLength(0);

    await scheduler.completeTask('org-1', 'event-task', { status: 'ok' });
    await new Promise((r) => setTimeout(r, 10));
    expect(received).toEqual(['org-1']);
  });

  it('isolates identical task ids across organizations', async () => {
    const a = createMockTask('shared-id');
    const b = { ...createMockTask('shared-id'), orgId: 'org-2' };

    await scheduler.enqueue('org-1', a);
    await expect(scheduler.enqueue('org-2', b)).rejects.toThrow('Task organization mismatch');

    expect((await repo.findById('org-1', 'shared-id'))?.orgId).toBe('org-1');
    expect(await repo.findById('org-2', 'shared-id')).toBeUndefined();
  });

  it('handles task failure', async () => {
    const t = createMockTask('t1');
    await scheduler.enqueue('org-1', t);
    await scheduler.failTask('org-1', 't1', { message: 'failed' });
    const failed = await repo.findById('org-1', 't1');
    expect(failed?.status).toBe(TaskStatus.FAILED);
  });

  it('throws TaskNotFoundError when targeting invalid task', async () => {
    await expect(scheduler.pause('org-1', 'missing')).rejects.toThrow(TaskNotFoundError);
    await scheduler.resume('org-1', 'missing');
    await expect(scheduler.cancel('org-1', 'missing', 'reason')).rejects.toThrow(TaskNotFoundError);
  });

  it('triggers catch blocks in scheduler operations', async () => {
    // Force findById to throw to trigger catch blocks
    repo.findById = async (_orgId, _id) => {
      throw new Error('db failure');
    };
    await expect(scheduler.pause('org-1', 'missing')).rejects.toThrow('db failure');
    (scheduler as unknown as { pausedTasks: Set<string> }).pausedTasks.add('org-1:missing');
    await expect(scheduler.resume('org-1', 'missing')).rejects.toThrow('db failure');
    await expect(scheduler.cancel('org-1', 'missing', 'reason')).rejects.toThrow('db failure');

    // Force save to throw
    repo.save = async () => {
      throw new Error('save failure');
    };
    const t = createMockTask('t1');
    await expect(scheduler.enqueue('org-1', t)).rejects.toThrow('save failure');

    // Restore repo.save for subsequent tests
    const tasks = new Map<string, TaskModel>();
    repo.save = async (orgId, task) => {
      tasks.set(task.id, { ...task, orgId });
    };
    repo.findById = async (orgId, id) => {
      const found = tasks.get(id);
      return found?.orgId === orgId ? found : undefined;
    };

    // Force eventBus.publish to throw in completeTask/failTask
    const t2 = createMockTask('t2');
    await scheduler.enqueue('org-1', t2);
    bus.publish = async () => {
      throw new Error('event bus failure');
    };
    await expect(scheduler.completeTask('org-1', 't2', { status: 'ok' })).rejects.toThrow(
      'event bus failure',
    );
    const t3 = createMockTask('t3');
    // Ensure t3 is accessible
    (scheduler as unknown as { inFlightTasks: Map<string, TaskModel> }).inFlightTasks.set(
      'org-1:t3',
      t3,
    );
    await expect(scheduler.failTask('org-1', 't3', { message: 'fail' })).rejects.toThrow(
      'event bus failure',
    );
  });

  it('resumes gracefully if task not found in pausedTasks but missing from repo', async () => {
    // Manually inject invalid state into scheduler
    (scheduler as unknown as { pausedTasks: Set<string> }).pausedTasks.add('org-1:missing-in-db');
    await expect(scheduler.resume('org-1', 'missing-in-db')).rejects.toThrow(TaskNotFoundError);
  });
});

describe('TaskContextBuilder', () => {
  it('builds context from memory reference', async () => {
    const mockSearch = vi.fn().mockResolvedValue([
      { content: 'hello', type: 'user' },
      { content: 'world', type: 'assistant' },
    ]);
    const mockMemory = { search: mockSearch };
    const builder = new TaskContextBuilder(mockMemory);
    const ctx = await builder.build('task-1');
    expect(ctx.variables).toEqual({});
    expect(ctx.history).toHaveLength(2);
    expect(ctx.history[0].role).toBe('user');
    expect(ctx.history[0].content).toBe('hello');
    expect(mockSearch).toHaveBeenCalledWith('task-1', { limit: 10 });
  });

  it('respects custom maxHistoryItems config', async () => {
    const mockSearch = vi.fn().mockResolvedValue([]);
    const mockMemory = { search: mockSearch };
    const builder = new TaskContextBuilder(mockMemory, { maxHistoryItems: 5 });
    await builder.build('task-2');
    expect(mockSearch).toHaveBeenCalledWith('task-2', { limit: 5 });
  });
});

describe('Execution Context', () => {
  it('binds logger context and clones correctly', () => {
    const task = createMockTask('t1');
    const ctx = new ExecutionContext({
      traceId: 'tr-1',
      taskId: 't1',
      logger: mockLogger,
      credentialResolver: mockResolver,
      task,
    });

    expect(ctx.traceId).toBe('tr-1');
    expect(ctx.task).toBe(task);

    ctx.setScopedVar('my_var', 42);
    expect(ctx.getScopedVar('my_var')).toBe(42);

    const ctxAgent = ctx.cloneWithAgent('agent-a');
    expect(ctxAgent.agentId).toBe('agent-a');

    const ctxProvider = ctx.cloneWithProvider('provider-p');
    expect(ctxProvider.providerId).toBe('provider-p');
  });
});
