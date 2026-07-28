/**
 * @module approval/approval-manager
 * @description Approval manager for coordinating approval workflows.
 * Manages approval sessions, expiration checks, and lifecycle.
 */

import type {
  ApprovalRequest,
  ApprovalResult,
  ApprovalSession,
  CreateApprovalRequestParams,
} from './interfaces.js';
import { ApprovalService } from './approval-service.js';
import {
  createApprovalSession,
  isSessionValid,
  addRequestToSession,
  deactivateSession,
} from './approval-session.js';

/**
 * Approval manager coordinating the full approval workflow
 */
export class ApprovalManager {
  private service: ApprovalService;
  private sessions = new Map<string, ApprovalSession>();

  constructor() {
    this.service = new ApprovalService();
  }

  /**
   * Creates an approval request within a session
   * @param params - Creation parameters
   * @param operatorId - Operator ID for the session
   * @returns ApprovalRequest
   */
  async createRequest(
    params: CreateApprovalRequestParams,
    operatorId: string,
  ): Promise<ApprovalRequest> {
    // Get or create session
    let session = this.getActiveSession(operatorId);
    if (!session) {
      session = createApprovalSession(operatorId);
      this.sessions.set(session.id, session);
    }

    // Create the request
    const request = await this.service.createRequest(params);

    // Add to session
    const updatedSession = addRequestToSession(session, request.id);
    this.sessions.set(session.id, updatedSession);

    return request;
  }

  /**
   * Approves a request
   * @param requestId - Request ID
   * @param operatorId - Operator ID
   * @param confirmed - Whether double confirmation is given
   * @returns ApprovalResult
   */
  async approve(
    requestId: string,
    operatorId: string,
    confirmed?: boolean,
  ): Promise<ApprovalResult> {
    return this.service.approve(requestId, operatorId, confirmed);
  }

  /**
   * Rejects a request
   * @param requestId - Request ID
   * @param operatorId - Operator ID
   * @param reason - Rejection reason
   * @returns ApprovalResult
   */
  async reject(requestId: string, operatorId: string, reason?: string): Promise<ApprovalResult> {
    return this.service.reject(requestId, operatorId, reason);
  }

  /**
   * Cancels a request
   * @param requestId - Request ID
   * @param operatorId - Operator ID
   * @returns ApprovalResult
   */
  async cancel(requestId: string, operatorId: string): Promise<ApprovalResult> {
    return this.service.cancel(requestId, operatorId);
  }

  /**
   * Checks for expired requests
   * @returns Array of expired request IDs
   */
  async checkExpirations(): Promise<string[]> {
    const expired: string[] = [];

    // Check all waiting requests for expiration
    for (const session of this.sessions.values() as IterableIterator<ApprovalSession>) {
      if (!isSessionValid(session as ApprovalSession)) {
        // Deactivate expired sessions
        const deactivated = deactivateSession(session as ApprovalSession);
        this.sessions.set((session as ApprovalSession).id, deactivated);
      }
    }

    return expired;
  }

  /**
   * Gets the active session for an operator
   * @param operatorId - Operator ID
   * @returns Active session or undefined
   */
  private getActiveSession(operatorId: string): ApprovalSession | undefined {
    for (const session of this.sessions.values() as IterableIterator<ApprovalSession>) {
      if (
        (session as ApprovalSession).operatorId === operatorId &&
        isSessionValid(session as ApprovalSession)
      ) {
        return session as ApprovalSession;
      }
    }
    return undefined;
  }

  /**
   * Gets the underlying service
   * @returns ApprovalService
   */
  getService(): ApprovalService {
    return this.service;
  }
}
