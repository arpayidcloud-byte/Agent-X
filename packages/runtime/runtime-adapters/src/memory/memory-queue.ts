/**
 * @module runtime-adapters/memory/memory-queue
 * @description Reference in-memory queue provider.
 */

import type {
  IQueueProvider,
  ProviderMetadata,
  ProviderCapabilities,
  ProviderHealth,
  ProviderMetrics,
} from '../interfaces.js';

export class MemoryQueueProvider implements IQueueProvider {
  private queue = new Map<string, Array<{ id: string; payload: unknown; priority: number }>>();
  private total = 0;
  private successes = 0;
  private failures = 0;

  getMetadata(): ProviderMetadata {
    return {
      id: 'memory-queue',
      name: 'Memory Queue Provider',
      type: 'queue',
      version: '0.1.0',
    };
  }

  getCapabilities(): ProviderCapabilities {
    return { priorityQueue: true };
  }

  async healthCheck(): Promise<ProviderHealth> {
    return { healthy: true, latencyMs: 0, lastChecked: new Date(), status: 'ACTIVE' };
  }

  getMetrics(): ProviderMetrics {
    return {
      totalRequests: this.total,
      successfulRequests: this.successes,
      failedRequests: this.failures,
      averageLatencyMs: 0,
    };
  }

  async enqueue(topic: string, message: unknown, priority: number = 0): Promise<void> {
    this.total++;
    const msgs = this.queue.get(topic) || [];
    msgs.push({ id: `msg-${Date.now()}-${Math.random()}`, payload: message, priority });
    msgs.sort((a, b) => b.priority - a.priority);
    this.queue.set(topic, msgs);
    this.successes++;
  }

  async dequeue(topic: string): Promise<unknown> {
    const msgs = this.queue.get(topic) || [];
    const val = msgs.shift();
    this.queue.set(topic, msgs);
    return val?.payload;
  }

  async peek(topic: string): Promise<unknown> {
    const msgs = this.queue.get(topic) || [];
    return msgs[0]?.payload;
  }

  async ack(_topic: string, _messageId: string): Promise<void> {
    // Memory queue pops immediately on dequeue, no-op for now.
  }

  async retry(_topic: string, _messageId: string): Promise<void> {
    // Memory queue retry logic
  }

  async deadLetter(_topic: string, _messageId: string): Promise<void> {
    // Memory queue dead-letter
  }

  async getDepth(topic: string): Promise<number> {
    return (this.queue.get(topic) || []).length;
  }

  async purge(topic: string): Promise<void> {
    this.queue.delete(topic);
  }
}
