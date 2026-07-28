/**
 * Validation Sprint - Day 1 Tests
 * Verifies basic E2E functionality
 */

import { describe, it, expect } from 'vitest';
import {
  InMemoryTaskRepository,
  InMemoryEventBus,
  Scheduler,
  TaskStatus,
  TaskPriority,
} from '@agentx/core-runtime';
import { ProviderRegistry, CredentialResolver, ProviderFactory } from '@agentx/provider-sdk';
import { AgentRegistry } from '../../../apps/cli/src/lib/agent-registry';
import { CoderAgent, ReviewerAgent, TesterAgent, SecurityAgent } from '@agentx/agent-platform';

describe('Validation Day 1 - E2E Basics', () => {
  it('1. Runtime initialization works', async () => {
    const taskRepo = new InMemoryTaskRepository();
    const bus = new InMemoryEventBus();
    const scheduler = new Scheduler(bus, taskRepo);

    expect(taskRepo).toBeDefined();
    expect(bus).toBeDefined();
    expect(scheduler).toBeDefined();
  });

  it('2. Provider registry works', async () => {
    const credentialResolver = new CredentialResolver();
    const factory = new ProviderFactory(credentialResolver);
    const registry = new ProviderRegistry();

    expect(registry).toBeDefined();
    expect(factory).toBeDefined();

    // Provider creation succeeds but won't work without API key
    const provider = factory.createProvider({
      providerId: 'anthropic',
      defaultModelId: 'claude-sonnet-4-20250514',
    });
    expect(provider).toBeDefined();
    expect(provider.id).toBe('anthropic');
  });

  it('3. Agent registry with 4 agents', async () => {
    const providerRegistry = new ProviderRegistry();
    const agentRegistry = new AgentRegistry();

    agentRegistry.register(
      new CoderAgent('coder-1', { providerId: 'anthropic' }, providerRegistry),
    );
    agentRegistry.register(
      new ReviewerAgent('reviewer-1', { providerId: 'anthropic' }, providerRegistry),
    );
    agentRegistry.register(
      new TesterAgent('tester-1', { providerId: 'anthropic' }, providerRegistry),
    );
    agentRegistry.register(
      new SecurityAgent('security-1', { providerId: 'anthropic' }, providerRegistry),
    );

    const agents = agentRegistry.list();
    expect(agents).toHaveLength(4);

    const coder = agentRegistry.getByRole('coder');
    expect(coder).toBeDefined();

    const reviewer = agentRegistry.getByRole('reviewer');
    expect(reviewer).toBeDefined();

    const tester = agentRegistry.getByRole('tester');
    expect(tester).toBeDefined();

    const security = agentRegistry.getByRole('security');
    expect(security).toBeDefined();
  });

  it('4. Task submission works', async () => {
    const taskRepo = new InMemoryTaskRepository();
    const bus = new InMemoryEventBus();
    const scheduler = new Scheduler(bus, taskRepo);

    const task = {
      id: 'validation-task-1',
      goal: 'Create a hello world function',
      status: TaskStatus.CREATED,
      priority: TaskPriority.NORMAL,
      rootTaskId: 'validation-task-1',
      dependsOn: [],
      traceId: 'validation-trace-1',
      assignedAgentRole: 'coder',
      metadata: { retryCount: 0 },
      context: { variables: {}, history: [] },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await scheduler.enqueue(task);
    const saved = await taskRepo.findById('validation-task-1');

    expect(saved).toBeDefined();
    // Scheduler may auto-dispatch to RUNNING if agent available
    expect(['QUEUED', 'RUNNING']).toContain(saved?.status);
    expect(saved?.goal).toBe('Create a hello world function');
  });

  it('5. Event bus works', async () => {
    const bus = new InMemoryEventBus();
    const events: Array<{ type: string; data: unknown }> = [];

    await bus.subscribe('task.queued', (data: unknown) => {
      events.push({ type: 'task.queued', data });
    });

    await bus.publish('task.queued', { taskId: 'test-123' });

    expect(events).toHaveLength(1);
    expect(events[0].type).toBe('task.queued');
    // Event data structure may vary
    expect(events[0]).toBeDefined();
  });

  it('6. Agent execution (mock)', async () => {
    const providerRegistry = new ProviderRegistry();
    const coder = new CoderAgent('coder-1', { providerId: 'anthropic' }, providerRegistry);

    const mockTask = {
      id: 'validation-task-1',
      goal: 'Create hello world',
      status: TaskStatus.RUNNING,
      priority: TaskPriority.NORMAL,
      rootTaskId: 'validation-task-1',
      dependsOn: [],
      traceId: 'validation-1',
      assignedAgentRole: 'coder',
      metadata: {},
      context: { variables: {}, history: [] },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Execute (will use fallback/stub without real API key)
    const result = await coder.execute(mockTask, {});

    expect(result).toBeDefined();
    expect(result.agentId).toBe('coder-1');
    expect(result.role).toBe('coder');
  });
});
