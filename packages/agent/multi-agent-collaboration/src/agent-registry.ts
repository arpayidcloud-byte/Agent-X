/**
 * @module multi-agent-collaboration/agent-registry
 * @description Agent registration and lifecycle management.
 */

import type { AgentRegistration, AgentMetadata } from './interfaces.js';
import { AgentError } from './errors.js';
import { createHash } from 'crypto';

export class AgentRegistry {
  private agents = new Map<string, AgentRegistration>();

  register(metadata: AgentMetadata): void {
    if (this.agents.has(metadata.id)) {
      throw new AgentError(`Agent already registered: ${metadata.id}`, 'agent-registry');
    }
    const payload = JSON.stringify(metadata);
    const reg: AgentRegistration = {
      agentId: metadata.id,
      metadata: { ...metadata, checksum: createHash('sha256').update(payload).digest('hex') },
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

  setBusy(agentId: string): void {
    const agent = this.agents.get(agentId);
    if (agent) agent.status = 'BUSY';
  }

  setIdle(agentId: string): void {
    const agent = this.agents.get(agentId);
    if (agent) agent.status = 'IDLE';
  }
}
