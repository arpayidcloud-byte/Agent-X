/**
 * @module goal-intelligence/task-ordering
 * @description Deterministic execution ordering for subgoals.
 */

import type { SubGoal } from './interfaces.js';

export class TaskOrderingEngine {
  order(subgoals: SubGoal[]): SubGoal[] {
    return [...subgoals].sort((a, b) => {
      if (a.dependencies.length === 0 && b.dependencies.length > 0) return -1;
      if (a.dependencies.length > 0 && b.dependencies.length === 0) return 1;
      return a.priority - b.priority;
    });
  }
}
