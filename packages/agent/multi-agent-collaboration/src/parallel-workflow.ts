/**
 * @module multi-agent-collaboration/parallel-workflow
 * @description Parallel execution of multiple goals through the specialist
 * team, with a bounded concurrency pool.
 *
 * The sequential `SpecialistWorkflow` runs one goal through
 * architect → coder → reviewer → tester. `ParallelWorkflow` runs N goals
 * concurrently (default 2, max 4) so independent workstreams progress at the
 * same time instead of queueing behind each other. Each goal still goes
 * through the full specialist pipeline with its own collaboration session.
 */

import type { MultiAgentCollaborationEngine } from './multi-agent-collaboration-engine.js';
import {
  SpecialistWorkflow,
  type PhaseExecutor,
  type WorkflowPhaseResult,
} from './specialist-workflow.js';
import { CollaborationError } from './errors.js';

export interface ParallelGoalInput {
  goalId: string;
  description: string;
}

export interface ParallelGoalResult {
  goalId: string;
  sessionId: string;
  approved: boolean;
  iterations: number;
  phases: WorkflowPhaseResult[];
  error?: string;
}

export interface ParallelWorkflowOptions {
  /** Max goals running at the same time (default 2, clamped to [1, 4]). */
  concurrency: number;
}

export interface ParallelWorkflowResult {
  goals: ParallelGoalResult[];
  approvedCount: number;
  totalGoals: number;
  /** Milliseconds between first start and last completion. */
  wallTimeMs: number;
}

const DEFAULT_CONCURRENCY = 2;
const MAX_CONCURRENCY = 4;

export class ParallelWorkflow {
  /** Effective concurrency bound (clamped to [1, 4]). */
  readonly concurrency: number;

  constructor(
    private readonly engine: MultiAgentCollaborationEngine,
    options: Partial<ParallelWorkflowOptions> = {},
  ) {
    this.concurrency = Math.min(
      MAX_CONCURRENCY,
      Math.max(1, options.concurrency ?? DEFAULT_CONCURRENCY),
    );
  }

  /**
   * Runs all goals through the specialist team with a bounded pool.
   * Goals are processed FIFO; up to `concurrency` run at any moment.
   * A failure in one goal is captured in that goal's result and never
   * aborts the other workstreams.
   */
  async run(goals: ParallelGoalInput[], executor: PhaseExecutor): Promise<ParallelWorkflowResult> {
    if (goals.length === 0) {
      throw new CollaborationError(
        'goals must not be empty',
        'INVALID_OPTIONS',
        'parallel-workflow',
      );
    }

    const startedAt = Date.now();
    const results: ParallelGoalResult[] = new Array(goals.length);
    const queue = [...goals];
    let cursor = 0;

    // Each worker pulls the next goal from the queue when it is free.
    const worker = async (): Promise<void> => {
      for (;;) {
        const index = cursor++;
        const goal = queue[index];
        if (!goal) return;
        results[index] = await this.runGoal(goal, executor);
      }
    };

    const workers = Array.from({ length: Math.min(this.concurrency, goals.length) }, () =>
      worker(),
    );
    await Promise.all(workers);

    return {
      goals: results,
      approvedCount: results.filter((r) => r.approved).length,
      totalGoals: results.length,
      wallTimeMs: Date.now() - startedAt,
    };
  }

  private async runGoal(
    goal: ParallelGoalInput,
    executor: PhaseExecutor,
  ): Promise<ParallelGoalResult> {
    const workflow = new SpecialistWorkflow(this.engine);
    try {
      const result = await workflow.run(goal.goalId, goal.description, executor);
      return {
        goalId: goal.goalId,
        sessionId: result.sessionId,
        approved: result.approved,
        iterations: result.iterations,
        phases: result.phases,
      };
    } catch (e) {
      this.engine.events.publish('parallel.goal.failed', {
        goalId: goal.goalId,
        error: e instanceof Error ? e.message : String(e),
      });
      return {
        goalId: goal.goalId,
        sessionId: '',
        approved: false,
        iterations: 0,
        phases: [],
        error: e instanceof Error ? e.message : String(e),
      };
    }
  }
}
