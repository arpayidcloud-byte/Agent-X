/**
 * @module workflow-orchestration/workflow-history
 * @description Immutable execution history tracking.
 */

import { createHash } from 'crypto';

export interface ExecutionRecord {
  workflowId: string;
  taskId: string;
  status: string;
  timestamp: Date;
  checksum: string;
}

export class WorkflowHistory {
  private records: ExecutionRecord[] = [];

  record(workflowId: string, taskId: string, status: string): void {
    const payload = JSON.stringify({ workflowId, taskId, status });
    const record: ExecutionRecord = {
      workflowId,
      taskId,
      status,
      timestamp: new Date(),
      checksum: createHash('sha256').update(payload).digest('hex'),
    };
    this.records.push(Object.freeze(record));
  }

  getAll(): ExecutionRecord[] {
    return [...this.records];
  }
}
