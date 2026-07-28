/**
 * @module approval/errors
 * @description Error types for Approval & Execution Governance.
 */

import { ToolError } from '../errors/index.js';

/** Base error for approval engine */
export class ApprovalError extends ToolError {
  constructor(message: string, code: string) {
    super(message, code);
  }
}

/** Thrown when an approval request is not found */
export class ApprovalNotFoundError extends ApprovalError {
  constructor(requestId: string) {
    super(`Approval request not found: '${requestId}'`, 'APPROVAL_NOT_FOUND');
  }
}

/** Thrown when an approval request has already been processed */
export class ApprovalAlreadyProcessedError extends ApprovalError {
  constructor(requestId: string) {
    super(
      `Approval request '${requestId}' has already been processed`,
      'APPROVAL_ALREADY_PROCESSED',
    );
  }
}

/** Thrown when an approval request has expired */
export class ApprovalExpiredError extends ApprovalError {
  constructor(requestId: string) {
    super(`Approval request '${requestId}' has expired`, 'APPROVAL_EXPIRED');
  }
}

/** Thrown when an approval request has been cancelled */
export class ApprovalCancelledError extends ApprovalError {
  constructor(requestId: string) {
    super(`Approval request '${requestId}' has been cancelled`, 'APPROVAL_CANCELLED');
  }
}

/** Thrown when double confirmation is required but not provided */
export class ApprovalDoubleConfirmationRequiredError extends ApprovalError {
  constructor(requestId: string) {
    super(
      `Double confirmation required for approval request '${requestId}'`,
      'APPROVAL_DOUBLE_CONFIRMATION_REQUIRED',
    );
  }
}

/** Thrown when an approval token is invalid */
export class ApprovalTokenInvalidError extends ApprovalError {
  constructor(token: string) {
    super(`Invalid approval token: '${token}'`, 'APPROVAL_TOKEN_INVALID');
  }
}

/** Thrown when a replay attack is detected */
export class ApprovalReplayAttackError extends ApprovalError {
  constructor(requestId: string) {
    super(`Replay attack detected for approval request '${requestId}'`, 'APPROVAL_REPLAY_ATTACK');
  }
}

/** Thrown when a duplicate approval is detected */
export class ApprovalDuplicateError extends ApprovalError {
  constructor(requestId: string) {
    super(`Duplicate approval request '${requestId}'`, 'APPROVAL_DUPLICATE');
  }
}

/** Thrown when approval validation fails */
export class ApprovalValidationError extends ApprovalError {
  constructor(message: string) {
    super(message, 'APPROVAL_VALIDATION_ERROR');
  }
}

/** Thrown when approval execution fails */
export class ApprovalExecutionError extends ApprovalError {
  constructor(requestId: string, reason: string) {
    super(`Approval execution failed for '${requestId}': ${reason}`, 'APPROVAL_EXECUTION_FAILED');
  }
}

/** Thrown when approval service is unavailable */
export class ApprovalServiceUnavailableError extends ApprovalError {
  constructor(message: string = 'Approval service is unavailable') {
    super(message, 'APPROVAL_SERVICE_UNAVAILABLE');
  }
}
