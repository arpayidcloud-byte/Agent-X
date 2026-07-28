/**
 * @module architecture-sdk/errors
 * @description Architecture SDK constraint errors.
 */

export class ArchitectureError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly source: string,
  ) {
    super(message);
    this.name = 'ArchitectureError';
  }
}

export class ValidationError extends ArchitectureError {
  constructor(message: string, source: string) {
    super(message, 'VALIDATION_ERROR', source);
    this.name = 'ValidationError';
  }
}

export class DependencyViolationError extends ArchitectureError {
  constructor(message: string, source: string) {
    super(message, 'DEPENDENCY_VIOLATION', source);
    this.name = 'DependencyViolationError';
  }
}

export class FrozenStateError extends ArchitectureError {
  constructor(message: string, source: string) {
    super(message, 'FROZEN_STATE_ERROR', source);
    this.name = 'FrozenStateError';
  }
}
