/**
 * @module cognitive-contracts/errors
 * @description Error classes for Cognitive Runtime Contracts.
 */

export class CognitiveError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly source: string,
  ) {
    super(message);
    this.name = 'CognitiveError';
  }
}

export class BudgetExceededError extends CognitiveError {
  constructor(message: string, source: string) {
    super(message, 'BUDGET_EXCEEDED', source);
    this.name = 'BudgetExceededError';
  }
}

export class SafetyViolationError extends CognitiveError {
  constructor(message: string, source: string) {
    super(message, 'SAFETY_VIOLATION', source);
    this.name = 'SafetyViolationError';
  }
}

export class ValidationError extends CognitiveError {
  constructor(message: string, source: string) {
    super(message, 'VALIDATION_FAILED', source);
    this.name = 'ValidationError';
  }
}

export class GoalConflictError extends CognitiveError {
  constructor(message: string, source: string) {
    super(message, 'GOAL_CONFLICT', source);
    this.name = 'GoalConflictError';
  }
}
