/**
 * @module cognitive-learning/experience-extractor
 * @description Extracts knowledge from execution history.
 */

import type { Experience, Pattern } from './interfaces.js';
import { createHash } from 'crypto';

export class ExperienceExtractor {
  extractPatterns(experiences: Experience[]): Pattern[] {
    const patterns: Pattern[] = [];

    // Detect repeated failures
    const failures = experiences.filter((e) => e.outcome === 'failure');
    if (failures.length >= 2) {
      patterns.push({
        id: `pat-${Date.now()}`,
        type: 'repeated_failure',
        signature: 'failure-count:' + failures.length,
        occurrenceCount: failures.length,
        firstSeen: (failures[0] as Experience).timestamp,
        lastSeen: (failures[failures.length - 1] as Experience).timestamp,
        checksum: '',
      });
    }

    // Detect repeated successes
    const successes = experiences.filter((e) => e.outcome === 'success');
    if (successes.length >= 2) {
      patterns.push({
        id: `pat-${Date.now()}`,
        type: 'repeated_success',
        signature: 'success-count:' + successes.length,
        occurrenceCount: successes.length,
        firstSeen: (successes[0] as Experience).timestamp,
        lastSeen: (successes[successes.length - 1] as Experience).timestamp,
        checksum: '',
      });
    }

    for (const p of patterns) {
      p.checksum = createHash('sha256').update(JSON.stringify(p)).digest('hex');
    }

    return patterns;
  }
}
