/**
 * @module workflow-orchestration/workflow-recovery
 * @description Workflow execution recovery manager.
 */

import type { WorkflowCheckpointManager } from './workflow-checkpoint.js';

export class WorkflowRecoveryManager {
  constructor(private checkpointManager: WorkflowCheckpointManager) {}

  recover(workflowId: string): { restored: boolean; workflowId: string } {
    const cp = this.checkpointManager.load(workflowId);
    return { restored: !!cp, workflowId };
  }
}
