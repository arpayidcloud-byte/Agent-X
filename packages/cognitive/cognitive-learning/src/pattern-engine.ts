/**
 * @module cognitive-learning/pattern-engine
 * @description Discovers deterministic symbolic patterns from experiences.
 */

import type { Experience, Pattern } from './interfaces.js';

export class PatternEngine {
  analyze(experiences: Experience[]): Pattern[] {
    const patterns: Pattern[] = [];
    const pathCounts = new Map<string, { count: number; first: Date; last: Date }>();

    for (const exp of experiences) {
      const pathKey = exp.reasoningTrace.join('->');
      const existing = pathCounts.get(pathKey) || {
        count: 0,
        first: exp.timestamp,
        last: exp.timestamp,
      };
      existing.count++;
      existing.last = exp.timestamp;
      pathCounts.set(pathKey, existing);
    }

    for (const [pathKey, info] of Array.from(pathCounts) as Array<
      [string, { count: number; first: Date; last: Date }]
    >) {
      if (info.count >= 2) {
        patterns.push({
          id: `pat-path-${Date.now()}`,
          type: 'frequent_path',
          signature: pathKey,
          occurrenceCount: info.count,
          firstSeen: info.first,
          lastSeen: info.last,
          checksum: '',
        });
      }
    }

    return patterns;
  }
}
