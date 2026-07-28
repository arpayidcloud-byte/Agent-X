/**
 * @module cognitive-kernel/kernel-scheduler
 * @description Schedules task execution in the cognitive loop.
 */

import { SchedulerError } from './errors.js';

export class KernelScheduler {
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
