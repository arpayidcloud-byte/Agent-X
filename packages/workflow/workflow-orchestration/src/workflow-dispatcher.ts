/**
 * @module workflow-orchestration/workflow-dispatcher
 * @description Dispatches tasks to execution handlers.
 */

import type { WorkflowTask } from './interfaces.js';

export class WorkflowDispatcher {
  async dispatch(task: WorkflowTask): Promise<unknown> {
    return { taskId: task.id, status: 'dispatched', type: task.type };
  }
}
