/**
 * @module cognitive-learning/learning-engine
 * @description Master orchestrator for cognitive learning.
 */

import { LearningStateMachine } from './learning-state.js';
import { LearningSession } from './learning-session.js';
import { ExperienceStore } from './experience-store.js';
import { ExperienceExtractor } from './experience-extractor.js';
import { PatternEngine } from './pattern-engine.js';
import { PatternValidator } from './pattern-validator.js';
import { PatternRegistry } from './pattern-registry.js';
import { FeedbackEngine } from './feedback-engine.js';
import { FeedbackCollector } from './feedback-collector.js';
import { FeedbackValidator } from './feedback-validator.js';
import { OutcomeEvaluator } from './outcome-evaluator.js';
import { SuccessAnalyzer } from './success-analyzer.js';
import { FailureAnalyzer } from './failure-analyzer.js';
import { ReflectionEngine } from './reflection-engine.js';
import { ReflectionHistory } from './reflection-history.js';
import { AdaptationEngine } from './adaptation-engine.js';
import { AdaptationPolicyManager } from './adaptation-policy.js';
import { StrategySelector } from './strategy-selector.js';
import { StrategyRegistry } from './strategy-registry.js';
import { ImprovementEngine } from './improvement-engine.js';
import { ImprovementValidator } from './improvement-validator.js';
import { LearningCheckpointManager } from './checkpoint.js';
import { LearningRecoveryManager } from './recovery.js';
import { LearningEventBus } from './events.js';
import { LearningHookManager } from './hooks.js';
import { LearningMetricsCollector } from './metrics.js';
import type { Experience, AdaptationPolicy } from './interfaces.js';

export class LearningEngine {
  public stateMachine = new LearningStateMachine();
  public experienceStore = new ExperienceStore();
  public patternEngine = new PatternEngine();
  public patternValidator = new PatternValidator();
  public patternRegistry = new PatternRegistry();
  public feedbackEngine = new FeedbackEngine();
  public feedbackCollector = new FeedbackCollector();
  public feedbackValidator = new FeedbackValidator();
  public outcomeEvaluator = new OutcomeEvaluator();
  public successAnalyzer = new SuccessAnalyzer();
  public failureAnalyzer = new FailureAnalyzer();
  public reflectionEngine = new ReflectionEngine();
  public reflectionHistory = new ReflectionHistory();
  public adaptationEngine = new AdaptationEngine();
  public adaptationPolicy = new AdaptationPolicyManager();
  public strategySelector = new StrategySelector();
  public strategyRegistry = new StrategyRegistry();
  public improvementEngine = new ImprovementEngine();
  public improvementValidator = new ImprovementValidator();
  public checkpointManager = new LearningCheckpointManager();
  public recoveryManager = new LearningRecoveryManager(this.checkpointManager);
  public events = new LearningEventBus();
  public hooks = new LearningHookManager();
  public metrics = new LearningMetricsCollector();
  private extractor = new ExperienceExtractor();

  async run(
    experiences: Experience[],
    adaptationPolicy: AdaptationPolicy = 'balanced',
  ): Promise<void> {
    const session = new LearningSession(`learn-${Date.now()}`);
    await this.hooks.runBeforeLearning(session.id);
    this.events.publish('learning.started', { sessionId: session.id });

    try {
      this.stateMachine.transition('COLLECTING');
      // Collect experiences into store
      for (const exp of experiences) {
        this.experienceStore.store(exp);
      }

      this.stateMachine.transition('EXTRACTING');
      const patterns = this.extractor.extractPatterns(experiences);
      for (const p of patterns) {
        this.patternValidator.validate(p);
        this.patternRegistry.register(p);
        this.metrics.patternsLearned++;
        this.events.publish('pattern.learned', { patternId: p.id });
      }

      this.stateMachine.transition('PATTERN_ANALYSIS');
      const discovered = this.patternEngine.analyze(experiences);
      for (const p of discovered) {
        this.patternRegistry.register(p);
        this.metrics.patternsLearned++;
        this.events.publish('pattern.learned', { patternId: p.id });
      }

      this.stateMachine.transition('REFLECTION');
      for (const exp of experiences) {
        const reflection = this.reflectionEngine.reflect(exp);
        this.reflectionHistory.add(reflection);
        this.metrics.reflectionsCreated++;
      }
      this.events.publish('reflection.completed', { sessionId: session.id });

      this.stateMachine.transition('ADAPTATION');
      const allPatterns = this.patternRegistry.getAll();
      const adaptations = this.adaptationEngine.adapt(allPatterns, adaptationPolicy);
      this.metrics.adaptationsGenerated += adaptations.length;
      if (adaptations.length > 0) {
        this.events.publish('adaptation.generated', {
          sessionId: session.id,
          count: adaptations.length,
        });
      }

      this.stateMachine.transition('VALIDATION');
      const improvements = this.improvementEngine.generate(experiences, allPatterns);
      for (const imp of improvements) {
        this.improvementValidator.validate(imp);
        this.metrics.improvementsGenerated++;
      }
      if (improvements.length > 0) {
        this.events.publish('improvement.generated', {
          sessionId: session.id,
          count: improvements.length,
        });
      }

      this.stateMachine.transition('CHECKPOINTING');
      this.checkpointManager.save(session.id, {
        patterns: allPatterns,
        adaptations,
        improvements,
        timestamp: new Date(),
      });

      this.stateMachine.transition('COMPLETED');
      this.metrics.recordRun(true);
      session.markComplete();
      this.events.publish('learning.completed', { sessionId: session.id });
      await this.hooks.runAfterLearning(session.id, { patterns: allPatterns.length });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.metrics.recordRun(false);
      this.events.publish('learning.failed', { sessionId: session.id, error: message });
      throw err;
    }
  }

  recoverAndContinue(sessionId: string): void {
    const cp = this.recoveryManager.recover(sessionId);
    if (cp) {
      this.events.publish('learning.recovered', { sessionId });
    }
  }

  async collectExperience(data: {
    sessionId: string;
    taskId: string;
    action: string;
    input: string;
    output: string;
    outcome: 'success' | 'failure';
    durationMs: number;
  }): Promise<void> {
    const experience: Experience = {
      id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      sessionId: data.sessionId,
      taskId: data.taskId,
      action: data.action,
      input: data.input,
      output: data.output,
      goal: '',
      reasoningTrace: [],
      decision: data.outcome === 'success' ? 'completed' : 'failed',
      confidence: data.outcome === 'success' ? 0.8 : 0.2,
      outcome: data.outcome,
      feedback: [],
      durationMs: data.durationMs,
      timestamp: new Date(),
      checksum: '',
    };
    experience.checksum = Buffer.from(JSON.stringify(experience)).toString('base64');

    this.experienceStore.store(experience);
    this.metrics.experiencesCollected++;
    this.events.publish('experience.collected', { experienceId: experience.id });
  }
}
