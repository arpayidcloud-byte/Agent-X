/**
 * @module approval/approval-store
 * @description In-memory approval store implementation.
 * Stores approval requests with state management.
 */

import type { IApprovalStore, ApprovalRequest, ApprovalState } from './interfaces.js';
import { ApprovalNotFoundError } from './errors.js';

/**
 * In-memory approval store
 */
export class InMemoryApprovalStore implements IApprovalStore {
  private requests = new Map<string, ApprovalRequest>();

  /** @inheritdoc */
  async store(request: ApprovalRequest): Promise<void> {
    this.requests.set(request.id, { ...request });
  }

  /** @inheritdoc */
  async retrieve(id: string): Promise<ApprovalRequest | undefined> {
    return this.requests.get(id);
  }

  /** @inheritdoc */
  async update(request: ApprovalRequest): Promise<void> {
    if (!this.requests.has(request.id)) {
      throw new ApprovalNotFoundError(request.id);
    }
    this.requests.set(request.id, { ...request });
  }

  /** @inheritdoc */
  async delete(id: string): Promise<void> {
    this.requests.delete(id);
  }

  /** @inheritdoc */
  async list(): Promise<ApprovalRequest[]> {
    return Array.from(this.requests.values());
  }

  /** @inheritdoc */
  async listByState(state: ApprovalState): Promise<ApprovalRequest[]> {
    return Array.from(this.requests.values()).filter((r) => r.state === state);
  }
}
