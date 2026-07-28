/**
 * @module cognitive-learning/improvement-engine
 * @description Generates symbolic improvement recommendations.
 */

import type { Experience, Pattern, Improvement } from './interfaces.js';

export class ImprovementEngine {
  generate(experiences: Experience[], patterns: Pattern[]): Improvement[] {
    const improvements: Improvement[] = [];

    const failures = experiences.filter((e) => e.outcome === 'failure');
    if (failures.length >= 2) {
      improvements.push({
        id: `impr-${Date.now()}`,
        sessionId: '',
        recommendation: 'Increase validation before critical decisions',
        priority: 1,
        category: 'validation',
        timestamp: new Date(),
      });
    }

    if (patterns.filter((p) => p.type === 'repeated_success').length >= 2) {
      improvements.push({
        id: `impr-${Date.now()}`,
        sessionId: '',
        recommendation: 'Continue current reasoning approach',
        priority: 2,
        category: 'strategy',
        timestamp: new Date(),
      });
    }

    return improvements;
  }
}
