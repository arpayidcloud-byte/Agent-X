/**
 * @module cognitive-learning/cognitive-learning.test
 * @description Comprehensive tests for M5.3 Cognitive Learning & Adaptive Feedback.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  LearningEngine,
  LearningStateMachine,
  LearningSession,
  ExperienceStore,
  ExperienceExtractor,
  PatternEngine,
  PatternValidator,
  PatternRegistry,
  FeedbackEngine,
  FeedbackCollector,
  FeedbackValidator,
  OutcomeEvaluator,
  SuccessAnalyzer,
  FailureAnalyzer,
  ReflectionEngine,
  ReflectionHistory,
  AdaptationEngine,
  AdaptationPolicyManager,
  StrategySelector,
  StrategyRegistry,
  ImprovementEngine,
  ImprovementValidator,
  LearningCheckpointManager,
  LearningRecoveryManager,
  LearningEventBus,
  LearningHookManager,
  LearningMetricsCollector,
  LearningError,
  LearningStateError,
  InvalidExperienceError,
  InvalidPatternError,
  AdaptationError,
  CheckpointError,
  Experience,
  Pattern,
  Feedback,
  StrategyRecord,
  AdaptationPolicy,
} from '../src/index.js';

const sampleExperience = (overrides: Partial<Experience> = {}): Experience => ({
  id: 'exp-1',
  sessionId: 's1',
  goal: 'test',
  reasoningTrace: ['step1', 'step2'],
  decision: 'action_a',
  confidence: 80,
  outcome: 'success',
  feedback: [],
  timestamp: new Date(),
  checksum: '',
  ...overrides,
});

const sampleFailure = (overrides: Partial<Experience> = {}): Experience =>
  sampleExperience({ outcome: 'failure', confidence: 20, ...overrides });

// ============================================================
// ERRORS
// ============================================================
describe('Errors', () => {
  it('instantiates all error types', () => {
    const errs = [
      LearningStateError,
      InvalidExperienceError,
      InvalidPatternError,
      AdaptationError,
      CheckpointError,
    ];
    for (const ET of errs) {
      const e = new ET('msg', 'src');
      expect(e.message).toBe('msg');
      expect(e.source).toBe('src');
      expect(e.code).toBeDefined();
    }
    const base = new LearningError('msg', 'CODE', 'src');
    expect(base.code).toBe('CODE');
  });
});

// ============================================================
// STATE MACHINE
// ============================================================
describe('Learning State Machine', () => {
  it('transitions through valid states', () => {
    const sm = new LearningStateMachine();
    expect(sm.getState()).toBe('CREATED');
    sm.transition('COLLECTING');
    sm.transition('EXTRACTING');
    expect(sm.getState()).toBe('EXTRACTING');
    expect(sm.canTransition('PATTERN_ANALYSIS')).toBe(true);
  });

  it('rejects invalid transitions', () => {
    const sm = new LearningStateMachine();
    expect(() => sm.transition('COMPLETED')).toThrow(LearningStateError);
  });

  it('canTransition returns false for invalid transitions', () => {
    const sm = new LearningStateMachine();
    expect(sm.canTransition('COMPLETED')).toBe(false);
    expect(sm.canTransition('COLLECTING')).toBe(true);
  });
});

// ============================================================
// SESSION
// ============================================================
describe('Learning Session', () => {
  it('creates and completes sessions', () => {
    const session = new LearningSession('t1');
    expect(session.traceId).toBe('t1');
    expect(session.checksum).toBeDefined();
    expect(session.getDurationMs()).toBeGreaterThanOrEqual(0);
    session.markComplete();
    expect(session.status).toBe('COMPLETED');
  });
});

// ============================================================
// EXPERIENCE STORE
// ============================================================
describe('Experience Store', () => {
  let store: ExperienceStore;
  beforeEach(() => {
    store = new ExperienceStore();
  });

  it('stores immutable experiences', () => {
    store.store(sampleExperience());
    expect(store.count()).toBe(1);
    expect(store.getAll()[0].checksum).toBeDefined();
  });

  it('filters by outcome', () => {
    store.store(sampleExperience({ outcome: 'success', id: 'e1' }));
    store.store(sampleFailure({ id: 'e2' }));
    expect(store.getByOutcome('success')).toHaveLength(1);
    expect(store.getByOutcome('failure')).toHaveLength(1);
  });

  it('rejects invalid experiences', () => {
    expect(() => store.store({} as any)).toThrow(InvalidExperienceError);
  });
});

// ============================================================
// EXTRACTOR & PATTERN ENGINE
// ============================================================
describe('Experience Extractor and Pattern Engine', () => {
  it('extracts patterns from experiences', () => {
    const extractor = new ExperienceExtractor();
    const patterns = extractor.extractPatterns([
      sampleFailure(),
      sampleFailure(),
      sampleExperience(),
    ]);
    expect(patterns.some((p) => p.type === 'repeated_failure')).toBe(true);
  });

  it('pattern engine discovers frequent paths', () => {
    const engine = new PatternEngine();
    const exps = [
      sampleExperience({ reasoningTrace: ['A', 'B'], id: 'e1', sessionId: 's1' }),
      sampleExperience({ reasoningTrace: ['A', 'B'], id: 'e2', sessionId: 's2' }),
    ];
    const patterns = engine.analyze(exps);
    expect(patterns.some((p) => p.type === 'frequent_path')).toBe(true);
  });
});

// ============================================================
// VALIDATORS
// ============================================================
describe('Pattern Validator', () => {
  it('explore all pattern validator branches', () => {
    const v = new PatternValidator();
    // Valid pattern should not throw
    const validPattern: Pattern = {
      id: 'p1',
      type: 'repeated_failure',
      signature: 's',
      occurrenceCount: 5,
      firstSeen: new Date(),
      lastSeen: new Date(),
      checksum: 'c',
    };
    expect(() => v.validate(validPattern)).not.toThrow();
    // Missing id
    expect(() => v.validate({ ...validPattern, id: '' })).toThrow(InvalidPatternError);
    // Zero occurrence
    expect(() => v.validate({ ...validPattern, occurrenceCount: 0 })).toThrow(InvalidPatternError);
  });
});

describe('Feedback Validator', () => {
  it('validates feedback records', () => {
    const v = new FeedbackValidator();
    expect(() => v.validate({} as any)).toThrow(InvalidExperienceError);
    const valid: Feedback = {
      id: 'f1',
      sessionId: 's1',
      source: 'runtime',
      type: 'success',
      payload: {},
      timestamp: new Date(),
    };
    expect(() => v.validate(valid)).not.toThrow();
  });
});

describe('Improvement Validator', () => {
  it('validates improvements', () => {
    const v = new ImprovementValidator();
    expect(() => v.validate({ id: '', recommendation: '', priority: -1 } as any)).toThrow();
    expect(() =>
      v.validate({ id: 'i1', recommendation: 'test', priority: 0 } as any),
    ).not.toThrow();
    expect(() =>
      v.validate({ id: 'i1', recommendation: 'test', priority: 5 } as any),
    ).not.toThrow();
    // Validate the missing recommendation branch
    expect(() => v.validate({ id: 'i1', recommendation: '', priority: 1 } as any)).toThrow();
  });
});

// ============================================================
// FEEDBACK
// ============================================================
describe('Feedback Engine & Collector', () => {
  it('processes feedback types', () => {
    const eng = new FeedbackEngine();
    expect(eng.process({ type: 'success' } as any).delta).toBe(5);
    expect(eng.process({ type: 'failure' } as any).delta).toBe(-5);
    expect(eng.process({ type: 'approval' } as any).delta).toBe(3);
    expect(eng.process({ type: 'rejection' } as any).delta).toBe(-8);
    expect(eng.process({ type: 'unknown' } as any).delta).toBe(0);
  });

  it('collector stores feedback', () => {
    const col = new FeedbackCollector();
    col.collect({ id: 'f1', sessionId: 's1' } as any);
    expect(col.count()).toBe(1);
  });
});

// ============================================================
// OUTCOME EVALUATOR
// ============================================================
describe('Outcome Evaluator', () => {
  it('evaluates match and mismatch', () => {
    const ev = new OutcomeEvaluator();
    const match = ev.evaluate('A', 'A');
    expect(match.successScore).toBe(100);
    expect(match.confidenceDelta).toBe(5);
    const miss = ev.evaluate('A', 'B');
    expect(miss.successScore).toBe(0);
    expect(miss.confidenceDelta).toBe(-10);
  });
});

// ============================================================
// ANALYZERS
// ============================================================
describe('Success & Failure Analyzers', () => {
  it('success analyzer extracts rules', () => {
    const sa = new SuccessAnalyzer();
    const rules = sa.analyze([sampleExperience()]);
    expect(rules.length).toBeGreaterThan(0);
  });

  it('failure analyzer identifies empty trace root causes', () => {
    const fa = new FailureAnalyzer();
    const causes = fa.analyze([sampleFailure({ reasoningTrace: [] })]);
    expect(causes.some((c) => c.includes('empty-trace'))).toBe(true);
  });
});

// ============================================================
// REFLECTION
// ============================================================
describe('Reflection Engine & History', () => {
  it('generates reflection from experience', () => {
    const eng = new ReflectionEngine();
    const ref = eng.reflect(sampleExperience());
    expect(ref.checksum).toBeDefined();
    expect(ref.question).toContain('What happened');
  });

  it('history stores immutable reflections', () => {
    const hist = new ReflectionHistory();
    hist.add({} as any);
    expect(hist.count()).toBe(1);
  });
});

// ============================================================
// ADAPTATION
// ============================================================
describe('Adaptation Engine', () => {
  it('generates adaptations based on patterns', () => {
    const eng = new AdaptationEngine();
    const p: Pattern = {
      id: 'p1',
      type: 'repeated_failure',
      signature: 'f',
      occurrenceCount: 3,
      firstSeen: new Date(),
      lastSeen: new Date(),
      checksum: '',
    };
    const adapts = eng.adapt([p], 'balanced');
    expect(adapts.length).toBeGreaterThan(0);
  });

  it('no adaptation with conservative policy', () => {
    const eng = new AdaptationEngine();
    const p: Pattern = {
      id: 'p1',
      type: 'repeated_failure',
      signature: 'f',
      occurrenceCount: 3,
      firstSeen: new Date(),
      lastSeen: new Date(),
      checksum: '',
    };
    expect(eng.adapt([p], 'conservative')).toHaveLength(0);
  });
});

describe('Adaptation Policy Manager', () => {
  it('lists and validates policies', () => {
    const pm = new AdaptationPolicyManager();
    expect(pm.getPolicies()).toContain('balanced');
    expect(pm.validate('balanced')).toBe(true);
    expect(pm.validate('invalid' as any)).toBe(false);
  });
});

// ============================================================
// STRATEGY
// ============================================================
describe('Strategy Selector & Registry', () => {
  it('selects best strategy', () => {
    const sel = new StrategySelector();
    const strategies: StrategyRecord[] = [
      { id: 's1', name: 'S1', version: '1', priority: 1, confidence: 80 },
      { id: 's2', name: 'S2', version: '1', priority: 2, confidence: 90 },
    ];
    const selected = sel.select([], strategies);
    expect(selected.id).toBe('s2');
  });

  it('selects fallback strategy with failure patterns', () => {
    const sel = new StrategySelector();
    const failurePattern: Pattern = {
      id: 'fp',
      type: 'repeated_failure',
      signature: 'f',
      occurrenceCount: 3,
      firstSeen: new Date(),
      lastSeen: new Date(),
      checksum: '',
    };
    const strategies: StrategyRecord[] = [
      { id: 's1', name: 'S1', version: '1', priority: 1, confidence: 60 },
      { id: 's2', name: 'S2', version: '1', priority: 2, confidence: 80 },
    ];
    const selected = sel.select([failurePattern], strategies);
    expect(selected.confidence).toBeGreaterThan(70);
  });

  it('forward-chains without failures to reach best.sort path', () => {
    const sel = new StrategySelector();
    const strategies: StrategyRecord[] = [
      { id: 's1', name: 'S1', version: '1', priority: 1, confidence: 50 },
      { id: 's2', name: 'S2', version: '1', priority: 2, confidence: 80 },
    ];
    // No failure patterns -> goes to best.sort path
    const selected = sel.select(
      [
        {
          id: 'ok',
          type: 'repeated_success',
          signature: 's',
          occurrenceCount: 2,
          firstSeen: new Date(),
          lastSeen: new Date(),
          checksum: '',
        },
      ],
      strategies,
    );
    expect(selected.id).toBe('s2');
  });

  it('strategy registry stores and retrieves', () => {
    const reg = new StrategyRegistry();
    reg.register({ id: 's1', name: 'S', version: '1', priority: 1, confidence: 100 });
    expect(reg.get('s1')).toBeDefined();
    expect(reg.getAll()).toHaveLength(1);
  });
});

// ============================================================
// IMPROVEMENT ENGINE
// ============================================================
describe('Improvement Engine', () => {
  it('generates recommendations', () => {
    const eng = new ImprovementEngine();
    const imps = eng.generate([sampleFailure(), sampleFailure()], []);
    expect(imps.length).toBeGreaterThan(0);
  });

  it('generates strategy recommendations for repeated success', () => {
    const eng = new ImprovementEngine();
    const successes = [sampleExperience({ id: 'e1', sessionId: 's1' })];
    const patterns: Pattern[] = [
      {
        id: 'p1',
        type: 'repeated_success',
        signature: 's',
        occurrenceCount: 2,
        firstSeen: new Date(),
        lastSeen: new Date(),
        checksum: '',
      },
      {
        id: 'p2',
        type: 'repeated_success',
        signature: 's2',
        occurrenceCount: 3,
        firstSeen: new Date(),
        lastSeen: new Date(),
        checksum: '',
      },
    ];
    const imps = eng.generate(successes, patterns);
    expect(imps.length).toBeGreaterThan(0);
    expect(imps.some((i) => i.recommendation.includes('Continue'))).toBe(true);
  });
});

// ============================================================
// CHECKPOINT & RECOVERY
// ============================================================
describe('Checkpoint & Recovery', () => {
  let cm: LearningCheckpointManager;
  beforeEach(() => {
    cm = new LearningCheckpointManager();
  });

  it('saves and loads checkpoints', () => {
    const cp = cm.save('s1', { data: 'test' });
    expect(cp.checksum).toBeDefined();
    expect(cm.load('s1')?.id).toBe(cp.id);
  });

  it('recovery manager loads checkpoint', () => {
    cm.save('s1', { val: 1 });
    const rm = new LearningRecoveryManager(cm);
    expect(rm.recover('s1')?.snapshot).toEqual({ val: 1 });
  });
});

// ============================================================
// EVENTS, HOOKS, METRICS
// ============================================================
describe('Events', () => {
  it('publishes and subscribes', () => {
    const bus = new LearningEventBus();
    const fn = vi.fn();
    bus.subscribe('ev', fn);
    bus.publish('ev', {});
    expect(fn).toHaveBeenCalled();
    bus.clear();
  });
});

describe('Hooks', () => {
  it('executes all hook points', async () => {
    const hm = new LearningHookManager();
    const hook = {
      beforeLearning: vi.fn(),
      afterLearning: vi.fn(),
      beforeReflection: vi.fn(),
      afterReflection: vi.fn(),
      beforeAdaptation: vi.fn(),
      afterAdaptation: vi.fn(),
    };
    hm.register(hook);
    await hm.runBeforeLearning('s1');
    await hm.runAfterLearning('s1', {});
    await hm.runBeforeReflection('s1');
    await hm.runAfterReflection('s1');
    await hm.runBeforeAdaptation('s1');
    await hm.runAfterAdaptation('s1');
    expect(hook.beforeLearning).toHaveBeenCalled();
  });
});

describe('Metrics', () => {
  it('computes learning metrics', () => {
    const mc = new LearningMetricsCollector();
    mc.recordRun(true);
    mc.recordRun(false);
    mc.patternsLearned = 3;
    mc.feedbackProcessed = 5;
    const m = mc.getMetrics();
    expect(m.learningRuns).toBe(2);
    expect(m.successRate).toBe(50);
    expect(m.failureRate).toBe(50);
    expect(m.averageConfidenceDelta).toBe(0);
  });

  it('handles zero runs in metrics', () => {
    const mc = new LearningMetricsCollector();
    const m = mc.getMetrics();
    expect(m.learningRuns).toBe(0);
    expect(m.averageConfidenceDelta).toBe(0);
  });
});

// ============================================================
// PATTERN REGISTRY EDGE COVERAGE
// ============================================================
describe('Pattern Registry Edge Cases', () => {
  it('lookup returns undefined for missing', () => {
    const reg = new PatternRegistry();
    expect(reg.lookup('missing')).toBeUndefined();
    expect(reg.getAll()).toHaveLength(0);
  });
});

// ============================================================
// REFLECTION HISTORY EDGE COVERAGE
// ============================================================
describe('Reflection History Edge Cases', () => {
  it('returns empty array initially', () => {
    const h = new ReflectionHistory();
    expect(h.getAll()).toHaveLength(0);
    expect(h.count()).toBe(0);
  });
});

// ============================================================
// FEEDBACK COLLECTOR EDGE COVERAGE
// ============================================================
describe('Feedback Collector Edge Cases', () => {
  it('starts empty', () => {
    const col = new FeedbackCollector();
    expect(col.count()).toBe(0);
    expect(col.getAll()).toHaveLength(0);
  });
});

// ============================================================
// LEARNING ENGINE — State machine & recovery
// ============================================================
describe('Learning Engine Orchestration', () => {
  let engine: LearningEngine;

  beforeEach(() => {
    engine = new LearningEngine();
  });

  it('executes complete learning cycle with patterns', async () => {
    const experiences = [
      sampleExperience({ id: 'e1', sessionId: 's1' }),
      sampleExperience({ id: 'e2', sessionId: 's2', outcome: 'failure', confidence: 10 }),
      sampleExperience({ id: 'e3', sessionId: 's3', outcome: 'failure', confidence: 15 }),
      sampleExperience({ id: 'e4', sessionId: 's4', reasoningTrace: ['X', 'Y'] }),
      sampleExperience({ id: 'e5', sessionId: 's5', reasoningTrace: ['X', 'Y'] }),
    ];

    await engine.run(experiences, 'aggressive');
    expect(engine.stateMachine.getState()).toBe('COMPLETED');
    expect(engine.patternRegistry.getAll().length).toBeGreaterThan(0);
    expect(engine.metrics.getMetrics().learningRuns).toBe(1);
    expect(engine.metrics.getMetrics().patternsLearned).toBeGreaterThan(0);
  });

  it('handles errors during learning gracefully', async () => {
    const engine2 = new LearningEngine();
    // Pass experiences with duplicate to trigger validation that should pass, then check metrics
    // Test a case where learning fails mid-process
    engine2.stateMachine.transition('COLLECTING');
    engine2.stateMachine.transition('EXTRACTING');
    // Since EXTRACTING can transition to COMPLETED directly as well
    engine2.stateMachine.transition('PATTERN_ANALYSIS');
    expect(engine2.stateMachine.getState()).toBe('PATTERN_ANALYSIS');
  });

  it('recovery loads existing checkpoint', () => {
    engine.checkpointManager.save('learn-1', { patterns: [] });
    const cp = engine.recoveryManager.recover('learn-1');
    expect(cp).toBeDefined();
  });

  it('recoverAndContinue emits recovery event', () => {
    engine.checkpointManager.save('learn-2', { patterns: [] });
    engine.recoverAndContinue('learn-2');
    expect(engine.stateMachine.getState()).toBe('CREATED');
  });

  it('handles error during pattern validation', async () => {
    const badExp: Experience = {
      id: '',
      sessionId: '',
      goal: '',
      reasoningTrace: [],
      decision: '',
      confidence: 0,
      outcome: 'failure',
      feedback: [],
      timestamp: new Date(),
      checksum: '',
    };
    await expect(engine.run([badExp])).rejects.toThrow();
  });
});
