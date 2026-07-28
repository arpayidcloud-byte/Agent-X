/**
 * @module cognitive-learning/success-analyzer
 * @description Analyzes successful executions to extract reusable rules.
 */

import type { Experience } from './interfaces.js';

export class SuccessAnalyzer {
  analyze(experiences: Experience[]): string[] {
    const rules: string[] = [];
    for (const exp of experiences) {
      if (exp.outcome === 'success') {
        rules.push(`success-path:${exp.goal}:${exp.reasoningTrace.join('->')}`);
      }
    }
    return rules;
  }
}
