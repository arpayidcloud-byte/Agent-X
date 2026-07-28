/**
 * @module goal-intelligence/goal-intelligence.test
 * @description Comprehensive tests for Goal Decomposition & Autonomous Decision Intelligence.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  GoalEngine,
  GoalStateMachine,
  GoalSession,
  GoalParser,
  GoalValidator,
  GoalDecomposer,
  SubGoalManager,
  ObjectiveTree,
  DependencyGraph,
  TaskOrderingEngine,
  TaskPriorityEngine,
  DecisionEngine,
  DecisionPolicyManager,
  DecisionValidator,
  DecisionHistory,
  DecisionExplainer,
  StrategySelector,
  StrategyScorer,
  PlanningEngine,
  PlanningValidator,
  PlanningCheckpointManager,
  PlanningRecoveryManager,
  GoalEventBus,
  GoalHookManager,
  GoalIntelligenceMetricsCollector,
  GoalError,
  GoalValidationError,
  DecompositionError,
  DecisionError,
  PlanningError,
  CycleDetectedError,
  BudgetExceededError,
  Goal,
  SubGoal,
  DecisionChoice,
  PlanningStep,
  PlanningPlan,
  PlanningBudget,
  DependencyEdge,
  CognitiveHook,
} from '../src/index.js';

const sampleGoal = (overrides: Partial<Goal> = {}): Goal => ({
  id: 'g1',
  title: 'Build Feature',
  description: 'Complete build',
  priority: 5,
  maxDepth: 5,
  checksum: '',
  timestamp: new Date(),
  ...overrides,
});

const sampleSubGoal = (overrides: Partial<SubGoal> = {}): SubGoal => ({
  id: 'sg1',
  goalId: 'g1',
  title: 'Step 1',
  objective: 'Do step 1',
  depth: 1,
  priority: 5,
  dependencies: [],
  status: 'PENDING',
  ...overrides,
});

const sampleChoice = (overrides: Partial<DecisionChoice> = {}): DecisionChoice => ({
  id: 'c1',
  strategy: 'forward-chaining',
  confidence: 80,
  cost: 10,
  safety: 'SAFE',
  metadata: {},
  ...overrides,
});

const defaultBudget: PlanningBudget = { tokens: 1000, timeMs: 10000, cost: 5 };

// ============================================================
// ERRORS
// ============================================================
describe('Errors', () => {
  it('instantiates all error types', () => {
    const errs = [
      GoalValidationError,
      DecompositionError,
      DecisionError,
      PlanningError,
      CycleDetectedError,
      BudgetExceededError,
    ];
    for (const ET of errs) {
      const e = new ET('msg', 'src');
      expect(e.message).toBe('msg');
      expect(e.source).toBe('src');
      expect(e.code).toBeDefined();
    }
  });
});

// ============================================================
// STATE MACHINE
// ============================================================
describe('Goal State Machine', () => {
  it('transitions through full lifecycle', () => {
    const sm = new GoalStateMachine();
    expect(sm.getState()).toBe('CREATED');
    sm.transition('VALIDATING');
    sm.transition('DECOMPOSING');
    sm.transition('GRAPH_BUILDING');
    sm.transition('PLANNING');
    sm.transition('DECISION');
    sm.transition('VALIDATION');
    sm.transition('CHECKPOINTING');
    sm.transition('READY');
    sm.transition('COMPLETED');
    expect(sm.getState()).toBe('COMPLETED');
  });

  it('rejects invalid transitions', () => {
    const sm = new GoalStateMachine();
    expect(() => sm.transition('COMPLETED')).toThrow(GoalError);
    expect(sm.canTransition('VALIDATING')).toBe(true);
    expect(sm.canTransition('COMPLETED')).toBe(false);
  });
});

// ============================================================
// SESSION
// ============================================================
describe('Goal Session', () => {
  it('creates session and computes checksum', () => {
    const goal = sampleGoal();
    const session = new GoalSession('trace-1', goal);
    expect(session.traceId).toBe('trace-1');
    expect(session.checksum).toBeDefined();
    session.markComplete();
    expect(session.state).toBe('COMPLETED');
  });
});

// ============================================================
// PARSER
// ============================================================
describe('Goal Parser', () => {
  it('parses goals deterministically', () => {
    const parser = new GoalParser();
    const goal = parser.parse('Title', 'Description', 7);
    expect(goal.title).toBe('Title');
    expect(goal.priority).toBe(7);
    expect(goal.checksum).toBeDefined();
  });
});

// ============================================================
// VALIDATOR
// ============================================================
describe('Goal Validator', () => {
  it('validates correct goals', () => {
    const v = new GoalValidator();
    expect(() => v.validate(sampleGoal())).not.toThrow();
  });

  it('rejects empty title', () => {
    const v = new GoalValidator();
    expect(() => v.validate(sampleGoal({ title: '' }))).toThrow(GoalValidationError);
  });

  it('rejects invalid priority', () => {
    const v = new GoalValidator();
    expect(() => v.validate(sampleGoal({ priority: 0 }))).toThrow(GoalValidationError);
    expect(() => v.validate(sampleGoal({ priority: 11 }))).toThrow(GoalValidationError);
  });

  it('rejects zero maxDepth', () => {
    const v = new GoalValidator();
    expect(() => v.validate(sampleGoal({ maxDepth: 0 }))).toThrow(GoalValidationError);
  });
});

// ============================================================
// DECOMPOSER
// ============================================================
describe('Goal Decomposer', () => {
  it('decomposes goals into subgoals', () => {
    const d = new GoalDecomposer();
    const subs = d.decompose(sampleGoal(), 3);
    expect(subs.length).toBe(3);
    expect(subs[0].dependencies).toHaveLength(0);
    expect(subs[1].dependencies).toContain(subs[0].id);
  });

  it('rejects zero objectives', () => {
    expect(() => new GoalDecomposer().decompose(sampleGoal(), 0)).toThrow(DecompositionError);
  });

  it('rejects objectives exceeding maxDepth', () => {
    expect(() => new GoalDecomposer().decompose(sampleGoal({ maxDepth: 1 }), 5)).toThrow(
      DecompositionError,
    );
  });
});

// ============================================================
// SUBGOAL MANAGER
// ============================================================
describe('SubGoal Manager', () => {
  it('manages subgoal lifecycle', () => {
    const mgr = new SubGoalManager();
    const sg = sampleSubGoal();
    mgr.register(sg);
    expect(mgr.get(sg.id)).toEqual(sg);
    expect(mgr.getAll()).toHaveLength(1);
    expect(mgr.getByGoal('g1')).toHaveLength(1);
    mgr.updateStatus(sg.id, 'COMPLETED');
    expect(mgr.get(sg.id)!.status).toBe('COMPLETED');
  });
});

// ============================================================
// OBJECTIVE TREE
// ============================================================
describe('Objective Tree', () => {
  it('manages nodes and children', () => {
    const tree = new ObjectiveTree();
    tree.addNode({
      id: 'n1',
      goalId: 'g1',
      subgoalId: 's1',
      objective: 'obj1',
      children: ['n2'],
      metadata: {},
    });
    tree.addNode({
      id: 'n2',
      goalId: 'g1',
      subgoalId: 's2',
      objective: 'obj2',
      children: [],
      metadata: {},
    });
    expect(tree.getNode('n1')).toBeDefined();
    expect(tree.getChildren('n1')).toHaveLength(1);
    expect(tree.getAll()).toHaveLength(2);
    expect(tree.getChildren('missing')).toHaveLength(0);
  });
});

// ============================================================
// DEPENDENCY GRAPH
// ============================================================
describe('Dependency Graph', () => {
  it('detects valid acyclic graphs', () => {
    const g = new DependencyGraph();
    g.addEdge('A', 'B');
    g.addEdge('B', 'C');
    expect(g.detectCycle()).toBe(false);
    expect(g.getEdges()).toHaveLength(2);
  });

  it('detects cycles', () => {
    const g = new DependencyGraph();
    g.addEdge('A', 'B');
    g.addEdge('B', 'C');
    g.addEdge('C', 'A');
    expect(g.detectCycle()).toBe(true);
  });
});

// ============================================================
// TASK ORDERING
// ============================================================
describe('Task Ordering', () => {
  it('orders by dependency and priority', () => {
    const order = new TaskOrderingEngine();
    const subs: SubGoal[] = [
      sampleSubGoal({ id: 'sg2', dependencies: ['sg1'], priority: 2 }),
      sampleSubGoal({ id: 'sg1', dependencies: [], priority: 5 }),
    ];
    const ordered = order.order(subs);
    expect(ordered[0].id).toBe('sg1');
  });
});

// ============================================================
// TASK PRIORITY
// ============================================================
describe('Task Priority', () => {
  it('calculates priority correctly', () => {
    const tp = new TaskPriorityEngine();
    expect(tp.assignPriority(sampleSubGoal(), 5)).toBe(7);
    expect(tp.assignPriority(sampleSubGoal({ depth: 0 }), 5)).toBe(8);
  });
});

// ============================================================
// DECISION ENGINE
// ============================================================
describe('Decision Engine', () => {
  it('selects best safe choice', () => {
    const de = new DecisionEngine();
    const choices = [
      sampleChoice({ id: 'c1', confidence: 90, safety: 'SAFE' }),
      sampleChoice({ id: 'c2', confidence: 80, safety: 'CAUTION' }),
    ];
    const selected = de.evaluate(choices);
    expect(selected.id).toBe('c1');
  });

  it('selects best safe choice from all options', () => {
    const de = new DecisionEngine();
    const choices = [
      sampleChoice({ id: 'c1', confidence: 90, safety: 'CAUTION' }),
      sampleChoice({ id: 'c2', confidence: 80, safety: 'SAFE' }),
    ];
    const selected = de.evaluate(choices);
    expect(selected.id).toBe('c2');
  });

  it('throws on empty choices', () => {
    expect(() => new DecisionEngine().evaluate([])).toThrow();
  });

  it('selects exact match for all unsafe choices', () => {
    const de = new DecisionEngine();
    const choices = [
      sampleChoice({ id: 'c1', confidence: 95, safety: 'CAUTION' }),
      sampleChoice({ id: 'c2', confidence: 85, safety: 'CAUTION' }),
    ];
    const selected = de.evaluate(choices);
    expect(selected.id).toBe('c1');
  });

  it('single choice returns immediately', () => {
    const de = new DecisionEngine();
    const selected = de.evaluate([sampleChoice()]);
    expect(selected.strategy).toBe('forward-chaining');
  });
});

// ============================================================
// DECISION POLICY
// ============================================================
describe('Decision Policy', () => {
  it('validates policies', () => {
    const pm = new DecisionPolicyManager();
    expect(pm.validate('safe')).toBe(true);
    expect(pm.validate('unknown' as any)).toBe(false);
    expect(pm.requiresApproval('human_approval')).toBe(true);
    expect(pm.requiresApproval('aggressive')).toBe(false);
    expect(pm.getPolicies()).toContain('balanced');
  });
});

// ============================================================
// DECISION VALIDATOR
// ============================================================
describe('Decision Validator', () => {
  it('validates valid choices', () => {
    const dv = new DecisionValidator();
    expect(() => dv.validate(sampleChoice())).not.toThrow();
  });

  it('rejects incomplete choices', () => {
    const dv = new DecisionValidator();
    expect(() => dv.validate({ id: '', strategy: '' } as any)).toThrow(DecisionError);
  });

  it('rejects unsafe choices', () => {
    const dv = new DecisionValidator();
    expect(() => dv.validate(sampleChoice({ safety: 'UNSAFE' }))).toThrow(DecisionError);
  });
});

// ============================================================
// DECISION HISTORY & EXPLAINER
// ============================================================
describe('Decision History & Explainer', () => {
  it('records immutable decisions', () => {
    const history = new DecisionHistory();
    history.add(sampleChoice());
    expect(history.getAll()).toHaveLength(1);
    expect(history.getAll()[0].checksum).toBeDefined();
  });

  it('generates explanation text', () => {
    const explainer = new DecisionExplainer();
    const text = explainer.explain(sampleChoice(), [sampleChoice({ id: 'c2', confidence: 60 })]);
    expect(text).toContain('forward-chaining');
    expect(text).toContain('Rejected Strategies');
  });
});

// ============================================================
// STRATEGY SELECTOR & SCORER
// ============================================================
describe('Strategy Selector', () => {
  it('selects best strategy by confidence', () => {
    const selector = new StrategySelector();
    const selected = selector.select(sampleSubGoal(), [
      { name: 's1', confidence: 90, cost: 10 },
      { name: 's2', confidence: 80, cost: 5 },
    ]);
    expect(selected.name).toBe('s1');
  });

  it('selects by cost when confidence is equal', () => {
    const selector = new StrategySelector();
    const selected = selector.select(sampleSubGoal(), [
      { name: 's1', confidence: 80, cost: 10 },
      { name: 's2', confidence: 80, cost: 5 },
    ]);
    expect(selected.name).toBe('s2');
  });

  it('throws on empty strategies', () => {
    expect(() => new StrategySelector().select(sampleSubGoal(), [])).toThrow();
  });
});

describe('Strategy Scorer', () => {
  it('scores based on confidence and history', () => {
    const scorer = new StrategyScorer();
    const score = scorer.score(sampleChoice(), 5, 2);
    expect(score).toBeGreaterThan(0);
  });

  it('scores safe choice higher', () => {
    const scorer = new StrategyScorer();
    const safe = scorer.score(sampleChoice({ safety: 'SAFE' }), 0, 0);
    const unsafe = scorer.score(sampleChoice({ safety: 'UNSAFE' }), 0, 0);
    expect(safe).toBeGreaterThan(unsafe);
  });

  it('scores clamp to 0-100', () => {
    const scorer = new StrategyScorer();
    const low = scorer.score(sampleChoice({ cost: 1000 }), 0, 100);
    expect(low).toBeGreaterThanOrEqual(0);
    const high = scorer.score(sampleChoice({ confidence: 100 }), 100, 0);
    expect(high).toBeLessThanOrEqual(100);
  });
});

// ============================================================
// PLANNING
// ============================================================
describe('Planning Engine', () => {
  it('generates plans from subgoals', () => {
    const pe = new PlanningEngine();
    const subs = [
      sampleSubGoal({ id: 's1', dependencies: [] }),
      sampleSubGoal({ id: 's2', dependencies: ['s1'] }),
    ];
    const plan = pe.generatePlan('g1', subs, defaultBudget);
    expect(plan.steps.length).toBe(2);
    expect(plan.checksum).toBeDefined();
  });

  it('generates plan with single subgoal', async () => {
    const pe = new PlanningEngine();
    const subs = [sampleSubGoal({ id: 's1', dependencies: [] })];
    const plan = pe.generatePlan('g1', subs, defaultBudget);
    expect(plan.steps.length).toBe(1);
    expect(plan.totalEstimatedTime).toBeGreaterThan(0);
  });
});

describe('Planning Validator', () => {
  it('validates valid plans', () => {
    const pv = new PlanningValidator();
    const plan: PlanningPlan = {
      id: 'p1',
      goalId: 'g1',
      steps: [{ id: 's1', subgoalId: 's1', strategy: 'seq', order: 1, parallel: false }],
      totalEstimatedTime: 1000,
      budget: defaultBudget,
      checksum: '',
      timestamp: new Date(),
    };
    expect(() => pv.validatePlan(plan, [])).not.toThrow();
    expect(() => pv.validateBudget(plan, { tokens: 2000, timeMs: 20000, cost: 20 })).not.toThrow();
  });

  it('rejects empty plans', () => {
    const pv = new PlanningValidator();
    const plan: PlanningPlan = {
      id: 'p1',
      goalId: 'g1',
      steps: [],
      totalEstimatedTime: 0,
      budget: defaultBudget,
      checksum: '',
      timestamp: new Date(),
    };
    expect(() => pv.validatePlan(plan, [])).toThrow(PlanningError);
  });

  it('rejects cycles', () => {
    const pv = new PlanningValidator();
    const plan: PlanningPlan = {
      id: 'p1',
      goalId: 'g1',
      steps: [{ id: 's1', subgoalId: 's1', strategy: 'seq', order: 1, parallel: false }],
      totalEstimatedTime: 0,
      budget: defaultBudget,
      checksum: '',
      timestamp: new Date(),
    };
    expect(() =>
      pv.validatePlan(plan, [
        { source: 'a', target: 'b', weight: 1 },
        { source: 'b', target: 'a', weight: 1 },
      ]),
    ).toThrow(CycleDetectedError);
  });

  it('rejects over budget plans', () => {
    const pv = new PlanningValidator();
    const plan: PlanningPlan = {
      id: 'p1',
      goalId: 'g1',
      steps: [{ id: 's1', subgoalId: 's1', strategy: 'seq', order: 1, parallel: false }],
      totalEstimatedTime: 0,
      budget: { tokens: 5000, timeMs: 20000, cost: 5 },
      checksum: '',
      timestamp: new Date(),
    };
    expect(() => pv.validateBudget(plan, defaultBudget)).toThrow(PlanningError);
  });
});

// ============================================================
// CHECKPOINT & RECOVERY
// ============================================================
describe('Checkpoint & Recovery', () => {
  let cm: PlanningCheckpointManager;
  beforeEach(() => {
    cm = new PlanningCheckpointManager();
  });

  it('saves and loads checkpoints', () => {
    const plan: PlanningPlan = {
      id: 'p1',
      goalId: 'g1',
      steps: [],
      totalEstimatedTime: 0,
      budget: defaultBudget,
      checksum: '',
      timestamp: new Date(),
    };
    const cp = cm.save('g1', plan);
    expect(cp.checksum).toBeDefined();
    expect(cm.load('g1')).toBeDefined();
  });

  it('recovery restores planning', () => {
    const rm = new PlanningRecoveryManager(cm);
    cm.save('g1', {
      id: 'p1',
      goalId: 'g1',
      steps: [],
      totalEstimatedTime: 0,
      budget: defaultBudget,
      checksum: '',
      timestamp: new Date(),
    });
    const result = rm.recover('g1');
    expect(result.restored).toBe(true);
    expect(rm.recover('missing').restored).toBe(false);
  });
});

// ============================================================
// EVENTS, HOOKS, METRICS
// ============================================================
describe('Events', () => {
  it('publishes and subscribes', () => {
    const bus = new GoalEventBus();
    const fn = vi.fn();
    bus.subscribe('ev', fn);
    bus.publish('ev', { a: 1 });
    expect(fn).toHaveBeenCalled();
    bus.clear();
  });
});

describe('Hooks', () => {
  it('executes all hook points', async () => {
    const hm = new GoalHookManager();
    const hook = {
      beforeGoal: vi.fn(),
      afterGoal: vi.fn(),
      beforeDecision: vi.fn(),
      afterDecision: vi.fn(),
      beforePlanning: vi.fn(),
      afterPlanning: vi.fn(),
    };
    hm.register(hook);
    await hm.runBeforeGoal('g1');
    await hm.runAfterGoal('g1', {});
    await hm.runBeforeDecision('g1');
    await hm.runAfterDecision('g1', 'choice');
    await hm.runBeforePlanning('g1');
    await hm.runAfterPlanning('g1', 'p1');
    expect(hook.beforeGoal).toHaveBeenCalled();
  });
});

describe('Metrics', () => {
  it('computes intelligence metrics', () => {
    const m = new GoalIntelligenceMetricsCollector();
    m.recordGoal(true);
    m.recordGoal(false);
    m.recordDecision(85);
    m.recordPlanning(1000);
    m.recordSubgoals(3, 2, 1);
    m.recordStrategy('forward');
    m.recordRecovery();
    m.recordFailure();
    const metrics = m.getMetrics();
    expect(metrics.goalsCreated).toBe(2);
    expect(metrics.decisionConfidence).toBe(85);
    expect(metrics.planningTimeMs).toBe(1000);
  });

  it('handles zero runs gracefully', () => {
    const m = new GoalIntelligenceMetricsCollector();
    const metrics = m.getMetrics();
    expect(metrics.goalsCreated).toBe(0);
    expect(metrics.decisionConfidence).toBe(0);
  });
});

// ============================================================
// GOAL ENGINE ORCHESTRATION
// ============================================================
describe('Goal Engine Orchestration', () => {
  let engine: GoalEngine;

  beforeEach(() => {
    engine = new GoalEngine();
  });

  it('processes goals through full lifecycle', async () => {
    const result = await engine.processGoal('Build Feature', 'Complete the build', 2, 'balanced');
    expect(result.plan).toBeDefined();
    expect(result.subgoals).toBe(2);
    expect(engine.stateMachine.getState()).toBe('COMPLETED');
    expect(engine.metrics.getMetrics().goalsCreated).toBe(1);
  });

  it('handles goal processing failure', async () => {
    await expect(engine.processGoal('', 'No title')).rejects.toThrow(GoalValidationError);
  });

  it('handles decomposition beyond maxDepth', async () => {
    await expect(engine.processGoal('Goal', 'Desc', 10, 'safe')).rejects.toThrow(
      DecompositionError,
    );
  });

  it('recovery loads checkpoints', () => {
    engine.checkpointManager.save('g1', {
      id: 'p1',
      goalId: 'g1',
      steps: [],
      totalEstimatedTime: 0,
      budget: { tokens: 0, timeMs: 0, cost: 0 },
      checksum: '',
      timestamp: new Date(),
    });
    expect(engine.recoverPlanning('g1').restored).toBe(true);
    expect(engine.recoverPlanning('missing').restored).toBe(false);
  });

  it('registers hooks that execute', async () => {
    const beforeGoalFn = vi.fn();
    engine.hooks.register({ beforeGoal: beforeGoalFn });
    await engine.processGoal('Test', 'Test desc');
    expect(beforeGoalFn).toHaveBeenCalled();
  });
});
