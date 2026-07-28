/**
 * @module workflow-orchestration/workflow-router
 * @description Routes tasks to correct execution components.
 */

import type { WorkflowTask } from './interfaces.js';

export class WorkflowRouter {
  route(task: WorkflowTask): string {
    if (task.type === 'agent') return 'agent-executor';
    if (task.type === 'tool') return 'tool-executor';
    if (task.type === 'workflow') return 'workflow-executor';
    return 'default-executor';
  }
}
