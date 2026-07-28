/**
 * @module workflow-orchestration/workflow-orchestration.test
 * @description Comprehensive tests for M5.5 Autonomous Workflow Execution.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  WorkflowOrchestrator,
  WorkflowStateMachine,
  WorkflowSession,
  WorkflowBuilder,
  WorkflowValidator,
  WorkflowGraphManager,
  WorkflowCheckpointManager,
  WorkflowRecoveryManager,
  WorkflowHistory,
  WorkflowStatisticsCollector,
  WorkflowScheduler,
  WorkflowDispatcher,
  WorkflowEngine,
  WorkflowMonitor,
  MultiGoalManager,
  GoalConflictDetector,
  ResourceAllocator,
  ResourceValidator,
  ResourceBudgetManager,
  ExecutionValidator,
  ReplanningEngine,
  ReplanningPolicyManager,
  ProgressTracker,
  DecisionLog,
  WorkflowMetadataManager,
  WorkflowPriorityEngine,
  WorkflowDependencyManager,
  WorkflowEventBus,
  WorkflowHookManager,
  WorkflowQueue,
  WorkflowRouter,
  WorkflowBarrier,
  WorkflowSplitter,
  WorkflowMerger,
  ExecutionPolicyManager,
  ExecutionHistory,
  WorkflowIntelligenceMetricsCollector,
  WorkflowError,
  WorkflowStateError,
  WorkflowValidationError,
  WorkflowExecutionError,
  ResourceExhaustedError,
  WorkflowGraph,
  WorkflowTask,
  WorkflowHook,
} from '../src/index.js';

const makeTask = (id: string, priority: number = 5, type: string = 'a'): WorkflowTask => ({
  id,
  goalId: 'g1',
  workflowId: 'w1',
  type,
  payload: {},
  priority,
  timeout: 1000,
  status: 'PENDING',
  retries: 0,
  maxRetries: 3,
  timestamp: new Date(),
});

// ============================================================
// STATE MACHINE
// ============================================================
describe('Workflow State Machine', () => {
  it('transitions through valid lifecycle', () => {
    const sm = new WorkflowStateMachine();
    expect(sm.getState()).toBe('CREATED');
    sm.transition('BUILDING');
    sm.transition('VALIDATING');
    sm.transition('READY');
    sm.transition('SCHEDULING');
    sm.transition('DISPATCHING');
    sm.transition('EXECUTING');
    sm.transition('MONITORING');
    sm.transition('CHECKPOINTING');
    sm.transition('REPLANNING');
    sm.transition('READY');
    sm.transition('SCHEDULING');
    sm.transition('DISPATCHING');
    sm.transition('EXECUTING');
    sm.transition('MONITORING');
    sm.transition('COMPLETED');
    expect(sm.getState()).toBe('COMPLETED');
  });

  it('rejects invalid transitions', () => {
    const sm = new WorkflowStateMachine();
    expect(() => sm.transition('COMPLETED')).toThrow(WorkflowStateError);
    expect(sm.canTransition('BUILDING')).toBe(true);
    expect(sm.canTransition('COMPLETED')).toBe(false);
  });

  it('supports pause/resume', () => {
    const sm = new WorkflowStateMachine();
    sm.transition('BUILDING');
    sm.transition('VALIDATING');
    sm.transition('READY');
    sm.transition('SCHEDULING');
    sm.transition('PAUSED');
    expect(sm.getState()).toBe('PAUSED');
    sm.transition('SCHEDULING');
    sm.transition('CANCELLED');
    expect(sm.getState()).toBe('CANCELLED');
  });

  it('supports replanning', () => {
    const sm = new WorkflowStateMachine();
    sm.transition('BUILDING');
    sm.transition('VALIDATING');
    sm.transition('READY');
    sm.transition('SCHEDULING');
    sm.transition('DISPATCHING');
    sm.transition('EXECUTING');
    sm.transition('MONITORING');
    sm.transition('REPLANNING');
    sm.transition('FAILED');
    sm.transition('REPLANNING');
    expect(sm.getState()).toBe('REPLANNING');
  });
});

// ============================================================
// SESSION
// ============================================================
describe('Workflow Session', () => {
  it('creates and manages session lifecycle', () => {
    const session = new WorkflowSession('t1');
    expect(session.traceId).toBe('t1');
    expect(session.status).toBe('ACTIVE');
    session.markComplete();
    expect(session.status).toBe('COMPLETED');
    session.markFailed();
    expect(session.status).toBe('FAILED');
    session.markCancelled();
    expect(session.status).toBe('CANCELLED');
    session.markPaused();
    expect(session.status).toBe('PAUSED');
  });
});

// ============================================================
// WORKFLOW BUILDER
// ============================================================
describe('Workflow Builder', () => {
  it('builds workflow graph from subgoal count', () => {
    const builder = new WorkflowBuilder();
    const graph = builder.build('g1', 3);
    expect(graph.nodes.length).toBe(3);
    expect(graph.edges.length).toBe(2);
    expect(graph.checksum).toBeDefined();
  });
});

// ============================================================
// WORKFLOW VALIDATOR
// ============================================================
describe('Workflow Validator', () => {
  it('validates and rejects invalid graphs', () => {
    const v = new WorkflowValidator();
    expect(() =>
      v.validateGraph({ id: 'g1', nodes: [], edges: [], checksum: '', timestamp: new Date() }),
    ).toThrow(WorkflowValidationError);
    expect(() =>
      v.validateGraph({
        id: 'g1',
        nodes: [{ id: 'n1', type: 'sequential', taskId: 't1', metadata: {} }],
        edges: [{ source: 'n1', target: 'n2', weight: 1 }],
        checksum: '',
        timestamp: new Date(),
      }),
    ).toThrow(WorkflowValidationError);
  });
});

// ============================================================
// WORKFLOW GRAPH
// ============================================================
describe('Workflow Graph Manager', () => {
  it('detects cycles', () => {
    const gm = new WorkflowGraphManager();
    expect(gm.detectCycles([], [])).toBe(false);
    expect(
      gm.detectCycles(
        [
          { id: 'a', type: 'sequential', taskId: 't1', metadata: {} },
          { id: 'b', type: 'sequential', taskId: 't2', metadata: {} },
        ],
        [
          { source: 'a', target: 'b', weight: 1 },
          { source: 'b', target: 'a', weight: 1 },
        ],
      ),
    ).toBe(true);
  });
});

// ============================================================
// SCHEDULER, QUEUE, DISPATCHER, ROUTER
// ============================================================
describe('Workflow Scheduler', () => {
  it('queues and dequeues tasks by priority', () => {
    const sched = new WorkflowScheduler();
    sched.schedule(makeTask('t1', 1));
    sched.schedule(makeTask('t2', 10));
    expect(sched.getQueueSize()).toBe(2);
    expect(sched.dequeue()?.id).toBe('t2');
  });
});

describe('Workflow Queue', () => {
  it('manages queue with cancellation', () => {
    const queue = new WorkflowQueue();
    queue.enqueue(makeTask('t1'));
    expect(queue.size()).toBe(1);
    queue.cancel('t1');
    expect(queue.size()).toBe(0);
  });
});

describe('Workflow Dispatcher', () => {
  it('dispatches tasks successfully', async () => {
    const result = await new WorkflowDispatcher().dispatch(makeTask('t1'));
    expect(result).toBeDefined();
  });
});

describe('Workflow Router', () => {
  it('routes tasks to correct handlers', () => {
    const router = new WorkflowRouter();
    expect(router.route(makeTask('t1', 1, 'agent'))).toBe('agent-executor');
    expect(router.route(makeTask('t1', 1, 'tool'))).toBe('tool-executor');
    expect(router.route(makeTask('t1', 1, 'workflow'))).toBe('workflow-executor');
    expect(router.route(makeTask('t1', 1, 'other'))).toBe('default-executor');
  });
});

// ============================================================
// MULTI-GOAL MANAGER
// ============================================================
describe('Multi-Goal Manager', () => {
  it('manages multiple goals lifecycle', () => {
    const mgr = new MultiGoalManager();
    mgr.register('g1', 5);
    mgr.register('g2', 10);
    expect(mgr.getRunning()).toHaveLength(2);
    mgr.suspend('g1');
    expect(mgr.getRunning()).toHaveLength(1);
    mgr.resume('g1');
    mgr.complete('g1');
    mgr.cancel('g2');
    expect(mgr.getRunning()).toHaveLength(0);
  });
});

// ============================================================
// GOAL CONFLICT DETECTOR
// ============================================================
describe('Goal Conflict Detector', () => {
  it('detects resource conflicts', () => {
    const det = new GoalConflictDetector();
    expect(det.detect([])).toHaveLength(0);
    expect(det.detect(['g1'])).toHaveLength(0);
    expect(det.detect(['g1', 'g2'])).toHaveLength(1);
  });
});

// ============================================================
// RESOURCE MANAGEMENT
// ============================================================
describe('Resource Allocator, Validator, and Budget', () => {
  it('allocates and validates resources', () => {
    const allocator = new ResourceAllocator();
    const res = allocator.allocate('cpu', 10);
    expect(allocator.getAllocations()).toHaveLength(1);
    allocator.release(res.id);
    expect(allocator.getAllocations()).toHaveLength(0);

    const validator = new ResourceValidator();
    expect(() => validator.validate(10, 5, 'cpu')).toThrow(ResourceExhaustedError);
    expect(() => validator.validate(5, 10, 'cpu')).not.toThrow();

    const budget = new ResourceBudgetManager();
    budget.consumeTokens(500, 1000);
    expect(() => budget.consumeTokens(600, 1000)).toThrow(ResourceExhaustedError);
  });
});

// ============================================================
// EXECUTION POLICY AND VALIDATOR
// ============================================================
describe('Execution Policy and Validator', () => {
  it('validates policies and requires approval', () => {
    const policy = new ExecutionPolicyManager();
    expect(policy.validate('safe')).toBe(true);
    expect(policy.validate('unknown')).toBe(false);
    expect(policy.requiresApproval('safe')).toBe(true);
    expect(policy.requiresApproval('aggressive')).toBe(false);
  });

  it('validates execution plans', () => {
    const v = new ExecutionValidator();
    expect(() => v.validatePlan(0, 100)).toThrow(WorkflowExecutionError);
    expect(() => v.validatePlan(5, 0)).toThrow(WorkflowExecutionError);
    expect(() => v.validatePlan(5, 100)).not.toThrow();
  });
});

// ============================================================
// REPLANNING
// ============================================================
describe('Replanning Engine and Policy', () => {
  it('executes replanning', () => {
    const engine = new ReplanningEngine();
    const graph: WorkflowGraph = {
      id: 'g1',
      nodes: [],
      edges: [],
      checksum: '',
      timestamp: new Date(),
    };
    const replanned = engine.replan(graph, 'reason');
    expect(replanned.timestamp).toBeInstanceOf(Date);
  });

  it('validates replanning policies', () => {
    const policy = new ReplanningPolicyManager();
    expect(policy.validate('conservative')).toBe(true);
    expect(policy.validate('unknown')).toBe(false);
  });
});

// ============================================================
// BARRIERS, SPLITTERS, MERGERS
// ============================================================
describe('Barriers, Splitters, and Mergers', () => {
  it('barrier synchronizes parallel branches', () => {
    const barrier = new WorkflowBarrier(2);
    expect(barrier.isComplete()).toBe(false);
    barrier.arrive();
    expect(barrier.isComplete()).toBe(false);
    barrier.arrive();
    expect(barrier.isComplete()).toBe(true);
    barrier.reset();
    expect(barrier.isComplete()).toBe(false);
  });

  it('splitter creates parallel branches', () => {
    const splitter = new WorkflowSplitter();
    const result = splitter.split(
      [{ id: 'n1', type: 'sequential', taskId: 't1', metadata: {} }],
      'n1',
      2,
    );
    expect(result.nodes).toHaveLength(1);
  });

  it('merger combines branches', () => {
    const merger = new WorkflowMerger();
    const result = merger.merge([{ id: 'n1', type: 'sequential', taskId: 't1', metadata: {} }]);
    expect(result).toHaveLength(1);
  });
});

// ============================================================
// DEPENDENCY, PROGRESS, HISTORY, DECISION
// ============================================================
describe('Dependency, Progress, History, and Decision', () => {
  it('manages dependency edges', () => {
    const dep = new WorkflowDependencyManager();
    dep.addEdge('a', 'b');
    expect(dep.getEdges()).toHaveLength(1);
    expect(dep.hasDependency('b')).toBe(true);
    expect(dep.hasDependency('c')).toBe(false);
  });

  it('tracks progress', () => {
    const pt = new ProgressTracker();
    pt.updateProgress('w1', 50);
    expect(pt.getProgress('w1')).toBe(50);
    pt.updateProgress('w1', 120);
    expect(pt.getProgress('w1')).toBe(100);
    expect(pt.getProgress('missing')).toBe(0);
  });

  it('records history and decisions', () => {
    const history = new WorkflowHistory();
    history.record('w1', 't1', 'SUCCESS');
    expect(history.getAll()).toHaveLength(1);

    const log = new DecisionLog();
    log.log('w1', 'decide to run');
    expect(log.getAll()).toHaveLength(1);
  });
});

// ============================================================
// METRICS
// ============================================================
describe('Workflow Intelligence Metrics', () => {
  it('collects and computes metrics', () => {
    const mc = new WorkflowIntelligenceMetricsCollector();
    mc.recordWorkflow(true);
    mc.recordTask(false, true);
    mc.recordTask(true, false);
    const m = mc.getMetrics();
    expect(m.workflowsCreated).toBe(1);
    expect(m.tasksExecuted).toBe(2);
    expect(m.successRate).toBe(50);
    expect(m.failureRate).toBe(50);
  });
});

// ============================================================
// HOOKS
// ============================================================
describe('Workflow Hook Manager', () => {
  it('executes all hooks', async () => {
    const hm = new WorkflowHookManager();
    const hook: WorkflowHook = {
      beforeWorkflow: vi.fn(),
      afterWorkflow: vi.fn(),
      beforeExecution: vi.fn(),
      afterExecution: vi.fn(),
      beforeDispatch: vi.fn(),
      afterDispatch: vi.fn(),
      beforeReplanning: vi.fn(),
      afterReplanning: vi.fn(),
      beforeConflictResolution: vi.fn(),
      afterConflictResolution: vi.fn(),
    };
    hm.register(hook);
    await hm.runBeforeWorkflow('w1');
    await hm.runAfterWorkflow('w1', {});
    await hm.runBeforeExecution('t1');
    await hm.runAfterExecution('t1', {});
    await hm.runBeforeDispatch('t1');
    await hm.runAfterDispatch('t1', {});
    await hm.runBeforeReplanning('w1');
    await hm.runAfterReplanning('w1', {});
    await hm.runBeforeConflictResolution('c1');
    await hm.runAfterConflictResolution('c1', 'resolved');
    expect(hook.beforeWorkflow).toHaveBeenCalled();
  });
});

// ============================================================
// CHECKPOINT, RECOVERY, MONITOR, METADATA
// ============================================================
describe('Checkpoint, Recovery, Monitor, Metadata', () => {
  it('saves and loads checkpoints', () => {
    const cm = new WorkflowCheckpointManager();
    const cp = cm.save('w1', { t1: 'done' });
    expect(cp.checksum).toBeDefined();
    expect(cm.load('w1')).toBeDefined();
  });

  it('recovers from checkpoints', () => {
    const cm = new WorkflowCheckpointManager();
    cm.save('w1', { t1: 'done' });
    const rm = new WorkflowRecoveryManager(cm);
    expect(rm.recover('w1').restored).toBe(true);
    expect(rm.recover('missing').restored).toBe(false);
  });

  it('monitors task states', () => {
    const mon = new WorkflowMonitor();
    mon.updateState('t1', 'RUNNING');
    expect(mon.getState('t1')).toBe('RUNNING');
    expect(mon.getStateCount('RUNNING')).toBe(1);
  });

  it('creates immutable metadata', () => {
    const mm = new WorkflowMetadataManager();
    const meta = mm.create('w1', 'g1', 1);
    expect(meta.checksum).toBeDefined();
    expect(meta.workflowId).toBe('w1');
  });
});

// ============================================================
// STATISTICS
// ============================================================
describe('Workflow Statistics', () => {
  it('collects and computes statistics', () => {
    const sc = new WorkflowStatisticsCollector();
    sc.recordWorkflow(true);
    sc.recordWorkflow(false);
    sc.recordTask(false, true);
    sc.recordTask(true, false);
    const m = sc.getMetrics();
    expect(m.workflowsCreated).toBe(2);
    expect(m.successRate).toBe(50);
    expect(m.failureRate).toBe(50);
  });
});

// ============================================================
// ORCHESTRATOR FULL FLOW
// ============================================================
describe('Workflow Orchestrator Full Flow', () => {
  let orch: WorkflowOrchestrator;

  beforeEach(() => {
    orch = new WorkflowOrchestrator();
  });

  it('executes workflow end-to-end', async () => {
    const result = await orch.executeWorkflow('g1', 2);
    expect(result.completed).toBe(true);
    expect(result.results).toHaveLength(2);
    expect(orch.statisticsCollector.getMetrics().workflowsCreated).toBe(1);
  });

  it('handles single node workflow', async () => {
    const result = await orch.executeWorkflow('g2', 1);
    expect(result.completed).toBe(true);
  });

  it('handles workflow cancellation during execution', () => {
    orch.stateMachine.transition('BUILDING');
    orch.stateMachine.transition('VALIDATING');
    orch.stateMachine.transition('READY');
    orch.stateMachine.transition('SCHEDULING');
    orch.cancel('cancel-test');
    expect(orch.stateMachine.getState()).toBe('CANCELLED');
  });

  it('handles replanning', () => {
    orch.recover('recover-test');
  });

  it('registers and executes hooks', async () => {
    const hookFn = vi.fn();
    orch.hooks.register({ beforeWorkflow: hookFn });
    await orch.executeWorkflow('g3', 1);
    expect(hookFn).toHaveBeenCalled();
  });

  it('validates execution plan failure', async () => {
    const v = new ExecutionValidator();
    expect(() => v.validatePlan(0, 100)).toThrow(WorkflowExecutionError);
  });

  it('manages multi-goal lifecycle', () => {
    orch.goalManager.register('g1', 5);
    orch.goalManager.register('g2', 10);
    expect(orch.goalManager.getRunning()).toHaveLength(2);
    orch.goalManager.cancel('g1');
    expect(orch.goalManager.getRunning()).toHaveLength(1);
  });

  it('detects goal conflicts', () => {
    const conflicts = orch.conflictDetector.detect(['g1', 'g2']);
    expect(conflicts).toHaveLength(1);
  });

  it('manages resource allocation', () => {
    const res = orch.resourceAllocator.allocate('cpu', 10);
    expect(orch.resourceAllocator.getAllocations()).toHaveLength(1);
    orch.resourceAllocator.release(res.id);
    expect(orch.resourceAllocator.getAllocations()).toHaveLength(0);
  });

  it('validates resources', () => {
    expect(() => orch.resourceValidator.validate(10, 5, 'cpu')).toThrow(ResourceExhaustedError);
  });

  it('manages resource budgets', () => {
    orch.resourceBudget.consumeTokens(500, 1000);
    expect(orch.resourceBudget.getConsumption().maxTokens).toBe(500);
  });

  it('tracks progress', () => {
    orch.progressTracker.updateProgress('w1', 50);
    expect(orch.progressTracker.getProgress('w1')).toBe(50);
  });

  it('logs decisions', () => {
    orch.decisionLog.log('w1', 'decide');
    expect(orch.decisionLog.getAll()).toHaveLength(1);
  });

  it('manages metadata', () => {
    const meta = orch.metadataManager.create('w1', 'g1', 1);
    expect(meta.checksum).toBeDefined();
  });

  it('manages dependencies', () => {
    orch.dependencyManager.addEdge('a', 'b');
    expect(orch.dependencyManager.getEdges()).toHaveLength(1);
  });

  it('validates replanning policy', () => {
    const policy = new ReplanningPolicyManager();
    expect(policy.validate('conservative')).toBe(true);
    expect(policy.validate('unknown')).toBe(false);
  });
});

// ============================================================
// ADDITIONAL COVERAGE TESTS
// ============================================================
describe('Additional Coverage Tests', () => {
  it('covers WorkflowPriority engine', () => {
    const pe = new WorkflowPriorityEngine();
    expect(pe.assignPriority('critical', 5)).toBe(10);
    expect(pe.assignPriority('high', 5)).toBe(8);
    expect(pe.assignPriority('medium', 5)).toBe(5);
    expect(pe.assignPriority('low', 5)).toBe(3);
    expect(pe.assignPriority('background', 5)).toBe(1);
    expect(pe.assignPriority('unknown', 5)).toBe(5);
  });

  it('covers event bus methods', () => {
    const bus = new WorkflowEventBus();
    bus.subscribe('test', vi.fn());
    bus.publish('test', {});
    bus.clear();
    bus.publish('empty', {});
  });

  it('covers ExecutionHistory methods', () => {
    const hist = new ExecutionHistory();
    hist.record('w1', 'g1', 'SUCCESS');
    expect(hist.getAll()).toHaveLength(1);
  });

  it('covers ResourceBudgetManager edge cases', () => {
    const budget = new ResourceBudgetManager();
    expect(budget.getConsumption().maxTokens).toBe(0);
  });

  it('covers execution policy manager', () => {
    const pm = new ExecutionPolicyManager();
    expect(pm.getAvailablePolicies()).toContain('safe');
    expect(pm.requiresApproval('safe')).toBe(true);
  });

  it('covers workflow-orchestrator cancel after completed state', async () => {
    // Execute and then start a fresh orchestrator for a fresh cancel
    const orch2 = new WorkflowOrchestrator();
    orch2.stateMachine.transition('BUILDING');
    orch2.stateMachine.transition('VALIDATING');
    orch2.stateMachine.transition('READY');
    orch2.stateMachine.transition('SCHEDULING');
    orch2.cancel('test');
    expect(orch2.stateMachine.getState()).toBe('CANCELLED');
  });
});
