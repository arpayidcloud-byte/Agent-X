import type { CollaborationMessage } from '../../domain/collaboration/interfaces.js';

export type MessageHandler = (message: CollaborationMessage) => void;

export class InterNodeMessageBus {
  private handlers = new Map<string, MessageHandler[]>();
  private deadLetterQueue: CollaborationMessage[] = [];

  publish(message: CollaborationMessage): void {
    const handlers = this.handlers.get(message.toNode) || [];
    if (handlers.length === 0) {
      this.deadLetterQueue.push(Object.freeze({ ...message }));
      return;
    }
    for (const handler of handlers) {
      handler(message);
    }
  }

  subscribe(nodeId: string, handler: MessageHandler): void {
    const current = this.handlers.get(nodeId) || [];
    this.handlers.set(nodeId, [...current, handler]);
  }

  unsubscribe(nodeId: string): void {
    this.handlers.delete(nodeId);
  }

  getDeadLetterQueue(): CollaborationMessage[] {
    return [...this.deadLetterQueue];
  }

  clearDeadLetterQueue(): void {
    this.deadLetterQueue = [];
  }

  getSubscribers(nodeId: string): number {
    return (this.handlers.get(nodeId) || []).length;
  }
}
