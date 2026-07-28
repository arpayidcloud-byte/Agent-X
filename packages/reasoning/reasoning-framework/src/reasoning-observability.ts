/**
 * @module reasoning-framework/reasoning-observability
 * @description Exposes tracing hooks.
 */

import type { PipelineTraceManager } from './pipeline-trace.js';

export class ReasoningObservability {
  constructor(private traceManager: PipelineTraceManager) {}

  getTraceSummary(traceId: string) {
    const list = this.traceManager.getTrace(traceId);
    return { traceId, stepsPassed: list.length };
  }
}
