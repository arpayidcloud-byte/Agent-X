/**
 * @module native-providers/providers/otel-telemetry
 * @description Native OpenTelemetry metrics and tracing provider wrapper (Stub implementation).
 */

import type {
  ITelemetryProvider,
  ProviderMetadata,
  ProviderCapabilities,
  ProviderHealth,
  ProviderMetrics,
  ProviderContext,
} from '@agentx-fast/runtime-adapters';
import type { IConfigurationProvider, INativeProvider } from '../interfaces.js';
import { ConfigurationError } from '../errors.js';

export class OTELTelemetryProvider implements ITelemetryProvider, INativeProvider {
  id = 'otel-telemetry';
  name = 'OpenTelemetry Provider';
  private connected = false;
  private config!: IConfigurationProvider;

  async initialize(config: IConfigurationProvider): Promise<void> {
    this.config = config;
    if (!this.config.has('OTEL_EXPORTER_OTLP_ENDPOINT')) {
      throw new ConfigurationError('OTEL_EXPORTER_OTLP_ENDPOINT is required', this.id);
    }
  }

  async connect(): Promise<void> {
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }

  async getHealth(): Promise<{ status: 'UP' | 'DOWN' | 'DEGRADED'; latencyMs: number }> {
    return { status: this.connected ? 'UP' : 'DOWN', latencyMs: 3 };
  }

  getMetadata(): ProviderMetadata {
    return { id: this.id, name: this.name, type: 'telemetry', version: '1.0.0' };
  }

  getCapabilities(): ProviderCapabilities {
    return { telemetry: true };
  }

  async healthCheck(): Promise<ProviderHealth> {
    return {
      healthy: this.connected,
      latencyMs: 3,
      lastChecked: new Date(),
      status: this.connected ? 'ACTIVE' : 'DOWN',
    };
  }

  getMetrics(): ProviderMetrics {
    return { totalRequests: 0, successfulRequests: 0, failedRequests: 0, averageLatencyMs: 0 };
  }

  startSpan(_name: string, _context?: ProviderContext): string {
    return `span-${Date.now()}`;
  }

  endSpan(_spanId: string, _status?: 'OK' | 'ERROR'): void {}
  recordCounter(_name: string, _value?: number): void {}
  recordHistogram(_name: string, _value: number): void {}
  recordGauge(_name: string, _value: number): void {}
  async flush(): Promise<void> {}
}
