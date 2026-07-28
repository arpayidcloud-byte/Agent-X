/**
 * @module reasoning-framework/reasoning-scheduler
 * @description Manages task queue execution order.
 */

import { SchedulerError } from './errors.js';

export class ReasoningScheduler {
  private queue: string[] = [];

  schedule(taskId: string): void {
    if (this.queue.includes(taskId)) {
      throw new SchedulerError(`Task already scheduled: ${taskId}`, 'scheduler');
    }
    this.queue.push(taskId);
  }

  next(): string | undefined {
    return this.queue.shift();
  }
}
