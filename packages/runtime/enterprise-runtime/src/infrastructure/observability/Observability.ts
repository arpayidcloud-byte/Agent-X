import { createHash } from 'crypto';
import { trace, SpanStatusCode, type Tracer, type Span } from '@opentelemetry/api';

export interface LogEntry {
  readonly level: string;
  readonly message: string;
  readonly timestamp: Date;
  readonly metadata: Record<string, unknown>;
  readonly checksum: string;
}

export class StructuredLogging {
  private entries: LogEntry[] = [];

  log(level: string, message: string, metadata: Record<string, unknown> = {}): LogEntry {
    const checksum = createHash('sha256')
      .update(JSON.stringify({ level, message, metadata }))
      .digest('hex');
    const entry: LogEntry = Object.freeze({
      level,
      message,
      metadata: { ...metadata },
      timestamp: new Date(),
      checksum,
    });
    this.entries.push(entry);
    return entry;
  }

  getEntries(level?: string): LogEntry[] {
    if (level) return this.entries.filter((e) => e.level === level);
    return [...this.entries];
  }

  clear(): void {
    this.entries = [];
  }
}

export interface MetricEntry {
  readonly name: string;
  readonly value: number;
  readonly timestamp: Date;
  readonly tags: Readonly<Record<string, string>>;
}

export class MetricsCollector {
  private metrics: MetricEntry[] = [];

  record(name: string, value: number, tags: Record<string, string> = {}): MetricEntry {
    const entry: MetricEntry = Object.freeze({
      name,
      value,
      timestamp: new Date(),
      tags: { ...tags },
    });
    this.metrics.push(entry);
    return entry;
  }

  query(name: string): MetricEntry[] {
    return this.metrics.filter((m) => m.name === name);
  }

  aggregate(name: string): { sum: number; count: number; avg: number } {
    const points = this.query(name);
    if (points.length === 0) return { sum: 0, count: 0, avg: 0 };
    const sum = points.reduce((a, b) => a + b.value, 0);
    return { sum, count: points.length, avg: sum / points.length };
  }

  getAll(): MetricEntry[] {
    return [...this.metrics];
  }

  clear(): void {
    this.metrics = [];
  }
}

export interface TraceSpan {
  readonly spanId: string;
  readonly traceId: string;
  readonly operation: string;
  readonly startTime: Date;
  readonly endTime: Date;
  readonly durationMs: number;
  readonly status: 'OK' | 'ERROR';
  readonly checksum: string;
}

export interface SpanContext {
  readonly spanId: string;
  readonly traceId: string;
  readonly operation: string;
  readonly startTime: Date;
  readonly otelSpan?: Span;
}

export class DistributedTracing {
  private spans: TraceSpan[] = [];
  private activeSpans = new Map<string, SpanContext>();
  private tracer: Tracer;

  constructor(tracerName: string = 'agentx') {
    this.tracer = trace.getTracer(tracerName);
  }

  startSpan(traceId: string, operation: string): string {
    const spanId = `span-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const startTime = new Date();

    const otelSpan = this.tracer.startSpan(operation, {
      attributes: {
        'trace.id': traceId,
        'span.id': spanId,
      },
    });

    const spanContext: SpanContext = {
      spanId,
      traceId,
      operation,
      startTime,
      otelSpan,
    };

    this.activeSpans.set(spanId, spanContext);
    return spanId;
  }

  finishSpan(
    spanId: string,
    traceId: string,
    operation: string,
    startTime: Date,
    status: 'OK' | 'ERROR',
  ): TraceSpan {
    const spanContext = this.activeSpans.get(spanId);
    const endTime = new Date();
    const durationMs = endTime.getTime() - startTime.getTime();

    if (spanContext?.otelSpan) {
      spanContext.otelSpan.setStatus({
        code: status === 'OK' ? SpanStatusCode.OK : SpanStatusCode.ERROR,
      });
      spanContext.otelSpan.setAttribute('operation.duration_ms', durationMs);
      spanContext.otelSpan.end();
      this.activeSpans.delete(spanId);
    }

    const checksum = createHash('sha256')
      .update(JSON.stringify({ traceId, operation, spanId, durationMs }))
      .digest('hex');
    const span: TraceSpan = Object.freeze({
      spanId,
      traceId,
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
            operation: s.operation,
            spanId: s.spanId,
            durationMs: s.durationMs,
          }),
        )
        .digest('hex');
      return computed === s.checksum;
    });
  }

  injectContext(spanId: string): Record<string, string> {
    const spanContext = this.activeSpans.get(spanId);
    if (!spanContext) return {};

    const headers: Record<string, string> = {
      traceparent: `00-${spanContext.traceId}-${spanId}-01`,
    };

    return headers;
  }

  extractContext(headers: Record<string, string>): string | null {
    const traceparent = headers['traceparent'];
    if (!traceparent || typeof traceparent !== 'string') return null;

    const parts = traceparent.split('-');
    if (parts.length !== 4) return null;

    const traceId = parts[1];
    if (!traceId) return null;

    return this.startSpan(traceId, 'extracted-span');
  }

  getCurrentTraceId(spanId: string): string | null {
    return this.activeSpans.get(spanId)?.traceId ?? null;
  }

  clearSpans(): void {
    this.spans = [];
    this.activeSpans.clear();
  }
}

export interface HealthCheckResult {
  readonly component: string;
  readonly status: 'UP' | 'DOWN' | 'DEGRADED';
  readonly latencyMs: number;
  readonly timestamp: Date;
}

export class HealthEndpoint {
  private results: HealthCheckResult[] = [];

  check(
    component: string,
    status: 'UP' | 'DOWN' | 'DEGRADED',
    latencyMs: number,
  ): HealthCheckResult {
    const result: HealthCheckResult = Object.freeze({
      component,
      status,
      latencyMs,
      timestamp: new Date(),
    });
    this.results.push(result);
    return result;
  }

  getResults(): HealthCheckResult[] {
    return [...this.results];
  }

  isHealthy(): boolean {
    return this.results.every((r) => r.status !== 'DOWN');
  }
}

export class ReadinessProbe {
  private checks = new Map<string, boolean>();

  setReady(component: string, ready: boolean): void {
    this.checks.set(component, ready);
  }

  isReady(): boolean {
    return this.checks.size > 0 && Array.from(this.checks.values()).every((v) => v);
  }

  getComponents(): Array<{ component: string; ready: boolean }> {
    return Array.from(this.checks.entries()).map(([component, ready]) => ({ component, ready }));
  }
}

export class LivenessProbe {
  private alive = true;

  setAlive(alive: boolean): void {
    this.alive = alive;
  }

  isAlive(): boolean {
    return this.alive;
  }
}

export interface DiagnosticResult {
  readonly diagnosticId: string;
  readonly component: string;
  readonly findings: readonly string[];
  readonly checksum: string;
}

export class DiagnosticEngine {
  private results: DiagnosticResult[] = [];

  run(component: string, findings: string[]): DiagnosticResult {
    const diagnosticId = `diag-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ diagnosticId, component, findings }))
      .digest('hex');
    const result: DiagnosticResult = Object.freeze({
      diagnosticId,
      component,
      findings: [...findings],
      checksum,
    });
    this.results.push(result);
    return result;
  }

  getResults(): DiagnosticResult[] {
    return [...this.results];
  }
}
