import type { NodeMetadata, NodeRegistration, NodeStatus } from './interfaces.js';

export class NodeRegistry {
  private nodes = new Map<string, NodeRegistration>();

  register(metadata: NodeMetadata): void {
    if (this.nodes.has(metadata.nodeId)) {
      throw new Error(`Node already registered: ${metadata.nodeId}`);
    }
    const reg: NodeRegistration = {
      metadata: { ...metadata },
      registeredAt: new Date(),
      lastHeartbeat: new Date(),
      status: 'ACTIVE',
      currentLoad: 0,
    };
    this.nodes.set(metadata.nodeId, Object.freeze(reg));
  }

  unregister(nodeId: string): void {
    this.nodes.delete(nodeId);
  }

  get(nodeId: string): NodeRegistration | undefined {
    return this.nodes.get(nodeId);
  }

  getAll(): NodeRegistration[] {
    return Array.from(this.nodes.values());
  }

  setStatus(nodeId: string, status: NodeStatus): void {
    const node = this.nodes.get(nodeId);
    if (!node) throw new Error(`Node not found: ${nodeId}`);
    const updated: NodeRegistration = { ...node, status };
    this.nodes.set(nodeId, Object.freeze(updated));
  }

  updateHeartbeat(nodeId: string): void {
    const node = this.nodes.get(nodeId);
    if (!node) throw new Error(`Node not found: ${nodeId}`);
    const updated: NodeRegistration = { ...node, lastHeartbeat: new Date(), status: 'ACTIVE' };
    this.nodes.set(nodeId, Object.freeze(updated));
  }

  findNodesByCapability(capability: string): NodeRegistration[] {
    return this.getAll().filter((n) => n.metadata.capabilities.includes(capability));
  }
}
