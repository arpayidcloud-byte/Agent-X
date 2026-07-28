import { createHash } from 'crypto';

export interface MetricPoint {
  readonly name: string;
  readonly value: number;
  readonly timestamp: Date;
  readonly tags: Readonly<Record<string, string>>;
}

export class ExecutionMetricsCollector {
  private metrics: MetricPoint[] = [];

  record(name: string, value: number, tags: Record<string, string> = {}): MetricPoint {
    const point: MetricPoint = Object.freeze({
      name,
      value,
      timestamp: new Date(),
      tags: { ...tags },
    });
    this.metrics.push(point);
    return point;
  }

  query(name: string): MetricPoint[] {
    return this.metrics.filter((m) => m.name === name);
  }

  aggregate(name: string): { sum: number; count: number; avg: number; max: number; min: number } {
    const points = this.query(name);
    if (points.length === 0) return { sum: 0, count: 0, avg: 0, max: 0, min: 0 };
    const values = points.map((p) => p.value);
    const sum = values.reduce((a, b) => a + b, 0);
    return {
      sum,
      count: values.length,
      avg: sum / values.length,
      max: Math.max(...values),
      min: Math.min(...values),
    };
  }

  getAll(): MetricPoint[] {
    return [...this.metrics];
  }

  clear(): void {
    this.metrics = [];
  }
}

export interface AuditEntry {
  readonly entryId: string;
  readonly traceId: string;
  readonly goalId: string;
  readonly action: string;
  readonly metadata: Record<string, unknown>;
  readonly timestamp: Date;
  readonly checksum: string;
}

export class ExecutionAuditManager {
  private entries: AuditEntry[] = [];

  log(
    traceId: string,
    goalId: string,
    action: string,
    metadata: Record<string, unknown>,
  ): AuditEntry {
    const entryId = `ea-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ traceId, goalId, action, metadata }))
      .digest('hex');
    const entry: AuditEntry = Object.freeze({
      entryId,
      traceId,
      goalId,
      action,
      metadata: { ...metadata },
      timestamp: new Date(),
      checksum,
    });
    this.entries.push(entry);
    return entry;
  }

  verifyIntegrity(goalId: string): boolean {
    const filtered = this.entries.filter((e) => e.goalId === goalId);
    return filtered.every((e) => {
      const computed = createHash('sha256')
        .update(
          JSON.stringify({
            traceId: e.traceId,
            goalId: e.goalId,
            action: e.action,
            metadata: e.metadata,
          }),
        )
        .digest('hex');
      return computed === e.checksum;
    });
  }

  getEntries(goalId?: string): AuditEntry[] {
    if (goalId) return this.entries.filter((e) => e.goalId === goalId);
    return [...this.entries];
  }
}

export interface TraceSpan {
  readonly spanId: string;
  readonly traceId: string;
  readonly goalId: string;
  readonly operation: string;
  readonly startTime: Date;
  readonly endTime: Date;
  readonly durationMs: number;
  readonly status: 'OK' | 'ERROR';
  readonly checksum: string;
}

export class ExecutionTraceManager {
  private spans: TraceSpan[] = [];

  startSpan(_traceId: string, _goalId: string, _operation: string): string {
    return `span-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  }

  finishSpan(
    spanId: string,
    traceId: string,
    goalId: string,
    operation: string,
    startTime: Date,
    status: 'OK' | 'ERROR',
  ): TraceSpan {
    const endTime = new Date();
    const durationMs = endTime.getTime() - startTime.getTime();
    const checksum = createHash('sha256')
      .update(JSON.stringify({ traceId, goalId, operation, spanId, durationMs }))
      .digest('hex');
    const span: TraceSpan = Object.freeze({
      spanId,
      traceId,
      goalId,
      operation,
      startTime,
      endTime,
      durationMs,
      status,
      checksum,
    });
    this.spans.push(span);
    return span;
  }

  getSpans(traceId: string): TraceSpan[] {
    return this.spans.filter((s) => s.traceId === traceId);
  }

  validateTrace(traceId: string): boolean {
    return this.getSpans(traceId).every((s) => {
      const computed = createHash('sha256')
        .update(
          JSON.stringify({
            traceId: s.traceId,
            goalId: s.goalId,
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
    return [...new Set(this.spans.map((s) => s.traceId))] as string[];
  }
}

export interface ExecutionEvent {
  readonly eventType: string;
  readonly goalId: string;
  readonly payload: Record<string, unknown>;
  readonly timestamp: Date;
  readonly checksum: string;
}

export type EventListener = (event: ExecutionEvent) => void;

export class ExecutionEventBus {
  private listeners = new Map<string, EventListener[]>();
  private log: ExecutionEvent[] = [];

  publish(event: ExecutionEvent): void {
    this.log.push(Object.freeze({ ...event }));
    const handlers = this.listeners.get(event.eventType) ?? [];
    for (const handler of handlers) handler(event);
  }

  subscribe(eventType: string, listener: EventListener): void {
    const current = this.listeners.get(eventType) ?? [];
    this.listeners.set(eventType, [...current, listener]);
  }

  unsubscribe(eventType: string): void {
    this.listeners.delete(eventType);
  }

  getLog(): ExecutionEvent[] {
    return [...this.log];
  }

  clear(): void {
    this.listeners.clear();
  }
}
