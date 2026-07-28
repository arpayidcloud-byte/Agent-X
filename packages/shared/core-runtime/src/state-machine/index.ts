import type { TaskModel } from '../interfaces/task.js';
import { TaskStatus } from '../interfaces/task.js';
import { IllegalStateTransitionError } from '../errors.js';

export class TaskStateMachine {
  private static readonly validTransitions: Record<TaskStatus, Set<TaskStatus>> = {
    [TaskStatus.CREATED]: new Set([TaskStatus.QUEUED, TaskStatus.CANCELLED]),
    [TaskStatus.QUEUED]: new Set([
      TaskStatus.DECOMPOSING,
      TaskStatus.PLANNING,
      TaskStatus.RUNNING,
      TaskStatus.CANCELLED,
    ]),
    [TaskStatus.DECOMPOSING]: new Set([
      TaskStatus.PLANNING,
      TaskStatus.FAILED,
      TaskStatus.CANCELLED,
    ]),
    [TaskStatus.PLANNING]: new Set([TaskStatus.RUNNING, TaskStatus.FAILED, TaskStatus.CANCELLED]),
    [TaskStatus.RUNNING]: new Set([
      TaskStatus.WAITING_APPROVAL,
      TaskStatus.WAITING_PROVIDER,
      TaskStatus.WAITING_TOOL,
      TaskStatus.COMPLETED,
      TaskStatus.FAILED,
      TaskStatus.CANCELLED,
    ]),
    [TaskStatus.WAITING_APPROVAL]: new Set([
      TaskStatus.RUNNING,
      TaskStatus.FAILED,
      TaskStatus.CANCELLED,
    ]),
    [TaskStatus.WAITING_PROVIDER]: new Set([
      TaskStatus.RUNNING,
      TaskStatus.FAILED,
      TaskStatus.RETRYING,
      TaskStatus.CANCELLED,
    ]),
    [TaskStatus.WAITING_TOOL]: new Set([
      TaskStatus.RUNNING,
      TaskStatus.FAILED,
      TaskStatus.RETRYING,
      TaskStatus.CANCELLED,
    ]),
    [TaskStatus.RETRYING]: new Set([
      TaskStatus.QUEUED,
      TaskStatus.RUNNING,
      TaskStatus.FAILED,
      TaskStatus.CANCELLED,
    ]),
    [TaskStatus.COMPLETED]: new Set([]), // Terminal
    [TaskStatus.FAILED]: new Set([TaskStatus.QUEUED]), // Can be manually retried from UI
    [TaskStatus.CANCELLED]: new Set([]), // Terminal
  };

  public static canTransition(current: TaskStatus, next: TaskStatus): boolean {
    const allowed = this.validTransitions[current];
    return allowed ? allowed.has(next) : false;
  }

  public static transition(task: TaskModel, next: TaskStatus): TaskModel {
    if (!this.canTransition(task.status, next)) {
      throw new IllegalStateTransitionError(task.id, task.status, next);
    }
    task.status = next;
    task.updatedAt = new Date();
    return task;
  }
}
