/**
 * @module cognitive-contracts/reasoning-engine
 * @description Reasoning engine contract implementation base.
 */

import type { IReasoningEngine } from './contracts.js';
import type { ReasoningResult, ReasoningContext } from './interfaces.js';

export class ReasoningEngineBase implements IReasoningEngine {
  async reason(_context: ReasoningContext, _input: string): Promise<ReasoningResult> {
    return {
      thoughtProcess: [],
      conclusion: '',
      confidenceScore: 0,
    };
  }
}
