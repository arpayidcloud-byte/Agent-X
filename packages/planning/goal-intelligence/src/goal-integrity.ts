/**
 * @module goal-intelligence/goal-integrity
 * @description Validates integrity of planning state.
 */

import type { PlanningPlan } from './interfaces.js';
import { createHash } from 'crypto';

export class GoalIntegrityValidator {
  validateChecksum(plan: PlanningPlan): boolean {
    const payload = JSON.stringify({ goalId: plan.goalId, steps: plan.steps });
    const computed = createHash('sha256').update(payload).digest('hex');
    return computed === plan.checksum;
  }

  validatePlanningConsistency(plan: PlanningPlan): boolean {
    if (plan.steps.length === 0) return false;
    const stepIds = new Set(plan.steps.map((s) => s.id));
    if (stepIds.size !== plan.steps.length) return false;
    for (const step of plan.steps) {
      for (const dep of step.dependencies || []) {
        if (!stepIds.has(dep)) return false;
      }
    }
    return true;
  }
}
