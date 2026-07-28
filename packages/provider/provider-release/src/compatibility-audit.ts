/**
 * @module provider-release/compatibility-audit
 * @description Immutable auditing for compatibility decisions.
 */

export interface AuditRecord {
  id: string;
  timestamp: Date;
  traceId: string;
  provider: string;
  version: string;
  tester: string;
  environment: string;
  score: number;
  status: 'PASS' | 'FAIL';
}

export class CompatibilityAuditLogger {
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
