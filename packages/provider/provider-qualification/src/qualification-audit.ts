/**
 * @module provider-qualification/qualification-audit
 * @description Generates immutable audit logs for qualification events.
 */

export interface AuditRecord {
  id: string;
  timestamp: Date;
  traceId: string;
  provider: string;
  version: string;
  executionTimeMs: number;
  tester: string;
  environment: string;
  score: number;
  decision: 'PASS' | 'WARNING' | 'FAILED';
}

export class QualificationAuditLogger {
  private records: AuditRecord[] = [];

  log(entry: AuditRecord): void {
    this.records.push(Object.freeze({ ...entry, timestamp: new Date() }));
  }

  getAll(): AuditRecord[] {
    return [...this.records];
  }

  clear(): void {
    this.records = [];
  }
}
