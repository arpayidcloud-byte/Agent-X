/**
 * @module workflow-orchestration/workflow-priority
 * @description Deterministic priority assignment for workflow tasks.
 */

export class WorkflowPriorityEngine {
  assignPriority(taskType: string, basePriority: number): number {
    const priorityMap: Record<string, number> = {
      critical: 10,
      high: 8,
      medium: 5,
      low: 3,
      background: 1,
    };
    return priorityMap[taskType] || basePriority;
  }
}
