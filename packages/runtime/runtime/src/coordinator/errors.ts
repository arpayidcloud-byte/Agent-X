/**
 * @module coordinator/errors
 * @description Error classes for the Production Execution Coordinator.
 */

export class CoordinatorError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly source: string,
  ) {
    super(message);
    this.name = 'CoordinatorError';
  }
}

export class CoordinatorStateError extends CoordinatorError {
  constructor(message: string, source: string) {
    super(message, 'STATE_ERROR', source);
    this.name = 'CoordinatorStateError';
  }
}

export class CoordinatorSchedulingError extends CoordinatorError {
  constructor(message: string, source: string) {
    super(message, 'SCHEDULING_ERROR', source);
    this.name = 'CoordinatorSchedulingError';
  }
}

export class CoordinatorExecutionError extends CoordinatorError {
  constructor(message: string, source: string) {
    super(message, 'EXECUTION_ERROR', source);
    this.name = 'CoordinatorExecutionError';
  }
}

export class CoordinatorTimeoutError extends CoordinatorError {
  constructor(message: string, source: string) {
    super(message, 'TIMEOUT_ERROR', source);
    this.name = 'CoordinatorTimeoutError';
  }
}

export class CoordinatorCancelledError extends CoordinatorError {
  constructor(message: string, source: string) {
    super(message, 'CANCELLED_ERROR', source);
    this.name = 'CoordinatorCancelledError';
  }
}

export class CoordinatorDependencyError extends CoordinatorError {
  constructor(message: string, source: string) {
    super(message, 'DEPENDENCY_ERROR', source);
    this.name = 'CoordinatorDependencyError';
  }
}

export class CoordinatorBatchError extends CoordinatorError {
  constructor(message: string, source: string) {
    super(message, 'BATCH_ERROR', source);
    this.name = 'CoordinatorBatchError';
  }
}

export class CoordinatorConcurrencyError extends CoordinatorError {
  constructor(message: string, source: string) {
    super(message, 'CONCURRENCY_ERROR', source);
    this.name = 'CoordinatorConcurrencyError';
  }
}

export class CoordinatorResourceLimitError extends CoordinatorError {
  constructor(message: string, source: string) {
    super(message, 'RESOURCE_LIMIT_ERROR', source);
    this.name = 'CoordinatorResourceLimitError';
  }
}

export class CoordinatorReservationError extends CoordinatorError {
  constructor(message: string, source: string) {
    super(message, 'RESERVATION_ERROR', source);
    this.name = 'CoordinatorReservationError';
  }
}

export class CoordinatorRecoveryError extends CoordinatorError {
  constructor(message: string, source: string) {
    super(message, 'RECOVERY_ERROR', source);
    this.name = 'CoordinatorRecoveryError';
  }
}
