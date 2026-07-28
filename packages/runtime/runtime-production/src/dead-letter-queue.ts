/**
 * @module runtime-production/dead-letter-queue
 * @description Permanent storage for unprocessable execution messages.
 */

import type { QueueMessage } from './interfaces.js';

export class DeadLetterQueue {
  private messages: QueueMessage[] = [];

  send(msg: QueueMessage): void {
    this.messages.push(msg);
  }

  list(): QueueMessage[] {
    return [...this.messages];
  }

  size(): number {
    return this.messages.length;
  }

  clear(): void {
    this.messages = [];
  }
}
