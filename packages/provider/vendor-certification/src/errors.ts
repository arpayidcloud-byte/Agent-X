/**
 * @module vendor-certification/errors
 * @description Error classes for Vendor Certification.
 */

export class CertificationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly source: string,
  ) {
    super(message);
    this.name = 'CertificationError';
  }
}

export class ValidationError extends CertificationError {
  constructor(message: string, source: string) {
    super(message, 'VALIDATION_ERROR', source);
    this.name = 'ValidationError';
  }
}

export class SecurityError extends CertificationError {
  constructor(message: string, source: string) {
    super(message, 'SECURITY_ERROR', source);
    this.name = 'SecurityError';
  }
}

export class PerformanceError extends CertificationError {
  constructor(message: string, source: string) {
    super(message, 'PERFORMANCE_ERROR', source);
    this.name = 'PerformanceError';
  }
}

export class VersionMismatchError extends CertificationError {
  constructor(message: string, source: string) {
    super(message, 'VERSION_MISMATCH', source);
    this.name = 'VersionMismatchError';
  }
}

export class IntegrityError extends CertificationError {
  constructor(message: string, source: string) {
    super(message, 'INTEGRITY_ERROR', source);
    this.name = 'IntegrityError';
  }
}
