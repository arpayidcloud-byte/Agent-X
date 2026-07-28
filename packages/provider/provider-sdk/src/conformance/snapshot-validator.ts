/**
 * @module provider-sdk/snapshot-validator
 * @description Validates immutable snapshot state.
 */

import { createHash } from 'crypto';

export class SnapshotValidator {
  validateChecksum(data: string, checksum: string): boolean {
    const computed = createHash('sha256').update(data).digest('hex');
    return computed === checksum;
  }
}
