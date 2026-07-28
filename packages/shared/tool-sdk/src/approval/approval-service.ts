/**
 * @module approval/approval-service
 * @description High-level approval service.
 * Provides a unified API for approval operations.
 */

import type {
  IApprovalEngine,
  IApprovalStore,
  ApprovalRequest,
  ApprovalResult,
  CreateApprovalRequestParams,
} from './interfaces.js';
import { ApprovalEngine } from './approval-engine.js';
import { InMemoryApprovalStore } from './approval-store.js';
import { createApprovalPolicy, isApprovalRequired } from './approval-policy.js';

/**
 * Approval service providing high-level API
 */
export class ApprovalService {
  private engine: IApprovalEngine;
  private store: IApprovalStore;

  constructor(store?: IApprovalStore) {
    this.store = store || new InMemoryApprovalStore();
    this.engine = new ApprovalEngine(this.store);
  }

  /**
   * Checks if approval is required for an operation
   * @param riskScore - Risk score (0-100)
   * @returns true if approval is required
   */
  isApprovalRequired(riskScore: number): boolean {
    const policy = createApprovalPolicy();
    return isApprovalRequired(riskScore, policy);
  }

  /**
   * Creates an approval request
   * @param params - Creation parameters
   * @returns ApprovalRequest
   */
  async createRequest(params: CreateApprovalRequestParams): Promise<ApprovalRequest> {
    return this.engine.createRequest(params);
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
    return this.engine.approve(requestId, operatorId, confirmed);
  }

  /**
   * Rejects a request
   * @param requestId - Request ID
   * @param operatorId - Operator ID
   * @param reason - Rejection reason
   * @returns ApprovalResult
   */
  async reject(requestId: string, operatorId: string, reason?: string): Promise<ApprovalResult> {
    return this.engine.reject(requestId, operatorId, reason);
  }

  /**
   * Cancels a request
   * @param requestId - Request ID
   * @param operatorId - Operator ID
   * @returns ApprovalResult
   */
  async cancel(requestId: string, operatorId: string): Promise<ApprovalResult> {
    return this.engine.cancel(requestId, operatorId);
  }

  /**
   * Gets a request by ID
   * @param requestId - Request ID
   * @returns ApprovalRequest or undefined
   */
  async getRequest(requestId: string): Promise<ApprovalRequest | undefined> {
    return this.engine.getRequest(requestId);
  }

  /**
   * Executes an approved request
   * @param requestId - Request ID
   */
  async execute(requestId: string): Promise<void> {
    return this.engine.execute(requestId);
  }

  /**
   * Gets the underlying engine
   * @returns IApprovalEngine
   */
  getEngine(): IApprovalEngine {
    return this.engine;
  }
}
