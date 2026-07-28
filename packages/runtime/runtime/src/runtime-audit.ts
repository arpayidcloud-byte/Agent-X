/**
 * @module runtime/runtime-audit
 * @description Audit trail for all runtime actions.
 */

import type { AuditRecord } from './interfaces.js';

/**
 * In-memory audit store
 */
export class AuditStore {
  private records: AuditRecord[] = [];

  /**
   * Records an audit entry
   * @param record - The audit record
   */
  record(record: AuditRecord): void {
    this.records.push({
      ...record,
      timestamp: record.timestamp || new Date(),
    });
  }

  /**
   * Gets all records
   * @returns Array of audit records
   */
  getAll(): AuditRecord[] {
    return [...this.records];
  }

  /**
   * Gets records by trace ID
   * @param traceId - Trace ID
   * @returns Filtered records
   */
  getByTraceId(traceId: string): AuditRecord[] {
    return this.records.filter((r) => r.traceId === traceId);
  }

  /**
   * Gets records by session ID
   * @param sessionId - Session ID
   * @returns Filtered records
   */
  getBySessionId(sessionId: string): AuditRecord[] {
    return this.records.filter((r) => r.sessionId === sessionId);
  }

  /**
   * Gets records by workflow ID
   * @param workflowId - Workflow ID
   * @returns Filtered records
   */
  getByWorkflowId(workflowId: string): AuditRecord[] {
    return this.records.filter((r) => r.workflowId === workflowId);
  }

  /**
   * Clears all records
   */
  clear(): void {
    this.records = [];
  }
}

/**
 * Creates an audit record
 * @param partial - Partial record data
 * @returns Complete AuditRecord
 */
export function createAuditRecord(partial: Partial<AuditRecord>): AuditRecord {
  return {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    traceId: '',
    correlationId: '',
    sessionId: '',
    workflowId: '',
    timestamp: new Date(),
    durationMs: 0,
    result: 'success',
    metadata: {},
    ...partial,
  };
}
