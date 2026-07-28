/**
 * @module goal-intelligence/errors
 * @description Error classes for goal intelligence.
 */

export class GoalError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly source: string,
  ) {
    super(message);
    this.name = 'GoalError';
  }
}

export class GoalValidationError extends GoalError {
  constructor(message: string, source: string) {
    super(message, 'GOAL_VALIDATION_ERROR', source);
    this.name = 'GoalValidationError';
  }
}

export class DecompositionError extends GoalError {
  constructor(message: string, source: string) {
    super(message, 'DECOMPOSITION_ERROR', source);
    this.name = 'DecompositionError';
  }
}

export class DecisionError extends GoalError {
  constructor(message: string, source: string) {
    super(message, 'DECISION_ERROR', source);
    this.name = 'DecisionError';
  }
}

export class PlanningError extends GoalError {
  constructor(message: string, source: string) {
    super(message, 'PLANNING_ERROR', source);
    this.name = 'PlanningError';
  }
}

export class CycleDetectedError extends GoalError {
  constructor(message: string, source: string) {
    super(message, 'CYCLE_DETECTED', source);
    this.name = 'CycleDetectedError';
  }
}

export class BudgetExceededError extends GoalError {
  constructor(message: string, source: string) {
    super(message, 'BUDGET_EXCEEDED', source);
    this.name = 'BudgetExceededError';
  }
}
