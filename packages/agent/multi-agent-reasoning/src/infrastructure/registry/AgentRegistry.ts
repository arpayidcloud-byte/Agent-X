/**
 * @module multi-agent-reasoning/infrastructure/registry/AgentRegistry
 * @description Agent registration and lifecycle management.
 */

import type { AgentMetadata, AgentRegistration } from '../../domain/collaboration/interfaces.js';
import { AgentError } from '../../domain/collaboration/errors.js';

export class AgentRegistry {
  private agents = new Map<string, AgentRegistration>();

  register(metadata: AgentMetadata): void {
    if (this.agents.has(metadata.id)) {
      throw new AgentError(`Agent already registered: ${metadata.id}`, 'agent-registry');
    }
    const reg: AgentRegistration = {
      agentId: metadata.id,
      metadata: { ...metadata },
      registeredAt: new Date(),
      lastHeartbeat: new Date(),
      status: 'ACTIVE',
    };
    this.agents.set(metadata.id, reg);
  }

  unregister(agentId: string): void {
    this.agents.delete(agentId);
  }

  heartbeat(agentId: string): void {
    const agent = this.agents.get(agentId);
    if (!agent) throw new AgentError(`Agent not found: ${agentId}`, 'agent-registry');
    agent.lastHeartbeat = new Date();
    agent.status = 'ACTIVE';
  }

  get(agentId: string): AgentRegistration | undefined {
    return this.agents.get(agentId);
  }

  list(): AgentRegistration[] {
    return Array.from(this.agents.values());
  }
}
