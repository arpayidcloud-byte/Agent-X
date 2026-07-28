/**
 * @module workflow-engine/workflow.test
 * @description Comprehensive tests for Workflow Engine (M3.1).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  // Graph
  createWorkflow,
  createNode,
  createEdge,
  topologicalSort,
  detectCycle,
  getPredecessors,
  getSuccessors,
  isNodeReady,
  findReadyNodes,
  // Validator
  validateWorkflow,
  validateNodeConfig,
  validateEdges,
  // Checkpoint
  InMemoryCheckpointManager,
  createSnapshot,
  restoreFromSnapshot,
  // Engine
  WorkflowEngine,
  WorkflowStateMachine,
  // Compiler
  compileWorkflow,
  // Serializer
  JsonWorkflowSerializer,
  // Errors
  CycleDetectedError,
  WorkflowValidationError,
  NodeNotFoundError,
  // Types
  WorkflowDefinition,
  WorkflowNode,
  NodeState,
} from '../src/index.js';

describe('Graph Utilities', () => {
  it('creates workflow definition', () => {
    const wf = createWorkflow('wf-1', 'Test Workflow', 'admin');
    expect(wf.id).toBe('wf-1');
    expect(wf.name).toBe('Test Workflow');
    expect(wf.version).toBe(1);
    expect(wf.nodes).toEqual([]);
    expect(wf.edges).toEqual([]);
  });

  it('creates workflow node', () => {
    const node = createNode('n1', 'task', 'Task 1', { type: 'task', goal: 'test', priority: 1 });
    expect(node.id).toBe('n1');
    expect(node.type).toBe('task');
    expect(node.name).toBe('Task 1');
  });

  it('creates workflow edge', () => {
    const edge = createEdge('n1', 'n2', 'condition');
    expect(edge.source).toBe('n1');
    expect(edge.target).toBe('n2');
    expect(edge.condition).toBe('condition');
  });

  it('topological sort works correctly', () => {
    const nodes = [
      createNode('n1', 'task', 'Task 1', { type: 'task', goal: 'test', priority: 1 }),
      createNode('n2', 'task', 'Task 2', { type: 'task', goal: 'test', priority: 1 }),
      createNode('n3', 'task', 'Task 3', { type: 'task', goal: 'test', priority: 1 }),
    ];
    const edges = [createEdge('n1', 'n2'), createEdge('n2', 'n3')];

    const sorted = topologicalSort(nodes, edges);
    expect(sorted.map((n) => n.id)).toEqual(['n1', 'n2', 'n3']);
  });

  it('topological sort detects cycles', () => {
    const nodes = [
      createNode('n1', 'task', 'Task 1', { type: 'task', goal: 'test', priority: 1 }),
      createNode('n2', 'task', 'Task 2', { type: 'task', goal: 'test', priority: 1 }),
    ];
    const edges = [createEdge('n1', 'n2'), createEdge('n2', 'n1')];

    expect(() => topologicalSort(nodes, edges)).toThrow('Cycle detected in graph');
  });

  it('detects cycles correctly', () => {
    const nodes = [
      createNode('n1', 'task', 'Task 1', { type: 'task', goal: 'test', priority: 1 }),
      createNode('n2', 'task', 'Task 2', { type: 'task', goal: 'test', priority: 1 }),
    ];

    expect(detectCycle(nodes, [createEdge('n1', 'n2')])).toBe(false);
    expect(detectCycle(nodes, [createEdge('n1', 'n2'), createEdge('n2', 'n1')])).toBe(true);
  });

  it('gets predecessors and successors', () => {
    const edges = [createEdge('n1', 'n2'), createEdge('n1', 'n3'), createEdge('n2', 'n4')];

    expect(getPredecessors('n2', edges)).toEqual(['n1']);
    expect(getPredecessors('n1', edges)).toEqual([]);
    expect(getSuccessors('n1', edges)).toEqual(['n2', 'n3']);
  });

  it('checks node readiness', () => {
    const edges = [createEdge('n1', 'n2'), createEdge('n2', 'n3')];
    const completed = new Set(['n1']);

    expect(isNodeReady('n2', edges, completed)).toBe(true);
    expect(isNodeReady('n3', edges, completed)).toBe(false);
  });

  it('finds ready nodes', () => {
    const nodes = [
      createNode('n1', 'task', 'Task 1', { type: 'task', goal: 'test', priority: 1 }),
      createNode('n2', 'task', 'Task 2', { type: 'task', goal: 'test', priority: 1 }),
      createNode('n3', 'task', 'Task 3', { type: 'task', goal: 'test', priority: 1 }),
    ];
    const edges = [createEdge('n1', 'n2'), createEdge('n2', 'n3')];
    const completed = new Set(['n1']);
    const active = new Set<string>();

    const ready = findReadyNodes(nodes, edges, completed, active);
    expect(ready.length).toBe(1);
    expect(ready[0].id).toBe('n2');
  });
});

describe('Validator', () => {
  it('validates a correct workflow', () => {
    const wf = {
      id: 'wf-1',
      name: 'Test',
      version: 1,
      nodes: [createNode('n1', 'task', 'Task 1', { type: 'task', goal: 'test', priority: 1 })],
      edges: [],
      variables: {},
      metadata: { createdAt: new Date(), updatedAt: new Date(), createdBy: 'admin', traceId: 't1' },
    };

    expect(() => validateWorkflow(wf)).not.toThrow();
  });

  it('rejects empty nodes', () => {
    const wf = {
      id: 'wf-1',
      name: 'Test',
      version: 1,
      nodes: [],
      edges: [],
      variables: {},
      metadata: { createdAt: new Date(), updatedAt: new Date(), createdBy: 'admin', traceId: 't1' },
    };
    expect(() => validateWorkflow(wf)).toThrow(WorkflowValidationError);
  });

  it('rejects duplicate node IDs', () => {
    const wf = {
      id: 'wf-1',
      name: 'Test',
      version: 1,
      nodes: [
        createNode('n1', 'task', 'Task 1', { type: 'task', goal: 'test', priority: 1 }),
        createNode('n1', 'task', 'Task 2', { type: 'task', goal: 'test', priority: 1 }),
      ],
      edges: [],
      variables: {},
      metadata: { createdAt: new Date(), updatedAt: new Date(), createdBy: 'admin', traceId: 't1' },
    };
    expect(() => validateWorkflow(wf)).toThrow(WorkflowValidationError);
  });

  it('rejects cycles', () => {
    const wf = {
      id: 'wf-1',
      name: 'Test',
      version: 1,
      nodes: [
        createNode('n1', 'task', 'Task 1', { type: 'task', goal: 'test', priority: 1 }),
        createNode('n2', 'task', 'Task 2', { type: 'task', goal: 'test', priority: 1 }),
      ],
      edges: [createEdge('n1', 'n2'), createEdge('n2', 'n1')],
      variables: {},
      metadata: { createdAt: new Date(), updatedAt: new Date(), createdBy: 'admin', traceId: 't1' },
    };
    expect(() => validateWorkflow(wf)).toThrow(CycleDetectedError);
  });

  it('validates node configs', () => {
    const validNode = createNode('n1', 'task', 'Task 1', {
      type: 'task',
      goal: 'test',
      priority: 1,
    });
    expect(() => validateNodeConfig(validNode)).not.toThrow();

    const invalidNode = createNode('n1', 'task', '', { type: 'task', goal: 'test', priority: 1 });
    expect(() => validateNodeConfig(invalidNode)).toThrow(WorkflowValidationError);
  });
});

describe('Checkpoint Manager', () => {
  let manager: InMemoryCheckpointManager;

  beforeEach(() => {
    manager = new InMemoryCheckpointManager();
  });

  it('saves and loads checkpoints', async () => {
    const snapshot = createSnapshot('wf-1', new Map(), new Map(), 1);
    const cp = await manager.save(snapshot);

    expect(cp.id).toBeDefined();
    expect(cp.workflowId).toBe('wf-1');

    const loaded = await manager.load('wf-1');
    expect(loaded).toBeDefined();
    expect(loaded?.id).toBe(cp.id);
  });

  it('lists checkpoints', async () => {
    await manager.save(createSnapshot('wf-1', new Map(), new Map(), 1));
    await manager.save(createSnapshot('wf-1', new Map(), new Map(), 2));

    const list = await manager.list('wf-1');
    expect(list.length).toBe(2);
  });

  it('deletes checkpoints', async () => {
    const cp = await manager.save(createSnapshot('wf-1', new Map(), new Map(), 1));
    await manager.delete(cp.id);

    const list = await manager.list('wf-1');
    expect(list.length).toBe(0);
  });

  it('creates and restores snapshots', () => {
    const nodeStates = new Map([
      ['n1', 'COMPLETED'],
      ['n2', 'PENDING'],
    ]);
    const results = new Map([['n1', { status: 'ok' }]]);

    const snapshot = createSnapshot('wf-1', nodeStates, results, 1);
    expect(snapshot.workflowId).toBe('wf-1');
    expect(snapshot.nodeStates.get('n1')).toBe('COMPLETED');

    const restored = restoreFromSnapshot(snapshot);
    expect(restored.nodeStates.get('n1')).toBe('COMPLETED');
    expect(restored.results.get('n1')).toEqual({ status: 'ok' });
  });
});

describe('Workflow State Machine', () => {
  it('validates state transitions', () => {
    expect(WorkflowStateMachine.canTransition('CREATED', 'COMPILED')).toBe(true);
    expect(WorkflowStateMachine.canTransition('COMPILED', 'RUNNING')).toBe(true);
    expect(WorkflowStateMachine.canTransition('RUNNING', 'COMPLETED')).toBe(true);
    expect(WorkflowStateMachine.canTransition('RUNNING', 'PAUSED')).toBe(true);
    expect(WorkflowStateMachine.canTransition('RUNNING', 'FAILED')).toBe(true);
    expect(WorkflowStateMachine.canTransition('PAUSED', 'RUNNING')).toBe(true);
    expect(WorkflowStateMachine.canTransition('FAILED', 'RUNNING')).toBe(true);

    // Invalid transitions
    expect(WorkflowStateMachine.canTransition('COMPLETED', 'RUNNING')).toBe(false);
    expect(WorkflowStateMachine.canTransition('CREATED', 'RUNNING')).toBe(false);
    expect(WorkflowStateMachine.canTransition('CANCELLED', 'RUNNING')).toBe(false);
  });
});

describe('WorkflowEngine', () => {
  let engine: WorkflowEngine;

  beforeEach(() => {
    engine = new WorkflowEngine();
  });

  it('compiles and executes a simple workflow', async () => {
    const wf = createWorkflow(
      'wf-1',
      'Simple Workflow',
      'admin',
      [
        createNode('n1', 'task', 'Step 1', { type: 'task', goal: 'Process data', priority: 1 }),
        createNode('n2', 'task', 'Step 2', { type: 'task', goal: 'Analyze results', priority: 2 }),
      ],
      [createEdge('n1', 'n2')],
    );

    engine.compile(wf);
    expect(engine.getState()).toBe('COMPILED');

    const metrics = await engine.execute(wf);
    expect(engine.getState()).toBe('COMPLETED');
    expect(metrics.completedNodes).toBe(2);
    expect(metrics.failedNodes).toBe(0);
  });

  it('executes parallel nodes', async () => {
    const wf = createWorkflow(
      'wf-parallel',
      'Parallel Workflow',
      'admin',
      [
        createNode('n1', 'task', 'Start', { type: 'task', goal: 'init', priority: 1 }),
        createNode('n2', 'task', 'Parallel A', { type: 'task', goal: 'a', priority: 2 }),
        createNode('n3', 'task', 'Parallel B', { type: 'task', goal: 'b', priority: 2 }),
        createNode('n4', 'task', 'End', { type: 'task', goal: 'end', priority: 3 }),
      ],
      [
        createEdge('n1', 'n2'),
        createEdge('n1', 'n3'),
        createEdge('n2', 'n4'),
        createEdge('n3', 'n4'),
      ],
    );

    engine.compile(wf);
    const metrics = await engine.execute(wf);
    expect(metrics.completedNodes).toBe(4);
  });

  it('handles tool nodes', async () => {
    const wf = createWorkflow(
      'wf-tool',
      'Tool Workflow',
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

    engine.compile(wf);
    const metrics = await engine.execute(wf);
    expect(metrics.completedNodes).toBe(1);
  });

  it('handles agent nodes', async () => {
    const wf = createWorkflow(
      'wf-agent',
      'Agent Workflow',
      'admin',
      [
        createNode('n1', 'agent', 'Code Review', {
          type: 'agent',
          role: 'reviewer',
          goal: 'review code',
        }),
      ],
      [],
    );

    engine.compile(wf);
    const metrics = await engine.execute(wf);
    expect(metrics.completedNodes).toBe(1);
  });

  it('handles approval nodes', async () => {
    const wf = createWorkflow(
      'wf-approval',
      'Approval Workflow',
      'admin',
      [createNode('n1', 'approval', 'Review Approval', { type: 'approval', riskScore: 60 })],
      [],
    );

    engine.compile(wf);
    const metrics = await engine.execute(wf);
    expect(metrics.completedNodes).toBe(1);
  });

  it('supports pause and resume', async () => {
    const wf = createWorkflow(
      'wf-pause',
      'Pause Workflow',
      'admin',
      [createNode('n1', 'task', 'Step 1', { type: 'task', goal: 'test', priority: 1 })],
      [],
    );

    engine.compile(wf);
    engine.resume(); // compile -> COMPILED, resume won't change to RUNNING
    expect(engine.getState()).toBe('COMPILED'); // Still COMPILED since we didn't execute

    // Execute to set state to RUNNING
    engine.execute(wf);
    engine.pause();
    expect(engine.getState()).toBe('PAUSED');

    engine.resume();
    expect(engine.getState()).toBe('RUNNING');
  });

  it('supports cancel', async () => {
    const wf = createWorkflow(
      'wf-cancel',
      'Cancel Workflow',
      'admin',
      [createNode('n1', 'task', 'Step 1', { type: 'task', goal: 'test', priority: 1 })],
      [],
    );

    engine.compile(wf);
    engine.execute(wf); // Execute to set state to RUNNING
    engine.cancel();
    expect(engine.getState()).toBe('CANCELLED');
  });

  it('builds metrics correctly', async () => {
    const wf = createWorkflow(
      'wf-metrics',
      'Metrics Workflow',
      'admin',
      [createNode('n1', 'task', 'Step 1', { type: 'task', goal: 'test', priority: 1 })],
      [],
    );

    engine.compile(wf);
    const metrics = await engine.execute(wf);
    expect(metrics.workflowId).toBe('wf-metrics');
    expect(metrics.totalNodes).toBe(1);
    expect(metrics.completedNodes).toBe(1);
    expect(metrics.totalDurationMs).toBeGreaterThanOrEqual(0);
  });
});

describe('Compiler', () => {
  it('compiles a valid workflow', () => {
    const wf = createWorkflow(
      'wf-1',
      'Test',
      'admin',
      [createNode('n1', 'task', 'Task 1', { type: 'task', goal: 'test', priority: 1 })],
      [],
    );

    const compiled = compileWorkflow(wf);
    expect(compiled.version).toBe(2);
    expect(compiled.nodes.length).toBe(1);
  });

  it('rejects invalid workflows', () => {
    const wf = createWorkflow('wf-1', 'Test', 'admin', [], []);
    expect(() => compileWorkflow(wf)).toThrow();
  });
});

describe('Serializer', () => {
  it('serializes and deserializes workflow', () => {
    const serializer = new JsonWorkflowSerializer();
    const wf = createWorkflow(
      'wf-1',
      'Test',
      'admin',
      [createNode('n1', 'task', 'Task 1', { type: 'task', goal: 'test', priority: 1 })],
      [],
    );

    const serialized = serializer.serialize(wf);
    const deserialized = serializer.deserialize(serialized);

    expect(deserialized.id).toBe('wf-1');
    expect(deserialized.name).toBe('Test');
    expect(deserialized.nodes.length).toBe(1);
  });

  it('throws on invalid JSON', () => {
    const serializer = new JsonWorkflowSerializer();
    expect(() => serializer.deserialize('invalid json')).toThrow();
  });

  it('throws on incomplete workflow', () => {
    const serializer = new JsonWorkflowSerializer();
    expect(() => serializer.deserialize('{"id": "test"}')).toThrow();
  });
});
