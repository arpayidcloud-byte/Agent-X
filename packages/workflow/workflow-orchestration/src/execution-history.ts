/**
 * @module workflow-orchestration/execution-history
 * @description Immutable execution history tracking.
 */

import { createHash } from 'crypto';

export interface ExecutionHistoryRecord {
  workflowId: string;
  goalId: string;
  status: string;
  timestamp: Date;
  checksum: string;
}

export class ExecutionHistory {
  private records: ExecutionHistoryRecord[] = [];

  record(workflowId: string, goalId: string, status: string): void {
    const payload = JSON.stringify({ workflowId, goalId, status });
    const record: ExecutionHistoryRecord = {
      workflowId,
      goalId,
      status,
      timestamp: new Date(),
      checksum: createHash('sha256').update(payload).digest('hex'),
    };
    this.records.push(Object.freeze(record));
  }

  getAll(): ExecutionHistoryRecord[] {
    return [...this.records];
  }
}
