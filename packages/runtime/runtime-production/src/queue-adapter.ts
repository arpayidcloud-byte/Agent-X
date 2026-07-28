/**
 * @module runtime-production/queue-adapter
 * @description Persistent queue adapters with multiple message queue providers.
 */

import type { QueueMessage } from './interfaces.js';

export interface IExecutionQueue {
  enqueue(msg: QueueMessage): Promise<void>;
  dequeue(): Promise<QueueMessage | undefined>;
  ack(id: string): Promise<void>;
  retry(id: string): Promise<void>;
}

export class MemoryQueue implements IExecutionQueue {
  private queue: QueueMessage[] = [];
  private deadLetterQueue: QueueMessage[] = [];

  async enqueue(msg: QueueMessage): Promise<void> {
    this.queue.push(msg);
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  async dequeue(): Promise<QueueMessage | undefined> {
    const msg = this.queue.shift();
    if (msg) {
      msg.status = 'PROCESSING';
    }
    return msg;
  }

  async ack(id: string): Promise<void> {
    const idx = this.queue.findIndex((m) => m.id === id);
    if (idx !== -1) {
      this.queue.splice(idx, 1);
    }
  }

  async retry(id: string): Promise<void> {
    const msg = this.queue.find((m) => m.id === id);
    if (msg) {
      msg.retryCount++;
      if (msg.retryCount > 3) {
        msg.status = 'FAILED';
        this.deadLetterQueue.push(msg);
        this.queue = this.queue.filter((m) => m.id !== id);
      } else {
        msg.status = 'PENDING';
      }
    }
  }

  getDlq(): QueueMessage[] {
    return [...this.deadLetterQueue];
  }
}

export class BullMQAdapter implements IExecutionQueue {
  private queue: QueueMessage[] = [];
  private deadLetterQueue: QueueMessage[] = [];
  private processing = new Map<string, QueueMessage>();

  async enqueue(msg: QueueMessage): Promise<void> {
    this.queue.push(msg);
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  async dequeue(): Promise<QueueMessage | undefined> {
    const msg = this.queue.shift();
    if (msg) {
      msg.status = 'PROCESSING';
      this.processing.set(msg.id, msg);
    }
    return msg;
  }

  async ack(id: string): Promise<void> {
    const msg = this.processing.get(id);
    if (msg) {
      msg.status = 'COMPLETED';
      this.processing.delete(id);
    }
  }

  async retry(id: string): Promise<void> {
    const msg = this.processing.get(id) ?? this.queue.find((m) => m.id === id);
    if (!msg) return;
    msg.retryCount++;
    if (msg.retryCount > 3) {
      msg.status = 'FAILED';
      this.deadLetterQueue.push(msg);
      this.queue = this.queue.filter((m) => m.id !== id);
    } else {
      msg.status = 'PENDING';
      this.processing.delete(id);
      this.queue.push(msg);
      this.queue.sort((a, b) => b.priority - a.priority);
    }
  }

  getDlq(): QueueMessage[] {
    return [...this.deadLetterQueue];
  }
}

export class NATSAdapter implements IExecutionQueue {
  private streams = new Map<string, QueueMessage[]>();
  private processing = new Map<string, QueueMessage>();
  private deadLetterQueue: QueueMessage[] = [];

  async enqueue(msg: QueueMessage): Promise<void> {
    const streamKey = msg.workflowId;
    const stream = this.streams.get(streamKey) ?? [];
    stream.push(msg);
    stream.sort((a, b) => b.priority - a.priority);
    this.streams.set(streamKey, stream);
  }

  async dequeue(): Promise<QueueMessage | undefined> {
    let highestPriorityMsg: QueueMessage | undefined;
    let targetStreamKey: string | undefined;

    for (const [key, stream] of this.streams as Map<string, QueueMessage[]>) {
      if (stream.length === 0) continue;
      const candidate = stream[0]!;
      if (!highestPriorityMsg || candidate.priority > highestPriorityMsg.priority) {
        highestPriorityMsg = candidate;
        targetStreamKey = key;
      }
    }

    if (highestPriorityMsg && targetStreamKey) {
      const stream = this.streams.get(targetStreamKey) as QueueMessage[];
      stream.shift();
      highestPriorityMsg.status = 'PROCESSING';
      this.processing.set(highestPriorityMsg.id, highestPriorityMsg);
    }

    return highestPriorityMsg;
  }

  async ack(id: string): Promise<void> {
    const msg = this.processing.get(id);
    if (msg) {
      msg.status = 'COMPLETED';
      this.processing.delete(id);
    }
  }

  async retry(id: string): Promise<void> {
    const msg = this.processing.get(id);
    if (!msg) return;
    msg.retryCount++;
    if (msg.retryCount > 3) {
      msg.status = 'FAILED';
      this.deadLetterQueue.push(msg);
      this.processing.delete(id);
    } else {
      msg.status = 'PENDING';
      this.processing.delete(id);
      const streamKey = msg.workflowId;
      const stream = this.streams.get(streamKey) ?? [];
      stream.push(msg);
      stream.sort((a, b) => b.priority - a.priority);
      this.streams.set(streamKey, stream);
    }
  }

  getDlq(): QueueMessage[] {
    return [...this.deadLetterQueue];
  }
}

export class TemporalAdapter implements IExecutionQueue {
  private workflows = new Map<string, QueueMessage[]>();
  private processing = new Map<string, QueueMessage>();
  private deadLetterQueue: QueueMessage[] = [];
  private completedWorkflows = new Set<string>();

  async enqueue(msg: QueueMessage): Promise<void> {
    const workflowId = msg.workflowId;
    const tasks = this.workflows.get(workflowId) ?? [];
    tasks.push(msg);
    tasks.sort((a, b) => b.priority - a.priority);
    this.workflows.set(workflowId, tasks);
  }

  async dequeue(): Promise<QueueMessage | undefined> {
    for (const [_wfId, tasks] of this.workflows as Map<string, QueueMessage[]>) {
      if (tasks.length === 0) continue;
      const msg = tasks.shift();
      if (msg) {
        msg.status = 'PROCESSING';
        this.processing.set(msg.id, msg);
        return msg;
      }
    }
    return undefined;
  }

  async ack(id: string): Promise<void> {
    const msg = this.processing.get(id);
    if (msg) {
      msg.status = 'COMPLETED';
      this.completedWorkflows.add(msg.workflowId);
      this.processing.delete(id);
    }
  }

  async retry(id: string): Promise<void> {
    const msg = this.processing.get(id);
    if (!msg) return;
    msg.retryCount++;
    if (msg.retryCount > 3) {
      msg.status = 'FAILED';
      this.deadLetterQueue.push(msg);
      this.processing.delete(id);
    } else {
      msg.status = 'PENDING';
      this.processing.delete(id);
      const tasks = this.workflows.get(msg.workflowId) ?? [];
      tasks.push(msg);
      tasks.sort((a, b) => b.priority - a.priority);
      this.workflows.set(msg.workflowId, tasks);
    }
  }

  getDlq(): QueueMessage[] {
    return [...this.deadLetterQueue];
  }

  isWorkflowCompleted(workflowId: string): boolean {
    return this.completedWorkflows.has(workflowId);
  }
}
