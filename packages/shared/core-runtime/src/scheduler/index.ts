import type { IScheduler, ITaskRepository } from '../interfaces/scheduler.js';
import type { TaskModel } from '../interfaces/task.js';
import { TaskStatus } from '../interfaces/task.js';
import type { IEventBus } from '../interfaces/events.js';
import { EventTopic } from '../interfaces/events.js';
import { TaskStateMachine } from '../state-machine/index.js';
import { TaskNotFoundError, TenantContextError } from '../errors.js';
import { Tracer, Metrics } from '@agent-xai/observability';
import { AgentXLoggerFactory } from '@agent-xai/shared';
import type { AgentRegistry } from '../registry/agent-registry.js';

/**
 * Configuration options for the Scheduler.
 */
export interface SchedulerConfig {
  /** Maximum number of concurrent task graphs */
  maxConcurrentTaskGraphs?: number;
  /** Maximum number of parallel agent executions */
  maxParallelAgents?: number;
}

/**
 * Builds the tenant-scoped key used for all internal scheduler bookkeeping.
 * Keying by organization prevents a task ID from one organization colliding
 * with — or being controlled through — another organization's context.
 */
const tenantKey = (orgId: string, taskId: string): string => `${orgId}:${taskId}`;

/**
 * Asserts that an authenticated organization context is present.
 * @throws TenantContextError when the organization context is missing
 */
const assertOrgContext = (orgId: string): string => {
  const trimmed = (orgId ?? '').trim();
  if (!trimmed) throw new TenantContextError('Organization context required');
  return trimmed;
};

/**
 * Scheduler manages task execution lifecycle and agent dispatch.
 * Handles task queuing, state transitions, and concurrent execution limits.
 *
 * All public operations require an authenticated organization context, which
 * must be resolved server-side. Task payloads are never trusted as the source
 * of tenant identity.
 *
 * @example
 * ```ts
 * const scheduler = new Scheduler(eventBus, taskRepo, { maxParallelAgents: 10 });
 * await scheduler.enqueue('org-1', task);
 * ```
 */
export class Scheduler implements IScheduler {
  private inFlightTasks = new Map<string, TaskModel>();
  private pausedTasks = new Set<string>();
  private activeCount = 0;
  private maxParallel: number;
  private tracer = new Tracer('core-runtime-scheduler');
  private metrics = new Metrics();
  private logger = new AgentXLoggerFactory().createLogger('core-runtime:scheduler');
  private agentRegistry?: AgentRegistry;

  /**
   * Creates a new Scheduler instance.
   * @param eventBus - Event bus for async communication and event publishing
   * @param taskRepo - Task repository for persistence
   * @param config - Optional scheduler configuration
   * @param agentRegistry - Optional agent registry for task execution
   */
  constructor(
    private readonly eventBus: IEventBus,
    private readonly taskRepo: ITaskRepository,
    config: SchedulerConfig = {},
    agentRegistry?: AgentRegistry,
  ) {
    this.maxParallel = config.maxParallelAgents ?? 10;
    this.agentRegistry = agentRegistry;
  }

  /**
   * Sets the agent registry for task execution.
   * @param registry - Agent registry to use for executing tasks
   */
  public setAgentRegistry(registry: AgentRegistry): void {
    this.agentRegistry = registry;
  }

  /**
   * Enqueues a task for execution if it's in a valid initial state.
   * Transitions task to QUEUED status and triggers dispatch.
   * @param orgId - Authenticated organization context
   * @param task - Task to enqueue
   * @throws TenantContextError if the organization context is missing or the
   *   task already belongs to a different organization
   * @throws Error if task save or event publishing fails
   * @example
   * ```ts
   * await scheduler.enqueue('org-1', { id: 'task-1', status: TaskStatus.CREATED, ... });
   * ```
   */
  public async enqueue(orgId: string, task: TaskModel): Promise<void> {
    const org = assertOrgContext(orgId);
    const span = this.tracer.startSpan('scheduler-enqueue');
    span.setAttribute('task.id', task.id);
    span.setAttribute('task.status', task.status);
    try {
      if (task.orgId && task.orgId !== org) {
        throw new TenantContextError('Task organization mismatch');
      }

      if (
        task.status === TaskStatus.CREATED ||
        task.status === TaskStatus.FAILED ||
        task.status === TaskStatus.RETRYING
      ) {
        task = { ...TaskStateMachine.transition(task, TaskStatus.QUEUED), orgId: org };
        await this.taskRepo.save(org, task);
        await this.eventBus.publish(
          task.orgId ?? '',
          EventTopic.TASK_QUEUED,
          task,
          task.traceId,
          task.id,
        );

        this.inFlightTasks.set(tenantKey(org, task.id), task);
        this.metrics.counter('tasks_enqueued', 1, { status: task.status });
        await this.dispatch();
      }
      span.setStatus({ code: 0 });
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error(String(e));
      span.setStatus({ code: 1, message: error.message });
      throw error;
    } finally {
      span.end();
    }
  }

