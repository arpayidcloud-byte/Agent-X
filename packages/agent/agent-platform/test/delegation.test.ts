import { describe, it, expect } from 'vitest';
import { AgentDelegationProtocol } from '../src/delegation.js';
import type { TaskModel, TaskContext } from '@agentx-fast/core-runtime';
import { TaskStatus, TaskPriority } from '@agentx-fast/core-runtime';

describe('AgentDelegationProtocol', () => {
  it('delegates task from coder to reviewer', async () => {
    const protocol = new AgentDelegationProtocol();
    
    const task: TaskModel = {
      id: 'test-2',
      goal: 'Review this code',
      status: TaskStatus.RUNNING,
      priority: TaskPriority.NORMAL,
      rootTaskId: 'test-2',
      dependsOn: [],
      traceId: 'trace-2',
      metadata: { retryCount: 0 },
      context: { variables: {}, history: [] },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const context: TaskContext = {
      variables: {},
      history: [],
    };

    const result = await protocol.delegate({
      fromRole: 'coding',
      toRole: 'review',
      task,
      context,
      reason: 'Code review requested',
    });

    expect(result).toBeDefined();
    expect(typeof result.success).toBe('boolean');
  });

  it('chains multiple agents', async () => {
    const protocol = new AgentDelegationProtocol();
    
    const task: TaskModel = {
      id: 'test-3',
      goal: 'Create and test a function',
      status: TaskStatus.RUNNING,
      priority: TaskPriority.NORMAL,
      rootTaskId: 'test-3',
      dependsOn: [],
      traceId: 'trace-3',
      metadata: { retryCount: 0 },
      context: { variables: {}, history: [] },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const context: TaskContext = {
      variables: {},
      history: [],
    };

    const results = await protocol.chain(task, context, ['coding', 'test']);
    
    expect(results).toBeDefined();
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});
