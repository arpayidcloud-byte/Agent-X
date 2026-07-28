/**
 * @module workflow-orchestration/decision-log
 * @description Immutable decision logging.
 */

import { createHash } from 'crypto';

export interface DecisionRecord {
  id: string;
  workflowId: string;
  decision: string;
  timestamp: Date;
  checksum: string;
}

export class DecisionLog {
  private records: DecisionRecord[] = [];

  log(workflowId: string, decision: string): void {
    const payload = JSON.stringify({ workflowId, decision });
    const record: DecisionRecord = {
      id: `decision-${Date.now()}`,
      workflowId,
      decision,
      timestamp: new Date(),
      checksum: createHash('sha256').update(payload).digest('hex'),
    };
    this.records.push(Object.freeze(record));
  }

  getAll(): DecisionRecord[] {
    return [...this.records];
  }
}
