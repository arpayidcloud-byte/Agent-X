/**
 * @module cognitive-learning/pattern-registry
 * @description Immutable registry of learned patterns.
 */

import type { Pattern } from './interfaces.js';

export class PatternRegistry {
  private patterns = new Map<string, Pattern>();

  register(pattern: Pattern): void {
    this.patterns.set(pattern.id, pattern);
  }

  lookup(id: string): Pattern | undefined {
    return this.patterns.get(id);
  }

  getAll(): Pattern[] {
    return Array.from(this.patterns.values());
  }
}
