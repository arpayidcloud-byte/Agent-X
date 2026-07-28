import type { TaskMigration } from '../scheduler/interfaces.js';
import type { DistributedScheduler } from '../scheduler/DistributedScheduler.js';

export class DistributedTaskDispatcher {
  private migrations: TaskMigration[] = [];

  constructor(private scheduler: DistributedScheduler) {}

  dispatch(taskId: string, nodeId: string): void {
    this.scheduler.assign(taskId, nodeId);
    this.scheduler.transition(taskId, 'EXECUTING');
  }

  migrate(taskId: string, fromNode: string, toNode: string, reason: string): TaskMigration {
    const task = this.scheduler.getTask(taskId);
    if (!task) throw new Error(`Task not found: ${taskId}`);
    this.scheduler.assign(taskId, toNode);
    this.scheduler.transition(taskId, 'MIGRATED');
    const migration: TaskMigration = Object.freeze({
      taskId,
      fromNode,
      toNode,
      reason,
      timestamp: new Date(),
    });
    this.migrations.push(migration);
    return migration;
  }

  complete(taskId: string): void {
    this.scheduler.transition(taskId, 'COMPLETED');
  }

  fail(taskId: string): void {
    this.scheduler.transition(taskId, 'FAILED');
  }

  cancel(taskId: string): void {
    this.scheduler.transition(taskId, 'CANCELLED');
  }

  getMigrations(): TaskMigration[] {
    return [...this.migrations];
  }
}
