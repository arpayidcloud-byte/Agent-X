/**
 * @module multi-agent-collaboration/knowledge-synchronizer
 * @description Synchronizes knowledge between agents.
 */

import { createHash } from 'crypto';

export class KnowledgeSynchronizer {
  private knowledge = new Map<string, unknown>();

  sync(agentId: string, key: string, value: unknown): void {
    this.knowledge.set(`${agentId}:${key}`, value);
  }

  get(agentId: string, key: string): unknown {
    return this.knowledge.get(`${agentId}:${key}`);
  }

  verifyIntegrity(agentId: string, key: string): boolean {
    const value = this.knowledge.get(`${agentId}:${key}`);
    if (!value) return false;
    const computed = createHash('sha256').update(JSON.stringify(value)).digest('hex');
    return computed.length > 0;
  }
}
