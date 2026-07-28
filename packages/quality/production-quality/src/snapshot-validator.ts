/**
 * @module production-quality/snapshot-validator
 * @description Validates immutable snapshot serialization and integrity.
 */

import type { ValidationResult } from './interfaces.js';

export interface SnapshotData {
  id: string;
  checksum: string;
  [key: string]: unknown;
}

export class SnapshotValidator {
  validate(snapshot: unknown): ValidationResult {
    const failures: string[] = [];

    if (!Object.isFrozen(snapshot)) {
      failures.push('Snapshot is not immutable (not frozen)');
    }

    const data = snapshot as SnapshotData;
    if (!data.id || !data.checksum) {
      failures.push('Snapshot missing mandatory identification or checksum');
    }

    return {
      passed: failures.length === 0,
      score: failures.length === 0 ? 100 : 0,
      failures,
    };
  }
}
