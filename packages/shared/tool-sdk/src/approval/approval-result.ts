/**
 * @module approval/approval-result
 * @description Approval result creation and formatting.
 * Creates and formats approval results for consumption.
 */

import type { ApprovalRequest, ApprovalResult } from './interfaces.js';

/**
 * Creates a successful approval result
 * @param request - The approved request
 * @param doubleConfirmationRequired - Whether double confirmation was required
 * @returns ApprovalResult
 */
export function createSuccessResult(
  request: ApprovalRequest,
  doubleConfirmationRequired: boolean,
): ApprovalResult {
  return {
    approved: true,
    request,
    doubleConfirmationRequired,
    wasExpired: false,
    wasCancelled: false,
    message: 'Approval granted.',
  };
}

/**
 * Creates a rejection result
 * @param request - The rejected request
 * @param reason - Rejection reason
 * @returns ApprovalResult
 */
export function createRejectionResult(request: ApprovalRequest, reason?: string): ApprovalResult {
  return {
    approved: false,
    request,
    doubleConfirmationRequired: false,
    wasExpired: false,
    wasCancelled: false,
    message: reason || 'Approval rejected.',
  };
}

/**
 * Creates an expiration result
 * @param request - The expired request
 * @returns ApprovalResult
 */
export function createExpirationResult(request: ApprovalRequest): ApprovalResult {
  return {
    approved: false,
    request,
    doubleConfirmationRequired: false,
    wasExpired: true,
    wasCancelled: false,
    message: 'Approval request has expired.',
  };
}

/**
 * Creates a cancellation result
 * @param request - The cancelled request
 * @returns ApprovalResult
 */
export function createCancellationResult(request: ApprovalRequest): ApprovalResult {
  return {
    approved: false,
    request,
    doubleConfirmationRequired: false,
    wasExpired: false,
    wasCancelled: true,
    message: 'Approval cancelled.',
  };
}
