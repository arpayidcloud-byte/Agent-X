/**
 * @module multi-agent-collaboration/shared-memory-coordinator
 * @description Manages shared memory between agents.
 */

import type { SharedMemory } from './interfaces.js';
import { SharedMemoryError } from './errors.js';

export class SharedMemoryCoordinator {
  private memory = new Map<string, SharedMemory>();

  put(key: string, value: unknown, ownerAgentId: string): SharedMemory {
    const existing = this.memory.get(key);
    if (existing && existing.ownerAgentId !== ownerAgentId) {
      throw new SharedMemoryError(`Key ${key} owned by different agent`, 'shared-memory');
    }
    const mem: SharedMemory = {
      key,
      value,
      ownerAgentId,
      version: (existing?.version || 0) + 1,
      timestamp: new Date(),
    };
    this.memory.set(key, mem);
    return mem;
  }

  get(key: string): SharedMemory | undefined {
    return this.memory.get(key);
  }

  delete(key: string): void {
    this.memory.delete(key);
  }
}
