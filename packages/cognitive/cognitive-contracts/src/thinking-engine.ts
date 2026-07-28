/**
 * @module cognitive-contracts/thinking-engine
 * @description Thinking engine contract implementation base.
 */

import type { IThinkingEngine } from './contracts.js';
import type { ReasoningResult, ThinkingSession } from './interfaces.js';

export class ThinkingEngineBase implements IThinkingEngine {
  async think(_session: ThinkingSession): Promise<ReasoningResult> {
    return {
      thoughtProcess: [],
      conclusion: '',
      confidenceScore: 0,
    };
  }
}
