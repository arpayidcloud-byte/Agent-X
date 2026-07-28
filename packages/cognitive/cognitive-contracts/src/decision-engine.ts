/**
 * @module cognitive-contracts/decision-engine
 * @description Decision engine contract implementation base.
 */

import type { IDecisionEngine } from './contracts.js';
import type { DecisionResult, SafetyPolicy } from './interfaces.js';

export class DecisionEngineBase implements IDecisionEngine {
  async makeDecision(options: string[], _policy: SafetyPolicy): Promise<DecisionResult> {
    return {
      chosenAction: options[0] || '',
      alternatives: [],
      explanation: '',
    };
  }
}
