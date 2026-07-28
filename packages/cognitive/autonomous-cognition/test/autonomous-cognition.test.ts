/**
 * @module autonomous-cognition/autonomous-cognition.test
 * @description Comprehensive tests for M5.9 Autonomous Cognitive Execution.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  InvariantViolationError,
  GoalIntakeEngine,
  GoalAnalyzer,
  GoalDecomposer,
  GoalPrioritizer,
  GoalScheduler,
  Goal,
  GoalAnalysis,
  GoalDecomposition,
  ExecutionPlanner,
  AutonomousExecutor,
  TaskCoordinator,
  ProgressMonitor,
  ExecutionCheckpointManager,
  ExecutionReplayEngine,
  ExecutionPlan,
  TaskResult,
  ProgressSnapshot,
  Checkpoint,
  ReplayEntry,
  DecisionEngine,
  ReflectionEngine,
  SelfEvaluationEngine,
  SelfImprovementEngine,
  AdaptivePlanningEngine,
  StrategyOptimizer,
  FailureAnalyzer,
  RecoveryPlanner,
  Decision,
  Reflection,
  SelfEvaluation,
  ImprovementRecord,
  Strategy,
  FailureRecord,
  RecoveryPlan,
  KnowledgeFeedbackEngine,
  LearningMemoryManager,
  ExperienceRepository,
  FeedbackEntry,
  MemoryEntry,
  Experience,
  PolicyValidator,
  SafetyValidator,
  ConstraintValidator,
  ResourceOptimizer,
  ValidationResult,
  ExecutionMetricsCollector,
  ExecutionAuditManager,
  ExecutionTraceManager,
  ExecutionEventBus,
  MetricPoint,
  AuditEntry,
  TraceSpan,
  ExecutionEvent,
  EventListener,
} from '../src/index.js';

const makeGoal = (id: string, title = 'Test Goal', priority = 5): Goal => ({
  goalId: id,
  title,
  description: 'desc',
  priority,
  state: 'INTAKE',
  createdAt: new Date(),
  metadata: {},
  checksum: 'test',
});

// ============================================================================
// InvariantViolationError
// ============================================================================
describe('InvariantViolationError', () => {
  it('creates with all properties', () => {
    const err = new InvariantViolationError('msg', 'CODE', 'src');
    expect(err.message).toBe('msg');
    expect(err.code).toBe('CODE');
    expect(err.source).toBe('src');
    expect(err.name).toBe('InvariantViolationError');
    expect(err).toBeInstanceOf(Error);
  });
});

// ============================================================================
// GoalIntakeEngine
// ============================================================================
describe('GoalIntakeEngine', () => {
  let engine: GoalIntakeEngine;
  beforeEach(() => {
    engine = new GoalIntakeEngine();
  });

  it('intakes goals', () => {
    const goal = engine.intake('title', 'desc', 5);
    expect(goal.title).toBe('title');
    expect(goal.state).toBe('INTAKE');
    expect(goal.checksum).toBeDefined();
  });

  it('intakes with custom metadata', () => {
    const goal = engine.intake('title', 'desc', 5, { custom: true });
    expect(goal.metadata.custom).toBe(true);
  });

  it('transitions goal state', () => {
    const goal = engine.intake('title', 'desc', 5);
    const updated = engine.transition(goal.goalId, 'ANALYZING');
    expect(updated.state).toBe('ANALYZING');
  });

  it('throws on transition for missing goal', () => {
    expect(() => engine.transition('missing', 'ANALYZING')).toThrow('Goal not found');
  });

  it('gets goal', () => {
    const goal = engine.intake('title', 'desc', 5);
    expect(engine.get(goal.goalId)).toBeDefined();
    expect(engine.get('missing')).toBeUndefined();
  });

  it('gets all goals', () => {
    engine.intake('a', 'd', 1);
    engine.intake('b', 'd', 2);
    expect(engine.getAll()).toHaveLength(2);
  });
});

// ============================================================================
// GoalAnalyzer
// ============================================================================
describe('GoalAnalyzer', () => {
  const analyzer = new GoalAnalyzer();

  it('analyzes high complexity goal', () => {
    const goal = makeGoal('g1', 'A Very Long Goal Title For Testing', 8);
    const analysis = analyzer.analyze(goal);
    expect(analysis.complexity).toBeGreaterThan(0);
    expect(analysis.riskScore).toBe(0.8);
  });

  it('analyzes medium complexity goal', () => {
    const goal = makeGoal('g1', 'Medium', 5);
    const analysis = analyzer.analyze(goal);
    expect(analysis.riskScore).toBe(0.5);
  });

  it('analyzes low complexity goal', () => {
    const goal = makeGoal('g1', 'Short', 2);
    const analysis = analyzer.analyze(goal);
    expect(analysis.riskScore).toBe(0.2);
  });
});

// ============================================================================
// GoalDecomposer
// ============================================================================
describe('GoalDecomposer', () => {
  const decomposer = new GoalDecomposer();

  it('decomposes into multiple sub-goals', () => {
    const result = decomposer.decompose('g1', ['a', 'b', 'c']);
    expect(result.subGoals).toHaveLength(3);
    expect(result.dependencies.length).toBeGreaterThan(0);
    expect(result.checksum).toBeDefined();
  });

  it('decomposes into single sub-goal', () => {
    const result = decomposer.decompose('g1', ['a']);
    expect(result.subGoals).toHaveLength(1);
    expect(result.dependencies).toHaveLength(0);
  });
});

// ============================================================================
// GoalPrioritizer
// ============================================================================
describe('GoalPrioritizer', () => {
  it('prioritizes by priority descending', () => {
    const prioritizer = new GoalPrioritizer();
    const goals = [makeGoal('g1', 'a', 1), makeGoal('g2', 'b', 10), makeGoal('g3', 'c', 5)];
    const sorted = prioritizer.prioritize(goals);
    expect(sorted[0].priority).toBe(10);
    expect(sorted[2].priority).toBe(1);
  });
});

// ============================================================================
// GoalScheduler
// ============================================================================
describe('GoalScheduler', () => {
  let scheduler: GoalScheduler;
  beforeEach(() => {
    scheduler = new GoalScheduler();
  });

  it('schedules and dequeues by priority', () => {
    scheduler.schedule(makeGoal('g1', 'a', 1));
    scheduler.schedule(makeGoal('g2', 'b', 10));
    expect(scheduler.size()).toBe(2);
    expect(scheduler.dequeue()?.goalId).toBe('g2');
  });

  it('dequeues undefined when empty', () => {
    expect(scheduler.dequeue()).toBeUndefined();
  });

  it('gets all', () => {
    scheduler.schedule(makeGoal('g1', 'a', 1));
    expect(scheduler.getAll()).toHaveLength(1);
  });
});

// ============================================================================
// ExecutionPlanner
// ============================================================================
describe('ExecutionPlanner', () => {
  it('creates execution plan', () => {
    const planner = new ExecutionPlanner();
    const plan = planner.plan(makeGoal('g1'), ['step1', 'step2']);
    expect(plan.steps).toHaveLength(2);
    expect(plan.goalId).toBe('g1');
    expect(plan.checksum).toBeDefined();
  });
});

// ============================================================================
// AutonomousExecutor
// ============================================================================
describe('AutonomousExecutor', () => {
  it('executes steps', () => {
    const executor = new AutonomousExecutor();
    const result = executor.execute({
      stepId: 's1',
      action: 'do',
      capabilities: [],
      timeout: 1000,
    });
    expect(result.status).toBe('SUCCESS');
    expect(executor.getResults()).toHaveLength(1);
  });
});

// ============================================================================
// TaskCoordinator
// ============================================================================
describe('TaskCoordinator', () => {
  let coordinator: TaskCoordinator;
  beforeEach(() => {
    coordinator = new TaskCoordinator();
  });

  it('assigns and retrieves tasks', () => {
    coordinator.assign('p1', ['s1', 's2']);
    expect(coordinator.getAssignments('p1')).toEqual(['s1', 's2']);
  });

  it('returns empty for missing plan', () => {
    expect(coordinator.getAssignments('missing')).toEqual([]);
  });

  it('completes tasks', () => {
    coordinator.assign('p1', ['s1', 's2']);
    coordinator.complete('p1', 's1');
    expect(coordinator.getAssignments('p1')).toEqual(['s2']);
  });

  it('complete on missing plan does nothing', () => {
    coordinator.complete('missing', 's1');
  });
});

// ============================================================================
// ProgressMonitor
// ============================================================================
describe('ProgressMonitor', () => {
  it('records and retrieves progress', () => {
    const monitor = new ProgressMonitor();
    const snap = monitor.record('g1', 10, 5);
    expect(snap.progress).toBe(0.5);
    expect(monitor.get('g1')).toBeDefined();
  });

  it('returns undefined for missing goal', () => {
    expect(new ProgressMonitor().get('missing')).toBeUndefined();
  });

  it('handles zero total steps', () => {
    const monitor = new ProgressMonitor();
    const snap = monitor.record('g1', 0, 0);
    expect(snap.progress).toBe(0);
  });
});

// ============================================================================
// ExecutionCheckpointManager
// ============================================================================
describe('ExecutionCheckpointManager', () => {
  let cm: ExecutionCheckpointManager;
  beforeEach(() => {
    cm = new ExecutionCheckpointManager();
  });

  it('saves and loads checkpoints', () => {
    const cp = cm.save('g1', { data: 1 }, 1);
    expect(cp.checksum).toBeDefined();
    expect(cm.load('g1')).toBeDefined();
  });

  it('validates checkpoint', () => {
    const cp = cm.save('g1', { data: 1 }, 1);
    expect(cm.validate(cp)).toBe(true);
  });

  it('returns undefined for missing goal', () => {
    expect(cm.load('missing')).toBeUndefined();
  });

  it('lists checkpoints', () => {
    cm.save('g1', {}, 1);
    cm.save('g1', {}, 2);
    expect(cm.list('g1')).toHaveLength(2);
  });

  it('lists empty for missing goal', () => {
    expect(cm.list('missing')).toEqual([]);
  });
});

// ============================================================================
// ExecutionReplayEngine
// ============================================================================
describe('ExecutionReplayEngine', () => {
  let replay: ExecutionReplayEngine;
  beforeEach(() => {
    replay = new ExecutionReplayEngine();
  });

  it('records and retrieves entries', () => {
    replay.record('g1', 'action1', { data: 1 });
    expect(replay.getEntries('g1')).toHaveLength(1);
  });

  it('validates integrity', () => {
    replay.record('g1', 'a1', {});
    expect(replay.validate('g1')).toBe(true);
  });

  it('returns empty for missing goal', () => {
    expect(replay.getEntries('missing')).toEqual([]);
  });

  it('validates returns true for missing goal', () => {
    expect(replay.validate('missing')).toBe(true);
  });
});

// ============================================================================
// DecisionEngine
// ============================================================================
describe('DecisionEngine', () => {
  it('makes decisions', () => {
    const engine = new DecisionEngine();
    const dec = engine.decide({ context: 1 }, ['a', 'b']);
    expect(dec.choice).toBe('a');
    expect(dec.confidence).toBe(1.0);
  });

  it('handles empty choices', () => {
    const engine = new DecisionEngine();
    const dec = engine.decide({}, []);
    expect(dec.choice).toBe('default');
  });
});

// ============================================================================
// ReflectionEngine
// ============================================================================
describe('ReflectionEngine', () => {
  it('reflects with outcomes', () => {
    const engine = new ReflectionEngine();
    const ref = engine.reflect('g1', [{ result: 'ok' }]);
    expect(ref.score).toBe(0.8);
    expect(ref.suggestions).toContain('continue');
  });

  it('reflects without outcomes', () => {
    const engine = new ReflectionEngine();
    const ref = engine.reflect('g1', []);
    expect(ref.score).toBe(0.5);
    expect(ref.suggestions).toContain('retry');
  });
});

// ============================================================================
// SelfEvaluationEngine
// ============================================================================
describe('SelfEvaluationEngine', () => {
  const engine = new SelfEvaluationEngine();

  it('evaluates grade A', () => {
    const result = engine.evaluate('g1', { accuracy: 0.95 });
    expect(result.grade).toBe('A');
  });

  it('evaluates grade B', () => {
    const result = engine.evaluate('g1', { accuracy: 0.75 });
    expect(result.grade).toBe('B');
  });

  it('evaluates grade C', () => {
    const result = engine.evaluate('g1', { accuracy: 0.55 });
    expect(result.grade).toBe('C');
  });

  it('evaluates grade D', () => {
    const result = engine.evaluate('g1', { accuracy: 0.3 });
    expect(result.grade).toBe('D');
  });

  it('evaluates empty metrics', () => {
    const result = engine.evaluate('g1', {});
    expect(result.grade).toBe('D');
  });
});

// ============================================================================
// SelfImprovementEngine
// ============================================================================
describe('SelfImprovementEngine', () => {
  let engine: SelfImprovementEngine;
  beforeEach(() => {
    engine = new SelfImprovementEngine();
  });

  it('creates improvement records', () => {
    const record = engine.improve('g1', 'reason', 'old', 'new', 0.9);
    expect(record.rollbackCapable).toBe(true);
    expect(record.checksum).toBeDefined();
  });

  it('rolls back improvements', () => {
    const record = engine.improve('g1', 'r', 'old', 'new', 0.9);
    const rolled = engine.rollback(record.improvementId);
    expect(rolled).toBeDefined();
  });

  it('returns undefined for missing rollback', () => {
    expect(engine.rollback('missing')).toBeUndefined();
  });

  it('gets all records', () => {
    engine.improve('g1', 'r', 'o', 'n', 0.9);
    expect(engine.getRecords()).toHaveLength(1);
  });
});

// ============================================================================
// AdaptivePlanningEngine
// ============================================================================
describe('AdaptivePlanningEngine', () => {
  let engine: AdaptivePlanningEngine;
  beforeEach(() => {
    engine = new AdaptivePlanningEngine();
  });

  it('registers and retrieves strategies', () => {
    engine.registerStrategy({ strategyId: 's1', name: 'Test', rules: ['r1'], checksum: 'c' });
    expect(engine.getStrategy('s1')).toBeDefined();
    expect(engine.getStrategy('missing')).toBeUndefined();
  });

  it('selects best strategy', () => {
    expect(engine.selectBest('g1', ['s1', 's2'])).toBe('s1');
  });

  it('selects default when no strategies', () => {
    expect(engine.selectBest('g1', [])).toBe('default');
  });

  it('gets all strategies', () => {
    engine.registerStrategy({ strategyId: 's1', name: 'T', rules: [], checksum: 'c' });
    expect(engine.getAll()).toHaveLength(1);
  });
});

// ============================================================================
// StrategyOptimizer
// ============================================================================
describe('StrategyOptimizer', () => {
  let optimizer: StrategyOptimizer;
  beforeEach(() => {
    optimizer = new StrategyOptimizer();
  });

  it('records and computes average', () => {
    optimizer.record('s1', 0.9);
    optimizer.record('s1', 0.7);
    expect(optimizer.getAverageScore('s1')).toBe(0.8);
  });

  it('returns 0 for unknown strategy', () => {
    expect(optimizer.getAverageScore('missing')).toBe(0);
  });

  it('gets best strategy', () => {
    optimizer.record('s1', 0.5);
    optimizer.record('s2', 0.9);
    expect(optimizer.getBest()).toBe('s2');
  });

  it('returns undefined when no history', () => {
    expect(optimizer.getBest()).toBeUndefined();
  });
});

// ============================================================================
// FailureAnalyzer
// ============================================================================
describe('FailureAnalyzer', () => {
  it('analyzes failures', () => {
    const analyzer = new FailureAnalyzer();
    const result = analyzer.analyze('s1', 'timeout');
    expect(result.stepId).toBe('s1');
    expect(result.checksum).toBeDefined();
  });
});

// ============================================================================
// RecoveryPlanner
// ============================================================================
describe('RecoveryPlanner', () => {
  it('plans recovery', () => {
    const planner = new RecoveryPlanner();
    const plan = planner.plan('g1', ['s1', 's2']);
    expect(plan.recoveryActions).toHaveLength(2);
    expect(plan.checksum).toBeDefined();
  });
});

// ============================================================================
// KnowledgeFeedbackEngine
// ============================================================================
describe('KnowledgeFeedbackEngine', () => {
  let engine: KnowledgeFeedbackEngine;
  beforeEach(() => {
    engine = new KnowledgeFeedbackEngine();
  });

  it('records feedback', () => {
    const entry = engine.record('g1', 'success', ['lesson1']);
    expect(entry.outcome).toBe('success');
    expect(engine.getAll()).toHaveLength(1);
  });

  it('gets by goal', () => {
    engine.record('g1', 'ok', []);
    engine.record('g2', 'fail', []);
    expect(engine.getByGoal('g1')).toHaveLength(1);
    expect(engine.getByGoal('missing')).toHaveLength(0);
  });
});

// ============================================================================
// LearningMemoryManager
// ============================================================================
describe('LearningMemoryManager', () => {
  let mem: LearningMemoryManager;
  beforeEach(() => {
    mem = new LearningMemoryManager();
  });

  it('stores and retrieves values', () => {
    mem.store('k1', { data: 1 }, 'src');
    const entry = mem.retrieve('k1');
    expect(entry).toBeDefined();
    expect(entry?.value).toEqual({ data: 1 });
  });

  it('returns undefined for expired entries', () => {
    mem.store('k1', 'v1', 'src', 0);
    expect(mem.retrieve('k1')).toBeUndefined();
  });

  it('returns undefined for missing key', () => {
    expect(mem.retrieve('missing')).toBeUndefined();
  });

  it('deletes values', () => {
    mem.store('k1', 'v1', 'src');
    expect(mem.delete('k1')).toBe(true);
    expect(mem.delete('missing')).toBe(false);
  });

  it('gets all', () => {
    mem.store('k1', 'v1', 'src');
    expect(mem.getAll()).toHaveLength(1);
  });
});

// ============================================================================
// ExperienceRepository
// ============================================================================
describe('ExperienceRepository', () => {
  let repo: ExperienceRepository;
  beforeEach(() => {
    repo = new ExperienceRepository();
  });

  it('records experiences', () => {
    const exp = repo.record('g1', 'action', 'result', 0.9);
    expect(exp.score).toBe(0.9);
    expect(repo.getAll()).toHaveLength(1);
  });

  it('gets by goal', () => {
    repo.record('g1', 'a', 'r', 0.9);
    repo.record('g2', 'a', 'r', 0.8);
    expect(repo.getByGoal('g1')).toHaveLength(1);
  });
});

// ============================================================================
// PolicyValidator
// ============================================================================
describe('PolicyValidator', () => {
  it('validates with matching policy', () => {
    const v = new PolicyValidator();
    const result = v.validate('action', ['allow-all']);
    expect(result.valid).toBe(true);
  });

  it('validates with no matching policy', () => {
    const v = new PolicyValidator();
    const result = v.validate('action', ['deny']);
    expect(result.valid).toBe(false);
  });
});

// ============================================================================
// SafetyValidator
// ============================================================================
describe('SafetyValidator', () => {
  it('validates safe action', () => {
    const v = new SafetyValidator();
    expect(v.validate('read', ['delete']).valid).toBe(true);
  });

  it('validates unsafe action', () => {
    const v = new SafetyValidator();
    expect(v.validate('delete-all', ['delete']).valid).toBe(false);
  });
});

// ============================================================================
// ConstraintValidator
// ============================================================================
describe('ConstraintValidator', () => {
  it('validates with satisfied constraints', () => {
    const v = new ConstraintValidator();
    expect(v.validate('read-data', { read: 'yes' }).valid).toBe(true);
  });

  it('validates with unsatisfied constraints', () => {
    const v = new ConstraintValidator();
    expect(v.validate('action', { missing: 'yes' }).valid).toBe(false);
  });
});

// ============================================================================
// ResourceOptimizer
// ============================================================================
describe('ResourceOptimizer', () => {
  let ro: ResourceOptimizer;
  beforeEach(() => {
    ro = new ResourceOptimizer();
  });

  it('allocates and releases resources', () => {
    ro.allocate('cpu', 4);
    expect(ro.getTotal()).toBe(4);
    ro.release('cpu');
    expect(ro.getTotal()).toBe(0);
  });

  it('gets allocations', () => {
    ro.allocate('cpu', 4);
    expect(ro.getAllocations().size).toBe(1);
  });
});

// ============================================================================
// ExecutionMetricsCollector
// ============================================================================
describe('ExecutionMetricsCollector', () => {
  let metrics: ExecutionMetricsCollector;
  beforeEach(() => {
    metrics = new ExecutionMetricsCollector();
  });

  it('records and queries metrics', () => {
    metrics.record('cpu', 0.5);
    expect(metrics.query('cpu')).toHaveLength(1);
    expect(metrics.query('mem')).toHaveLength(0);
  });

  it('aggregates metrics', () => {
    metrics.record('cpu', 0.5);
    metrics.record('cpu', 0.7);
    const agg = metrics.aggregate('cpu');
    expect(agg.count).toBe(2);
    expect(agg.avg).toBe(0.6);
  });

  it('returns zero aggregate for empty', () => {
    expect(metrics.aggregate('cpu').count).toBe(0);
  });

  it('clears', () => {
    metrics.record('cpu', 0.5);
    metrics.clear();
    expect(metrics.getAll()).toHaveLength(0);
  });
});

// ============================================================================
// ExecutionAuditManager
// ============================================================================
describe('ExecutionAuditManager', () => {
  let audit: ExecutionAuditManager;
  beforeEach(() => {
    audit = new ExecutionAuditManager();
  });

  it('logs entries', () => {
    const entry = audit.log('t1', 'g1', 'action', {});
    expect(entry.checksum).toBeDefined();
  });

  it('verifies integrity', () => {
    audit.log('t1', 'g1', 'a', {});
    expect(audit.verifyIntegrity('g1')).toBe(true);
  });

  it('returns true for empty session', () => {
    expect(audit.verifyIntegrity('empty')).toBe(true);
  });

  it('gets entries by goal', () => {
    audit.log('t1', 'g1', 'a', {});
    audit.log('t2', 'g2', 'b', {});
    expect(audit.getEntries('g1')).toHaveLength(1);
  });

  it('gets all entries', () => {
    audit.log('t1', 'g1', 'a', {});
    expect(audit.getEntries()).toHaveLength(1);
  });
});

// ============================================================================
// ExecutionTraceManager
// ============================================================================
describe('ExecutionTraceManager', () => {
  let trace: ExecutionTraceManager;
  beforeEach(() => {
    trace = new ExecutionTraceManager();
  });

  it('starts and finishes spans', () => {
    const spanId = trace.startSpan('t1', 'g1', 'op1');
    const span = trace.finishSpan(spanId, 't1', 'g1', 'op1', new Date(), 'OK');
    expect(span.status).toBe('OK');
    expect(span.checksum).toBeDefined();
  });

  it('gets spans by trace', () => {
    const spanId = trace.startSpan('t1', 'g1', 'op1');
    trace.finishSpan(spanId, 't1', 'g1', 'op1', new Date(), 'OK');
    expect(trace.getSpans('t1')).toHaveLength(1);
  });

  it('validates trace', () => {
    const spanId = trace.startSpan('t1', 'g1', 'op1');
    trace.finishSpan(spanId, 't1', 'g1', 'op1', new Date(), 'OK');
    expect(trace.validateTrace('t1')).toBe(true);
  });

  it('gets trace ids', () => {
    const s1 = trace.startSpan('t1', 'g1', 'op1');
    trace.finishSpan(s1, 't1', 'g1', 'op1', new Date(), 'OK');
    expect(trace.getTraceIds()).toEqual(['t1']);
  });
});

// ============================================================================
// ExecutionEventBus
// ============================================================================
describe('ExecutionEventBus', () => {
  let bus: ExecutionEventBus;
  beforeEach(() => {
    bus = new ExecutionEventBus();
  });

  it('publishes and subscribes', () => {
    const fn = vi.fn();
    bus.subscribe('test', fn);
    bus.publish({
      eventType: 'test',
      goalId: 'g1',
      payload: {},
      timestamp: new Date(),
      checksum: 'c',
    });
    expect(fn).toHaveBeenCalled();
  });

  it('logs events', () => {
    bus.publish({
      eventType: 'test',
      goalId: 'g1',
      payload: {},
      timestamp: new Date(),
      checksum: 'c',
    });
    expect(bus.getLog()).toHaveLength(1);
  });

  it('unsubscribes', () => {
    const fn = vi.fn();
    bus.subscribe('test', fn);
    bus.unsubscribe('test');
    bus.publish({
      eventType: 'test',
      goalId: 'g1',
      payload: {},
      timestamp: new Date(),
      checksum: 'c',
    });
    expect(fn).not.toHaveBeenCalled();
  });

  it('clears', () => {
    bus.subscribe('test', vi.fn());
    bus.clear();
  });
});

// ============================================================================
// Integration Test
// ============================================================================
describe('Autonomous Cognition Integration', () => {
  it('full pipeline: intake, analyze, plan, execute, reflect, improve', () => {
    const intake = new GoalIntakeEngine();
    const analyzer = new GoalAnalyzer();
    const planner = new ExecutionPlanner();
    const executor = new AutonomousExecutor();
    const monitor = new ProgressMonitor();
    const reflection = new ReflectionEngine();
    const improvement = new SelfImprovementEngine();
    const audit = new ExecutionAuditManager();

    const goal = intake.intake('Build Feature', 'Implement X', 8);
    const analysis = analyzer.analyze(goal);
    expect(analysis.riskScore).toBe(0.8);

    const plan = planner.plan(goal, ['step1', 'step2']);
    expect(plan.steps).toHaveLength(2);

    for (const step of plan.steps) {
      executor.execute(step);
    }

    monitor.record(goal.goalId, 2, 2);
    const snap = monitor.get(goal.goalId);
    expect(snap?.progress).toBe(1.0);

    const ref = reflection.reflect(goal.goalId, executor.getResults());
    expect(ref.score).toBe(0.8);

    const record = improvement.improve(goal.goalId, 'good', 'old', 'new', 0.9);
    expect(record.rollbackCapable).toBe(true);

    audit.log('trace-1', goal.goalId, 'completed', {});
    expect(audit.verifyIntegrity(goal.goalId)).toBe(true);
  });
});
