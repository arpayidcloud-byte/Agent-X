/**
 * @module vendor-certification/checksum
 * @description Standard checksum generator.
 */

import { createHash } from 'crypto';

export class ChecksumGenerator {
  generate(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }
}
