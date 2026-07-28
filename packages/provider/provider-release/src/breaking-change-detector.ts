/**
 * @module provider-release/breaking-change-detector
 * @description Detects incompatible transformations between versions.
 */

import type { APIChange } from './interfaces.js';

export class BreakingChangeDetector {
  detect(changes: APIChange[]): string[] {
    const breaking: string[] = [];
    for (const change of changes) {
      if (
        change.type === 'removed' ||
        change.type === 'signature_changed' ||
        change.type === 'return_changed'
      ) {
        breaking.push(`${change.method} has breaking change: ${change.type}`);
      }
    }
    return breaking;
  }
}