  /**
   * Pauses a running task, transitioning it to WAITING_APPROVAL status.
   * @param orgId - Authenticated organization context
   * @param taskId - ID of the task to pause
   * @throws TaskNotFoundError if the task doesn't exist in this organization
   */
  public async pause(orgId: string, taskId: string): Promise<void> {
    const org = assertOrgContext(orgId);
    const span = this.tracer.startSpan('scheduler-pause');
    span.setAttribute('task.id', taskId);
    try {
      const task = await this.taskRepo.findById(org, taskId);
      if (!task) throw new TaskNotFoundError(taskId);

      this.pausedTasks.add(tenantKey(org, taskId));
      if (task.status === TaskStatus.RUNNING) {
        task.status = TaskStatus.WAITING_APPROVAL;
        await this.taskRepo.save(org, task);
        await this.eventBus.publish(
          task.orgId ?? '',
          EventTopic.TASK_WAITING_APPROVAL,
          task,
          task.traceId,
          task.id,
        );
      }
      span.setStatus({ code: 0 });
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error(String(e));
      span.setStatus({ code: 1, message: error.message });
      throw error;
    } finally {
      span.end();
    }
  }

  /**
   * Resumes a paused task, transitioning it back to RUNNING status.
   * @param orgId - Authenticated organization context
   * @param taskId - ID of the task to resume
   * @throws TaskNotFoundError if the task doesn't exist in this organization
   */
  public async resume(orgId: string, taskId: string): Promise<void> {
    const org = assertOrgContext(orgId);
    const span = this.tracer.startSpan('scheduler-resume');
    span.setAttribute('task.id', taskId);
    try {
      const key = tenantKey(org, taskId);
      if (!this.pausedTasks.has(key)) return;
      this.pausedTasks.delete(key);

      const task = await this.taskRepo.findById(org, taskId);
      if (!task) throw new TaskNotFoundError(taskId);

      if (task.status === TaskStatus.WAITING_APPROVAL) {
        task.status = TaskStatus.RUNNING;
        await this.taskRepo.save(org, task);
        await this.eventBus.publish(
          task.orgId ?? '',
          EventTopic.TASK_STARTED,
          task,
          task.traceId,
          task.id,
        );
        await this.dispatch();
      }
      span.setStatus({ code: 0 });
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error(String(e));
      span.setStatus({ code: 1, message: error.message });
      throw error;
    } finally {
      span.end();
    }
  }

  /**
   * Cancels a task with the given reason.
   * @param orgId - Authenticated organization context
   * @param taskId - ID of the task to cancel
   * @param reason - Reason for cancellation
   * @throws TaskNotFoundError if the task doesn't exist in this organization
   */
  public async cancel(orgId: string, taskId: string, reason: string): Promise<void> {
    const org = assertOrgContext(orgId);
    const span = this.tracer.startSpan('scheduler-cancel');
    span.setAttribute('task.id', taskId);
    try {
      const task = await this.taskRepo.findById(org, taskId);
      if (!task) throw new TaskNotFoundError(taskId);

      task.cancellation = {
        reason,
        requestedBy: 'operator',
        timestamp: new Date(),
      };
      task.status = TaskStatus.CANCELLED;
      task.updatedAt = new Date();
      await this.taskRepo.save(org, task);
      await this.eventBus.publish(
        task.orgId ?? '',
        EventTopic.TASK_CANCELLED,
        task,
        task.traceId,
        task.id,
      );

      const key = tenantKey(org, taskId);
      this.inFlightTasks.delete(key);
      this.pausedTasks.delete(key);

      if (this.activeCount > 0) this.activeCount--;
      await this.dispatch();
      span.setStatus({ code: 0 });
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error(String(e));
      span.setStatus({ code: 1, message: error.message });
      throw error;
    } finally {
      span.end();
    }
  }

