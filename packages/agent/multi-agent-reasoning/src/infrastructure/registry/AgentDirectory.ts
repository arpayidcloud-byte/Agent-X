/**
 * @module multi-agent-reasoning/infrastructure/registry/AgentDirectory
 * @description Agent capability and slot management.
 */

import type {
  AgentDirectoryEntry,
  CapabilityMatch,
} from '../../domain/collaboration/interfaces.js';

export class AgentDirectory {
  private entries = new Map<string, AgentDirectoryEntry>();

  register(agentId: string, capabilities: string[], priority: number, slots: number): void {
    this.entries.set(agentId, {
      agentId,
      capabilities,
      priority,
      availableSlots: slots,
      currentLoad: 0,
    });
  }

  unregister(agentId: string): void {
    this.entries.delete(agentId);
  }

  allocate(agentId: string): boolean {
    const entry = this.entries.get(agentId);
    if (!entry || entry.availableSlots <= entry.currentLoad) return false;
    entry.currentLoad++;
    return true;
  }

  release(agentId: string): void {
    const entry = this.entries.get(agentId);
    if (entry && entry.currentLoad > 0) entry.currentLoad--;
  }

  discover(requiredCapabilities: string[]): CapabilityMatch {
    const matchedAgents: string[] = [];
    for (const [agentId, entry] of this.entries as Iterable<[string, AgentDirectoryEntry]>) {
      if (
        requiredCapabilities.every((cap: string) =>
          (entry as AgentDirectoryEntry).capabilities.includes(cap),
        )
      ) {
        matchedAgents.push(agentId as string);
      }
    }
    return {
      requiredCapabilities,
      availableCapabilities: Array.from(new Set(this.getAllCapabilities())),
      matchScore: matchedAgents.length > 0 ? 100 : 0,
      matchedAgents,
    };
  }

  getAllCapabilities(): string[] {
    const caps = new Set<string>();
    for (const entry of this.entries.values() as Iterable<AgentDirectoryEntry>) {
      entry.capabilities.forEach((c: string) => caps.add(c));
    }
    return Array.from(caps);
  }
}
