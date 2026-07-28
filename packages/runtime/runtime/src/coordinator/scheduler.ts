/**
 * @module coordinator/scheduler
 * @description Scheduler for ordering, batching, and queuing execution tickets.
 */

import type { ExecutionTicket, ExecutionSchedule, ExecutionBatch } from './interfaces.js';

export class ExecutionScheduler {
  private queue: ExecutionTicket[] = [];
  private batches: Map<string, ExecutionBatch> = new Map();

  schedule(ticket: ExecutionTicket): ExecutionSchedule {
    this.queue.push(ticket);
    this.queue.sort((a, b) => b.priority - a.priority); // Highest priority first
    return {
      ticketId: ticket.id,
      scheduledAt: new Date(),
      estimatedDurationMs: 1000,
      priority: ticket.priority,
    };
  }

  dequeue(): ExecutionTicket | undefined {
    return this.queue.shift();
  }

  peek(): ExecutionTicket | undefined {
    return this.queue[0];
  }

  cancel(ticketId: string): boolean {
    const initialLength = this.queue.length;
    this.queue = this.queue.filter((t) => t.id !== ticketId);
    return this.queue.length < initialLength;
  }

  createBatch(tickets: ExecutionTicket[]): ExecutionBatch {
    const batch: ExecutionBatch = {
      id: `batch-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      tickets,
      status: 'PENDING',
    };
    this.batches.set(batch.id, batch);
    return batch;
  }

  completeBatch(batchId: string): void {
    const batch = this.batches.get(batchId);
    if (batch) {
      batch.status = 'COMPLETED';
    }
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  clear(): void {
    this.queue = [];
    this.batches.clear();
  }
}
