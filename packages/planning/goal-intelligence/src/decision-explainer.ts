/**
 * @module goal-intelligence/decision-explainer
 * @description Explains decision reasoning in human-readable format.
 */

import type { DecisionChoice } from './interfaces.js';

export class DecisionExplainer {
  explain(chosen: DecisionChoice, alternatives: DecisionChoice[]): string {
    const lines = [
      `Selected Strategy: ${chosen.strategy}`,
      `Confidence: ${chosen.confidence}`,
      `Safety: ${chosen.safety}`,
      `Alternatives Rejected: ${alternatives.length}`,
    ];
    if (alternatives.length > 0) {
      lines.push('Rejected Strategies:');
      for (const alt of alternatives) {
        lines.push(`  - ${alt.strategy} (confidence: ${alt.confidence})`);
      }
    }
    return lines.join('\n');
  }
}
