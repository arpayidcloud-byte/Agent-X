/**
 * @module core-runtime/interfaces/scheduler
 * @description Scheduler, retry policy, and task repository interfaces for the AgentX runtime.
 */

import type { TaskModel } from './task.js';

/**
 * Defines a retry policy for failed tasks.
 *
 * @example
 * ```ts
 * const policy: IRetryPolicy = {
 *   type: 'exponential',
 *   maxAttempts: 5,
 *   initialDelayMs: 1000,
 *   backoffMultiplier: 2,
 *   maxDelayMs: 30000,
 *   calculateDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
 *   isRetryable: (err) => !(err instanceof FatalError),
 * };
 * ```
 */
export interface IRetryPolicy {
  /** The backoff strategy type */
  readonly type: 'exponential' | 'linear' | 'constant';
  /** Maximum number of retry attempts */
  readonly maxAttempts: number;
  /** Initial delay in milliseconds before the first retry */
  readonly initialDelayMs: number;
  /** Multiplier applied to the delay on each subsequent retry */
  readonly backoffMultiplier: number;
  /** Optional upper bound on the delay in milliseconds */
  readonly maxDelayMs?: number;

  /**
   * Calculate the delay in milliseconds for a given attempt number.
   *
   * @param attempt - The current attempt number (0-indexed)
   * @returns Delay in milliseconds
   */
  calculateDelay(attempt: number): number;

  /**
   * Determine whether an error is retryable.
   *
   * @param error - The error to evaluate
   * @returns `true` if the task should be retried, `false` otherwise
   */
  isRetryable(error: Error): boolean;
}

/**
 * Scheduler interface for managing the task execution queue.
 *
 * @example
 * ```ts
 * await scheduler.enqueue(task);
 * await scheduler.pause('task-123');
 * await scheduler.resume('task-123');
 * await scheduler.cancel('task-123', 'User requested cancellation');
 * ```
 */
export interface IScheduler {
  /**
   * Add a task to the execution queue.
   *
   * @param task - The task to enqueue
   */
  enqueue(task: TaskModel): Promise<void>;

  /**
   * Pause a running or queued task.
   *
   * @param taskId - ID of the task to pause
   */
  pause(taskId: string): Promise<void>;

  /**
   * Resume a paused task.
   *
   * @param taskId - ID of the task to resume
   */
  resume(taskId: string): Promise<void>;

  /**
   * Cancel a task.
   *
   * @param taskId - ID of the task to cancel
   * @param reason - Reason for cancellation
   */
  cancel(taskId: string, reason: string): Promise<void>;
}

/**
 * Repository interface for persisting and retrieving tasks.
 *
 * @example
 * ```ts
 * await repo.save(task);
 * const found = await repo.findById('task-123');
 * const children = await repo.findByRootId('task-root');
 * ```
 */
export interface ITaskRepository {
  /**
   * Persist a task (create or update).
   *
   * @param task - The task to save
   */
  save(task: TaskModel): Promise<void>;

  /**
   * Find a task by its unique identifier.
   *
   * @param id - The task ID to look up
   * @returns The task if found, otherwise `undefined`
   */
  findById(id: string): Promise<TaskModel | undefined>;

  /**
   * Find all tasks belonging to a root task.
   *
   * @param rootId - The root task ID
   * @returns Array of matching tasks
   */
  findByRootId(rootId: string): Promise<TaskModel[]>;

  /**
   * Retrieve all tasks.
   *
   * @returns Array of all tasks
   */
  getAll(): Promise<TaskModel[]>;
}

/**
 * Observer interface for reacting to task lifecycle changes.
 *
 * @example
 * ```ts
 * const observer: ITaskLifecycleObserver = {
 *   onStateChange: async (task, previous) => {
 *     console.log(`Task ${task.id}: ${previous} -> ${task.status}`);
 *   },
 * };
 * ```
 */
export interface ITaskLifecycleObserver {
  /**
   * Called when a task transitions to a new state.
   *
   * @param task - The task in its new state
   * @param previous - The previous state string
   */
  onStateChange(task: TaskModel, previous: string): Promise<void>;
}
