/**
 * @module workflow-hardening/audit-engine
 * @description Immutable workflow audit trail generation.
 */

import { createHash } from 'crypto';

export interface AuditEntry {
  id: string;
  type: string;
  workflowId: string;
  sessionId: string;
  timestamp: Date;
  action: string;
  metadata: Record<string, unknown>;
  checksum: string;
}

export class WorkflowAuditEngine {
  private entries: AuditEntry[] = [];

  log(
    type: string,
    workflowId: string,
    sessionId: string,
    action: string,
    metadata: Record<string, unknown>,
  ): AuditEntry {
    const payload = JSON.stringify({ type, workflowId, sessionId, action, metadata });
    const entry: AuditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      type,
      workflowId,
      sessionId,
      timestamp: new Date(),
      action,
      metadata,
      checksum: createHash('sha256').update(payload).digest('hex'),
    };
    this.entries.push(Object.freeze(entry));
    return entry;
  }

  getEntries(): AuditEntry[] {
    return [...this.entries];
  }
}
