/**
 * @module runtime/audit-store
 * @description Abstract audit store interface and in-memory implementation.
 */

export interface AuditRecord {
  id: string;
  traceId: string;
  correlationId: string;
  sessionId: string;
  workflowId: string;
  agentId?: string;
  toolId?: string;
  approvalId?: string;
  timestamp: Date;
  durationMs: number;
  result: 'success' | 'failure' | 'cancelled';
  metadata: Record<string, unknown>;
}

export interface IAuditStore {
  record(audit: AuditRecord): Promise<void>;
  getAll(): Promise<AuditRecord[]>;
  getByTraceId(traceId: string): Promise<AuditRecord[]>;
  getBySessionId(sessionId: string): Promise<AuditRecord[]>;
  getByWorkflowId(workflowId: string): Promise<AuditRecord[]>;
  delete(id: string): Promise<void>;
}

export class InMemoryAuditStore implements IAuditStore {
  private records: AuditRecord[] = [];

  async record(audit: AuditRecord): Promise<void> {
    this.records.push({ ...audit, timestamp: audit.timestamp || new Date() });
  }

  async getAll(): Promise<AuditRecord[]> {
    return [...this.records];
  }

  async getByTraceId(traceId: string): Promise<AuditRecord[]> {
    return this.records.filter((r) => r.traceId === traceId);
  }

  async getBySessionId(sessionId: string): Promise<AuditRecord[]> {
    return this.records.filter((r) => r.sessionId === sessionId);
  }

  async getByWorkflowId(workflowId: string): Promise<AuditRecord[]> {
    return this.records.filter((r) => r.workflowId === workflowId);
  }

  async delete(id: string): Promise<void> {
    this.records = this.records.filter((r) => r.id !== id);
  }
}
