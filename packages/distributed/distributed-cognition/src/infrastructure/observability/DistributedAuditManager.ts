import { createHash } from 'crypto';

export interface AuditEntry {
  readonly entryId: string;
  readonly traceId: string;
  readonly nodeId: string;
  readonly sessionId: string;
  readonly action: string;
  readonly metadata: Record<string, unknown>;
  readonly timestamp: Date;
  readonly checksum: string;
}

export class DistributedAuditManager {
  private entries: AuditEntry[] = [];

  log(
    traceId: string,
    nodeId: string,
    sessionId: string,
    action: string,
    metadata: Record<string, unknown>,
  ): AuditEntry {
    const entryId = `da-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ traceId, nodeId, sessionId, action, metadata }))
      .digest('hex');
    const entry: AuditEntry = Object.freeze({
      entryId,
      traceId,
      nodeId,
      sessionId,
      action,
      metadata: { ...metadata },
      timestamp: new Date(),
      checksum,
    });
    this.entries.push(entry);
    return entry;
  }

  verifyIntegrity(sessionId: string): boolean {
    const filtered = this.entries.filter((e) => e.sessionId === sessionId);
    return filtered.every((e) => {
      const computed = createHash('sha256')
        .update(
          JSON.stringify({
            traceId: e.traceId,
            nodeId: e.nodeId,
            sessionId: e.sessionId,
            action: e.action,
            metadata: e.metadata,
          }),
        )
        .digest('hex');
      return computed === e.checksum;
    });
  }

  getEntries(sessionId?: string): AuditEntry[] {
    if (sessionId) return this.entries.filter((e) => e.sessionId === sessionId);
    return [...this.entries];
  }
}
