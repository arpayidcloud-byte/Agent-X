/**
 * @module runtime-production/telemetry
 * @description Vendor agnostic OpenTelemetry-like tracing and metrics collection.
 */

import type { TelemetrySpan, TelemetryMetrics } from './interfaces.js';

export class ProductionTelemetry {
  private spans: TelemetrySpan[] = [];
  private metrics: TelemetryMetrics = { counters: {}, gauges: {}, histograms: {} };

  startSpan(name: string, traceId: string, parentSpanId?: string): TelemetrySpan {
    const span: TelemetrySpan = {
      traceId,
      spanId: `span-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      parentSpanId,
      name,
      startTime: new Date(),
      attributes: {},
      status: 'OK',
    };
    this.spans.push(span);
    return span;
  }

  endSpan(spanId: string, status: 'OK' | 'ERROR' = 'OK'): void {
    const span = this.spans.find((s) => s.spanId === spanId);
    if (span) {
      span.endTime = new Date();
      span.status = status;
    }
  }

  incrementCounter(name: string, value: number = 1): void {
    this.metrics.counters[name] = (this.metrics.counters[name] || 0) + value;
  }

  setGauge(name: string, value: number): void {
    this.metrics.gauges[name] = value;
  }

  recordHistogram(name: string, value: number): void {
    const existing = this.metrics.histograms[name] ?? [];
    existing.push(value);
    this.metrics.histograms[name] = existing;
  }

  getMetrics(): TelemetryMetrics {
    return { ...this.metrics };
  }

  getSpans(): TelemetrySpan[] {
    return [...this.spans];
  }

  clear(): void {
    this.spans = [];
    this.metrics = { counters: {}, gauges: {}, histograms: {} };
  }
}
