/**
 * @module architecture-sdk/architecture-report
 * @description Generates the Architecture Freeze Report.
 */

import type { ArchitectureReport } from './interfaces.js';
import { createHash } from 'crypto';

export class ArchitectureReportBuilder {
  build(metadata: ArchitectureReport): ArchitectureReport {
    const payload = JSON.stringify(metadata.metadata);
    const checksum = createHash('sha256').update(payload).digest('hex');

    return {
      ...metadata,
      checksum,
      status: checksum.length > 0 ? 'VALID' : 'BROKEN',
    };
  }
}
