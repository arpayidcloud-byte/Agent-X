import type { CollaborationMessage } from '../../domain/collaboration/interfaces.js';

export interface QueuedMessage {
  readonly message: CollaborationMessage;
  readonly enqueuedAt: Date;
  readonly attempts: number;
  readonly checksum: string;
}

export class ReliableMessageQueue {
  private queue: QueuedMessage[] = [];
  private processed: QueuedMessage[] = [];
  private readonly maxAttempts: number;

  constructor(maxAttempts = 3) {
    this.maxAttempts = maxAttempts;
  }

  enqueue(message: CollaborationMessage): QueuedMessage {
    const checksum = JSON.stringify(message);
    const queued: QueuedMessage = Object.freeze({
      message,
      enqueuedAt: new Date(),
      attempts: 0,
      checksum,
    });
    this.queue.push(queued);
    return queued;
  }

  dequeue(): QueuedMessage | undefined {
    return this.queue.shift();
  }

  acknowledge(messageId: string): void {
    const idx = this.queue.findIndex((q) => q.message.messageId === messageId);
    if (idx >= 0) {
      const removed = this.queue.splice(idx, 1);
      if (removed.length > 0 && removed[0]) this.processed.push(removed[0]);
    }
  }

  requeue(messageId: string): boolean {
    const msg = this.queue.find((q) => q.message.messageId === messageId);
    if (!msg) return false;
    const idx = this.queue.indexOf(msg);
    if (msg.attempts >= this.maxAttempts) {
      this.queue.splice(idx, 1);
      return false;
    }
    const updated: QueuedMessage = {
      message: msg.message,
      enqueuedAt: msg.enqueuedAt,
      attempts: msg.attempts + 1,
      checksum: msg.checksum,
    };
    this.queue[idx] = Object.freeze(updated);
    return true;
  }

  size(): number {
    return this.queue.length;
  }

  getProcessed(): QueuedMessage[] {
    return [...this.processed];
  }

  getAll(): QueuedMessage[] {
    return [...this.queue];
  }
}
