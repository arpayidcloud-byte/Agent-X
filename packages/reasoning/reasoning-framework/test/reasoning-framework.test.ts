/**
 * @module reasoning-framework/reasoning-framework.test
 * @description Comprehensive tests for Reasoning Framework (M5.1).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ReasoningFramework,
  ReasoningPipeline,
  PipelineStateMachine,
  PipelineHookManager,
  PipelineEventEmitter,
  PipelineMetrics,
  PipelineTraceManager,
  PipelineBudgetManager,
  PipelineValidator,
  ReasoningGraphManager,
  ReasoningTreeManager,
  ReasoningStrategyBase,
  ReasoningPolicy,
  ReasoningRegistry,
  ReasoningDispatcher,
  ReasoningScheduler,
  ReasoningCheckpointManager,
  ReasoningRecoveryManager,
  ReasoningCapabilities,
  ReasoningValidator,
  ReasoningHealthMonitor,
  ReasoningStatistics,
  ReasoningObservability,
  ReasoningAuditManager,
  ReasoningContextManager,
  ReasoningSessionManager,
  createPipelineContext,
  PipelineStageBase,
  ReasoningContext,
  ReasoningSession,
  ReasoningGraph,
  ReasoningError,
  PipelineError,
  StrategyError,
  GraphIntegrityError,
  ValidationError,
  CheckpointError,
  IReasoningStrategy,
} from '../src/index.js';

const defaultSession: ReasoningSession = {
  id: 's1',
  traceId: 't1',
  correlationId: 'c1',
  status: 'ACTIVE',
  startedAt: new Date(),
  metadata: {},
};

const emptyGraph: ReasoningGraph = {
  nodes: [{ id: 'n1', label: 'H1', type: 'hypothesis', metadata: {} }],
  edges: [{ id: 'e1', sourceId: 'n1', targetId: 'n1', type: 'supports', weight: 1 }],
  checksum: '',
};

describe('Errors', () => {
  it('instantiates all error types', () => {
    const errs = [
      PipelineError,
      StrategyError,
      GraphIntegrityError,
      ValidationError,
      CheckpointError,
    ];
    for (const Err of errs) {
      const e = new Err('msg', 'src');
      expect(e.message).toBe('msg');
      expect(e.source).toBe('src');
    }
    const base = new ReasoningError('msg', 'CODE', 'src');
    expect(base.code).toBe('CODE');
  });
});

describe('Pipeline State Machine', () => {
  it('transitions valid states', () => {
    const sm = new PipelineStateMachine();
    expect(sm.getState()).toBe('INPUT');
    sm.transition('NORMALIZATION');
    sm.transition('CONTEXT_BUILD');
    expect(sm.getState()).toBe('CONTEXT_BUILD');
    expect(sm.canTransition('GRAPH_BUILD')).toBe(true);
  });

  it('rejects invalid transitions', () => {
    const sm = new PipelineStateMachine();
    expect(() => sm.transition('COMPLETED')).toThrow(PipelineError);
  });
});

describe('Pipeline Metrics and Trace', () => {
  it('tracks metrics and traces execution', () => {
    const metrics = new PipelineMetrics();
    metrics.recordStageDuration('INPUT', 10);
    expect(metrics.getMetrics().totalTimeMs).toBe(10);
    expect(metrics.getMetrics().INPUT).toBe(10);

    const trace = new PipelineTraceManager();
    trace.startTrace('t1');
    trace.addRecord('t1', 'INPUT');
    expect(trace.getTrace('t1')).toHaveLength(1);
    expect(trace.getTrace('missing')).toHaveLength(0);
  });
});

describe('Pipeline Budget', () => {
  it('validates budget limits', () => {
    const budget = new PipelineBudgetManager(100, 1000);
    budget.consume(50, 500);
    expect(budget.getBudgetSnapshot().tokensUsed).toBe(50);
    expect(() => budget.consume(60, 100)).toThrow();
    expect(() => budget.consume(10, 900)).toThrow();
  });
});

describe('Pipeline Hooks', () => {
  it('executes all hook points', async () => {
    const hooks = new PipelineHookManager();
    const mockHook = {
      beforePipeline: vi.fn(),
      afterPipeline: vi.fn(),
      beforeStage: vi.fn(),
      afterStage: vi.fn(),
      onFailure: vi.fn(),
      onRecovery: vi.fn(),
    };
    hooks.register(mockHook);
    await hooks.runBeforePipeline('s1');
    await hooks.runAfterPipeline('s1', {});
    await hooks.runBeforeStage('s1', 'INPUT');
    await hooks.runAfterStage('s1', 'INPUT');
    await hooks.runOnFailure('s1', new Error('e'));
    await hooks.runOnRecovery('s1');
    expect(mockHook.beforePipeline).toHaveBeenCalled();
  });
});

describe('Pipeline Events', () => {
  it('publishes pipeline events', () => {
    const events = new PipelineEventEmitter();
    events.emit('reasoning.pipeline.started', 't1', 's1', {});
    expect(events.getEvents()).toHaveLength(1);
    expect(events.getEvents()[0].type).toBe('reasoning.pipeline.started');
  });
});

describe('Pipeline Validator', () => {
  it('validates pipeline sessions', () => {
    const validator = new PipelineValidator();
    expect(() => validator.validateStage({} as any, 'INPUT')).toThrow(ValidationError);
  });
});

describe('Reasoning Graph and Tree', () => {
  it('manages graph nodes and edges', () => {
    const graphManager = new ReasoningGraphManager();
    graphManager.addNode({ id: 'n1', label: 'Node 1', type: 'fact', metadata: {} });
    graphManager.addEdge({ id: 'e1', sourceId: 'n1', targetId: 'n1', type: 'supports', weight: 1 });
    expect(graphManager.getGraph().nodes).toHaveLength(1);
  });

  it('manages tree nodes', () => {
    const treeManager = new ReasoningTreeManager();
    treeManager.addNode({ id: 'n1', label: 'Node 1', level: 1, metadata: {} });
    expect(treeManager.getTree().nodes).toHaveLength(1);
  });
});

describe('Reasoning Strategy and Registry', () => {
  it('validates strategy interface and registry', async () => {
    const strategy = new ReasoningStrategyBase();
    await strategy.initialize({} as any);
    await strategy.prepare({} as any);
    const result = await strategy.execute({} as any);
    expect(result).toEqual({});
    expect(await strategy.validate({} as any)).toBe(true);
    await strategy.checkpoint('s1', {});
    expect(await strategy.recover('s1')).toEqual({});
    await strategy.cleanup();

    const registry = new ReasoningRegistry();
    registry.register('s1', strategy);
    expect(registry.resolve('s1')).toBe(strategy);
  });
});

describe('Reasoning Policy', () => {
  it('validates max depth constraints', () => {
    const policy = new ReasoningPolicy();
    expect(
      policy.validate({
        sessionId: 's1',
        traceId: 't1',
        goalId: 'g1',
        depth: 3,
        maxDepth: 5,
        metadata: {},
      }),
    ).toBe(true);
    expect(
      policy.validate({
        sessionId: 's1',
        traceId: 't1',
        goalId: 'g1',
        depth: 6,
        maxDepth: 5,
        metadata: {},
      }),
    ).toBe(false);
  });
});

describe('Reasoning Dispatcher', () => {
  it('dispatches strategies successfully', async () => {
    const strategy = new ReasoningStrategyBase();
    const dispatcher = new ReasoningDispatcher();
    const result = await dispatcher.dispatch(strategy, emptyGraph);
    expect(result).toEqual(emptyGraph);

    // Fail dispatch path
    const failingStrategy = {
      ...strategy,
      execute: async () => {
        throw new Error('dispatch failed');
      },
    } as any;
    await expect(dispatcher.dispatch(failingStrategy, emptyGraph)).rejects.toThrow(StrategyError);
  });
});

describe('Reasoning Scheduler', () => {
  it('queues tasks without duplication', () => {
    const scheduler = new ReasoningScheduler();
    scheduler.schedule('task-1');
    expect(() => scheduler.schedule('task-1')).toThrow();
    expect(scheduler.next()).toBe('task-1');
  });
});

describe('Reasoning Checkpoint Manager', () => {
  it('saves and retrieves checkpoint snapshots', () => {
    const manager = new ReasoningCheckpointManager();
    const snap = manager.save('s1', { val: 1 });
    expect(snap.sessionId).toBe('s1');
    expect(manager.getSnapshots('s1')).toHaveLength(1);
  });
});

describe('Reasoning Recovery Manager', () => {
  it('restores from snapshot correctly', () => {
    const manager = new ReasoningRecoveryManager();
    const result = manager.recover({
      id: '1',
      sessionId: 's1',
      timestamp: new Date(),
      snapshot: { val: 1 },
      checksum: '',
    });
    expect(result.val).toBe(1);
  });
});

describe('Reasoning Health and Capabilities', () => {
  it('reports health and capabilities', () => {
    const health = new ReasoningHealthMonitor();
    expect(health.isHealthy()).toBe(true);

    const caps = new ReasoningCapabilities();
    expect(caps.getCapabilities()).toContain('Graph');
  });
});

describe('Reasoning Validator', () => {
  it('validates context and graph integrity', () => {
    const validator = new ReasoningValidator();
    expect(() => validator.validateContext({} as any)).toThrow(ValidationError);

    const goodGraph: ReasoningGraph = {
      nodes: [{ id: 'n1', label: 'N', type: 'fact', metadata: {} }],
      edges: [{ id: 'e1', sourceId: 'n1', targetId: 'n1', type: 'supports', weight: 1 }],
      checksum: '',
    };
    expect(() => validator.validateGraph(goodGraph)).not.toThrow();

    const badGraph: ReasoningGraph = {
      nodes: [{ id: 'n1', label: 'N', type: 'fact', metadata: {} }],
      edges: [{ id: 'e1', sourceId: 'n1', targetId: 'n2', type: 'supports', weight: 1 }],
      checksum: '',
    };
    expect(() => validator.validateGraph(badGraph)).toThrow(GraphIntegrityError);
  });
});

describe('Module Wrappers', () => {
  it('covers pipeline-stage, pipeline-context, reasoning-context, reasoning-session, reasoning-observability, reasoning-audit', () => {
    const stageBase = new PipelineStageBase('stage');
    expect(stageBase.getName()).toBe('stage');

    const ctx = createPipelineContext('s1', 't1');
    expect(ctx.sessionId).toBe('s1');

    const rCtxManager = new ReasoningContextManager({
      sessionId: 's1',
      traceId: 't1',
      goalId: 'g1',
      depth: 1,
      maxDepth: 5,
      metadata: {},
    });
    expect(rCtxManager.getContext().sessionId).toBe('s1');

    const rSessionManager = new ReasoningSessionManager({
      id: 's1',
      traceId: 't1',
      correlationId: 'c1',
      status: 'ACTIVE',
      startedAt: new Date(),
      metadata: {},
    });
    expect(rSessionManager.getSession().id).toBe('s1');

    const traceManager = new PipelineTraceManager();
    traceManager.startTrace('t1');
    traceManager.addRecord('t1', 'INPUT');
    const obs = new ReasoningObservability(traceManager);
    expect(obs.getTraceSummary('t1').stepsPassed).toBe(1);

    const auditManager = new ReasoningAuditManager();
    auditManager.log('t1', 's1', 'test', {});
    expect(auditManager.getRecords()).toHaveLength(1);

    const stats = new ReasoningStatistics(new PipelineMetrics());
    stats.getStats();
  });
});

describe('Framework Execution', () => {
  let framework: ReasoningFramework;

  beforeEach(() => {
    framework = new ReasoningFramework();
  });

  it('executes full reasoning flow successfully', async () => {
    await framework.executeReasoning(defaultSession, emptyGraph);
  });

  it('handles execution failures', async () => {
    const failSession = { ...defaultSession, id: '', metadata: {} };
    await expect(framework.executeReasoning(failSession, emptyGraph)).rejects.toThrow();

    // Trigger state machine FAILED to COMPLETED/other error paths if needed
    const pipeline = new ReasoningPipeline();
    expect(pipeline.getState()).toBe('INPUT');
  });
});
