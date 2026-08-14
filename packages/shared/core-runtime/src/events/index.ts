import type { IEventBus, EventEnvelope } from '../interfaces/events.js';
import { EventBusError } from '../errors.js';
import { Queue, Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { AgentXLoggerFactory } from '@agent-xai/shared';

const scopedKey = (orgId: string, topic: string): string => {
  if (!orgId?.trim()) throw new EventBusError('Organization context required');
  return `${orgId}:${topic}`;
};
const eventId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

export class InMemoryEventBus implements IEventBus {
  private handlers = new Map<string, Set<(e: EventEnvelope<unknown>) => Promise<void>>>();
  private processedEventIds = new Set<string>();
  private logger = new AgentXLoggerFactory().createLogger('core-runtime:event-bus');

  public async publish<T>(
    orgId: string,
    topic: string,
    payload: T,
    traceId: string,
    taskId?: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    const event: EventEnvelope<T> = {
      orgId,
      id: eventId(),
      topic,
      traceId,
      taskId,
      timestamp: new Date(),
      version: '1.0',
      sourceModule: 'core-runtime',
      payload,
      metadata,
    };
    await this.dispatch(scopedKey(orgId, topic), event);
  }
  public async subscribe<T>(
    orgId: string,
    topic: string,
    handler: (event: EventEnvelope<T>) => Promise<void>,
  ): Promise<void> {
    const key = scopedKey(orgId, topic);
    if (!this.handlers.has(key)) this.handlers.set(key, new Set());
    this.handlers.get(key)!.add(handler as (e: EventEnvelope<unknown>) => Promise<void>);
  }
  public async unsubscribe(orgId: string, topic: string): Promise<void> {
    this.handlers.delete(scopedKey(orgId, topic));
  }
  public async request<TReq, TRes>(
    orgId: string,
    topic: string,
    payload: TReq,
    traceId: string,
    timeoutMs = 5000,
  ): Promise<EventEnvelope<TRes>> {
    return new Promise((resolve, reject) => {
      const replyTopic = `${topic}.reply.${eventId()}`;
      const timeout = setTimeout(
        () => reject(new EventBusError(`Request timed out for topic ${topic}`)),
        timeoutMs,
      );
      void this.subscribe<TRes>(orgId, replyTopic, async (event) => {
        clearTimeout(timeout);
        await this.unsubscribe(orgId, replyTopic);
        resolve(event);
      });
      this.publish(orgId, topic, payload, traceId, undefined, { replyTo: replyTopic }).catch(
        reject,
      );
    });
  }
  public async reply<TReq, TRes>(
    orgId: string,
    topic: string,
    handler: (event: EventEnvelope<TReq>) => Promise<TRes>,
  ): Promise<void> {
    await this.subscribe<TReq>(orgId, topic, async (event) => {
      try {
        const response = await handler(event);
        const replyTo = event.metadata?.replyTo as string;
        if (replyTo) await this.publish(orgId, replyTo, response, event.traceId, event.taskId);
      } catch (e) {
        this.logger.error('Error handling reply', e instanceof Error ? e : new Error(String(e)));
      }
    });
  }
  public async broadcast<T>(
    orgId: string,
    topic: string,
    payload: T,
    traceId: string,
  ): Promise<void> {
    await this.publish(orgId, topic, payload, traceId);
  }
  private async dispatch<T>(key: string, event: EventEnvelope<T>): Promise<void> {
    if (this.processedEventIds.has(event.id)) return;
    this.processedEventIds.add(event.id);
    for (const handler of this.handlers.get(key) ?? []) {
      try {
        const promise = handler(event as EventEnvelope<unknown>);
        if (promise?.catch)
          promise.catch((err) =>
            this.logger.error(
              `Error in event handler for topic ${event.topic}`,
              err instanceof Error ? err : new Error(String(err)),
            ),
          );
      } catch (err) {
        this.logger.error(
          `Error in event handler for topic ${event.topic}`,
          err instanceof Error ? err : new Error(String(err)),
        );
      }
    }
  }
}

export class BullMQEventBus implements IEventBus {
  private redisConnection: Redis;
  private queues = new Map<string, Queue>();
  private workers = new Map<string, Worker>();
  private processedEventIds = new Set<string>();
  private logger = new AgentXLoggerFactory().createLogger('core-runtime:event-bus');
  constructor(redisUrl: string = process.env.REDIS_URL || 'redis://localhost:6379') {
    this.redisConnection = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
    } as unknown as Redis['options']) as Redis;
  }
  public async publish<T>(
    orgId: string,
    topic: string,
    payload: T,
    traceId: string,
    taskId?: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    const key = scopedKey(orgId, topic);
    if (!this.queues.has(key))
      this.queues.set(
        key,
        new Queue(key, { connection: this.redisConnection as unknown as Record<string, unknown> }),
      );
    const event: EventEnvelope<T> = {
      orgId,
      id: eventId(),
      topic,
      traceId,
      taskId,
      timestamp: new Date(),
      version: '1.0',
      sourceModule: 'core-runtime',
      payload,
      metadata,
    };
    await this.queues.get(key)!.add(key, event, { jobId: event.id });
  }
  public async subscribe<T>(
    orgId: string,
    topic: string,
    handler: (event: EventEnvelope<T>) => Promise<void>,
  ): Promise<void> {
    const key = scopedKey(orgId, topic);
    if (this.workers.has(key)) throw new EventBusError(`Already subscribed to topic ${topic}`);
    const worker = new Worker(
      key,
      async (job) => {
        const event = job.data as EventEnvelope<T>;
        if (this.processedEventIds.has(event.id)) return;
        this.processedEventIds.add(event.id);
        await handler(event);
      },
      { connection: this.redisConnection as unknown as Record<string, unknown> },
    );
    this.workers.set(key, worker);
  }
  public async unsubscribe(orgId: string, topic: string): Promise<void> {
    const key = scopedKey(orgId, topic);
    const worker = this.workers.get(key);
    if (worker) {
      await worker.close();
      this.workers.delete(key);
    }
  }
  public async request<TReq, TRes>(
    orgId: string,
    topic: string,
    payload: TReq,
    traceId: string,
    timeoutMs = 5000,
  ): Promise<EventEnvelope<TRes>> {
    const replyTopic = `${topic}.reply.${eventId()}`;
    return new Promise((resolve, reject) => {
      void (async () => {
        const timeout = setTimeout(() => {
          void this.unsubscribe(orgId, replyTopic);
          reject(new EventBusError(`Request timed out for topic ${topic}`));
        }, timeoutMs);
        try {
          await this.subscribe<TRes>(orgId, replyTopic, async (event) => {
            clearTimeout(timeout);
            await this.unsubscribe(orgId, replyTopic);
            resolve(event);
          });
          await this.publish(orgId, topic, payload, traceId, undefined, { replyTo: replyTopic });
        } catch (err) {
          reject(err);
        }
      })();
    });
  }
  public async reply<TReq, TRes>(
    orgId: string,
    topic: string,
    handler: (event: EventEnvelope<TReq>) => Promise<TRes>,
  ): Promise<void> {
    await this.subscribe<TReq>(orgId, topic, async (event) => {
      try {
        const response = await handler(event);
        const replyTo = event.metadata?.replyTo as string;
        if (replyTo) await this.publish(orgId, replyTo, response, event.traceId, event.taskId);
      } catch (e) {
        this.logger.error('Error handling reply', e instanceof Error ? e : new Error(String(e)));
      }
    });
  }
  public async broadcast<T>(
    orgId: string,
    topic: string,
    payload: T,
    traceId: string,
  ): Promise<void> {
    await this.publish(orgId, topic, payload, traceId);
  }
  public async close(): Promise<void> {
    for (const queue of this.queues.values()) await queue.close();
    for (const worker of this.workers.values()) await worker.close();
    await this.redisConnection.quit();
  }
}
