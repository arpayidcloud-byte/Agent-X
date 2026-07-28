/**
 * @module runtime-production/worker-registry
 * @description Registry for discovering and tracking active worker nodes.
 */

import type { WorkerMetadata } from './interfaces.js';
import { WorkerRegistryError } from './errors.js';

export class WorkerRegistry {
  private workers = new Map<string, WorkerMetadata>();

  register(worker: WorkerMetadata): void {
    if (this.workers.has(worker.id)) {
      throw new WorkerRegistryError(`Worker already registered: ${worker.id}`, 'worker-registry');
    }
    this.workers.set(worker.id, worker);
  }

  unregister(workerId: string): void {
    this.workers.delete(workerId);
  }

  heartbeat(workerId: string): void {
    const worker = this.workers.get(workerId);
    if (!worker) {
      throw new WorkerRegistryError(`Worker not found: ${workerId}`, 'worker-registry');
    }
    worker.lastHeartbeat = new Date();
  }

  getWorker(workerId: string): WorkerMetadata | undefined {
    return this.workers.get(workerId);
  }

  listWorkers(): WorkerMetadata[] {
    const threshold = 10000; // 10 seconds timeout
    const now = Date.now();

    // Purge expired workers
    for (const [id, worker] of this.workers.entries() as IterableIterator<
      [string, WorkerMetadata]
    >) {
      if (now - worker.lastHeartbeat.getTime() > threshold) {
        this.workers.delete(id);
      }
    }
    return Array.from(this.workers.values());
  }

  clear(): void {
    this.workers.clear();
  }
}
