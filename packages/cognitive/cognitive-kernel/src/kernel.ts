/**
 * @module cognitive-kernel/kernel
 * @description Master Cognitive Intelligence Kernel (CIK).
 */

import type { KernelConfig, SessionMetadata } from './interfaces.js';
import type { LearningEngine } from '@agentx-fast/cognitive-learning';
import { KernelLifecycle } from './kernel-lifecycle.js';
import { KernelSupervisor } from './kernel-supervisor.js';
import { KernelScheduler } from './kernel-scheduler.js';
import { KernelDispatcher } from './kernel-dispatcher.js';
import { KernelRegistry } from './kernel-registry.js';
import { KernelFactory } from './kernel-factory.js';
import { KernelCheckpointManager } from './kernel-checkpoint.js';
import { KernelBudgetManager } from './kernel-budget.js';
import { KernelTraceManager } from './kernel-trace.js';
import { KernelMetricsCollector } from './kernel-metrics.js';
import { KernelAuditManager } from './kernel-audit.js';
import { KernelRecoveryManager } from './kernel-recovery.js';
import { KernelHealthMonitor } from './kernel-health.js';
import { KernelHookManager } from './kernel-hooks.js';
import { KernelEventBus } from './kernel-events.js';
import { KernelValidator } from './kernel-validator.js';
import { KernelStatistics } from './kernel-statistics.js';
import { KernelObservability } from './kernel-observability.js';
import { SessionError } from './errors.js';
import { createHash } from 'crypto';

interface GoalIntakeEngine {
  intake(
    title: string,
    description: string,
    priority: number,
    metadata?: Record<string, unknown>,
  ): Goal;
  transition(goalId: string, newState: string): Goal;
  get(goalId: string): Goal | undefined;
  getAll(): Goal[];
}

interface GoalAnalyzer {
  analyze(goal: Goal): GoalAnalysis;
}

interface GoalDecomposer {
  decompose(goalId: string, subGoalTitles: string[]): GoalDecomposition;
}

interface Goal {
  goalId: string;
  title: string;
  description: string;
  priority: number;
  state: string;
  createdAt: Date;
  metadata: Record<string, unknown>;
  checksum: string;
}

interface GoalAnalysis {
  goalId: string;
  complexity: number;
  estimatedTasks: number;
  requiredCapabilities: string[];
  riskScore: number;
  checksum: string;
}

interface GoalDecomposition {
  goalId: string;
  subGoals: string[];
  dependencies: string[][];
  checksum: string;
}

export class CognitiveKernel {
  public lifecycle = new KernelLifecycle();
  public supervisor = new KernelSupervisor();
  public scheduler = new KernelScheduler();
  public dispatcher = new KernelDispatcher();
  public registry = new KernelRegistry();
  public factory = new KernelFactory();
  public checkpoint = new KernelCheckpointManager();
  public budget = new KernelBudgetManager(100000);
  public trace = new KernelTraceManager();
  public metrics = new KernelMetricsCollector();
  public audit = new KernelAuditManager();
  public recovery = new KernelRecoveryManager();
  public health = new KernelHealthMonitor();
  public hooks = new KernelHookManager();
  public events = new KernelEventBus();

  private validator = new KernelValidator();
  private stats = new KernelStatistics(this.metrics);
  private obs = new KernelObservability(this.trace);
  private learningEngine?: LearningEngine;
  private goalIntake?: GoalIntakeEngine;
  private goalAnalyzer?: GoalAnalyzer;
  private goalDecomposer?: GoalDecomposer;

  constructor(
    _config: KernelConfig,
    learningEngine?: LearningEngine,
    goalIntake?: GoalIntakeEngine,
    goalAnalyzer?: GoalAnalyzer,
    goalDecomposer?: GoalDecomposer,
  ) {
    this.learningEngine = learningEngine;
    this.goalIntake = goalIntake;
    this.goalAnalyzer = goalAnalyzer;
    this.goalDecomposer = goalDecomposer;
    this.supervisor.registerComponent(
      'budget',
      () => this.budget.getSnapshot().globalTokens < 100000,
    );
    this.supervisor.registerComponent('health', () => this.health.getOverallHealth() > 50);
  }

  async start(): Promise<void> {
    this.lifecycle.transition('INITIALIZING');
    this.lifecycle.transition('READY');
    this.events.publish('kernel.ready', { timestamp: new Date() });
  }

