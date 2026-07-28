/**
 * @module multi-agent-collaboration/message-router
 * @description Deterministic message routing between agents.
 */

import type { AgentMessage } from './interfaces.js';

export class MessageRouter {
  private inbox = new Map<string, AgentMessage[]>();

  route(message: AgentMessage): void {
    const existing = this.inbox.get(message.toAgentId) || [];
    existing.push(message);
    this.inbox.set(message.toAgentId, existing);
  }

  getInbox(agentId: string): AgentMessage[] {
    return [...(this.inbox.get(agentId) || [])];
  }

  clearInbox(agentId: string): void {
    this.inbox.delete(agentId);
  }
}
