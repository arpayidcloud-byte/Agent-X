/**
 * @module coordinator/coordinator-audit
 * @description Immutable audit log generation for coordinator events.
 */

import type { CoordinatorAuditRecord, ExecutionPhase } from './interfaces.js';

export class CoordinatorAuditLogger {
  private records: CoordinatorAuditRecord[] = [];

  log(
    sessionId: string,
    traceId: string,
    action: string,
    phase: ExecutionPhase,
    result: 'success' | 'failure' | 'cancelled',
    metadata: Record<string, unknown> = {},
  ): CoordinatorAuditRecord {
    const record: CoordinatorAuditRecord = {
      id: `coord-audit-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date(),
      sessionId,
      traceId,
      action,
      phase,
      result,
      metadata: Object.freeze({ ...metadata }),
    };
    this.records.push(Object.freeze(record));
    return record;
  }

  getRecords(): CoordinatorAuditRecord[] {
    return [...this.records];
  }

  clear(): void {
    this.records = [];
  }
}
