/**
 * @module workflow-orchestration/workflow-queue
 * @description Task queue management.
 */

import type { WorkflowTask } from './interfaces.js';

export class WorkflowQueue {
  private queue: WorkflowTask[] = [];

  enqueue(task: WorkflowTask): void {
    this.queue.push(task);
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  dequeue(): WorkflowTask | undefined {
    return this.queue.shift();
  }

  size(): number {
    return this.queue.length;
  }

  cancel(taskId: string): boolean {
    const len = this.queue.length;
    this.queue = this.queue.filter((t) => t.id !== taskId);
    return this.queue.length < len;
  }
}
