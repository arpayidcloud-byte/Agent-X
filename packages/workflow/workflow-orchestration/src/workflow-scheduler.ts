/**
 * @module workflow-orchestration/workflow-scheduler
 * @description Deterministic task scheduling.
 */

import type { WorkflowTask } from './interfaces.js';

export class WorkflowScheduler {
  private queue: WorkflowTask[] = [];

  schedule(task: WorkflowTask): void {
    this.queue.push(task);
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  dequeue(): WorkflowTask | undefined {
    return this.queue.shift();
  }

  getQueueSize(): number {
    return this.queue.length;
  }
}
