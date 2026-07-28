import { createHash } from 'crypto';
import type { Goal } from '../goal/interfaces.js';

export interface ExecutionPlan {
  readonly planId: string;
  readonly goalId: string;
  readonly steps: readonly ExecutionStep[];
  readonly checksum: string;
}

export interface ExecutionStep {
  readonly stepId: string;
  readonly action: string;
  readonly capabilities: readonly string[];
  readonly timeout: number;
}

export class ExecutionPlanner {
  plan(goal: Goal, steps: string[]): ExecutionPlan {
    const planId = `ep-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const executionSteps: ExecutionStep[] = steps.map((action, i) => ({
      stepId: `step-${planId}-${i}`,
      action,
      capabilities: ['execution'],
      timeout: 30000,
    }));
    const checksum = createHash('sha256')
      .update(JSON.stringify({ planId, goalId: goal.goalId, steps: executionSteps }))
      .digest('hex');
    return Object.freeze({ planId, goalId: goal.goalId, steps: executionSteps, checksum });
  }
}

export interface TaskResult {
  readonly taskId: string;
  readonly stepId: string;
  readonly status: 'SUCCESS' | 'FAILURE' | 'SKIPPED';
  readonly output: unknown;
  readonly durationMs: number;
  readonly checksum: string;
}

export class AutonomousExecutor {
  private results: TaskResult[] = [];

  execute(step: ExecutionStep): TaskResult {
    const taskId = `task-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ taskId, stepId: step.stepId, status: 'SUCCESS' }))
      .digest('hex');
    const result: TaskResult = Object.freeze({
      taskId,
      stepId: step.stepId,
      status: 'SUCCESS',
      output: { executed: true },
      durationMs: 0,
      checksum,
    });
    this.results.push(result);
    return result;
  }

  getResults(): TaskResult[] {
    return [...this.results];
  }
}

export class TaskCoordinator {
  private assignments = new Map<string, string[]>();

  assign(planId: string, stepIds: string[]): void {
    this.assignments.set(planId, [...stepIds]);
  }

  getAssignments(planId: string): string[] {
    return [...(this.assignments.get(planId) ?? [])];
  }

  complete(planId: string, stepId: string): void {
    const steps = this.assignments.get(planId);
    if (!steps) return;
    const idx = steps.indexOf(stepId);
    if (idx >= 0) steps.splice(idx, 1);
  }
}

export interface ProgressSnapshot {
  readonly goalId: string;
  readonly totalSteps: number;
  readonly completedSteps: number;
  readonly progress: number;
  readonly checksum: string;
}

export class ProgressMonitor {
  private snapshots = new Map<string, ProgressSnapshot>();

  record(goalId: string, totalSteps: number, completedSteps: number): ProgressSnapshot {
    const progress = totalSteps > 0 ? completedSteps / totalSteps : 0;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ goalId, totalSteps, completedSteps, progress }))
      .digest('hex');
    const snapshot: ProgressSnapshot = Object.freeze({
      goalId,
      totalSteps,
      completedSteps,
      progress,
      checksum,
    });
    this.snapshots.set(goalId, snapshot);
    return snapshot;
  }

  get(goalId: string): ProgressSnapshot | undefined {
    return this.snapshots.get(goalId);
  }
}
