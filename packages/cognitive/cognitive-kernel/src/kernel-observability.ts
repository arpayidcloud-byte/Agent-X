/**
 * @module cognitive-kernel/kernel-observability
 * @description Exposes global tracing and logging vectors.
 */

import type { KernelTraceManager } from './kernel-trace.js';

export class KernelObservability {
  constructor(private traceManager: KernelTraceManager) {}

  getTraceSummary(traceId: string) {
    const trace = this.traceManager.getTrace(traceId);
    return trace ? { traceId, stepsCount: trace.steps.length } : null;
  }
}
