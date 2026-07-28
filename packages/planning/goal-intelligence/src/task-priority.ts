/**
 * @module goal-intelligence/task-priority
 * @description Priority assignment based on symbolic policies.
 */

import type { SubGoal } from './interfaces.js';

export class TaskPriorityEngine {
  assignPriority(subgoal: SubGoal, basePriority: number): number {
    let priority = basePriority;
    if (subgoal.dependencies.length === 0) priority += 2;
    if (subgoal.depth === 0) priority += 1;
    return Math.min(priority, 10);
  }
}
