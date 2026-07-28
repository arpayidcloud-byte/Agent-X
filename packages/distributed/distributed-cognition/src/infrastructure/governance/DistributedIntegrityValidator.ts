import { createHash } from 'crypto';

export interface IntegrityRecord {
  readonly recordId: string;
  readonly entityType: string;
  readonly entityId: string;
  readonly checksum: string;
  readonly verifiedAt: Date;
}

export class DistributedIntegrityValidator {
  private records = new Map<string, IntegrityRecord[]>();

  validate(entityType: string, entityId: string, data: unknown): IntegrityRecord {
    const recordId = `iv-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256').update(JSON.stringify(data)).digest('hex');
    const record: IntegrityRecord = Object.freeze({
      recordId,
      entityType,
      entityId,
      checksum,
      verifiedAt: new Date(),
    });
    const existing = this.records.get(entityType) || [];
    existing.push(record);
    this.records.set(entityType, existing);
    return record;
  }

  verify(entityType: string, entityId: string, data: unknown): boolean {
    const records = this.records.get(entityType) || [];
    const latest = records.filter((r) => r.entityId === entityId).pop();
    if (!latest) return false;
    const computed = createHash('sha256').update(JSON.stringify(data)).digest('hex');
    return computed === latest.checksum;
  }

  getRecords(entityType: string): IntegrityRecord[] {
    return [...(this.records.get(entityType) || [])];
  }

  clear(): void {
    this.records.clear();
  }
}
