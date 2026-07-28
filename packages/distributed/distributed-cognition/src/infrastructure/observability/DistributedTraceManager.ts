import { createHash } from 'crypto';

export interface TraceSpan {
  readonly spanId: string;
  readonly traceId: string;
  readonly nodeId: string;
  readonly operation: string;
  readonly startTime: Date;
  readonly endTime: Date;
  readonly durationMs: number;
  readonly parentSpanId: string | null;
  readonly status: 'OK' | 'ERROR' | 'TIMEOUT';
  readonly checksum: string;
}

export class DistributedTraceManager {
  private spans: TraceSpan[] = [];

  startSpan(
    _traceId: string,
    _nodeId: string,
    _operation: string,
    _parentSpanId: string | null = null,
  ): string {
    return `span-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  }

  finishSpan(
    spanId: string,
    traceId: string,
    nodeId: string,
    operation: string,
    startTime: Date,
    parentSpanId: string | null,
    status: 'OK' | 'ERROR' | 'TIMEOUT',
  ): TraceSpan {
    const endTime = new Date();
    const durationMs = endTime.getTime() - startTime.getTime();
    const checksum = createHash('sha256')
      .update(JSON.stringify({ traceId, nodeId, operation, spanId, durationMs }))
      .digest('hex');
    const span: TraceSpan = Object.freeze({
      spanId,
      traceId,
      nodeId,
      operation,
      startTime,
      endTime,
      durationMs,
      parentSpanId,
      status,
      checksum,
    });
    this.spans.push(span);
    return span;
  }

  getSpans(traceId: string): TraceSpan[] {
    return this.spans.filter((s) => s.traceId === traceId);
  }

  getSpansByNode(nodeId: string): TraceSpan[] {
    return this.spans.filter((s) => s.nodeId === nodeId);
  }

  validateTrace(traceId: string): boolean {
    const spans = this.getSpans(traceId);
    return spans.every((s) => {
      const computed = createHash('sha256')
        .update(
          JSON.stringify({
            traceId: s.traceId,
            nodeId: s.nodeId,
            operation: s.operation,
            spanId: s.spanId,
            durationMs: s.durationMs,
          }),
        )
        .digest('hex');
      return computed === s.checksum;
    });
  }

  getTraceIds(): string[] {
    return [...new Set(this.spans.map((s: TraceSpan) => s.traceId))] as string[];
  }
}
