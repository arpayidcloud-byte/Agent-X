/**
 * @module provider-release/api-compatibility
 * @description Analyzes structural interface compatibility.
 */

import type { APIChange } from './interfaces.js';

export class APICompatibility {
  compare(oldAPI: string[], newAPI: string[]): APIChange[] {
    const changes: APIChange[] = [];
    for (const method of oldAPI) {
      if (!newAPI.includes(method)) {
        changes.push({ method, type: 'removed' });
      }
    }
    for (const method of newAPI) {
      if (!oldAPI.includes(method)) {
        changes.push({ method, type: 'added' });
      }
    }
    return changes;
  }
}
