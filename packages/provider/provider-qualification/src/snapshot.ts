/**
 * @module provider-qualification/snapshot
 * @description Snapshot manager for immutable historical storage.
 */

import type { QualificationSnapshot, CertificationReport } from './interfaces.js';
import { createHash } from 'crypto';

export class SnapshotManager {
  private snapshots: QualificationSnapshot[] = [];

  create(report: CertificationReport): QualificationSnapshot {
    const reportJson = JSON.stringify(report);
    const checksum = createHash('sha256').update(reportJson).digest('hex');
    const snapshot: QualificationSnapshot = {
      id: `snap-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date(),
      report: Object.freeze(report),
      checksum,
    };
    this.snapshots.push(snapshot);
    return snapshot;
  }

  list(): QualificationSnapshot[] {
    return [...this.snapshots];
  }

  clear(): void {
    this.snapshots = [];
  }
}
