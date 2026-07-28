/**
 * @module cognitive-contracts/cognitive-contracts.test
 * @description Comprehensive unit tests matching >99% coverage targets (M4.5).
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  CognitiveLifecycle,
  CognitiveBudgetManager,
  CognitiveValidator,
  CognitiveRegistry,
  CognitiveFactory,
  CognitivePolicyEnforcer,
  CognitiveCapabilityResolver,
  CognitiveCompatibilityChecker,
  CognitiveArchitectureValidator,
  ReasoningEngineBase,
  ReflectionEngineBase,
  PlanningEngineBase,
  GoalEngineBase,
  DecisionEngineBase,
  ThinkingEngineBase,
  MemoryStrategyBase,
  ContextStrategyBase,
  PromptStrategyBase,
  ReasoningContextBase,
  ThinkingSessionBase,
  ThinkingStateBase,
  ThinkingSnapshotBase,
  ReasoningTraceBase,
  CognitiveTraceBase,
  CognitiveMetricsBase,
  createCognitiveEvent,
  CognitiveError,
  BudgetExceededError,
  SafetyViolationError,
  ValidationError,
  GoalConflictError,
  ThinkingSession,
  ReasoningContext,
  ThinkingState,
  ThinkingSnapshot,
  ReasoningTrace,
  CognitiveMetrics,
  SafetyPolicy,
} from '../src/index.js';

describe('Cognitive Errors', () => {
  it('instantiates all errors correctly', () => {
    const errs = [BudgetExceededError, SafetyViolationError, ValidationError, GoalConflictError];
    for (const Err of errs) {
      const e = new Err('msg', 'src');
      expect(e.message).toBe('msg');
      expect(e.source).toBe('src');
      expect(e.code).toBeDefined();
    }
    const base = new CognitiveError('msg', 'CODE', 'src');
    expect(base.message).toBe('msg');
  });
});

describe('Cognitive Lifecycle State Transitions', () => {
  let lc: CognitiveLifecycle;

  beforeEach(() => {
    lc = new CognitiveLifecycle();
  });

  it('manages standard states transitions', () => {
    expect(lc.getState()).toBe('CREATED');
    lc.transition('INITIALIZING');
    lc.transition('THINKING');
    expect(lc.getState()).toBe('THINKING');
  });

  it('fails closed on invalid transition', () => {
    expect(() => lc.transition('COMPLETED')).toThrow(ValidationError);
  });
});

describe('Cognitive Budget Manager', () => {
  it('manages and enforces token budgets', () => {
    const budget = {
      inputBudget: 100,
      outputBudget: 100,
      reasoningBudget: 100,
      reflectionBudget: 100,
      planningBudget: 100,
      toolBudget: 100,
      memoryBudget: 100,
      globalBudget: 1000,
    };
    const manager = new CognitiveBudgetManager(budget);
    manager.consume('inputBudget', 50);
    expect(manager.getConsumption()['inputBudget']).toBe(50);
    expect(() => manager.consume('inputBudget', 60)).toThrow(BudgetExceededError);
  });
});

describe('Cognitive Validator', () => {
  it('validates critical session properties', () => {
    const validator = new CognitiveValidator();
    const session: ThinkingSession = {
      id: 's1',
      traceId: 't1',
      correlationId: 'c1',
      state: 'CREATED',
      startedAt: new Date(),
      metadata: {},
    };
    expect(() => validator.validateSession(session)).not.toThrow();
    expect(() => validator.validateSession({} as any)).toThrow(ValidationError);
  });
});

describe('Cognitive Registry and Factory', () => {
  it('manages engine registrations and factories', () => {
    const factory = new CognitiveFactory();
    const engine = factory.create('e1', 'engine', '1.0');
    expect(engine.getEngineMetadata().id).toBe('e1');

    const registry = new CognitiveRegistry();
    registry.register(engine);
    expect(registry.resolve('e1')).toBeDefined();
    expect(registry.list()).toHaveLength(1);
  });
});

describe('Cognitive Policy Enforcer', () => {
  it('evaluates safety confidence thresholds', () => {
    const enforcer = new CognitivePolicyEnforcer();
    const policy: SafetyPolicy = {
      riskLevel: 'LOW',
      confidenceThreshold: 80,
      requiresHumanApproval: false,
      rollbackOnFailure: false,
    };
    expect(() => enforcer.enforce(policy, 90)).not.toThrow();
    expect(() => enforcer.enforce(policy, 70)).toThrow(SafetyViolationError);
  });
});

describe('Capability and Compatibility Resolvers', () => {
  it('resolves feature capabilities', () => {
    const resolver = new CognitiveCapabilityResolver();
    const caps = { reasoning: true, reflection: false, planning: true, decision: false };
    expect(resolver.hasCapability(caps, 'reasoning')).toBe(true);
    expect(resolver.hasCapability(caps, 'reflection')).toBe(false);
  });

  it('checks version compatibility', () => {
    const checker = new CognitiveCompatibilityChecker();
    expect(checker.isCompatible('1.0.0')).toBe(true);
  });

  it('checks architectural dependency directions', () => {
    const validator = new CognitiveArchitectureValidator();
    expect(validator.validateArchitectureDirection('cognitive-contracts', 'native-providers')).toBe(
      false,
    );
    expect(validator.validateArchitectureDirection('cognitive-contracts', 'runtime')).toBe(true);
  });
});

describe('Event Contracts', () => {
  it('creates cognitive event envelopes', () => {
    const event = createCognitiveEvent('thinking.started', 's1', 't1', 'w1', 'c1', 'src', {
      extra: 'data',
    });
    expect(event.type).toBe('thinking.started');
    expect(event.payload.extra).toBe('data');
  });
});

describe('Engine Base Contract Stubs', () => {
  it('runs all stubs successfully', async () => {
    const reasoning = new ReasoningEngineBase();
    expect(await reasoning.reason({} as any, '')).toBeDefined();

    const reflection = new ReflectionEngineBase();
    expect(await reflection.reflect('', [])).toBeDefined();

    const planning = new PlanningEngineBase();
    expect(await planning.generatePlan('', {})).toBeDefined();

    const goal = new GoalEngineBase();
    expect(await goal.evaluateGoal('g1')).toBeDefined();

    const decision = new DecisionEngineBase();
    expect(await decision.makeDecision(['a'], {} as any)).toBeDefined();

    const thinking = new ThinkingEngineBase();
    expect(await thinking.think({} as any)).toBeDefined();

    const memory = new MemoryStrategyBase();
    expect(await memory.retrieve('', {} as any)).toBeDefined();
    await memory.update('', {}, {} as any);

    const context = new ContextStrategyBase();
    expect(await context.compress({})).toBeDefined();

    const prompt = new PromptStrategyBase();
    expect(prompt.render({ template: 'tpl' } as any, {})).toBe('tpl');
  });
});

describe('Cognitive Session Model Classes', () => {
  it('wraps models', () => {
    const rc = new ReasoningContextBase({
      sessionId: 's1',
      traceId: 't1',
      goalId: 'g1',
      depth: 1,
      maxDepth: 5,
    });
    expect(rc.getContext().sessionId).toBe('s1');

    const ts = new ThinkingSessionBase({
      id: 's1',
      traceId: 't1',
      correlationId: 'c1',
      state: 'CREATED',
      startedAt: new Date(),
      metadata: {},
    });
    expect(ts.getSession().id).toBe('s1');

    const state = new ThinkingStateBase({ session: {} as any, history: [] });
    expect(state.getState().history).toHaveLength(0);

    const snap = new ThinkingSnapshotBase({
      id: '1',
      timestamp: new Date(),
      state: {} as any,
      checksum: 'abc',
    });
    expect(snap.getSnapshot().checksum).toBe('abc');

    const trace: ReasoningTrace = {
      traceId: 't1',
      sessionId: 's1',
      goalId: 'g1',
      reasoningSteps: [],
      reflectionSteps: [],
      decisionSteps: [],
      timestamps: { start: new Date() },
      checksum: 'abc',
    };
    const rtb = new ReasoningTraceBase(trace);
    expect(rtb.getTrace().traceId).toBe('t1');

    const ctb = new CognitiveTraceBase();
    ctb.addTrace(trace);
    expect(ctb.getTraces()).toHaveLength(1);

    const metrics: CognitiveMetrics = {
      thinkingDurationMs: 0,
      reasoningDurationMs: 0,
      reflectionDurationMs: 0,
      decisionDurationMs: 0,
      planningDurationMs: 0,
      averageConfidence: 0,
      riskDistribution: {},
      budgetConsumption: {},
    };
    const cmb = new CognitiveMetricsBase(metrics);
    expect(cmb.getMetrics().thinkingDurationMs).toBe(0);
  });
});
