/**
 * @module provider-qualification/qualification-registry
 * @description Central registry for certified providers.
 */

import type { CertificationReport, QualificationSnapshot } from './interfaces.js';
import { QualificationRegistryError } from './errors.js';

export class QualificationRegistry {
  private reports = new Map<string, CertificationReport>();
  private snapshots = new Map<string, QualificationSnapshot>();

  register(report: CertificationReport): void {
    if (this.reports.has(report.providerId)) {
      throw new QualificationRegistryError(
        `Provider already registered: ${report.providerId}`,
        'qualification-registry',
      );
    }
    this.reports.set(report.providerId, report);
  }

  unregister(providerId: string): void {
    this.reports.delete(providerId);
  }

  resolve(providerId: string): CertificationReport | undefined {
    return this.reports.get(providerId);
  }

  saveSnapshot(snapshot: QualificationSnapshot): void {
    this.snapshots.set(snapshot.id, snapshot);
  }

  listSnapshots(): QualificationSnapshot[] {
    return Array.from(this.snapshots.values());
  }

  isCertified(providerId: string): boolean {
    const report = this.reports.get(providerId);
    return !!report && report.status === 'PASS';
  }

  clear(): void {
    this.reports.clear();
    this.snapshots.clear();
  }
}
