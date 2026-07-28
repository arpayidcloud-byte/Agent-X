/**
 * @module goal-intelligence/goal-constraints
 * @description Constraint validation for goals.
 */

import { GoalValidationError } from './errors.js';

export interface GoalConstraints {
  deadline?: Date;
  priority: number;
  budgetLimit: number;
  resourceLimit: number;
  maxExecutionTime: number;
  maxRetries: number;
  requiredCapabilities: string[];
  approvalRequired: boolean;
  maxTokenBudget: number;
  maxCost: number;
}

export class GoalConstraintValidator {
  validate(constraints: GoalConstraints): void {
    if (constraints.priority < 1 || constraints.priority > 10) {
      throw new GoalValidationError('Priority must be between 1 and 10', 'constraint-validator');
    }
    if (constraints.budgetLimit <= 0) {
      throw new GoalValidationError('Budget limit must be positive', 'constraint-validator');
    }
    if (constraints.maxExecutionTime <= 0) {
      throw new GoalValidationError('Max execution time must be positive', 'constraint-validator');
    }
    if (constraints.maxTokenBudget <= 0) {
      throw new GoalValidationError('Max token budget must be positive', 'constraint-validator');
    }
    if (constraints.deadline && constraints.deadline.getTime() <= Date.now()) {
      throw new GoalValidationError('Deadline is in the past', 'constraint-validator');
    }
  }
}
