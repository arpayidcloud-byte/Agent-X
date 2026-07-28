import { describe, it, expect } from 'vitest';
import { AgentOrchestrator } from '../src/orchestrator.js';
import type { TaskModel, TaskContext } from '@agentx-fast/core-runtime';
import { TaskStatus, TaskPriority } from '@agentx-fast/core-runtime';

describe('AgentOrchestrator', () => {
  it('executes code→review→test→security flow', async () => {
    const orchestrator = new AgentOrchestrator();
    
    const task: TaskModel = {
      id: 'test-1',
      goal: 'Create a function that adds two numbers',
      status: TaskStatus.RUNNING,
      priority: TaskPriority.NORMAL,
      rootTaskId: 'test-1',
      dependsOn: [],
      traceId: 'trace-1',
      metadata: { retryCount: 0 },
      context: { variables: {}, history: [] },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const context: TaskContext = {
      variables: {},
      history: [],
    };

    // Note: This will fail without configured providers
    // Test structure only
    const result = await orchestrator.executeFlow(task, context);
    
    expect(result.results).toBeDefined();
    expect(result.results.code).toBeDefined();
  });
});
