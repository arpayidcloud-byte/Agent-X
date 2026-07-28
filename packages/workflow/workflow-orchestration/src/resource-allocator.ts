/**
 * @module workflow-orchestration/resource-allocator
 * @description Resource allocation and tracking.
 */

import type { ResourceAllocation } from './interfaces.js';

export class ResourceAllocator {
  private allocations = new Map<string, ResourceAllocation>();

  allocate(type: string, capacity: number): ResourceAllocation {
    const res: ResourceAllocation = {
      id: `res-${Date.now()}`,
      type: type as ResourceAllocation['type'],
      capacity,
      used: 0,
      expiresAt: new Date(Date.now() + 300000),
    };
    this.allocations.set(res.id, res);
    return res;
  }

  release(id: string): void {
    this.allocations.delete(id);
  }

  getAllocations(): ResourceAllocation[] {
    return Array.from(this.allocations.values());
  }
}
