/**
 * @module reasoning-framework/reasoning-audit
 * @description Immutable chronological log manager.
 */

import type { ReasoningAuditRecord } from './interfaces.js';
import { createHash } from 'crypto';

export class ReasoningAuditManager {
  private records: ReasoningAuditRecord[] = [];

  log(traceId: string, sessionId: string, action: string, metadata: Record<string, unknown>): void {
    const payload = `${traceId}:${sessionId}:${action}:${JSON.stringify(metadata)}`;
    const checksum = createHash('sha256').update(payload).digest('hex');

    this.records.push(
      Object.freeze({
        id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        traceId,
        sessionId,
        action,
        timestamp: new Date(),
        metadata,
        checksum,
      }),
    );
  }

  getRecords(): ReasoningAuditRecord[] {
    return [...this.records];
  }
}
