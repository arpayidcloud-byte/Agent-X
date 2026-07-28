/**
 * @module runtime-adapters/memory/memory-telemetry
 * @description Reference in-memory telemetry, metrics, and tracing provider.
 */

import type {
  ITelemetryProvider,
  ProviderMetadata,
  ProviderCapabilities,
  ProviderHealth,
  ProviderMetrics,
  ProviderContext,
} from '../interfaces.js';

export interface TelemetrySpanRecord {
  id: string;
  name: string;
  context?: ProviderContext;
  status?: 'OK' | 'ERROR';
}

export class MemoryTelemetryProvider implements ITelemetryProvider {
  private spans = new Map<string, TelemetrySpanRecord>();
  private metrics = new Map<string, number>();
  private histograms = new Map<string, number[]>();
  private total = 0;

  getMetadata(): ProviderMetadata {
    return {
      id: 'memory-telemetry',
      name: 'Memory Telemetry Provider',
      type: 'telemetry',
      version: '0.1.0',
    };
  }

  getCapabilities(): ProviderCapabilities {
    return { telemetry: true };
  }

  async healthCheck(): Promise<ProviderHealth> {
    return { healthy: true, latencyMs: 0, lastChecked: new Date(), status: 'ACTIVE' };
  }

  getMetrics(): ProviderMetrics {
    return {
      totalRequests: this.total,
      successfulRequests: this.total,
      failedRequests: 0,
      averageLatencyMs: 0,
    };
  }

  startSpan(name: string, context?: ProviderContext): string {
    this.total++;
    const spanId = `span-${Date.now()}-${Math.random()}`;
    this.spans.set(spanId, { id: spanId, name, context });
    return spanId;
  }

  endSpan(spanId: string, status: 'OK' | 'ERROR' = 'OK'): void {
    const span = this.spans.get(spanId);
    if (span) {
      span.status = status;
    }
  }

  recordCounter(name: string, value: number = 1): void {
    this.metrics.set(name, (this.metrics.get(name) || 0) + value);
  }

  recordHistogram(name: string, value: number): void {
    const list = this.histograms.get(name) || [];
    list.push(value);
    this.histograms.set(name, list);
  }

  recordGauge(name: string, value: number): void {
    this.metrics.set(name, value);
  }

  async flush(): Promise<void> {
    // telemetries flushed
  }

  getSpans(): Map<string, TelemetrySpanRecord> {
    return this.spans;
  }

  getGauges(): Map<string, number> {
    return this.metrics;
  }
}
