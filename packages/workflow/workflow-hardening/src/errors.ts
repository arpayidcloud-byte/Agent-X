/**
 * @module workflow-hardening/errors
 * @description Error classes for workflow hardening.
 */

export class HardeningError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly source: string,
  ) {
    super(message);
    this.name = 'HardeningError';
  }
}

export class ReplayMismatchError extends HardeningError {
  constructor(message: string, source: string) {
    super(message, 'REPLAY_MISMATCH', source);
    this.name = 'ReplayMismatchError';
  }
}

export class CheckpointCorruptionError extends HardeningError {
  constructor(message: string, source: string) {
    super(message, 'CHECKPOINT_CORRUPTION', source);
    this.name = 'CheckpointCorruptionError';
  }
}

export class IntegrityError extends HardeningError {
  constructor(message: string, source: string) {
    super(message, 'INTEGRITY_ERROR', source);
    this.name = 'IntegrityError';
  }
}

export class CompensationError extends HardeningError {
  constructor(message: string, source: string) {
    super(message, 'COMPENSATION_ERROR', source);
    this.name = 'CompensationError';
  }
}

export class CertificationError extends HardeningError {
  constructor(message: string, source: string) {
    super(message, 'CERTIFICATION_ERROR', source);
    this.name = 'CertificationError';
  }
}

export class VersionRollbackError extends HardeningError {
  constructor(message: string, source: string) {
    super(message, 'VERSION_ROLLBACK_ERROR', source);
    this.name = 'VersionRollbackError';
  }
}
