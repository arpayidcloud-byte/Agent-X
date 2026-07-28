/**
 * @module cognitive-learning/reflection-history
 * @description Immutable reflection log storage.
 */

import type { Reflection } from './interfaces.js';

export class ReflectionHistory {
  private reflections: Reflection[] = [];

  add(reflection: Reflection): void {
    this.reflections.push(Object.freeze(reflection));
  }

  getAll(): Reflection[] {
    return [...this.reflections];
  }

  count(): number {
    return this.reflections.length;
  }
}
