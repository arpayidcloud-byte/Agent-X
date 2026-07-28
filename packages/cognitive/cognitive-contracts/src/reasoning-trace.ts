/**
 * @module cognitive-contracts/reasoning-trace
 * @description Reasoning trace contract base implementation.
 */

export interface ReasoningTrace {
  traceId: string;
  parentTraceId?: string;
  sessionId: string;
  goalId: string;
  reasoningSteps: string[];
  reflectionSteps: string[];
  decisionSteps: string[];
  timestamps: { start: Date; end?: Date };
  checksum: string;
}

export class ReasoningTraceBase {
  private trace: ReasoningTrace;

  constructor(trace: ReasoningTrace) {
    this.trace = trace;
  }

  getTrace(): ReasoningTrace {
    return { ...this.trace };
  }
}
