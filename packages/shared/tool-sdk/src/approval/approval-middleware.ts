/**
 * @module approval/approval-middleware
 * @description Approval middleware for tool execution pipeline.
 * Integrates approval checks into the tool execution flow.
 */

import type { IApprovalMiddleware, ApprovalState } from './interfaces.js';
import type { IApprovalStore } from './interfaces.js';

/**
 * Approval middleware implementation
 */
export class ApprovalMiddleware implements IApprovalMiddleware {
  private store: IApprovalStore;

  constructor(store: IApprovalStore) {
    this.store = store;
  }

  /** @inheritdoc */
  isApprovalRequired(_category: string, riskScore: number): boolean {
    // Approval required for risk score >= 40
    return riskScore >= 40;
  }

  /** @inheritdoc */
  async getApprovalStatus(requestId: string): Promise<ApprovalState | undefined> {
    const request = await this.store.retrieve(requestId);
    return request?.state;
  }
}