  private async dispatch(): Promise<void> {
    for (const [key, task] of this.inFlightTasks.entries() as IterableIterator<
      [string, TaskModel]
    >) {
      if (this.activeCount >= this.maxParallel) break;
      if (this.pausedTasks.has(key)) continue;

      const org = task.orgId;
      if (!org) continue;

      if (task.status === TaskStatus.QUEUED) {
        task.status = TaskStatus.RUNNING;
        this.activeCount++;
        await this.taskRepo.save(org, task);
        await this.eventBus.publish(
          task.orgId ?? '',
          EventTopic.TASK_STARTED,
          task,
          task.traceId,
          task.id,
        );

        // Execute agent if registry is configured
        if (this.agentRegistry && task.assignedAgentRole) {
          this.executeAgent(task).catch((err) => {
            this.failTask(org, task.id, err).catch((e) =>
              this.logger.error('Failed to fail task', e),
            );
          });
        }
      }
    }
  }

  private async executeAgent(task: TaskModel): Promise<void> {
    const span = this.tracer.startSpan('agent-execution');
    span.setAttribute('task.id', task.id);
    span.setAttribute('agent.role', task.assignedAgentRole || 'unknown');

    try {
      if (!this.agentRegistry) {
        throw new Error('Agent registry not configured');
      }

      const org = assertOrgContext(task.orgId ?? '');
      const role = task.assignedAgentRole || 'coder';
      const result = await this.agentRegistry.executeByRole(role, task, task.context);

      await this.completeTask(org, task.id, result);
      this.metrics.counter('agent_executions', 1, { role, status: 'success' });
      span.setStatus({ code: 0 });
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error(String(e));
      span.setStatus({ code: 1, message: error.message });
      this.metrics.counter('agent_executions', 1, { status: 'failure' });
      throw error;
    } finally {
      span.end();
    }
  }

  /**
   * Marks a task as completed with the given result.
   * @param orgId - Authenticated organization context
   * @param taskId - ID of the completed task
   * @param result - Task execution result
   */
  public async completeTask(orgId: string, taskId: string, result: unknown): Promise<void> {
    const org = assertOrgContext(orgId);
    const span = this.tracer.startSpan('scheduler-complete');
    span.setAttribute('task.id', taskId);
    try {
      const key = tenantKey(org, taskId);
      const task = this.inFlightTasks.get(key);
      if (!task) return;
      task.result = result as TaskModel['result'];
      task.status = TaskStatus.COMPLETED;
      task.updatedAt = new Date();
      await this.taskRepo.save(org, task);
      await this.eventBus.publish(
        task.orgId ?? '',
        EventTopic.TASK_COMPLETED,
        task,
        task.traceId,
        task.id,
      );

      this.inFlightTasks.delete(key);
      this.activeCount--;
      this.metrics.counter('tasks_completed', 1);
      await this.dispatch();
      span.setStatus({ code: 0 });
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error(String(e));
      span.setStatus({ code: 1, message: error.message });
      throw error;
    } finally {
      span.end();
    }
  }

  /**
   * Marks a task as failed with the given error.
   * @param orgId - Authenticated organization context
   * @param taskId - ID of the failed task
   * @param error - Error that caused the failure
   */
  public async failTask(orgId: string, taskId: string, error: unknown): Promise<void> {
    const org = assertOrgContext(orgId);
    const span = this.tracer.startSpan('scheduler-fail');
    span.setAttribute('task.id', taskId);
    try {
      const key = tenantKey(org, taskId);
      const task = this.inFlightTasks.get(key);
      if (!task) return;
      task.error = error as TaskModel['error'];
      task.status = TaskStatus.FAILED;
      task.updatedAt = new Date();
      await this.taskRepo.save(org, task);
      await this.eventBus.publish(
        task.orgId ?? '',
        EventTopic.TASK_FAILED,
        task,
        task.traceId,
        task.id,
      );

      this.inFlightTasks.delete(key);
      this.activeCount--;
      this.metrics.counter('tasks_failed', 1);
      await this.dispatch();
      span.setStatus({ code: 0 });
    } catch (e: unknown) {
      const err = e instanceof Error ? e : new Error(String(e));
      span.setStatus({ code: 1, message: err.message });
      throw err;
    } finally {
      span.end();
    }
  }

  /**
   * Retrieves a task by ID from in-flight tasks or repository, scoped to the
   * authenticated organization.
   * @param orgId - Authenticated organization context
   * @param taskId - ID of the task to retrieve
   * @returns Task model if found in this organization, undefined otherwise
   */
  public async getTask(orgId: string, taskId: string): Promise<TaskModel | undefined> {
    const org = assertOrgContext(orgId);
    const task = this.inFlightTasks.get(tenantKey(org, taskId));
    if (task) return task.orgId === org ? task : undefined;
    return this.taskRepo.findById(org, taskId);
  }
}
