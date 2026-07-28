import type { NodeMetadata, NodeRegistration } from './interfaces.js';
import type { NodeRegistry } from './NodeRegistry.js';

export class NodeDiscoveryEngine {
  private knownNodes = new Map<string, NodeRegistration>();

  constructor(private registry: NodeRegistry) {}

  discover(region: string): NodeMetadata[] {
    return this.registry
      .getAll()
      .filter((n) => n.status === 'ACTIVE' && n.metadata.region === region)
      .map((n) => n.metadata);
  }

  discoverByCapability(capability: string): NodeMetadata[] {
    return this.registry.findNodesByCapability(capability).map((n) => n.metadata);
  }

  registerDiscovered(metadata: NodeMetadata): void {
    const existing = this.knownNodes.get(metadata.nodeId);
    if (!existing) {
      this.knownNodes.set(metadata.nodeId, {
        metadata: { ...metadata },
        registeredAt: new Date(),
        lastHeartbeat: new Date(),
        status: 'ACTIVE',
        currentLoad: 0,
      });
      this.register(metadata);
    }
  }

  private register(metadata: NodeMetadata): void {
    const existing = this.registry.get(metadata.nodeId);
    if (!existing) {
      this.registry.register(metadata);
    }
  }

  getKnownNodes(): NodeRegistration[] {
    return Array.from(this.knownNodes.values());
  }

  pruneStale(thresholdMs: number): string[] {
    const now = Date.now();
    const pruned: string[] = [];
    for (const [nodeId, node] of this.knownNodes as Iterable<[string, NodeRegistration]>) {
      if (now - node.lastHeartbeat.getTime() >= thresholdMs) {
        this.knownNodes.delete(nodeId);
        pruned.push(nodeId);
      }
    }
    return pruned;
  }
}
