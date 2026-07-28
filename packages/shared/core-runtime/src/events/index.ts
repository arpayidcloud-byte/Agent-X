import type { IEventBus, EventEnvelope } from '../interfaces/events.js';
import { EventBusError } from '../errors.js';
import { Queue, Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { AgentXLoggerFactory } from '@agentx-fast/shared';

/**
 * In-memory implementation of IEventBus for testing and development.
 * Provides pub/sub, request/reply, and broadcast patterns.
 * @example
 * ```ts
 * const bus = new InMemoryEventBus();
 * await bus.subscribe('task.created', handler);
 * await bus.publish('task.created', task, traceId);
 * ```
 */
export class InMemoryEventBus implements IEventBus {
  private handlers = new Map<string, Set<(e: EventEnvelope<unknown>) => Promise<void>>>();
  private processedEventIds = new Set<string>();
  private logger = new AgentXLoggerFactory().createLogger('core-runtime:event-bus');

  /**
   * Publishes an event to a topic.
   * @param topic - Event topic to publish to
   * @param payload - Event payload data
   * @param traceId - Trace ID for distributed tracing
   * @param taskId - Optional task ID associated with the event
   * @param metadata - Optional metadata for the event
   */
  public async publish<T>(
    topic: string,
    payload: T,
    traceId: string,
    taskId?: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    const event: EventEnvelope<T> = {
      id: Math.random().toString(36).substring(2) + Date.now().toString(36),
      topic,
      traceId,
      taskId,
      timestamp: new Date(),
      version: '1.0',
      sourceModule: 'core-runtime',
      payload,
      metadata,
    };
    await this.dispatch(topic, event);
  }

  /**
   * Subscribes a handler to a topic.
   * @param topic - Topic to subscribe to
   * @param handler - Async handler function to process events
   */
  public async subscribe<T>(
    topic: string,
    handler: (event: EventEnvelope<T>) => Promise<void>,
  ): Promise<void> {
    if (!this.handlers.has(topic)) {
      this.handlers.set(topic, new Set());
    }
    this.handlers.get(topic)!.add(handler as (e: EventEnvelope<unknown>) => Promise<void>);
  }

  /**
   * Unsubscribes all handlers from a topic.
   * @param topic - Topic to unsubscribe from
   */
  public async unsubscribe(topic: string): Promise<void> {
    this.handlers.delete(topic);
  }

  /**
   * Sends a request and waits for a reply.
   * @param topic - Request topic
   * @param payload - Request payload
   * @param traceId - Trace ID for distributed tracing
   * @param timeoutMs - Timeout in milliseconds (default: 5000)
   * @returns Promise resolving to the reply event envelope
   * @throws EventBusError if request times out
   */
  public async request<TReq, TRes>(
    topic: string,
    payload: TReq,
    traceId: string,
    timeoutMs: number = 5000,
  ): Promise<EventEnvelope<TRes>> {
    return new Promise((resolve, reject) => {
      const replyTopic = `${topic}.reply.${Math.random().toString(36).substring(2)}`;
      const timeout = setTimeout(
        () => reject(new EventBusError(`Request timed out for topic ${topic}`)),
        timeoutMs,
      );

      void this.subscribe<TRes>(replyTopic, async (event) => {
        clearTimeout(timeout);
        await this.unsubscribe(replyTopic);
        resolve(event);
      });

      this.publish(topic, payload, traceId, undefined, { replyTo: replyTopic }).catch(reject);
    });
  }

  /**
   * Registers a handler that replies to requests on a topic.
   * @param topic - Request topic to handle
   * @param handler - Async handler that processes requests and returns responses
   */
  public async reply<TReq, TRes>(
    topic: string,
    handler: (event: EventEnvelope<TReq>) => Promise<TRes>,
  ): Promise<void> {
    await this.subscribe<TReq>(topic, async (event) => {
      try {
        const responsePayload = await handler(event);
        const replyTo = event.metadata?.replyTo as string;
        if (replyTo) {
          await this.publish(replyTo, responsePayload, event.traceId, event.taskId);
        }
      } catch (e) {
        this.logger.error('Error handling reply', e instanceof Error ? e : new Error(String(e)));
      }
    });
  }

  /**
   * Broadcasts an event to all subscribers of a topic.
   * @param topic - Topic to broadcast to
   * @param payload - Event payload
   * @param traceId - Trace ID for distributed tracing
   */
  public async broadcast<T>(topic: string, payload: T, traceId: string): Promise<void> {
    await this.publish(topic, payload, traceId);
  }

  private async dispatch<T>(topic: string, event: EventEnvelope<T>): Promise<void> {
    if (this.processedEventIds.has(event.id)) {
      return; // Deduplicate
    }
    this.processedEventIds.add(event.id);

    const topicHandlers = this.handlers.get(topic);
    if (topicHandlers) {
      for (const handler of topicHandlers as Set<(e: EventEnvelope<unknown>) => Promise<void>>) {
        try {
          const promise = handler(event as EventEnvelope<unknown>);
          if (promise && typeof (promise as Promise<void>).catch === 'function') {
            (promise as Promise<void>).catch((err: unknown) => {
              this.logger.error(
                `Error in event handler for topic ${topic}`,
                err instanceof Error ? err : new Error(String(err)),
              );
            });
          }
        } catch (err) {
          this.logger.error(
            `Error in event handler for topic ${topic}`,
            err instanceof Error ? err : new Error(String(err)),
          );
        }
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
    topic: string,
    payload: T,
    traceId: string,
    taskId?: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    if (!this.queues.has(topic)) {
      this.queues.set(
        topic,
        new Queue(topic, {
          connection: this.redisConnection as unknown as Record<string, unknown>,
        }),
      );
    }
    const queue = this.queues.get(topic)!;
    const event: EventEnvelope<T> = {
      id: Math.random().toString(36).substring(2) + Date.now().toString(36),
      topic,
      traceId,
      taskId,
      timestamp: new Date(),
      version: '1.0',
      sourceModule: 'core-runtime',
      payload,
      metadata,
    };
    await queue.add(topic, event, { jobId: event.id });
  }

  public async subscribe<T>(
    topic: string,
    handler: (event: EventEnvelope<T>) => Promise<void>,
  ): Promise<void> {
    if (this.workers.has(topic)) {
      throw new EventBusError(`Already subscribed to topic ${topic}`);
    }
    const worker = new Worker(
      topic,
      async (job) => {
        const event = job.data as EventEnvelope<T>;
        if (this.processedEventIds.has(event.id)) {
          return; // Deduplicate
        }
        this.processedEventIds.add(event.id);
        await handler(event);
      },
      { connection: this.redisConnection as unknown as Record<string, unknown> },
    );
    this.workers.set(topic, worker);
  }

  public async unsubscribe(topic: string): Promise<void> {
    const worker = this.workers.get(topic);
    if (worker) {
      await worker.close();
      this.workers.delete(topic);
    }
  }

  public async request<TReq, TRes>(
    topic: string,
    payload: TReq,
    traceId: string,
    timeoutMs: number = 5000,
  ): Promise<EventEnvelope<TRes>> {
    const replyTopic = `${topic}.reply.${Math.random().toString(36).substring(2)}`;
    return new Promise((resolve, reject) => {
      void (async () => {
        const timeout = setTimeout(() => {
          void (async () => {
            await this.unsubscribe(replyTopic);
            reject(new EventBusError(`Request timed out for topic ${topic}`));
          })();
        }, timeoutMs);

        try {
          await this.subscribe<TRes>(replyTopic, async (event) => {
            clearTimeout(timeout);
            await this.unsubscribe(replyTopic);
            resolve(event);
          });

          await this.publish(topic, payload, traceId, undefined, { replyTo: replyTopic });
        } catch (err) {
          reject(err);
        }
      })();
    });
  }

  public async reply<TReq, TRes>(
    topic: string,
    handler: (event: EventEnvelope<TReq>) => Promise<TRes>,
  ): Promise<void> {
    await this.subscribe<TReq>(topic, async (event) => {
      try {
        const responsePayload = await handler(event);
        const replyTo = event.metadata?.replyTo as string;
        if (replyTo) {
          await this.publish(replyTo, responsePayload, event.traceId, event.taskId);
        }
      } catch (e) {
        this.logger.error('Error handling reply', e instanceof Error ? e : new Error(String(e)));
      }
    });
  }

  public async broadcast<T>(topic: string, payload: T, traceId: string): Promise<void> {
    await this.publish(topic, payload, traceId);
  }

  public async close(): Promise<void> {
    for (const queue of this.queues.values() as IterableIterator<Queue>) {
      await queue.close();
    }
    for (const worker of this.workers.values() as IterableIterator<Worker>) {
      await worker.close();
    }
    await this.redisConnection.quit();
  }
}