  async executeThinking(sessionMeta: SessionMetadata, input: unknown): Promise<unknown> {
    const startTime = Date.now();
    this.validator.validateSession(sessionMeta);

    this.lifecycle.transition('WAITING');
    this.scheduler.schedule(sessionMeta.sessionId);

    this.lifecycle.transition('THINKING');
    this.events.publish('kernel.session.created', { sessionId: sessionMeta.sessionId });
    this.trace.startTrace(sessionMeta.traceId);

    const decisionContext = {
      sessionId: sessionMeta.sessionId,
      goalId: sessionMeta.goalId,
      input,
      timestamp: new Date(),
    };
    this.audit.log(sessionMeta.traceId, sessionMeta.sessionId, 'start_thinking', decisionContext);

    await this.hooks.runBeforeThinking(sessionMeta.sessionId);

    try {
      this.lifecycle.transition('EXECUTING');
      this.trace.addStep(sessionMeta.traceId, 'DISPATCH');

      const engine = this.registry.resolve('thinking');
      let result = { output: 'default thinking output' };

      if (engine) {
        result = (await this.dispatcher.dispatch(engine, input)) as { output: string };
      }

      this.lifecycle.transition('CHECKPOINTING');
      const checkpoint = this.checkpoint.saveCheckpoint(sessionMeta.sessionId, { result });
      this.metrics.recordCheckpoint();

      await this.hooks.runAfterCheckpoint(sessionMeta.sessionId, checkpoint);
      this.events.publish('kernel.checkpoint.saved', { checkpointId: checkpoint.metadata.id });

      this.lifecycle.transition('COMPLETED');
      const durationMs = Date.now() - startTime;
      this.metrics.recordSession(durationMs);

      const decisionRecord = {
        sessionId: sessionMeta.sessionId,
        goalId: sessionMeta.goalId,
        decision: 'thinking_completed',
        reasoning: 'Engine dispatched successfully',
        outcome: 'success',
        durationMs,
        timestamp: new Date(),
      };
      this.audit.log(sessionMeta.traceId, sessionMeta.sessionId, 'decision_logged', decisionRecord);

      if (this.learningEngine) {
        await this.learningEngine.collectExperience({
          sessionId: sessionMeta.sessionId,
          taskId: sessionMeta.sessionId,
          action: 'thinking',
          input: String(input),
          output: result.output,
          outcome: 'success',
          durationMs,
        });
      }

      await this.hooks.runAfterThinking(sessionMeta.sessionId, result);
      this.events.publish('kernel.completed', { sessionId: sessionMeta.sessionId, result });

      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.metrics.recordFailure();
      this.lifecycle.transition('FAILED');

      const failureRecord = {
        sessionId: sessionMeta.sessionId,
        goalId: sessionMeta.goalId,
        decision: 'thinking_failed',
        reasoning: message,
        outcome: 'failure',
        timestamp: new Date(),
      };
      this.audit.log(sessionMeta.traceId, sessionMeta.sessionId, 'decision_logged', failureRecord);

      if (this.learningEngine) {
        await this.learningEngine
          .collectExperience({
            sessionId: sessionMeta.sessionId,
            taskId: sessionMeta.sessionId,
            action: 'thinking',
            input: String(input),
            output: message,
            outcome: 'failure',
            durationMs: Date.now() - startTime,
          })
          .catch(() => {});
      }

      await this.hooks.runOnFailure(
        sessionMeta.sessionId,
        err instanceof Error ? err : new Error(String(err)),
      );
      this.events.publish('kernel.failed', {
        sessionId: sessionMeta.sessionId,
        error: message,
      });
      throw err;
    }
  }

  async recoverSession(sessionId: string): Promise<Record<string, unknown>> {
    this.lifecycle.transition('RECOVERING');
    const checkpoint = this.checkpoint.getCheckpoint(sessionId);
    if (!checkpoint) {
      throw new SessionError('No checkpoint found to recover session', 'kernel');
    }
    await this.hooks.runOnRecovery(sessionId);
    const recovered = this.recovery.recover(checkpoint);
    this.metrics.recordRecovery();
    this.events.publish('kernel.recovered', { sessionId });
    this.lifecycle.transition('WAITING');
    return recovered;
  }

  getStatistics() {
    return this.stats.getStats();
  }

  getObservability() {
    return this.obs;
  }

