/**
 * @module multi-agent-reasoning/application/dispatcher/CollaborationScheduler
 * @description Deterministic collaboration scheduling.
 */

import type { TaskDelegation } from '../../domain/collaboration/interfaces.js';

export class CollaborationScheduler {
  private queue: TaskDelegation[] = [];

  schedule(task: TaskDelegation): void {
    this.queue.push(task);
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  dequeue(): TaskDelegation | undefined {
    return this.queue.shift();
  }

  getQueueSize(): number {
    return this.queue.length;
  }
}
