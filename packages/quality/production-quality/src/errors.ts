/**
 * @module production-quality/errors
 * @description Error classes for Production Quality Hardening.
 */

export class QualityError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly source: string,
  ) {
    super(message);
    this.name = 'QualityError';
  }
}

export class QualityGateError extends QualityError {
  constructor(message: string, source: string) {
    super(message, 'QUALITY_GATE_ERROR', source);
    this.name = 'QualityGateError';
  }
}

export class DeterministicError extends QualityError {
  constructor(message: string, source: string) {
    super(message, 'DETERMINISTIC_ERROR', source);
    this.name = 'DeterministicError';
  }
}

export class ResourceValidationError extends QualityError {
  constructor(message: string, source: string) {
    super(message, 'RESOURCE_VALIDATION_ERROR', source);
    this.name = 'ResourceValidationError';
  }
}

export class DependencyError extends QualityError {
  constructor(message: string, source: string) {
    super(message, 'DEPENDENCY_ERROR', source);
    this.name = 'DependencyError';
  }
}
