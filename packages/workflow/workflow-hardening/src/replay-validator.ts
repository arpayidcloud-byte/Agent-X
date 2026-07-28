/**
 * @module workflow-hardening/replay-validator
 * @description Validates deterministic replay execution.
 */

import type { ReplayResult } from './interfaces.js';
import { ReplayMismatchError } from './errors.js';
import { createHash } from 'crypto';

export class ReplayValidator {
  validateDeterminism(results: ReplayResult[]): void {
    if (results.length < 2) return;

    const baseChecksum = createHash('sha256')
      .update(JSON.stringify((results[0] as ReplayResult).stepsExecuted))
      .digest('hex');
    for (let i = 1; i < results.length; i++) {
      const currentChecksum = createHash('sha256')
        .update(JSON.stringify((results[i] as ReplayResult).stepsExecuted))
        .digest('hex');
      if (baseChecksum !== currentChecksum) {
        throw new ReplayMismatchError(
          `Replay ${i} produced different steps than base replay`,
          'replay-validator',
        );
      }
    }
  }

  validateReplayIntegrity(result: ReplayResult): void {
    if (!result.deterministic) {
      throw new ReplayMismatchError('Replay was not deterministic', 'replay-validator');
    }
  }

  compareResults(a: ReplayResult, b: ReplayResult): boolean {
    return (
      a.stepsExecuted === b.stepsExecuted &&
      a.deterministic === b.deterministic &&
      a.checksumValid === b.checksumValid
    );
  }
}
