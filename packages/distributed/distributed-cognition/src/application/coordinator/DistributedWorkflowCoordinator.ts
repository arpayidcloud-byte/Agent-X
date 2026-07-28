import { createHash } from 'crypto';
import type { DistributedScheduler } from '../../domain/scheduler/DistributedScheduler.js';
import type { DistributedTaskDispatcher } from '../../domain/task/DistributedTaskDispatcher.js';
import type { NodeRegistry } from '../../domain/node/NodeRegistry.js';
import type { DistributedTask } from '../../domain/scheduler/interfaces.js';

export interface WorkflowPlan {
  readonly planId: string;
  readonly goalId: string;
  readonly taskCount: number;
  readonly estimatedNodes: number;
  readonly checksum: string;
}

export class DistributedWorkflowCoordinator {
  constructor(
    private scheduler: DistributedScheduler,
    private dispatcher: DistributedTaskDispatcher,
    private nodeRegistry: NodeRegistry,
  ) {}

  plan(goalId: string, taskCount: number): WorkflowPlan {
    const planId = `dwf-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const activeNodes = this.nodeRegistry.getAll().filter((n) => n.status === 'ACTIVE');
    const checksum = createHash('sha256')
      .update(JSON.stringify({ planId, goalId, taskCount }))
      .digest('hex');
    return Object.freeze({
      planId,
      goalId,
      taskCount,
      estimatedNodes: activeNodes.length,
      checksum,
    });
  }

  scheduleTasks(goalId: string, taskCount: number): DistributedTask[] {
    const tasks: DistributedTask[] = [];
    for (let i = 0; i < taskCount; i++) {
      tasks.push(this.scheduler.enqueue(goalId, i));
    }
    return tasks;
  }

  assignTasks(taskIds: string[], nodeId: string): void {
    for (const taskId of taskIds) {
      this.dispatcher.dispatch(taskId, nodeId);
    }
  }

  completeTasks(taskIds: string[]): void {
    for (const taskId of taskIds) {
      this.dispatcher.complete(taskId);
    }
  }

  failTasks(taskIds: string[]): void {
    for (const taskId of taskIds) {
      this.dispatcher.fail(taskId);
    }
  }
}
