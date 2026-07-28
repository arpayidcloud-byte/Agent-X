/**
 * @module production-quality/checksum-validator
 * @description Validates SHA-256 checksum integrity.
 */

import type { ValidationResult } from './interfaces.js';
import { createHash } from 'crypto';

export class ChecksumValidator {
  validate(data: string, expectedChecksum: string): ValidationResult {
    const computed = createHash('sha256').update(data).digest('hex');

    if (computed !== expectedChecksum) {
      return {
        passed: false,
        score: 0,
        failures: [`Checksum mismatch. Expected ${expectedChecksum}, got ${computed}`],
      };
    }

    return {
      passed: true,
      score: 100,
      failures: [],
    };
  }
}
