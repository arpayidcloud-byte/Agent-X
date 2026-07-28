/**
 * @module goal-intelligence/subgoal-manager
 * @description Manages lifecycle of subgoals.
 */

import type { SubGoal } from './interfaces.js';

export class SubGoalManager {
  private subgoals = new Map<string, SubGoal>();

  register(subgoal: SubGoal): void {
    this.subgoals.set(subgoal.id, subgoal);
  }

  get(id: string): SubGoal | undefined {
    return this.subgoals.get(id);
  }

  updateStatus(id: string, status: SubGoal['status']): void {
    const sub = this.subgoals.get(id);
    if (sub) sub.status = status;
  }

  getAll(): SubGoal[] {
    return Array.from(this.subgoals.values());
  }

  getByGoal(goalId: string): SubGoal[] {
    return Array.from(this.subgoals.values()).filter((s) => s.goalId === goalId);
  }
}
