/**
 * @module goal-intelligence/hooks
 * @description Lifecycle hook support for goal intelligence.
 */

import type { CognitiveHook } from './interfaces.js';

export class GoalHookManager {
  private hooks: CognitiveHook[] = [];

  register(hook: CognitiveHook): void {
    this.hooks.push(hook);
  }

  async runBeforeGoal(goalId: string): Promise<void> {
    for (const h of this.hooks) {
      if (h.beforeGoal) await h.beforeGoal(goalId);
    }
  }

  async runAfterGoal(goalId: string, result: unknown): Promise<void> {
    for (const h of this.hooks) {
      if (h.afterGoal) await h.afterGoal(goalId, result);
    }
  }

  async runBeforeDecision(goalId: string): Promise<void> {
    for (const h of this.hooks) {
      if (h.beforeDecision) await h.beforeDecision(goalId);
    }
  }

  async runAfterDecision(goalId: string, choice: string): Promise<void> {
    for (const h of this.hooks) {
      if (h.afterDecision) await h.afterDecision(goalId, choice);
    }
  }

  async runBeforePlanning(goalId: string): Promise<void> {
    for (const h of this.hooks) {
      if (h.beforePlanning) await h.beforePlanning(goalId);
    }
  }

  async runAfterPlanning(goalId: string, planId: string): Promise<void> {
    for (const h of this.hooks) {
      if (h.afterPlanning) await h.afterPlanning(goalId, planId);
    }
  }

  async runBeforeConstraintValidation(goalId: string): Promise<void> {
    for (const h of this.hooks) {
      if (h.beforeConstraintValidation) await h.beforeConstraintValidation(goalId);
    }
  }

  async runAfterConstraintValidation(goalId: string): Promise<void> {
    for (const h of this.hooks) {
      if (h.afterConstraintValidation) await h.afterConstraintValidation(goalId);
    }
  }

  async runBeforePlanningScore(goalId: string): Promise<void> {
    for (const h of this.hooks) {
      if (h.beforePlanningScore) await h.beforePlanningScore(goalId);
    }
  }

  async runAfterPlanningScore(goalId: string, score: number): Promise<void> {
    for (const h of this.hooks) {
      if (h.afterPlanningScore) await h.afterPlanningScore(goalId, score);
    }
  }

  async runBeforeIntegrityValidation(goalId: string): Promise<void> {
    for (const h of this.hooks) {
      if (h.beforeIntegrityValidation) await h.beforeIntegrityValidation(goalId);
    }
  }

  async runAfterIntegrityValidation(goalId: string): Promise<void> {
    for (const h of this.hooks) {
      if (h.afterIntegrityValidation) await h.afterIntegrityValidation(goalId);
    }
  }

  async runBeforeCriticalPath(goalId: string): Promise<void> {
    for (const h of this.hooks) {
      if (h.beforeCriticalPath) await h.beforeCriticalPath(goalId);
    }
  }

  async runAfterCriticalPath(goalId: string, path: string[]): Promise<void> {
    for (const h of this.hooks) {
      if (h.afterCriticalPath) await h.afterCriticalPath(goalId, path);
    }
  }
}
