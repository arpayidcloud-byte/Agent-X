import { createHash } from 'crypto';
import type { Goal, GoalAnalysis, GoalDecomposition, GoalState } from './interfaces.js';
import { InvariantViolationError } from '../shared/errors.js';

export class GoalIntakeEngine {
  private goals = new Map<string, Goal>();

  intake(
    title: string,
    description: string,
    priority: number,
    metadata: Record<string, unknown> = {},
  ): Goal {
    const goalId = `goal-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ goalId, title, description, priority }))
      .digest('hex');
    const goal: Goal = Object.freeze({
      goalId,
      title,
      description,
      priority,
      state: 'INTAKE',
      createdAt: new Date(),
      metadata: { ...metadata },
      checksum,
    });
    this.goals.set(goalId, goal);
    return goal;
  }

  transition(goalId: string, newState: GoalState): Goal {
    const current = this.goals.get(goalId);
    if (!current)
      throw new InvariantViolationError(
        `Goal not found: ${goalId}`,
        'GOAL_NOT_FOUND',
        'GoalIntakeEngine',
      );
    const checksum = createHash('sha256')
      .update(JSON.stringify({ ...current, state: newState }))
      .digest('hex');
    const updated: Goal = Object.freeze({ ...current, state: newState, checksum });
    this.goals.set(goalId, updated);
    return updated;
  }

  get(goalId: string): Goal | undefined {
    return this.goals.get(goalId);
  }

  getAll(): Goal[] {
    return Array.from(this.goals.values());
  }
}

export class GoalAnalyzer {
  analyze(goal: Goal): GoalAnalysis {
    const complexity = Math.min(goal.title.length / 10, 10);
    const estimatedTasks = Math.max(1, Math.ceil(complexity));
    const riskScore = goal.priority > 7 ? 0.8 : goal.priority > 4 ? 0.5 : 0.2;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ goalId: goal.goalId, complexity, estimatedTasks }))
      .digest('hex');
    return Object.freeze({
      goalId: goal.goalId,
      complexity,
      estimatedTasks,
      requiredCapabilities: ['reasoning', 'execution'],
      riskScore,
      checksum,
    });
  }
}

export class GoalDecomposer {
  decompose(goalId: string, subGoalTitles: string[]): GoalDecomposition {
    const subGoals = subGoalTitles.map((_, i) => `sub-${goalId}-${i}`);
    const dependencies: string[][] = subGoals.length > 1 ? [subGoals.slice(0, -1)] : [];
    const checksum = createHash('sha256')
      .update(JSON.stringify({ goalId, subGoals }))
      .digest('hex');
    return Object.freeze({ goalId, subGoals, dependencies, checksum });
  }
}

export class GoalPrioritizer {
  prioritize(goals: Goal[]): Goal[] {
    return [...goals].sort((a, b) => b.priority - a.priority);
  }
}

export class GoalScheduler {
  private queue: Goal[] = [];

  schedule(goal: Goal): void {
    this.queue.push(goal);
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  dequeue(): Goal | undefined {
    return this.queue.shift();
  }

  size(): number {
    return this.queue.length;
  }

  getAll(): Goal[] {
    return [...this.queue];
  }
}
