/**
 * @module goal-intelligence/strategy-score
 * @description Scores strategies based on symbolic metrics.
 */

import type { DecisionChoice } from './interfaces.js';

export class StrategyScorer {
  score(choice: DecisionChoice, historicalSuccesses: number, failureCount: number): number {
    let score = choice.confidence;
    score += historicalSuccesses * 2;
    score -= failureCount * 5;
    if (choice.safety === 'SAFE') score += 10;
    else if (choice.safety === 'UNSAFE') score -= 20;
    score -= choice.cost;
    return Math.max(0, Math.min(100, score));
  }
}
