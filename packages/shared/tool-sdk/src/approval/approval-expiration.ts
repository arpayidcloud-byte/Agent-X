/**
 * @module approval/approval-expiration
 * @description Approval expiration management.
 * Handles TTL checks and automatic expiration of approval requests.
 */

import type { ApprovalRequest, ExpirationCheckResult } from './interfaces.js';

/**
 * Checks if an approval request has expired
 * @param request - The approval request to check
 * @returns ExpirationCheckResult with time remaining
 */
export function checkExpiration(request: ApprovalRequest): ExpirationCheckResult {
  const now = Date.now();
  const expiresAt = request.expiresAt.getTime();
  const timeRemainingMs = expiresAt - now;

  return {
    requestId: request.id,
    isExpired: timeRemainingMs <= 0,
    timeRemainingMs: Math.max(0, timeRemainingMs),
  };
}

/**
 * Checks if an approval request is still valid (not expired and in waiting state)
 * @param request - The approval request to check
 * @returns true if the request is still valid
 */
export function isRequestValid(request: ApprovalRequest): boolean {
  if (request.state !== 'WAITING') {
    return false;
  }
  const check = checkExpiration(request);
  return !check.isExpired;
}

/**
 * Gets the remaining time in a human-readable format
 * @param timeRemainingMs - Time remaining in milliseconds
 * @returns Human-readable string (e.g., "14 minutes 30 seconds")
 */
export function formatTimeRemaining(timeRemainingMs: number): string {
  if (timeRemainingMs <= 0) {
    return 'Expired';
  }

  const minutes = Math.floor(timeRemainingMs / 60000);
  const seconds = Math.floor((timeRemainingMs % 60000) / 1000);

  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
  return `${seconds} second${seconds !== 1 ? 's' : ''}`;
}
