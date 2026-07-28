/**
 * @module reasoning-algorithms/errors
 * @description Error classes for reasoning algorithms.
 */

export class AlgorithmError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly source: string,
  ) {
    super(message);
    this.name = 'AlgorithmError';
  }
}

export class CyclicDependencyError extends AlgorithmError {
  constructor(message: string, source: string) {
    super(message, 'CYCLIC_DEPENDENCY', source);
    this.name = 'CyclicDependencyError';
  }
}

export class IntegrityError extends AlgorithmError {
  constructor(message: string, source: string) {
    super(message, 'INTEGRITY_ERROR', source);
    this.name = 'IntegrityError';
  }
}

export class OutOfRangeConfidenceError extends AlgorithmError {
  constructor(message: string, source: string) {
    super(message, 'OUT_OF_RANGE_CONFIDENCE', source);
    this.name = 'OutOfRangeConfidenceError';
  }
}
