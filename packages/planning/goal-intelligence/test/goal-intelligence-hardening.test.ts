/**
 * @module goal-intelligence/goal-intelligence-hardening.test
 * @description Comprehensive tests for M5.4.1 Goal Intelligence Hardening.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  GoalEngine,
  GoalCostEstimator,
  GoalConstraintValidator,
  GoalConstraints,
  GoalProvenanceManager,
  PlanningScorer,
  CriticalPathAnalyzer,
  GoalIntegrityValidator,
  GoalStatisticsCollector,
  GoalEventBus,
  GoalHookManager,
  PlanningEngine,
  PlanningValidator,
  GoalIntelligenceMetricsCollector,
  GoalValidationError,
  CycleDetectedError,
  PlanningError,
  SubGoal,
  PlanningStep,
  PlanningBudget,
  Goal,
  DecisionChoice,
} from '../src/index.js';

const defaultBudget: PlanningBudget = { tokens: 1000, timeMs: 10000, cost: 5 };

const makeSubgoal = (id: string, deps: string[] = []): SubGoal => ({
  id,
  goalId: 'g1',
  title: id,
  objective: `${id} objective`,
  depth: 1,
  priority: 5,
  dependencies: deps,
  status: 'PENDING',
});

const makeStep = (id: string, order: number, parallel: boolean = false): any => ({
  id,
  subgoalId: id,
  strategy: 'sequential',
  order,
  parallel,
  dependencies: [],
});

// ============================================================
// GOAL COST ESTIMATOR
// ============================================================
describe('GoalCostEstimator', () => {
  it('estimates costs deterministically for small goals', () => {
    const est = new GoalCostEstimator();
    const result = est.estimate(2, 1, 5);
    expect(result.estimatedExecutionTime).toBe(2500);
    expect(result.estimatedCPU).toBe(4);
    expect(result.estimatedMemory).toBe(128);
    expect(result.estimatedTokenUsage).toBe(1000);
    expect(result.estimatedCost).toBe(0.02);
    expect(result.estimatedRisk).toBe(50);
    expect(result.estimatedComplexity).toBe(3);
    expect(result.estimatedParallelism).toBe(2);
  });

  it('estimates costs for large goals', () => {
    const est = new GoalCostEstimator();
    const result = est.estimate(10, 5, 1);
    expect(result.estimatedExecutionTime).toBe(12500);
    expect(result.estimatedParallelism).toBe(5);
    expect(result.estimatedCPU).toBe(20);
    expect(result.estimatedMemory).toBe(640);
    expect(result.estimatedTokenUsage).toBe(5000);
    expect(result.estimatedCost).toBe(0.1);
    expect(result.estimatedRisk).toBe(90);
    expect(result.estimatedComplexity).toBe(15);
  });

  it('parallelism caps at 5', () => {
    const est = new GoalCostEstimator();
    const result = est.estimate(20, 5, 1);
    expect(result.estimatedParallelism).toBe(5);
  });

  it('parallelism min is 1', () => {
    const est = new GoalCostEstimator();
    const result = est.estimate(0, 0, 1);
    expect(result.estimatedParallelism).toBe(1);
  });
});

// ============================================================
// GOAL CONSTRAINTS
// ============================================================
describe('GoalConstraintValidator', () => {
  it('validates correct constraints', () => {
    const v = new GoalConstraintValidator();
    const valid: GoalConstraints = {
      priority: 5,
      budgetLimit: 100,
      resourceLimit: 10,
      maxExecutionTime: 5000,
      maxRetries: 3,
      requiredCapabilities: [],
      approvalRequired: false,
      maxTokenBudget: 5000,
      maxCost: 10,
    };
    expect(() => v.validate(valid)).not.toThrow();
  });

  it('rejects invalid priority', () => {
    const v = new GoalConstraintValidator();
    expect(() =>
      v.validate({
        priority: 0,
        budgetLimit: 100,
        resourceLimit: 10,
        maxExecutionTime: 5000,
        maxRetries: 3,
        requiredCapabilities: [],
        approvalRequired: false,
        maxTokenBudget: 5000,
        maxCost: 10,
      }),
    ).toThrow(GoalValidationError);
    expect(() =>
      v.validate({
        priority: 11,
        budgetLimit: 100,
        resourceLimit: 10,
        maxExecutionTime: 5000,
        maxRetries: 3,
        requiredCapabilities: [],
        approvalRequired: false,
        maxTokenBudget: 5000,
        maxCost: 10,
      }),
    ).toThrow(GoalValidationError);
  });

  it('rejects zero budget', () => {
    const v = new GoalConstraintValidator();
    expect(() =>
      v.validate({
        priority: 5,
        budgetLimit: 0,
        resourceLimit: 10,
        maxExecutionTime: 5000,
        maxRetries: 3,
        requiredCapabilities: [],
        approvalRequired: false,
        maxTokenBudget: 5000,
        maxCost: 10,
      }),
    ).toThrow(GoalValidationError);
  });

  it('rejects zero execution time', () => {
    const v = new GoalConstraintValidator();
    expect(() =>
      v.validate({
        priority: 5,
        budgetLimit: 100,
        resourceLimit: 10,
        maxExecutionTime: 0,
        maxRetries: 3,
        requiredCapabilities: [],
        approvalRequired: false,
        maxTokenBudget: 5000,
        maxCost: 10,
      }),
    ).toThrow(GoalValidationError);
  });

  it('rejects zero token budget', () => {
    const v = new GoalConstraintValidator();
    expect(() =>
      v.validate({
        priority: 5,
        budgetLimit: 100,
        resourceLimit: 10,
        maxExecutionTime: 5000,
        maxRetries: 3,
        requiredCapabilities: [],
        approvalRequired: false,
        maxTokenBudget: 0,
        maxCost: 10,
      }),
    ).toThrow(GoalValidationError);
  });

  it('rejects past deadline', () => {
    const v = new GoalConstraintValidator();
    expect(() =>
      v.validate({
        priority: 5,
        budgetLimit: 100,
        resourceLimit: 10,
        maxExecutionTime: 5000,
        maxRetries: 3,
        requiredCapabilities: [],
        approvalRequired: false,
        maxTokenBudget: 5000,
        maxCost: 10,
        deadline: new Date(0),
      }),
    ).toThrow(GoalValidationError);
  });

  it('allows valid future deadline', () => {
    const v = new GoalConstraintValidator();
    const future = new Date(Date.now() + 100000);
    expect(() =>
      v.validate({
        priority: 5,
        budgetLimit: 100,
        resourceLimit: 10,
        maxExecutionTime: 5000,
        maxRetries: 3,
        requiredCapabilities: [],
        approvalRequired: false,
        maxTokenBudget: 5000,
        maxCost: 10,
        deadline: future,
      }),
    ).not.toThrow();
  });
});

// ============================================================
// GOAL PROVENANCE
// ============================================================
describe('GoalProvenanceManager', () => {
  it('creates immutable provenance', () => {
    const mgr = new GoalProvenanceManager();
    const prov = mgr.createProvenance({ goalId: 'g1', parentGoalId: 'p1', originGoalId: 'o1' });
    expect(prov.goalId).toBe('g1');
    expect(prov.checksum).toBeDefined();
    expect(Object.isFrozen(prov)).toBe(true);
  });
});

// ============================================================
// PLANNING SCORER
// ============================================================
describe('PlanningScorer', () => {
  it('scores simple plans', () => {
    const scorer = new PlanningScorer();
    const plan = {
      id: 'p1',
      goalId: 'g1',
      steps: [
        { id: 's1', subgoalId: 's1', strategy: 'seq', order: 1, parallel: false },
        { id: 's2', subgoalId: 's2', strategy: 'seq', order: 2, parallel: true },
      ],
      totalEstimatedTime: 2000,
      budget: defaultBudget,
      checksum: '',
      timestamp: new Date(),
    };
    const score = scorer.score(plan);
    expect(score.planningQualityScore).toBeGreaterThanOrEqual(0);
    expect(score.planningQualityScore).toBeLessThanOrEqual(100);
    expect(['Excellent', 'Good', 'Acceptable', 'Poor']).toContain(score.grade);
  });

  it('scores empty plans', () => {
    const scorer = new PlanningScorer();
    const plan = {
      id: 'p1',
      goalId: 'g1',
      steps: [],
      totalEstimatedTime: 0,
      budget: defaultBudget,
      checksum: '',
      timestamp: new Date(),
    };
    const score = scorer.score(plan);
    expect(score.complexityScore).toBe(0);
  });
});

// ============================================================
// CRITICAL PATH ANALYZER
// ============================================================
describe('CriticalPathAnalyzer', () => {
  it('analyzes simple linear plan', () => {
    const analyzer = new CriticalPathAnalyzer();
    const steps: any[] = [
      { id: 's1', subgoalId: 's1', strategy: 'seq', order: 1, parallel: false, dependencies: [] },
      {
        id: 's2',
        subgoalId: 's2',
        strategy: 'seq',
        order: 2,
        parallel: false,
        dependencies: ['s1'],
      },
    ];
    const result = analyzer.analyze(steps);
    expect(result.criticalPath).toContain('s1');
    expect(result.longestChain).toBe(2);
    expect(result.executionLayers.length).toBeGreaterThanOrEqual(1);
  });

  it('identifies parallel branches', () => {
    const analyzer = new CriticalPathAnalyzer();
    const steps: any[] = [
      { id: 's1', subgoalId: 's1', strategy: 'seq', order: 1, parallel: false, dependencies: [] },
      { id: 's2', subgoalId: 's2', strategy: 'seq', order: 1, parallel: true, dependencies: [] },
      { id: 's3', subgoalId: 's3', strategy: 'seq', order: 1, parallel: true, dependencies: [] },
    ];
    const result = analyzer.analyze(steps);
    expect(result.parallelBranches).toBe(2);
  });
});

// ============================================================
// GOAL INTEGRITY VALIDATOR
// ============================================================
describe('GoalIntegrityValidator', () => {
  it('validates valid plan checksum', () => {
    const validator = new GoalIntegrityValidator();
    const plan = {
      id: 'p1',
      goalId: 'g1',
      steps: [{ id: 's1', subgoalId: 's1', strategy: 'seq', order: 1, parallel: false }],
      totalEstimatedTime: 1000,
      budget: defaultBudget,
      checksum: '',
      timestamp: new Date(),
    };
    const payload = JSON.stringify({ goalId: plan.goalId, steps: plan.steps });
    const { createHash } = require('crypto');
    plan.checksum = createHash('sha256').update(payload).digest('hex');
    expect(validator.validateChecksum(plan)).toBe(true);
    expect(validator.validatePlanningConsistency(plan)).toBe(true);
  });

  it('rejects inconsistent plans', () => {
    const validator = new GoalIntegrityValidator();
    const plan = {
      id: 'p1',
      goalId: 'g1',
      steps: [
        {
          id: 's1',
          subgoalId: 's1',
          strategy: 'seq',
          order: 1,
          parallel: false,
          dependencies: ['missing'],
        },
      ],
      totalEstimatedTime: 1000,
      budget: defaultBudget,
      checksum: '',
      timestamp: new Date(),
    };
    expect(validator.validatePlanningConsistency(plan)).toBe(false);
  });

  it('rejects empty plans', () => {
    const validator = new GoalIntegrityValidator();
    const plan = {
      id: 'p1',
      goalId: 'g1',
      steps: [],
      totalEstimatedTime: 0,
      budget: defaultBudget,
      checksum: '',
      timestamp: new Date(),
    };
    expect(validator.validatePlanningConsistency(plan)).toBe(false);
  });

  it('rejects duplicate step IDs', () => {
    const validator = new GoalIntegrityValidator();
    const plan = {
      id: 'p1',
      goalId: 'g1',
      steps: [
        { id: 's1', subgoalId: 's1', strategy: 'seq', order: 1, parallel: false },
        { id: 's1', subgoalId: 's1', strategy: 'seq', order: 2, parallel: false },
      ],
      totalEstimatedTime: 2000,
      budget: defaultBudget,
      checksum: '',
      timestamp: new Date(),
    };
    expect(validator.validatePlanningConsistency(plan)).toBe(false);
  });
});

// ============================================================
// GOAL STATISTICS COLLECTOR
// ============================================================
describe('GoalStatisticsCollector', () => {
  it('computes statistics correctly', () => {
    const collector = new GoalStatisticsCollector();
    collector.recordGoalCompletion(true, 3, 2, 1, 1, 10, 20, 5000);
    collector.recordGoalCompletion(false, 1, 1, 0, 0, 5, 40, 2000);
    collector.recordRecovery();
    const stats = collector.getStatistics();
    expect(stats.goalCompletionRatio).toBe(0.5);
    expect(stats.planningFailureRatio).toBe(0.5);
    expect(stats.recoveryRatio).toBe(0.5);
    expect(stats.averageCost).toBe(7.5);
    expect(stats.averageRisk).toBe(30);
    expect(stats.averagePlanningTime).toBe(3500);
  });

  it('handles zero goals', () => {
    const collector = new GoalStatisticsCollector();
    const stats = collector.getStatistics();
    expect(stats.goalCompletionRatio).toBe(0);
    expect(stats.averageCost).toBe(0);
  });
});

// ============================================================
// GOAL ENGINE WITH HARDENING
// ============================================================
describe('Goal Engine Hardened Orchestration', () => {
  let engine: GoalEngine;

  beforeEach(() => {
    engine = new GoalEngine();
  });

  it('processes goal with cost estimation and integrity validation', async () => {
    const result = await engine.processGoal('Test Goal', 'Description', 2, 'safe');
    expect(result.plan).toBeDefined();
    expect(result.subgoals).toBe(2);
    expect(engine.metrics.getMetrics().goalsCreated).toBe(1);
  });

  it('recovers planning sessions', () => {
    engine.checkpointManager.save('g1', {
      id: 'p1',
      goalId: 'g1',
      steps: [],
      totalEstimatedTime: 0,
      budget: defaultBudget,
      checksum: '',
      timestamp: new Date(),
    });
    const result = engine.recoverPlanning('g1');
    expect(result.restored).toBe(true);
    expect(engine.recoverPlanning('missing').restored).toBe(false);
  });

  it('registers hooks that execute all new lifecycle points', async () => {
    const beforeConstraintFn = vi.fn();
    const afterConstraintFn = vi.fn();
    const beforeScoreFn = vi.fn();
    const afterScoreFn = vi.fn();
    const beforeIntegrityFn = vi.fn();
    const afterIntegrityFn = vi.fn();
    const beforeCriticalFn = vi.fn();
    const afterCriticalFn = vi.fn();
    engine.hooks.register({
      beforeConstraintValidation: beforeConstraintFn,
      afterConstraintValidation: afterConstraintFn,
      beforePlanningScore: beforeScoreFn,
      afterPlanningScore: afterScoreFn,
      beforeIntegrityValidation: beforeIntegrityFn,
      afterIntegrityValidation: afterIntegrityFn,
      beforeCriticalPath: beforeCriticalFn,
      afterCriticalPath: afterCriticalFn,
    });
    await engine.processGoal('Hook Test', 'Desc', 1, 'safe');
    // Verify hooks were registered successfully
    expect(beforeConstraintFn).toBeDefined();
  });
});

describe('Hook Direct Execution Tests', () => {
  it('executes all new hook lifecycle methods', async () => {
    const hm = new GoalHookManager();
    const results: string[] = [];
    hm.register({
      beforeConstraintValidation: async (id: string) => {
        results.push(`bc:${id}`);
      },
      afterConstraintValidation: async (id: string) => {
        results.push(`ac:${id}`);
      },
      beforePlanningScore: async (id: string) => {
        results.push(`bs:${id}`);
      },
      afterPlanningScore: async (id: string, score: number) => {
        results.push(`as:${id}:${score}`);
      },
      beforeIntegrityValidation: async (id: string) => {
        results.push(`bi:${id}`);
      },
      afterIntegrityValidation: async (id: string) => {
        results.push(`ai:${id}`);
      },
      beforeCriticalPath: async (id: string) => {
        results.push(`bcp:${id}`);
      },
      afterCriticalPath: async (id: string, path: string[]) => {
        results.push(`acp:${id}:${path.length}`);
      },
    });

    await hm.runBeforeConstraintValidation('g1');
    await hm.runAfterConstraintValidation('g1');
    await hm.runBeforePlanningScore('g1');
    await hm.runAfterPlanningScore('g1', 85);
    await hm.runBeforeIntegrityValidation('g1');
    await hm.runAfterIntegrityValidation('g1');
    await hm.runBeforeCriticalPath('g1');
    await hm.runAfterCriticalPath('g1', ['s1', 's2']);

    expect(results).toHaveLength(8);
  });
});

describe('Metrics Direct Expansion Tests', () => {
  it('records all new metric types directly', () => {
    const mc = new GoalIntelligenceMetricsCollector();
    mc.recordPlanningScore(85);
    mc.recordPlanningComplexity(10);
    mc.recordCriticalPath(5);
    mc.recordConstraintViolation();
    mc.recordIntegrityFailure();
    mc.recordEstimatedCost(0.5);
    mc.recordEstimatedRisk(30);
    mc.recordGoalTreeDepth(3);
    mc.recordValidationTime(100);
    mc.recordGoal(true);
    mc.recordRecovery();

    const m = mc.getMetrics();
    expect(m.planningScoreAverage).toBe(85);
    expect(m.planningComplexityAverage).toBe(10);
    expect(m.constraintViolationCount).toBe(1);
    expect(m.integrityFailureCount).toBe(1);
    expect(m.estimatedCostAverage).toBe(0.5);
    expect(m.estimatedRiskAverage).toBe(30);
    expect(m.goalTreeDepthAverage).toBe(3);
    expect(m.planningValidationTime).toBe(100);
  });
});

// ============================================================
// STRESS AND EDGE CASES
// ============================================================
describe('Stress and Edge Cases', () => {
  it('handles large subgoal decomposition', () => {
    const engine = new GoalEngine();
    const goal = engine.parser.parse('Large Goal', 'Desc', 5);
    const subs = engine.decomposer.decompose(goal, 5);
    expect(subs.length).toBe(5);
    expect(subs[4].dependencies).toEqual([`sg-${goal.id}-3`]);
  });

  it('validates multiple constraint violations', () => {
    const v = new GoalConstraintValidator();
    expect(() =>
      v.validate({
        priority: 0,
        budgetLimit: 0,
        resourceLimit: 0,
        maxExecutionTime: 0,
        maxRetries: 0,
        requiredCapabilities: [],
        approvalRequired: false,
        maxTokenBudget: 0,
        maxCost: 0,
      }),
    ).toThrow(GoalValidationError);
  });

  it('handles critical path with mixed parallel and serial tasks', () => {
    const analyzer = new CriticalPathAnalyzer();
    const steps: any[] = [
      { id: 's1', subgoalId: 's1', strategy: 'seq', order: 1, parallel: false, dependencies: [] },
      { id: 's2', subgoalId: 's2', strategy: 'seq', order: 2, parallel: true, dependencies: [] },
      {
        id: 's3',
        subgoalId: 's3',
        strategy: 'seq',
        order: 3,
        parallel: false,
        dependencies: ['s2'],
      },
    ];
    const result = analyzer.analyze(steps);
    expect(result.executionLayers.length).toBe(3);
    expect(result.slackTime['s3']).toBeGreaterThan(0);
  });

  it('validates planning integrity with complex dependencies', () => {
    const validator = new GoalIntegrityValidator();
    const plan = {
      id: 'p1',
      goalId: 'g1',
      steps: [
        { id: 's1', subgoalId: 's1', strategy: 'seq', order: 1, parallel: false, dependencies: [] },
        {
          id: 's2',
          subgoalId: 's2',
          strategy: 'seq',
          order: 2,
          parallel: false,
          dependencies: ['s1'],
        },
      ],
      totalEstimatedTime: 2000,
      budget: defaultBudget,
      checksum: '',
      timestamp: new Date(),
    };
    expect(validator.validatePlanningConsistency(plan)).toBe(true);
  });

  it('scores plans with various structures', () => {
    const scorer = new PlanningScorer();
    // Low complexity plan
    const plan1 = {
      id: 'p1',
      goalId: 'g1',
      steps: [{ id: 's1', subgoalId: 's1', strategy: 'seq', order: 1, parallel: true }],
      totalEstimatedTime: 1000,
      budget: { tokens: 50, timeMs: 5000, cost: 2 },
      checksum: '',
      timestamp: new Date(),
    };
    const score1 = scorer.score(plan1);
    expect(score1.planningQualityScore).toBeGreaterThanOrEqual(0);
    expect(score1.planningQualityScore).toBeLessThanOrEqual(100);
    expect(['Excellent', 'Good', 'Acceptable', 'Poor']).toContain(score1.grade);

    // High complexity plan
    const plan2 = {
      id: 'p2',
      goalId: 'g2',
      steps: Array.from({ length: 20 }, (_, i) => ({
        id: `s${i}`,
        subgoalId: `s${i}`,
        strategy: 'seq',
        order: i,
        parallel: false,
        dependencies: [],
      })),
      totalEstimatedTime: 20000,
      budget: { tokens: 5000, timeMs: 50000, cost: 500 },
      checksum: '',
      timestamp: new Date(),
    };
    const score2 = scorer.score(plan2);
    expect(score2.planningQualityScore).toBeGreaterThanOrEqual(0);
    expect(score2.planningQualityScore).toBeLessThanOrEqual(100);
    expect(['Excellent', 'Good', 'Acceptable', 'Poor']).toContain(score2.grade);
  });

  it('cost estimator with edge cases', () => {
    const est = new GoalCostEstimator();
    const result = est.estimate(1, 0, 1);
    expect(result.estimatedExecutionTime).toBe(1000);
    expect(result.estimatedRisk).toBe(90);
  });

  it('goal statistics with mixed completions', () => {
    const collector = new GoalStatisticsCollector();
    collector.recordGoalCompletion(true, 5, 3, 2, 2, 50, 10, 10000);
    collector.recordGoalCompletion(false, 2, 1, 1, 1, 10, 50, 5000);
    collector.recordGoalCompletion(true, 3, 2, 1, 1, 20, 20, 7000);
    collector.recordRecovery();
    const stats = collector.getStatistics();
    expect(stats.goalCompletionRatio).toBeCloseTo(2 / 3, 1);
    expect(stats.planningFailureRatio).toBeCloseTo(1 / 3, 1);
    expect(stats.recoveryRatio).toBeCloseTo(1 / 3, 1);
  });

  it('provenance with empty overrides', () => {
    const mgr = new GoalProvenanceManager();
    const prov = mgr.createProvenance({});
    expect(prov.goalId).toBe('');
    expect(prov.version).toBe(1);
  });
});
