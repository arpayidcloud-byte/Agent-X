/**
 * @module provider-release/errors
 * @description Release validation and certification errors.
 */

export class ReleaseError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly source: string,
  ) {
    super(message);
    this.name = 'ReleaseError';
  }
}

export class IncompatibleVersionError extends ReleaseError {
  constructor(message: string, source: string) {
    super(message, 'INCOMPATIBLE_VERSION', source);
    this.name = 'IncompatibleVersionError';
  }
}

export class BreakingChangeError extends ReleaseError {
  constructor(message: string, source: string) {
    super(message, 'BREAKING_CHANGE', source);
    this.name = 'BreakingChangeError';
  }
}

export class CertificationFailedError extends ReleaseError {
  constructor(message: string, source: string) {
    super(message, 'CERTIFICATION_FAILED', source);
    this.name = 'CertificationFailedError';
  }
}

export class RegistryError extends ReleaseError {
  constructor(message: string, source: string) {
    super(message, 'REGISTRY_ERROR', source);
    this.name = 'RegistryError';
  }
}
