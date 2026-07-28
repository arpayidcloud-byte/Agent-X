/**
 * @module reasoning-algorithms/conflict-resolver
 * @description Logic conflict resolution strategies.
 */

import type { Rule } from './interfaces.js';

export class ConflictResolver {
  resolve(conflicts: Rule[], strategy: 'priority' | 'weight' | 'latest'): Rule | undefined {
    if (conflicts.length === 0) return undefined;

    switch (strategy) {
      case 'priority':
        return conflicts.reduce((prev, curr) => (curr.priority > prev.priority ? curr : prev));
      case 'weight':
        return conflicts.reduce((prev, curr) => (curr.weight > prev.weight ? curr : prev));
      case 'latest':
        return conflicts[conflicts.length - 1];
      default:
        return conflicts[0];
    }
  }
}
