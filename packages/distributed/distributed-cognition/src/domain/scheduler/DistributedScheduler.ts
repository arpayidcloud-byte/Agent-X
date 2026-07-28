import { createHash } from 'crypto';
import type { DistributedTask, TaskState, SchedulePolicy } from './interfaces.js';

export class DistributedScheduler {
  private tasks = new Map<string, DistributedTask>();
  private policy: SchedulePolicy;

  constructor(
    policy: SchedulePolicy = { strategy: 'LEAST_LOADED', maxRetries: 3, timeoutMs: 30000 },
  ) {
    this.policy = Object.freeze({ ...policy });
  }

  enqueue(
    goalId: string,
    priority: number,
    metadata: Record<string, unknown> = {},
  ): DistributedTask {
    const taskId = `dt-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ taskId, goalId, priority }))
      .digest('hex');
    const task: DistributedTask = Object.freeze({
      taskId,
      goalId,
      assignedNode: null,
      priority,
      timeout: this.policy.timeoutMs,
      state: 'PENDING',
      createdAt: new Date(),
      metadata: { ...metadata },
      checksum,
    });
    this.tasks.set(taskId, task);
    return task;
  }

  assign(taskId: string, nodeId: string): DistributedTask {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task not found: ${taskId}`);
    if (task.state !== 'PENDING' && task.state !== 'SCHEDULED' && task.state !== 'EXECUTING') {
      throw new Error(`Task not in schedulable state: ${task.state}`);
    }
    const updated: DistributedTask = Object.freeze({
      ...task,
      assignedNode: nodeId,
      state: 'ASSIGNED',
    });
    this.tasks.set(taskId, updated);
    return updated;
  }

  transition(taskId: string, newState: TaskState): DistributedTask {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task not found: ${taskId}`);
    const updated: DistributedTask = Object.freeze({ ...task, state: newState });
    this.tasks.set(taskId, updated);
    return updated;
  }

  getTask(taskId: string): DistributedTask | undefined {
    return this.tasks.get(taskId);
  }

  getPendingTasks(): DistributedTask[] {
    return Array.from(this.tasks.values()).filter((t) => t.state === 'PENDING');
  }

  getTasksByNode(nodeId: string): DistributedTask[] {
    return Array.from(this.tasks.values()).filter((t) => t.assignedNode === nodeId);
  }

  getAll(): DistributedTask[] {
    return Array.from(this.tasks.values());
  }

  getPolicy(): SchedulePolicy {
    return this.policy;
  }
}
