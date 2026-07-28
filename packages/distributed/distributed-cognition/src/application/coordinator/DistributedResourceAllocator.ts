import { createHash } from 'crypto';
import type { NodeRegistry } from '../../domain/node/NodeRegistry.js';

export interface ResourceAllocation {
  readonly allocationId: string;
  readonly nodeId: string;
  readonly resourceType: string;
  readonly amount: number;
  readonly allocatedAt: Date;
  readonly checksum: string;
}

export class DistributedResourceAllocator {
  private allocations = new Map<string, ResourceAllocation[]>();

  constructor(private nodeRegistry: NodeRegistry) {}

  allocate(nodeId: string, resourceType: string, amount: number): ResourceAllocation {
    const existing = this.nodeRegistry.get(nodeId);
    if (!existing) throw new Error(`Node not found: ${nodeId}`);

    const allocationId = `ra-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ allocationId, nodeId, resourceType, amount }))
      .digest('hex');
    const allocation: ResourceAllocation = Object.freeze({
      allocationId,
      nodeId,
      resourceType,
      amount,
      allocatedAt: new Date(),
      checksum,
    });

    const nodeAllocations = this.allocations.get(nodeId) || [];
    nodeAllocations.push(allocation);
    this.allocations.set(nodeId, nodeAllocations);
    return allocation;
  }

  getAllocations(nodeId: string): ResourceAllocation[] {
    return [...(this.allocations.get(nodeId) || [])];
  }

  release(allocationId: string, nodeId: string): boolean {
    const nodeAllocations = this.allocations.get(nodeId);
    if (!nodeAllocations) return false;
    const idx = nodeAllocations.findIndex((a) => a.allocationId === allocationId);
    if (idx >= 0) {
      nodeAllocations.splice(idx, 1);
      return true;
    }
    return false;
  }

  getTotalAllocated(nodeId: string, resourceType: string): number {
    const nodeAllocations = this.allocations.get(nodeId) || [];
    return nodeAllocations
      .filter((a) => a.resourceType === resourceType)
      .reduce((sum, a) => sum + a.amount, 0);
  }
}