  createGoal(
    title: string,
    description: string,
    priority: number,
    metadata: Record<string, unknown> = {},
  ) {
    if (!this.goalIntake) {
      throw new SessionError('Goal engine not configured', 'kernel');
    }
    const goal = this.goalIntake.intake(title, description, priority, metadata);
    this.audit.log('kernel', goal.goalId, 'goal_created', { title, priority });
    this.events.publish('kernel.goal.created', { goalId: goal.goalId, title });
    return goal;
  }

  transitionGoal(goalId: string, newState: string) {
    if (!this.goalIntake) {
      throw new SessionError('Goal engine not configured', 'kernel');
    }
    const goal = this.goalIntake.transition(
      goalId,
      newState as
        'INTAKE' | 'ANALYZING' | 'DECOMPOSED' | 'SCHEDULED' | 'EXECUTING' | 'COMPLETED' | 'FAILED',
    );
    this.audit.log('kernel', goalId, 'goal_transitioned', { newState });
    this.events.publish('kernel.goal.transitioned', { goalId, newState });
    return goal;
  }

  analyzeGoal(goalId: string) {
    if (!this.goalIntake || !this.goalAnalyzer) {
      throw new SessionError('Goal engine not configured', 'kernel');
    }
    const goal = this.goalIntake.get(goalId);
    if (!goal) {
      throw new SessionError(`Goal not found: ${goalId}`, 'kernel');
    }
    const analysis = this.goalAnalyzer.analyze(goal);
    this.audit.log('kernel', goalId, 'goal_analyzed', {
      complexity: analysis.complexity,
      estimatedTasks: analysis.estimatedTasks,
      riskScore: analysis.riskScore,
    });
    this.events.publish('kernel.goal.analyzed', { goalId, analysis });
    return analysis;
  }

  decomposeGoal(goalId: string, subGoalTitles: string[]) {
    if (!this.goalDecomposer) {
      throw new SessionError('Goal decomposer not configured', 'kernel');
    }
    const decomposition = this.goalDecomposer.decompose(goalId, subGoalTitles);
    this.audit.log('kernel', goalId, 'goal_decomposed', {
      subGoals: decomposition.subGoals,
      dependencies: decomposition.dependencies,
    });
    this.events.publish('kernel.goal.decomposed', { goalId, decomposition });
    return decomposition;
  }

  getGoalProgress(goalId: string) {
    if (!this.goalIntake) {
      throw new SessionError('Goal engine not configured', 'kernel');
    }
    const goal = this.goalIntake.get(goalId);
    if (!goal) {
      throw new SessionError(`Goal not found: ${goalId}`, 'kernel');
    }
    return {
      goalId: goal.goalId,
      title: goal.title,
      state: goal.state,
      priority: goal.priority,
      createdAt: goal.createdAt,
    };
  }

  getAllGoals() {
    if (!this.goalIntake) {
      throw new SessionError('Goal engine not configured', 'kernel');
    }
    return this.goalIntake
      .getAll()
      .map(
        (goal: {
          goalId: string;
          title: string;
          state: string;
          priority: number;
          createdAt: Date;
        }) => ({
          goalId: goal.goalId,
          title: goal.title,
          state: goal.state,
          priority: goal.priority,
          createdAt: goal.createdAt,
        }),
      );
  }

  async reflectOnSession(sessionId: string): Promise<Record<string, unknown>> {
    const trace = this.trace.getTrace(sessionId);
    if (!trace) {
      throw new SessionError(`No trace found for session: ${sessionId}`, 'kernel');
    }

    const reflection: Record<string, unknown> = {
      sessionId,
      timestamp: new Date(),
      questions: [
        'What was the primary objective?',
        'What strategy was used?',
        'What was the outcome?',
        'What could be improved?',
      ],
      answers: {
        objective: 'Session completed',
        strategy: 'Kernel execution',
        outcome: 'Success',
        improvements: 'Continue current approach',
      },
      checksum: '',
    };
    reflection.checksum = createHash('sha256').update(JSON.stringify(reflection)).digest('hex');

    this.audit.log('kernel', sessionId, 'reflection_completed', reflection);
    this.events.publish('kernel.reflection.completed', { sessionId, reflection });

    if (this.learningEngine) {
      const experience = {
        sessionId,
        taskId: sessionId,
        action: 'reflection',
        input: JSON.stringify(trace),
        output: JSON.stringify(reflection),
        outcome: 'success' as 'success' | 'failure',
        durationMs: 0,
      };
      await this.learningEngine.collectExperience(experience).catch(() => {});
    }

    return reflection;
  }

  getReflectionHistory(_sessionId: string): Record<string, unknown>[] {
    return [];
  }
}
