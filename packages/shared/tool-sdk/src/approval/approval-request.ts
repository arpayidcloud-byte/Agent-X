/**
 * @module approval/approval-request
 * @description Approval request creation and management.
 * Creates and manages approval requests with proper state transitions.
 */

import type { ApprovalRequest, ApprovalState, CreateApprovalRequestParams } from './interfaces.js';
import { classifyRiskLevel, createApprovalPolicy } from './approval-policy.js';

/**
 * Generates a unique approval request ID
 * @returns Unique ID string
 */
export function generateRequestId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `approval-${timestamp}-${random}`;
}

/**
 * Creates a new approval request from parameters
 * @param params - Creation parameters
 * @returns New ApprovalRequest
 */
export function createApprovalRequest(params: CreateApprovalRequestParams): ApprovalRequest {
  const policy = createApprovalPolicy();
  const id = generateRequestId();
  const riskLevel = params.riskLevel || classifyRiskLevel(params.riskScore);
  const ttlMs = params.ttlMs || policy.defaultTtlMs;
  const now = new Date();

  return {
    id,
    category: params.category,
    operation: params.operation,
    riskScore: params.riskScore,
    riskLevel,
    state: 'WAITING',
    requiresDoubleConfirmation:
      params.riskScore >= policy.doubleConfirmationThreshold && policy.requireDoubleConfirmation,
    firstConfirmationGiven: false,
    taskId: params.taskId,
    traceId: params.traceId,
    agentRole: params.agentRole,
    createdAt: now,
    expiresAt: new Date(now.getTime() + ttlMs),
    ttlMs,
    metadata: params.metadata,
  };
}

/**
 * Updates an approval request state
 * @param request - Current request
 * @param newState - New state
 * @param updates - Additional updates
 * @returns Updated request
 */
export function updateApprovalRequest(
  request: ApprovalRequest,
  newState: ApprovalState,
  updates: Partial<ApprovalRequest> = {},
): ApprovalRequest {
  return {
    ...request,
    ...updates,
    state: newState,
  };
}

/**
 * Checks if a request can transition to a new state
 * @param current - Current state
 * @param next - Target state
 * @returns true if transition is valid
 */
export function canTransition(current: ApprovalState, next: ApprovalState): boolean {
  const validTransitions: Record<ApprovalState, ApprovalState[]> = {
    WAITING: ['APPROVED', 'REJECTED', 'EXPIRED', 'CANCELLED'],
    APPROVED: ['EXECUTED'],
    REJECTED: [],
    EXPIRED: [],
    CANCELLED: [],
    EXECUTED: [],
  };

  return validTransitions[current]?.includes(next) ?? false;
}
