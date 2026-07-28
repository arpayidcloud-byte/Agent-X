/**
 * @module cognitive-learning/failure-analyzer
 * @description Identifies root causes of failures.
 */

import type { Experience } from './interfaces.js';

export class FailureAnalyzer {
  analyze(experiences: Experience[]): string[] {
    const causes: string[] = [];
    for (const exp of experiences) {
      if (exp.outcome === 'failure') {
        if (exp.confidence < 30) {
          causes.push(`low-confidence:${exp.goal}`);
        }
        if (exp.reasoningTrace.length === 0) {
          causes.push(`empty-trace:${exp.goal}`);
        }
      }
    }
    return causes;
  }
}
