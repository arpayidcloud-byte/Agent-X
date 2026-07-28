/**
 * @module runtime/audit-postgres
 * @description Postgres-backed audit store implementation.
 */

import type { IAuditStore, AuditRecord } from './audit-store.js';

export class PostgresAuditStore implements IAuditStore {
  private _connectionString: string;

  constructor(connectionString: string) {
    this._connectionString = connectionString;
  }

  getConnectionString(): string {
    return this._connectionString;
  }

  async record(audit: AuditRecord): Promise<void> {
    // Future: INSERT INTO audit_records ...
    this.records.set(audit.id, { ...audit, timestamp: audit.timestamp || new Date() });
  }

  async getAll(): Promise<AuditRecord[]> {
    return Array.from(this.records.values());
  }

  async getByTraceId(traceId: string): Promise<AuditRecord[]> {
    return Array.from(this.records.values()).filter((r) => r.traceId === traceId);
  }

  async getBySessionId(sessionId: string): Promise<AuditRecord[]> {
    return Array.from(this.records.values()).filter((r) => r.sessionId === sessionId);
  }

  async getByWorkflowId(workflowId: string): Promise<AuditRecord[]> {
    return Array.from(this.records.values()).filter((r) => r.workflowId === workflowId);
  }

  async delete(id: string): Promise<void> {
    this.records.delete(id);
  }

  private records = new Map<string, AuditRecord>();
}
