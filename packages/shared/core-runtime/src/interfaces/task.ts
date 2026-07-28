/**
 * @module core-runtime/interfaces/task
 * @description Task model and related types for the AgentX runtime.
 */

/**
 * Unique identifier type for tasks.
 */
export type TaskId = string;

/**
 * Represents the lifecycle status of a task.
 *
 * @example
 * ```ts
 * const status: TaskStatus = TaskStatus.RUNNING;
 * ```
 */
export enum TaskStatus {
  /** Task has been created but not yet queued */
  CREATED = 'CREATED',
  /** Task is queued and waiting to be processed */
  QUEUED = 'QUEUED',
  /** Task is being decomposed into subtasks */
  DECOMPOSING = 'DECOMPOSING',
  /** Task is in the planning phase */
  PLANNING = 'PLANNING',
  /** Task is currently being executed */
  RUNNING = 'RUNNING',
  /** Task is waiting for user approval */
  WAITING_APPROVAL = 'WAITING_APPROVAL',
  /** Task is waiting for an external provider */
  WAITING_PROVIDER = 'WAITING_PROVIDER',
  /** Task is waiting for a tool response */
  WAITING_TOOL = 'WAITING_TOOL',
  /** Task is retrying after a failure */
  RETRYING = 'RETRYING',
  /** Task has completed successfully */
  COMPLETED = 'COMPLETED',
  /** Task has failed */
  FAILED = 'FAILED',
  /** Task was cancelled */
  CANCELLED = 'CANCELLED',
}

/**
 * Priority levels for task scheduling.
 *
 * @example
 * ```ts
 * const priority: TaskPriority = TaskPriority.HIGH;
 * ```
 */
export enum TaskPriority {
  /** Low priority (0) */
  LOW = 0,
  /** Normal priority (1) */
  NORMAL = 1,
  /** High priority (2) */
  HIGH = 2,
  /** Critical priority (3) */
  CRITICAL = 3,
}

/**
 * Metadata associated with a task for tracking retries, providers, and tools.
 */
export interface TaskMetadata {
  /** Number of retry attempts made */
  retryCount: number;
  /** ID of the provider handling this task */
  providerId?: string;
  /** Name of the tool being used */
  toolName?: string;
  /** Additional arbitrary metadata */
  [key: string]: unknown;
}

/**
 * Runtime context for a task, including variables and conversation history.
 */
export interface TaskContext {
  /** Key-value variables available during task execution */
  variables: Record<string, unknown>;
  /** Conversation history entries */
  history: Array<{ role: string; content: unknown }>;
}

/**
 * Result produced by a completed task.
 */
export interface TaskResult {
  /** The output data of the task */
  output: unknown;
  /** Optional metadata about the result */
  metadata?: Record<string, unknown>;
}

/**
 * Error information when a task fails.
 */
export interface TaskError {
  /** Machine-readable error code */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Optional stack trace */
  stack?: string;
  /** Whether the task can be retried after this error */
  isRetryable: boolean;
}

/**
 * Information about a task cancellation request.
 */
export interface TaskCancellation {
  /** Reason for cancellation */
  reason: string;
  /** Identifier of the user or system that requested cancellation */
  requestedBy: string;
  /** Timestamp when cancellation was requested */
  timestamp: Date;
}

/**
 * Represents a task in the AgentX system.
 *
 * @example
 * ```ts
 * const task: TaskModel = {
 *   id: 'task-123',
 *   goal: 'Analyze code',
 *   status: TaskStatus.PENDING,
 *   priority: TaskPriority.HIGH,
 *   rootTaskId: 'task-123',
 *   dependsOn: [],
 *   traceId: 'trace-abc',
 *   metadata: { retryCount: 0 },
 *   context: { variables: {}, history: [] },
 *   createdAt: new Date(),
 *   updatedAt: new Date(),
 * };
 * ```
 */
export interface TaskModel {
  /** Unique identifier for the task */
  id: TaskId;
  /** The goal or objective of the task */
  goal: string;
  /** Current lifecycle status */
  status: TaskStatus;
  /** Priority level for scheduling */
  priority: TaskPriority;
  /** ID of the parent task (if this is a subtask) */
  parentTaskId?: TaskId;
  /** ID of the root task in the hierarchy */
  rootTaskId: TaskId;
  /** Role of the agent assigned to this task */
  assignedAgentRole?: string;
  /** IDs of tasks that must complete before this one */
  dependsOn: TaskId[];
  /** Distributed tracing identifier */
  traceId: string;
  /** Task metadata for tracking */
  metadata: TaskMetadata;
  /** Runtime context with variables and history */
  context: TaskContext;
  /** Result produced upon completion */
  result?: TaskResult;
  /** Error information if the task failed */
  error?: TaskError;
  /** Cancellation details if the task was cancelled */
  cancellation?: TaskCancellation;
  /** Timestamp when the task was created */
  createdAt: Date;
  /** Timestamp when the task was last updated */
  updatedAt: Date;
}
