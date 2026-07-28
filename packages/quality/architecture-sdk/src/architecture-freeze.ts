/**
 * @module architecture-sdk/architecture-freeze
 * @description Master architecture freeze validator.
 */

import type { ArchitectureMetadata, ArchitectureReport } from './interfaces.js';
import { createHash } from 'crypto';

export class ArchitectureFreeze {
  private frozenHash: string | null = null;

  freeze(metadata: ArchitectureMetadata): ArchitectureReport {
    const payload = JSON.stringify(metadata.packages) + JSON.stringify(metadata.dependencies);
    this.frozenHash = createHash('sha256').update(payload).digest('hex');

    metadata.checksum = this.frozenHash;
    metadata.frozenAt = new Date();

    return {
      id: `arch-${Date.now()}`,
      frozenAt: metadata.frozenAt,
      checksum: this.frozenHash,
      status: 'VALID',
      metadata,
    };
  }

  verify(metadata: ArchitectureMetadata): boolean {
    if (!this.frozenHash) return false;
    const payload = JSON.stringify(metadata.packages) + JSON.stringify(metadata.dependencies);
    const hash = createHash('sha256').update(payload).digest('hex');
    return hash === this.frozenHash;
  }
}
