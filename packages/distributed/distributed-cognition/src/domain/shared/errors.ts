/**
 * @module distributed-cognition/domain/shared/errors
 * @description Invariant violation error for internal API hardening.
 */

export class InvariantViolationError extends Error {
  public readonly code: string;
  public readonly source: string;

  constructor(message: string, code: string, source: string) {
    super(message);
    this.name = 'InvariantViolationError';
    this.code = code;
    this.source = source;
  }
}
