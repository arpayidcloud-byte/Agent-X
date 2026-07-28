/**
 * @module workflow-orchestration/workflow-metadata
 * @description Immutable workflow metadata.
 */

import { createHash } from 'crypto';

export interface WorkflowMetadata {
  workflowId: string;
  goalId: string;
  version: number;
  createdAt: Date;
  checksum: string;
}

export class WorkflowMetadataManager {
  create(workflowId: string, goalId: string, version: number): WorkflowMetadata {
    const payload = JSON.stringify({ workflowId, goalId, version });
    return {
      workflowId,
      goalId,
      version,
      createdAt: new Date(),
      checksum: createHash('sha256').update(payload).digest('hex'),
    };
  }
}
