import { createHash } from 'crypto';
import type { NodeCapability } from './interfaces.js';

export interface NodeCapabilityEntry {
  readonly nodeId: string;
  readonly capabilities: readonly NodeCapability[];
  readonly checksum: string;
}

export class NodeCapabilityRegistry {
  private capabilities = new Map<string, NodeCapabilityEntry>();

  register(nodeId: string, capabilities: NodeCapability[]): void {
    const sorted = [...capabilities].sort((a, b) => b.weight - a.weight);
    const checksum = createHash('sha256')
      .update(JSON.stringify({ nodeId, capabilities: sorted }))
      .digest('hex');
    const entry: NodeCapabilityEntry = Object.freeze({ nodeId, capabilities: sorted, checksum });
    this.capabilities.set(nodeId, entry);
  }

  unregister(nodeId: string): void {
    this.capabilities.delete(nodeId);
  }

  getCapabilities(nodeId: string): NodeCapabilityEntry | undefined {
    return this.capabilities.get(nodeId);
  }

  findNodesWithCapability(capName: string): string[] {
    const result: string[] = [];
    for (const [nodeId, entry] of this.capabilities) {
      if (entry.capabilities.some((c: NodeCapability) => c.name === capName)) {
        result.push(nodeId);
      }
    }
    return result;
  }

  getAll(): NodeCapabilityEntry[] {
    return Array.from(this.capabilities.values());
  }
}
