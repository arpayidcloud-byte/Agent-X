/**
 * @module core-runtime/interfaces/events
 * @description Event bus interfaces and types for the AgentX runtime.
 */

import type { TaskId } from './task.js';

/**
 * Envelope wrapping all events with metadata for tracing and idempotency.
 *
 * @typeParam T - The shape of the event payload
 *
 * @example
 * ```ts
 * const envelope: EventEnvelope<{ status: string }> = {
 *   id: 'evt-001',
 *   topic: 'task.state_changed',
 *   traceId: 'trace-abc',
 *   taskId: 'task-123',
 *   timestamp: new Date(),
 *   version: '1.0',
 *   sourceModule: 'scheduler',
 *   payload: { status: 'RUNNING' },
 * };
 * ```
 */
export interface EventEnvelope<T = unknown> {
  /** Unique event identifier for idempotency and deduplication */
  id: string;
  /** The topic this event belongs to */
  topic: string;
  /** Distributed tracing identifier */
  traceId: string;
  /** Associated task identifier (if applicable) */
  taskId?: TaskId;
  /** Timestamp when the event was created */
  timestamp: Date;
  /** Event schema version */
  version: string;
  /** Module that produced this event */
  sourceModule: string;
  /** The event payload data */
  payload: T;
  /** Optional additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Well-known event topics in the AgentX system.
 *
 * @example
 * ```ts
 * await eventBus.publish(EventTopic.TASK_CREATED, taskData, traceId);
 * ```
 */
export enum EventTopic {
  /** A new task has been created */
  TASK_CREATED = 'task.created',
  /** A task has been added to the queue */
  TASK_QUEUED = 'task.queued',
  /** A task has started execution */
  TASK_STARTED = 'task.started',
  /** A task has changed its lifecycle state */
  TASK_STATE_CHANGED = 'task.state_changed',
  /** A task is retrying after a failure */
  TASK_RETRYING = 'task.retrying',
  /** A task is waiting for user approval */
  TASK_WAITING_APPROVAL = 'task.waiting_approval',
  /** A task requires approval before proceeding */
  TASK_APPROVAL_REQUIRED = 'task.approval_required',
  /** An approval decision has been made */
  TASK_APPROVAL_RESOLVED = 'task.approval_resolved',
  /** A task is waiting for an external provider */
  TASK_WAITING_PROVIDER = 'task.waiting_provider',
  /** A task is waiting for a tool response */
  TASK_WAITING_TOOL = 'task.waiting_tool',
  /** A task has completed successfully */
  TASK_COMPLETED = 'task.completed',
  /** A task has failed */
  TASK_FAILED = 'task.failed',
  /** A task was cancelled */
  TASK_CANCELLED = 'task.cancelled',
  /** A tool has been invoked */
  TOOL_INVOKED = 'tool.invoked',
  /** A provider call has completed */
  PROVIDER_CALL_COMPLETED = 'provider.call_completed',
}

/**
 * Event bus interface for publishing, subscribing, and advanced routing of events.
 *
 * @example
 * ```ts
 * // Subscribe to task events
 * await eventBus.subscribe(EventTopic.TASK_COMPLETED, async (event) => {
 *   console.log('Task completed:', event.payload);
 * });
 *
 * // Publish an event
 * await eventBus.publish(EventTopic.TASK_CREATED, taskData, 'trace-abc', 'task-123');
 * ```
 */
export interface IEventBus {
  /**
   * Publish an event to a topic.
   *
   * @typeParam T - The shape of the event payload
   * @param topic - The topic to publish to
   * @param payload - The event payload
   * @param traceId - Distributed tracing identifier
   * @param taskId - Optional associated task identifier
   * @param metadata - Optional additional metadata
   */
  publish<T>(
    topic: string,
    payload: T,
    traceId: string,
    taskId?: TaskId,
    metadata?: Record<string, unknown>,
  ): Promise<void>;

  /**
   * Subscribe to events on a topic.
   *
   * @typeParam T - The shape of the event payload
   * @param topic - The topic to subscribe to
   * @param handler - Async callback invoked for each matching event
   */
  subscribe<T>(topic: string, handler: (event: EventEnvelope<T>) => Promise<void>): Promise<void>;

  /**
   * Unsubscribe from a topic, removing all handlers.
   *
   * @param topic - The topic to unsubscribe from
   */
  unsubscribe(topic: string): Promise<void>;

  /**
   * Send a request and wait for a correlated response (request/reply pattern).
   *
   * @typeParam TReq - Request payload type
   * @typeParam TRes - Response payload type
   * @param topic - The topic to send the request to
   * @param payload - The request payload
   * @param traceId - Distributed tracing identifier
   * @param timeoutMs - Optional timeout in milliseconds
   * @returns The response envelope
   * @throws Will throw if the timeout is exceeded
   */
  request<TReq, TRes>(
    topic: string,
    payload: TReq,
    traceId: string,
    timeoutMs?: number,
  ): Promise<EventEnvelope<TRes>>;

  /**
   * Register a handler to reply to requests on a topic.
   *
   * @typeParam TReq - Request payload type
   * @typeParam TRes - Response payload type
   * @param topic - The topic to listen for requests on
   * @param handler - Async callback that processes the request and returns a response
   */
  reply<TReq, TRes>(
    topic: string,
    handler: (event: EventEnvelope<TReq>) => Promise<TRes>,
  ): Promise<void>;

  /**
   * Broadcast an event to all subscribers without waiting for acknowledgement.
   *
   * @typeParam T - The shape of the event payload
   * @param topic - The topic to broadcast on
   * @param payload - The event payload
   * @param traceId - Distributed tracing identifier
   */
  broadcast<T>(topic: string, payload: T, traceId: string): Promise<void>;
}
