/**
 * @module workflow-engine/workflow-v2.test
 * @description Tests for M3.1 Revision (Workflow Engine Hardening).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WorkflowEngine, createWorkflow, createNode, createEdge } from '../src/index.js';
import {
  WorkflowExecutor,
  NodeExecutor,
  ExecutionPlanner,
  RetryCoordinator,
  WorkflowHookManager,
  ExecutionReplay,
  CriticalPathAnalyzer,
  ExecutionTimeline,
} from '../src/index.js';
import {
  createVersionedSnapshot,
  computeChecksum,
  validateSnapshotChecksum,
} from '../src/snapshot-v2.js';
import {
  ExecutionPlan,
  ExecutionBatch,
  RetryDecision,
  WorkflowHook,
} from '../src/interfaces-v2.js';

const DEFAULT_BUDGET = {
  estimatedCpuTimeMs: 10000,
  estimatedMemoryBytes: 1024 * 1024 * 10,
  tokenBudget: 10000,
  costCeilingUsd: 1.0,
  maxConcurrentProviders: 2,
  maxConcurrentTools: 2,
};

describe('WorkflowExecutor', () => {
  let executor: WorkflowExecutor;

  beforeEach(() => {
    executor = new WorkflowExecutor();
  });

  it('executes a simple workflow and emits metrics', async () => {
    const wf = createWorkflow(
      'wf-1',
      'Test',
      'admin',
      [
        createNode('n1', 'task', 'Step 1', { type: 'task', goal: 'process', priority: 1 }),
        createNode('n2', 'task', 'Step 2', { type: 'task', goal: 'analyze', priority: 2 }),
      ],
      [{ source: 'n1', target: 'n2' }],
    );

    const metrics = await executor.executeWorkflow(wf, () => {});
    expect(metrics.completedNodes).toBe(2);
    expect(metrics.totalNodes).toBe(2);
    expect(metrics.executionTimeMs).toBeGreaterThanOrEqual(0);
  });

  it('executes tool nodes', async () => {
    const wf = createWorkflow(
      'wf-tool',
      'Tool WF',
      'admin',
      [
        createNode('n1', 'tool', 'Run Tool', {
          type: 'tool',
          toolName: 'npm test',
          category: 'shell.build',
          arguments: {},
        }),
      ],
      [],
    );

    const metrics = await executor.executeWorkflow(wf, () => {});
    expect(metrics.toolCalls).toBe(1);
  });

  it('executes agent nodes', async () => {
    const wf = createWorkflow(
      'wf-agent',
      'Agent WF',
      'admin',
      [
        createNode('n1', 'agent', 'Code Review', {
          type: 'agent',
          role: 'reviewer',
          goal: 'review',
        }),
      ],
      [],
    );

    const metrics = await executor.executeWorkflow(wf, () => {});
    expect(metrics.agentCalls).toBe(1);
  });

  it('executes approval nodes', async () => {
    const wf = createWorkflow(
      'wf-approve',
      'Approval WF',
      'admin',
      [createNode('n1', 'approval', 'Review', { type: 'approval', riskScore: 60 })],
      [],
    );

    const metrics = await executor.executeWorkflow(wf, () => {});
    expect(metrics.approvalCount).toBe(1);
  });

  it('fires before and after hooks', async () => {
    const beforeHook = vi.fn();
    const afterHook = vi.fn();

    executor.addHook({
      name: 'test-hook',
      beforeWorkflow: beforeHook,
      afterWorkflow: afterHook,
    });

    const wf = createWorkflow(
      'wf-hook',
      'Hook WF',
      'admin',
      [createNode('n1', 'task', 'Task', { type: 'task', goal: 'test', priority: 1 })],
      [],
    );

    await executor.executeWorkflow(wf, () => {});
    expect(beforeHook).toHaveBeenCalled();
    expect(afterHook).toHaveBeenCalled();
  });

  it('executes parallel nodes', async () => {
    const wf = createWorkflow(
      'wf-par',
      'Parallel',
      'admin',
      [
        createNode('n1', 'task', 'Start', { type: 'task', goal: 'init', priority: 1 }),
        createNode('n2', 'task', 'A', { type: 'task', goal: 'a', priority: 2 }),
        createNode('n3', 'task', 'B', { type: 'task', goal: 'b', priority: 2 }),
      ],
      [
        { source: 'n1', target: 'n2' },
        { source: 'n1', target: 'n3' },
      ],
    );

    const metrics = await executor.executeWorkflow(wf, () => {});
    expect(metrics.completedNodes).toBe(3);
  });

  it('handles loop nodes', async () => {
    const wf = createWorkflow(
      'wf-loop',
      'Loop',
      'admin',
      [
        createNode('n1', 'loop', 'Loop', {
          type: 'loop',
          iterator: 'i',
          maxIterations: 3,
          body: [],
        }),
      ],
      [],
    );

    const metrics = await executor.executeWorkflow(wf, () => {});
    expect(metrics.completedNodes).toBe(1);
  });

  it('handles conditional nodes', async () => {
    const wf = createWorkflow(
      'wf-cond',
      'Conditional',
      'admin',
      [
        createNode('n1', 'conditional', 'Check', {
          type: 'conditional',
          condition: 'true',
          trueBranch: 'n2',
          falseBranch: 'n3',
        }),
      ],
      [],
    );

    const metrics = await executor.executeWorkflow(wf, () => {});
    expect(metrics.completedNodes).toBe(1);
  });
});

describe('NodeExecutor', () => {
  let executor: NodeExecutor;

  beforeEach(() => {
    executor = new NodeExecutor();
  });

  it('executes tool nodes', async () => {
    const node = {
      id: 'n1',
      type: 'tool',
      name: 'Run Tool',
      config: { type: 'tool', toolName: 'npm test', category: 'shell.build', arguments: {} },
    } as any;
    const result = await executor.executeToolNode(node, {});
    expect(result).toHaveProperty('status', 'completed');
    expect(result).toHaveProperty('toolName', 'npm test');
  });

  it('executes agent nodes', async () => {
    const node = {
      id: 'n1',
      type: 'agent',
      name: 'Agent',
      config: { type: 'agent', role: 'coder', goal: 'code' },
    } as any;
    const result = await executor.executeAgentNode(node, {});
    expect(result).toHaveProperty('status', 'completed');
    expect(result).toHaveProperty('role', 'coder');
  });

  it('executes approval nodes', async () => {
    const node = {
      id: 'n1',
      type: 'approval',
      name: 'Approve',
      config: { type: 'approval', riskScore: 60 },
    } as any;
    const result = await executor.executeApprovalNode(node, {});
    expect(result).toHaveProperty('status', 'completed');
    expect(result).toHaveProperty('riskScore', 60);
  });

  it('executes parallel nodes', async () => {
    const node = {
      id: 'n1',
      type: 'parallel',
      name: 'Parallel',
      config: { type: 'parallel', branches: ['a', 'b'] },
    } as any;
    const result = await executor.executeParallelNode(node, {});
    expect(result).toHaveProperty('status', 'completed');
    expect(result).toHaveProperty('branches');
  });

  it('executes loop nodes', async () => {
    const node = {
      id: 'n1',
      type: 'loop',
      name: 'Loop',
      config: { type: 'loop', iterator: 'i', maxIterations: 5, body: [] },
    } as any;
    const result = await executor.executeLoopNode(node, {});
    expect(result).toHaveProperty('status', 'completed');
    expect(result).toHaveProperty('iterations', 5);
  });

  it('executes conditional nodes', async () => {
    const node = {
      id: 'n1',
      type: 'conditional',
      name: 'Cond',
      config: { type: 'conditional', condition: 'x > 5', trueBranch: 'n2', falseBranch: 'n3' },
    } as any;
    const result = await executor.executeConditionalNode(node, {});
    expect(result).toHaveProperty('status', 'completed');
    expect(result).toHaveProperty('selectedBranch', 'n2');
  });

  it('dispatches to correct executor based on type', async () => {
    const node = {
      id: 'n1',
      type: 'tool',
      name: 'Tool',
      config: { type: 'tool', toolName: 'test', category: 'shell.build', arguments: {} },
    } as any;
    const result = await executor.executeNode(node, {});
    expect(result).toHaveProperty('toolName', 'test');
  });
});

describe('ExecutionPlanner', () => {
  let planner: ExecutionPlanner;

  beforeEach(() => {
    planner = new ExecutionPlanner();
  });

  it('plans execution batches', () => {
    const wf = {
      id: 'wf-1',
      name: 'Test',
      version: 1,
      nodes: [
        { id: 'n1', type: 'task', name: 'T1', config: { type: 'task', goal: 'test', priority: 1 } },
        { id: 'n2', type: 'task', name: 'T2', config: { type: 'task', goal: 'test', priority: 2 } },
        { id: 'n3', type: 'task', name: 'T3', config: { type: 'task', goal: 'test', priority: 3 } },
      ],
      edges: [
        { source: 'n1', target: 'n2' },
        { source: 'n2', target: 'n3' },
      ],
      variables: {},
      metadata: { createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', traceId: 't1' },
    } as any;

    const plan = planner.plan(wf);
    expect(plan.batches.length).toBe(3);
    expect(plan.batches[0].nodeIds).toEqual(['n1']);
    expect(plan.batches[1].nodeIds).toEqual(['n2']);
    expect(plan.batches[2].nodeIds).toEqual(['n3']);
  });

  it('identifies parallel nodes in same batch', () => {
    const wf = {
      id: 'wf-1',
      name: 'Test',
      version: 1,
      nodes: [
        {
          id: 'n1',
          type: 'task',
          name: 'Start',
          config: { type: 'task', goal: 'init', priority: 1 },
        },
        { id: 'n2', type: 'task', name: 'A', config: { type: 'task', goal: 'a', priority: 2 } },
        { id: 'n3', type: 'task', name: 'B', config: { type: 'task', goal: 'b', priority: 2 } },
      ],
      edges: [
        { source: 'n1', target: 'n2' },
        { source: 'n1', target: 'n3' },
      ],
      variables: {},
      metadata: { createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', traceId: 't1' },
    } as any;

    const plan = planner.plan(wf);
    expect(plan.batches[1].canRunInParallel).toBe(true);
    expect(plan.batches[1].nodeIds.length).toBe(2);
  });

  it('calculates critical path', () => {
    const wf = {
      id: 'wf-1',
      name: 'Test',
      version: 1,
      nodes: [
        { id: 'n1', type: 'task', name: 'T1', config: { type: 'task', goal: 'test', priority: 1 } },
        { id: 'n2', type: 'task', name: 'T2', config: { type: 'task', goal: 'test', priority: 2 } },
      ],
      edges: [{ source: 'n1', target: 'n2' }],
      variables: {},
      metadata: { createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', traceId: 't1' },
    } as any;

    const path = planner.calculateCriticalPath(wf);
    expect(path).toEqual(['n1', 'n2']);
  });

  it('estimates parallelism', () => {
    const wf = {
      id: 'wf-1',
      name: 'Test',
      version: 1,
      nodes: [
        { id: 'n1', type: 'task', name: 'T1', config: { type: 'task', goal: 'test', priority: 1 } },
        { id: 'n2', type: 'task', name: 'T2', config: { type: 'task', goal: 'test', priority: 2 } },
        { id: 'n3', type: 'task', name: 'T3', config: { type: 'task', goal: 'test', priority: 3 } },
      ],
      edges: [],
      variables: {},
      metadata: { createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', traceId: 't1' },
    } as any;

    const parallelism = planner.estimateParallelism(wf);
    expect(parallelism).toBe(3);
  });
});

describe('RetryCoordinator', () => {
  let coordinator: RetryCoordinator;

  beforeEach(() => {
    coordinator = new RetryCoordinator();
  });

  it('returns retryable decision for transient errors', () => {
    const decision = coordinator.shouldRetry('node-1', new Error('ETIMEDOUT'), 0);
    expect(decision.shouldRetry).toBe(true);
    expect(decision.delayMs).toBeGreaterThan(0);
  });

  it('returns non-retryable decision for permanent errors', () => {
    const decision = coordinator.shouldRetry('node-1', new Error('SyntaxError'), 0);
    expect(decision.shouldRetry).toBe(false);
  });

  it('respects retry budget', () => {
    coordinator.getRetryBudget('node-1');
    coordinator.recordAttempt('node-1');
    coordinator.recordAttempt('node-1');
    coordinator.recordAttempt('node-1');
    const decision = coordinator.shouldRetry('node-1', new Error('ETIMEDOUT'), 3);
    expect(decision.shouldRetry).toBe(false);
  });

  it('resets budgets', () => {
    coordinator.recordAttempt('node-1');
    coordinator.resetBudgets();
    const budget = coordinator.getRetryBudget('node-1');
    expect(budget.usedRetries).toBe(0);
  });
});

describe('WorkflowHookManager', () => {
  it('registers and executes hooks', async () => {
    const manager = new WorkflowHookManager();
    const hook: WorkflowHook = {
      name: 'test',
      beforeWorkflow: vi.fn(),
      afterWorkflow: vi.fn(),
    };
    manager.register(hook);
    await manager.executeBeforeHooks({} as any);
    await manager.executeAfterHooks({} as any, {} as any);
    expect(hook.beforeWorkflow).toHaveBeenCalled();
    expect(hook.afterWorkflow).toHaveBeenCalled();
  });

  it('unregisters hooks', async () => {
    const manager = new WorkflowHookManager();
    const hook: WorkflowHook = { name: 'test', beforeWorkflow: vi.fn() };
    manager.register(hook);
    manager.unregister('test');
    await manager.executeBeforeHooks({} as any);
    expect(hook.beforeWorkflow).not.toHaveBeenCalled();
  });
});

describe('ExecutionTimeline', () => {
  it('records node execution timeline', () => {
    const timeline = new ExecutionTimeline();
    const node = {
      id: 'n1',
      type: 'task',
      name: 'Task',
      config: { type: 'task', goal: 'test', priority: 1 },
    } as any;

    timeline.startNode(node);
    timeline.finishNode('n1', 'COMPLETED', 0);

    const entries = timeline.getTimeline();
    expect(entries.length).toBe(1);
    expect(entries[0].nodeId).toBe('n1');
    expect(entries[0].status).toBe('COMPLETED');
    expect(entries[0].durationMs).toBeGreaterThanOrEqual(0);
  });

  it('clears timeline', () => {
    const timeline = new ExecutionTimeline();
    const node = {
      id: 'n1',
      type: 'task',
      name: 'Task',
      config: { type: 'task', goal: 'test', priority: 1 },
    } as any;
    timeline.startNode(node);
    timeline.clear();
    expect(timeline.getTimeline().length).toBe(0);
  });
});

describe('Snapshot Versioning', () => {
  it('creates versioned snapshot with checksum', () => {
    const snapshot = createVersionedSnapshot('wf-1', new Map(), new Map(), 1, 'admin');
    expect(snapshot.schemaVersion).toBe('2.0');
    expect(snapshot.workflowVersion).toBe(1);
    expect(snapshot.engineVersion).toBe('1.0.0');
    expect(snapshot.snapshotVersion).toBe(1);
    expect(snapshot.createdBy).toBe('admin');
    expect(snapshot.checksum).toBeTruthy();
  });

  it('validates checksum', () => {
    const snapshot = createVersionedSnapshot(
      'wf-1',
      new Map([['n1', 'COMPLETED']]),
      new Map(),
      1,
      'admin',
    );
    expect(validateSnapshotChecksum(snapshot)).toBe(true);

    snapshot.nodeStates.set('n2', 'PENDING');
    expect(validateSnapshotChecksum(snapshot)).toBe(false);
  });
});

describe('CriticalPathAnalyzer', () => {
  let analyzer: CriticalPathAnalyzer;

  beforeEach(() => {
    analyzer = new CriticalPathAnalyzer();
  });

  it('analyzes workflow critical path', () => {
    const wf = {
      id: 'wf-1',
      name: 'Test',
      version: 1,
      nodes: [
        { id: 'n1', type: 'task', name: 'T1', config: { type: 'task', goal: 'test', priority: 1 } },
        { id: 'n2', type: 'task', name: 'T2', config: { type: 'task', goal: 'test', priority: 2 } },
        { id: 'n3', type: 'task', name: 'T3', config: { type: 'task', goal: 'test', priority: 3 } },
      ],
      edges: [
        { source: 'n1', target: 'n2' },
        { source: 'n2', target: 'n3' },
      ],
      variables: {},
      metadata: { createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', traceId: 't1' },
    } as any;

    const analysis = analyzer.analyze(wf);
    expect(analysis.workflowId).toBe('wf-1');
    expect(analysis.longestChainLength).toBe(3);
    expect(analysis.longestChain).toEqual(['n1', 'n2', 'n3']);
  });

  it('identifies bottlenecks', () => {
    const wf = {
      id: 'wf-1',
      name: 'Test',
      version: 1,
      nodes: [
        {
          id: 'n1',
          type: 'task',
          name: 'Hub',
          config: { type: 'task', goal: 'test', priority: 1 },
        },
        { id: 'n2', type: 'task', name: 'A', config: { type: 'task', goal: 'test', priority: 2 } },
        { id: 'n3', type: 'task', name: 'B', config: { type: 'task', goal: 'test', priority: 3 } },
      ],
      edges: [
        { source: 'n1', target: 'n2' },
        { source: 'n1', target: 'n3' },
      ],
      variables: {},
      metadata: { createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', traceId: 't1' },
    } as any;

    const analysis = analyzer.analyze(wf);
    expect(analysis.estimatedBottlenecks).toContain('n1');
  });
});

describe('ExecutionReplay', () => {
  let replay: ExecutionReplay;

  beforeEach(() => {
    replay = new ExecutionReplay();
  });

  it('starts replay with debug mode', async () => {
    const history = await replay.startReplay('wf-1', 'debug');
    expect(history.workflowId).toBe('wf-1');
    expect(history.snapshots.length).toBeGreaterThan(0);
  });

  it('gets snapshot at specific step', async () => {
    const snapshot = await replay.getSnapshot('wf-1', 5);
    expect(snapshot).toBeDefined();
    expect(snapshot?.step).toBe(5);
  });

  it('steps forward', async () => {
    const snapshot = await replay.stepForward('wf-1');
    expect(snapshot.step).toBe(1);
  });
});
