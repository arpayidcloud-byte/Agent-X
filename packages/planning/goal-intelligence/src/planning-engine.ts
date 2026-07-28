/**
 * @module goal-intelligence/planning-engine
 * @description Generates executable plans from subgoals.
 */

import type { SubGoal, PlanningPlan, PlanningStep, PlanningBudget } from './interfaces.js';
import { createHash } from 'crypto';

export class PlanningEngine {
  generatePlan(goalId: string, subgoals: SubGoal[], budget: PlanningBudget): PlanningPlan {
    const ordered = [...subgoals].sort((a, b) => {
      if (a.dependencies.length === 0 && b.dependencies.length > 0) return -1;
      return a.priority - b.priority;
    });

    const steps: PlanningStep[] = ordered.map((sg, idx) => ({
      id: `step-${idx}`,
      subgoalId: sg.id,
      strategy: 'sequential',
      order: idx,
      parallel: sg.dependencies.length === 0 && idx > 0,
      dependencies: sg.dependencies,
    }));

    const totalEstimatedTime = steps.length * 1000;

    return {
      id: `plan-${goalId}-${Date.now()}`,
      goalId,
      steps,
      totalEstimatedTime,
      budget,
      checksum: createHash('sha256').update(JSON.stringify({ goalId, steps })).digest('hex'),
      timestamp: new Date(),
    };
  }
}
