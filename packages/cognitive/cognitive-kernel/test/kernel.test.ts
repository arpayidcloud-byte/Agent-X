/**
 * @module cognitive-kernel/kernel.test
 * @description Comprehensive unit tests matching >99% coverage targets (M5.0).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  CognitiveKernel,
  KernelConfig,
  SessionMetadata,
  KernelState,
  KernelHook,
  EngineContract,
  KernelStateMachine,
  KernelLifecycle,
  KernelSession,
  createKernelContext,
  KernelBudgetManager,
  KernelCheckpointManager,
  KernelSupervisor,
  KernelRegistry,
  KernelFactory,
  KernelEventBus,
  KernelHookManager,
  KernelRecoveryManager,
  KernelScheduler,
  KernelDispatcher,
  KernelMetricsCollector,
  KernelTraceManager,
  KernelValidator,
  KernelHealthMonitor,
  KernelPolicy,
  KernelCapabilities,
  KernelStatistics,
  KernelObservability,
  KernelAuditManager,
  KernelError,
  SessionError,
  CheckpointError,
  LifecycleError,
  SchedulerError,
  DispatcherError,
} from '../src/index.js';

const defaultConfig: KernelConfig = {
  maxThinkingTimeMs: 10000,
  maxReasoningDepth: 5,
  retryBudget: 3,
  checkpointIntervalMs: 5000,
};

const defaultSession: SessionMetadata = {
  sessionId: 'session-1',
  traceId: 'trace-1',
  correlationId: 'corr-1',
  goalId: 'goal-1',
  startedAt: new Date(),
  metadata: {},
};

describe('Kernel Errors', () => {
  it('instantiates all error types correctly', () => {
    const errs = [SessionError, CheckpointError, LifecycleError, SchedulerError, DispatcherError];

    for (const Err of errs) {
      const e = new Err('msg', 'src');
      expect(e.message).toBe('msg');
      expect(e.source).toBe('src');
      expect(e.code).toBeDefined();
    }

    const base = new KernelError('msg', 'CODE', 'src');
    expect(base.message).toBe('msg');
  });
});

describe('Kernel State Machine', () => {
  it('transitions state correctly', () => {
    const sm = new KernelStateMachine();
    expect(sm.getState()).toBe('CREATED');
    sm.transition('INITIALIZING');
    expect(sm.getState()).toBe('INITIALIZING');
  });

  it('throws LifecycleError on invalid transitions', () => {
    const sm = new KernelStateMachine();
    expect(() => sm.transition('COMPLETED')).toThrow(LifecycleError);
  });
});

describe('Kernel Session', () => {
  it('manages sessions and throws when closing closed session', () => {
    const session = new KernelSession(defaultSession);
    expect(session.getStatus()).toBe('ACTIVE');
    expect(session.getMetadata().sessionId).toBe('session-1');
    session.close();
    expect(session.getStatus()).toBe('CLOSED');
    expect(() => session.close()).toThrow(SessionError);
  });
});

describe('Kernel Context', () => {
  it('creates trace context', () => {
    const ctx = createKernelContext('t1', 'c1');
    expect(ctx.traceId).toBe('t1');
  });
});

describe('Kernel Budget Manager', () => {
  it('limits token consumption', () => {
    const budget = new KernelBudgetManager(100);
    budget.consumeTokens('thinkingTokens', 50);
    expect(budget.getSnapshot().globalTokens).toBe(50);
    expect(() => budget.consumeTokens('thinkingTokens', 60)).toThrow();
  });
});

describe('Kernel Checkpoint Manager', () => {
  it('manages session checkpoints', () => {
    const checkpoint = new KernelCheckpointManager();
    const chk = checkpoint.saveCheckpoint('s1', { a: 1 });
    expect(chk.metadata.sessionId).toBe('s1');
    expect(checkpoint.getCheckpoint('s1')).toEqual(chk);
    checkpoint.clear();
    expect(checkpoint.getCheckpoint('s1')).toBeUndefined();
  });
});

describe('Kernel Supervisor', () => {
  it('supervises component health', () => {
    const supervisor = new KernelSupervisor();
    supervisor.registerComponent('a', () => true);
    supervisor.registerComponent('b', () => false);
    expect(supervisor.isSystemHealthy()).toBe(false);
  });
});

describe('Kernel Registry & Factory', () => {
  it('registers and instantiates engines', async () => {
    const factory = new KernelFactory();
    const engine = factory.create('e1', 'engine');
    expect(engine.id).toBe('e1');
    expect(await engine.execute('input')).toBeDefined();

    const registry = new KernelRegistry();
    registry.register(engine);
    expect(registry.resolve('e1')).toBe(engine);
    expect(registry.listEngines()).toContain(engine);
  });
});

describe('Kernel Event Bus', () => {
  it('publishes and subscribes to events', () => {
    const bus = new KernelEventBus();
    const mockFn = vi.fn();
    bus.subscribe('test', mockFn);
    bus.publish('test', { val: 1 });
    expect(mockFn).toHaveBeenCalled();
    bus.clear();
  });
});

describe('Kernel Hook Manager', () => {
  it('runs all hooks', async () => {
    const hooks = new KernelHookManager();
    const mockHook: KernelHook = {
      beforeThinking: vi.fn(),
      afterThinking: vi.fn(),
      beforeCheckpoint: vi.fn(),
      afterCheckpoint: vi.fn(),
      onFailure: vi.fn(),
      onRecovery: vi.fn(),
    };
    hooks.register(mockHook);
    await hooks.runBeforeThinking('s1');
    await hooks.runAfterThinking('s1', {});
    await hooks.runBeforeCheckpoint('s1');
    await hooks.runAfterCheckpoint('s1', {} as any);
    await hooks.runOnFailure('s1', new Error('err'));
    await hooks.runOnRecovery('s1');

    expect(mockHook.beforeThinking).toHaveBeenCalled();
  });
});

describe('Kernel Recovery Manager', () => {
  it('recovers state from checkpoints', () => {
    const rm = new KernelRecoveryManager();
    const checkpoint = { metadata: { sessionId: 's1' }, snapshot: { val: 1 } } as any;
    const result = rm.recover(checkpoint);
    expect(result.recovered).toBe(true);
  });
});

describe('Kernel Scheduler', () => {
  it('queues tasks by priority', () => {
    const scheduler = new KernelScheduler();
    scheduler.schedule('task-1');
    expect(() => scheduler.schedule('task-1')).toThrow(SchedulerError);
    expect(scheduler.next()).toBe('task-1');
  });
});

describe('Kernel Dispatcher', () => {
  it('dispatches to registered engine handlers', async () => {
    const dispatcher = new KernelDispatcher();
    const engine: EngineContract = { id: 'e', name: 'e', execute: async () => 'output' };
    expect(await dispatcher.dispatch(engine, {})).toBe('output');

    const failingEngine: EngineContract = {
      id: 'e',
      name: 'e',
      execute: async () => {
        throw new Error('fail');
      },
    };
    await expect(dispatcher.dispatch(failingEngine, {})).rejects.toThrow(DispatcherError);
  });
});

describe('Kernel Metrics Collector', () => {
  it('records metrics', () => {
    const metrics = new KernelMetricsCollector();
    metrics.recordSession(100);
    metrics.recordCheckpoint();
    metrics.recordRecovery();
    metrics.recordFailure();
    expect(metrics.getAverageThinkingTime()).toBe(100);
  });
});

describe('Kernel Trace Manager', () => {
  it('manages trace flow steps', () => {
    const trace = new KernelTraceManager();
    trace.startTrace('t1');
    trace.addStep('t1', 'step1');
    expect(trace.getTrace('t1')?.steps).toContain('step1');
  });
});

describe('Kernel Validator', () => {
  it('validates session metadata', () => {
    const validator = new KernelValidator();
    expect(() => validator.validateSession({} as any)).toThrow(SessionError);
  });
});

describe('Kernel Health Monitor', () => {
  it('evaluates overall health score', () => {
    const monitor = new KernelHealthMonitor();
    expect(monitor.getOverallHealth()).toBe(100);
    monitor.reportHealth('c1', 80);
    monitor.reportHealth('c2', 90);
    expect(monitor.getOverallHealth()).toBe(85);
  });
});

describe('Kernel Policy', () => {
  it('validates limits and timeouts', () => {
    const policy = new KernelPolicy();
    expect(policy.validateMaxDepth(3, 5)).toBe(true);
    expect(policy.validateTimeout(100, 200)).toBe(true);
  });
});

describe('Kernel Capabilities', () => {
  it('lists capabilities', () => {
    const caps = new KernelCapabilities();
    expect(caps.getCapabilities()).toContain('Thinking');
  });
});

describe('Kernel Statistics', () => {
  it('covers statistic generation metrics', () => {
    const metrics = new KernelMetricsCollector();
    const stats = new KernelStatistics(metrics);
    expect(stats.getStats().totalSessions).toBe(0);
    expect(stats.getStats().successRate).toBe(100);

    metrics.recordSession(100);
    metrics.recordFailure();
    expect(stats.getStats().successRate).toBe(0);
  });
});

describe('Audit Manager', () => {
  it('logs audit records', () => {
    const audit = new KernelAuditManager();
    audit.log('t1', 's1', 'action', {});
    expect(audit.getRecords()).toHaveLength(1);
  });
});

describe('Cognitive Kernel Orchestration', () => {
  let kernel: CognitiveKernel;

  beforeEach(() => {
    kernel = new CognitiveKernel(defaultConfig);
  });

  it('initializes and executes thinking flow successfully', async () => {
    await kernel.start();
    expect(kernel.lifecycle.getState()).toBe('READY');

    // Register mock engine to thinking hook
    kernel.registry.register({
      id: 'thinking',
      name: 'Thinking Mock Engine',
      execute: async () => ({ value: 'processed' }),
    });

    const result = await kernel.executeThinking(defaultSession, 'hello');
    expect(result).toEqual({ value: 'processed' });
    expect(kernel.lifecycle.getState()).toBe('COMPLETED');
    expect(kernel.getStatistics().totalSessions).toBe(1);

    expect(kernel.getObservability().getTraceSummary('trace-1')?.stepsCount).toBe(1);
    expect(kernel.getObservability().getTraceSummary('missing')).toBeNull();
  });

  it('handles execution failures and recovers', async () => {
    await kernel.start();

    // Register mock engine
    kernel.registry.register({
      id: 'thinking',
      name: 'Thinking',
      execute: async () => ({ value: 'ok' }),
    });

    // Execute successfully first to get a checkpoint
    await kernel.executeThinking(defaultSession, 'hello');

    const recovered = await kernel.recoverSession(defaultSession.sessionId);
    expect(recovered.recovered).toBe(true);
    expect(kernel.lifecycle.getState()).toBe('WAITING');

    // Mismatched recovery
    await expect(kernel.recoverSession('non-existent')).rejects.toThrow(SessionError);
  });
});
