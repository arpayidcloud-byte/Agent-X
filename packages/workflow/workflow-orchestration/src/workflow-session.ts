/**
 * @module workflow-orchestration/workflow-session
 * @description Session tracking for workflow orchestration.
 */

import { createHash } from 'crypto';

export class WorkflowSession {
  public readonly id: string;
  public readonly traceId: string;
  public status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'FAILED' | 'CANCELLED' = 'ACTIVE';
  public readonly startedAt: Date = new Date();
  public readonly checksum: string;

  constructor(traceId: string) {
    this.id = `wf-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    this.traceId = traceId;
    this.checksum = createHash('sha256')
      .update(`${this.id}:${traceId}:${Date.now()}`)
      .digest('hex');
  }

  markComplete(): void {
    this.status = 'COMPLETED';
  }
  markFailed(): void {
    this.status = 'FAILED';
  }
  markCancelled(): void {
    this.status = 'CANCELLED';
  }
  markPaused(): void {
    this.status = 'PAUSED';
  }
}
