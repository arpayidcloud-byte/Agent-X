/**
 * @module goal-intelligence/goal-validator
 * @description Validates goals before decomposition.
 */

import type { Goal } from './interfaces.js';
import { GoalValidationError } from './errors.js';

export class GoalValidator {
  validate(goal: Goal): void {
    if (!goal.title || goal.title.trim() === '') {
      throw new GoalValidationError('Goal must have a non-empty title', 'goal-validator');
    }
    if (goal.priority < 1 || goal.priority > 10) {
      throw new GoalValidationError('Goal priority must be between 1 and 10', 'goal-validator');
    }
    if (goal.maxDepth < 1) {
      throw new GoalValidationError('Goal maxDepth must be at least 1', 'goal-validator');
    }
  }
}
