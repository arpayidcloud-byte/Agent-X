/**
 * @module multi-agent-reasoning/domain/audit/AuditTrailManager
 * @description Records immutable audit trails.
 */

import { createHash } from 'crypto';

export interface AuditEntry {
  id: string;
  traceId: string;
  sessionId: string;
  action: string;
  timestamp: Date;
  metadata: Record<string, unknown>;
  checksum: string;
}

export class AuditTrailManager {
  private entries: AuditEntry[] = [];

  log(
    traceId: string,
    sessionId: string,
    action: string,
    metadata: Record<string, unknown>,
  ): AuditEntry {
    const payload = JSON.stringify({ traceId, sessionId, action, metadata });
    const checksum = createHash('sha256').update(payload).digest('hex');
    const entry: AuditEntry = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      traceId,
      sessionId,
      action,
      timestamp: new Date(),
      metadata,
      checksum,
    };
    this.entries.push(Object.freeze(entry));
    return entry;
  }

  verifyIntegrity(sessionId: string): boolean {
    const entries = this.entries.filter((e) => e.sessionId === sessionId);
    return entries.every((e) => {
      const payload = JSON.stringify({
        traceId: e.traceId,
        sessionId: e.sessionId,
        action: e.action,
        metadata: e.metadata,
      });
      const computed = createHash('sha256').update(payload).digest('hex');
      return computed === e.checksum;
    });
  }

  getEntries(): AuditEntry[] {
    return [...this.entries];
  }
}
