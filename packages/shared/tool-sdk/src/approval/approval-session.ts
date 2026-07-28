/**
 * @module approval/approval-session
 * @description Approval session management.
 * Manages operator sessions for approval workflows.
 */

import type { ApprovalSession } from './interfaces.js';

/**
 * Generates a unique session ID
 * @returns Unique session ID string
 */
export function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `session-${timestamp}-${random}`;
}

/**
 * Creates a new approval session
 * @param operatorId - Operator who created the session
 * @param ttlMs - Session TTL in milliseconds (default: 30 minutes)
 * @returns New ApprovalSession
 */
export function createApprovalSession(
  operatorId: string,
  ttlMs: number = 30 * 60 * 1000,
): ApprovalSession {
  const now = new Date();
  return {
    id: generateSessionId(),
    operatorId,
    startedAt: now,
    expiresAt: new Date(now.getTime() + ttlMs),
    isActive: true,
    requestIds: [],
  };
}

/**
 * Checks if a session is still valid
 * @param session - The session to check
 * @returns true if the session is active and not expired
 */
export function isSessionValid(session: ApprovalSession): boolean {
  if (!session.isActive) return false;
  return Date.now() < session.expiresAt.getTime();
}

/**
 * Adds a request ID to a session
 * @param session - The session to update
 * @param requestId - The request ID to add
 * @returns Updated session
 */
export function addRequestToSession(session: ApprovalSession, requestId: string): ApprovalSession {
  return {
    ...session,
    requestIds: [...session.requestIds, requestId],
  };
}

/**
 * Deactivates a session
 * @param session - The session to deactivate
 * @returns Deactivated session
 */
export function deactivateSession(session: ApprovalSession): ApprovalSession {
  return {
    ...session,
    isActive: false,
  };
}
