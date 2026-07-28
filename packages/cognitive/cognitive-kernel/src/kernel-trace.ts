/**
 * @module cognitive-kernel/kernel-trace
 * @description Traces flow paths across the cognitive loop.
 */

export interface KernelTrace {
  traceId: string;
  steps: string[];
  durationMs: number;
}

export class KernelTraceManager {
  private traces = new Map<string, KernelTrace>();

  startTrace(traceId: string): void {
    this.traces.set(traceId, { traceId, steps: [], durationMs: 0 });
  }

  addStep(traceId: string, step: string): void {
    const trace = this.traces.get(traceId);
    if (trace) {
      trace.steps.push(step);
    }
  }

  getTrace(traceId: string): KernelTrace | undefined {
    return this.traces.get(traceId);
  }
}
