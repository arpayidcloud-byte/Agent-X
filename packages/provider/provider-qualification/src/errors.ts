/**
 * @module provider-qualification/errors
 * @description Qualification framework errors.
 */

export class QualificationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly source: string,
  ) {
    super(message);
    this.name = 'QualificationError';
  }
}

export class ContractValidationError extends QualificationError {
  constructor(message: string, source: string) {
    super(message, 'CONTRACT_VALIDATION_ERROR', source);
    this.name = 'ContractValidationError';
  }
}

export class CompatibilityValidationError extends QualificationError {
  constructor(message: string, source: string) {
    super(message, 'COMPATIBILITY_VALIDATION_ERROR', source);
    this.name = 'CompatibilityValidationError';
  }
}

export class QualificationRegistryError extends QualificationError {
  constructor(message: string, source: string) {
    super(message, 'REGISTRY_ERROR', source);
    this.name = 'QualificationRegistryError';
  }
}
