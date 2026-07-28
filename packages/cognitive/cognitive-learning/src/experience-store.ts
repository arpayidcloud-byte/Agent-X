/**
 * @module cognitive-learning/experience-store
 * @description Immutable store of execution experiences.
 */

import type { Experience } from './interfaces.js';
import { InvalidExperienceError } from './errors.js';
import { createHash } from 'crypto';

export class ExperienceStore {
  private experiences: Experience[] = [];

  store(exp: Experience): void {
    if (!exp.goal || !exp.sessionId) {
      throw new InvalidExperienceError('Experience missing mandatory fields', 'experience-store');
    }
    const payload = JSON.stringify(exp);
    const stored: Experience = {
      ...exp,
      checksum: createHash('sha256').update(payload).digest('hex'),
    };
    this.experiences.push(Object.freeze(stored));
  }

  getAll(): Experience[] {
    return [...this.experiences];
  }

  getByOutcome(outcome: 'success' | 'failure' | 'partial'): Experience[] {
    return this.experiences.filter((e) => e.outcome === outcome);
  }

  count(): number {
    return this.experiences.length;
  }
}
