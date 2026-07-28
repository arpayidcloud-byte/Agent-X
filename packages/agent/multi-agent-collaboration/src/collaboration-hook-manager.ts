/**
 * @module multi-agent-collaboration/collaboration-hook-manager
 * @description Collaboration lifecycle hook execution.
 */

import type { CollaborationHook } from './interfaces.js';

export class CollaborationHookManager {
  private hooks: CollaborationHook[] = [];

  register(hook: CollaborationHook): void {
    this.hooks.push(hook);
  }

  async runBeforeCollaboration(sessionId: string): Promise<void> {
    for (const h of this.hooks) {
      if (h.beforeCollaboration) await h.beforeCollaboration(sessionId);
    }
  }

  async runAfterCollaboration(sessionId: string, result: unknown): Promise<void> {
    for (const h of this.hooks) {
      if (h.afterCollaboration) await h.afterCollaboration(sessionId, result);
    }
  }

  async runBeforeDelegation(taskId: string): Promise<void> {
    for (const h of this.hooks) {
      if (h.beforeDelegation) await h.beforeDelegation(taskId);
    }
  }

  async runAfterDelegation(taskId: string, result: unknown): Promise<void> {
    for (const h of this.hooks) {
      if (h.afterDelegation) await h.afterDelegation(taskId, result);
    }
  }

  async runBeforeConsensus(proposalId: string): Promise<void> {
    for (const h of this.hooks) {
      if (h.beforeConsensus) await h.beforeConsensus(proposalId);
    }
  }

  async runAfterConsensus(proposalId: string, approved: boolean): Promise<void> {
    for (const h of this.hooks) {
      if (h.afterConsensus) await h.afterConsensus(proposalId, approved);
    }
  }

  async runBeforeRecovery(sessionId: string): Promise<void> {
    for (const h of this.hooks) {
      if (h.beforeRecovery) await h.beforeRecovery(sessionId);
    }
  }

  async runAfterRecovery(sessionId: string): Promise<void> {
    for (const h of this.hooks) {
      if (h.afterRecovery) await h.afterRecovery(sessionId);
    }
  }
}
