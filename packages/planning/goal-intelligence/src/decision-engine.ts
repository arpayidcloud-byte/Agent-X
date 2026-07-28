/**
 * @module goal-intelligence/decision-engine
 * @description Determines optimal strategies using symbolic reasoning.
 */

import type { DecisionChoice } from './interfaces.js';

export class DecisionEngine {
  evaluate(choices: DecisionChoice[]): DecisionChoice {
    if (choices.length === 0) {
      throw new Error('No decision choices provided');
    }

    const safe = choices.filter((c) => c.safety === 'SAFE');
    if (safe.length === 0) {
      const bestUnsafe = [...choices].sort((a, b) => b.confidence - a.confidence);
      return bestUnsafe[0] as DecisionChoice;
    }

    return [...safe].sort((a, b) => b.confidence - a.confidence)[0] as DecisionChoice;
  }
}
