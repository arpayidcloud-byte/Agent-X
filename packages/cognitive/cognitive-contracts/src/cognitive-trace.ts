/**
 * @module cognitive-contracts/cognitive-trace
 * @description Cognitive trace contract base implementation.
 */

import type { ReasoningTrace } from './reasoning-trace.js';

export class CognitiveTraceBase {
  private traces: ReasoningTrace[] = [];

  addTrace(trace: ReasoningTrace): void {
    this.traces.push(trace);
  }

  getTraces(): ReasoningTrace[] {
    return [...this.traces];
  }
}
