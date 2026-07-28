/**
 * @module reasoning-framework/pipeline-trace
 * @description Traces stage execution paths.
 */

import type { PipelineStageName } from './interfaces.js';

export interface TraceRecord {
  stage: PipelineStageName;
  timestamp: Date;
}

export class PipelineTraceManager {
  private traces = new Map<string, TraceRecord[]>();

  startTrace(traceId: string): void {
    this.traces.set(traceId, []);
  }

  addRecord(traceId: string, stage: PipelineStageName): void {
    const list = this.traces.get(traceId) || [];
    list.push({ stage, timestamp: new Date() });
    this.traces.set(traceId, list);
  }

  getTrace(traceId: string): TraceRecord[] {
    return [...(this.traces.get(traceId) || [])];
  }
}
