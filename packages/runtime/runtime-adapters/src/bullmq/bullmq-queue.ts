import { Queue } from 'bullmq';
import { Redis } from 'ioredis';
import type {
  IQueueProvider,
  ProviderMetadata,
  ProviderCapabilities,
  ProviderHealth,
  ProviderMetrics,
} from '../interfaces.js';

export class BullMQProvider implements IQueueProvider {
  private queues = new Map<string, Queue>();
  private redis: Redis;
  private total = 0;
  private successes = 0;
  private failures = 0;

  constructor(redisUrl: string = process.env.REDIS_URL || 'redis://localhost:6379') {
    this.redis = new Redis(redisUrl, { maxRetriesPerRequest: null });
  }

  getMetadata(): ProviderMetadata {
    return {
      id: 'bullmq-queue',
      name: 'BullMQ Queue Provider',
      type: 'queue',
      version: '1.0.0',
    };
  }

  getCapabilities(): ProviderCapabilities {
    return { priorityQueue: true };
  }

  async healthCheck(): Promise<ProviderHealth> {
    try {
      await this.redis.ping();
      return { healthy: true, latencyMs: 1, lastChecked: new Date(), status: 'ACTIVE' };
    } catch (e) {
      return {
        healthy: false,
        latencyMs: 0,
        lastChecked: new Date(),
        status: 'DEGRADED',
        details: { error: String(e) },
      };
    }
  }

  getMetrics(): ProviderMetrics {
    return {
      totalRequests: this.total,
      successfulRequests: this.successes,
      failedRequests: this.failures,
      averageLatencyMs: 0,
    };
  }

  private getQueue(topic: string): Queue {
    let q = this.queues.get(topic);
    if (!q) {
      // @ts-expect-error - bullmq redis connection type mismatch
      q = new Queue(topic, { connection: this.redis });
      this.queues.set(topic, q);
    }
    return q;
  }

  async enqueue(topic: string, message: unknown, priority: number = 0): Promise<void> {
    this.total++;
    try {
      const q = this.getQueue(topic);
      const bullPriority = Math.max(1, 100 - priority);

      await q.add('job', message, {
        priority: bullPriority,
        jobId: `msg-${Date.now()}-${Math.random()}`,
      });
      this.successes++;
    } catch (e) {
      this.failures++;
      throw e;
    }
  }

  async dequeue(_topic: string): Promise<unknown> {
    throw new Error('dequeue() not natively supported by BullMQ push model. Use Workers.');
  }

  async peek(topic: string): Promise<unknown> {
    const q = this.getQueue(topic);
    const jobs = await q.getWaiting(0, 0);
    return jobs.length > 0 ? jobs[0]?.data : undefined;
  }

  async ack(_topic: string, _messageId: string): Promise<void> {
    // Ack happens automatically in BullMQ worker
  }

  async retry(topic: string, messageId: string): Promise<void> {
    const q = this.getQueue(topic);
    const job = await q.getJob(messageId);
    if (job) await job.retry();
  }

  async deadLetter(_topic: string, _messageId: string): Promise<void> {
    // Configured via removeOnFail options in BullMQ
  }

  async getDepth(topic: string): Promise<number> {
    const q = this.getQueue(topic);
    return await q.getWaitingCount();
  }

  async purge(topic: string): Promise<void> {
    const q = this.getQueue(topic);
    await q.obliterate();
  }
}
