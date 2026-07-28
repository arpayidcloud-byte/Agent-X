/**
 * @module workflow-orchestration/workflow-checkpoint
 * @description Immutable workflow checkpoint management.
 */

import type { WorkflowCheckpoint } from './interfaces.js';
import { createHash } from 'crypto';

export class WorkflowCheckpointManager {
  private checkpoints = new Map<string, WorkflowCheckpoint>();

  save(workflowId: string, taskStates: Record<string, string>): WorkflowCheckpoint {
    const payload = JSON.stringify(taskStates);
    const cp: WorkflowCheckpoint = {
      id: `wcp-${Date.now()}`,
      workflowId,
      taskStates: { ...taskStates },
      timestamp: new Date(),
      checksum: createHash('sha256').update(payload).digest('hex'),
    };
    this.checkpoints.set(workflowId, cp);
    return cp;
  }

  load(workflowId: string): WorkflowCheckpoint | undefined {
    return this.checkpoints.get(workflowId);
  }
}
