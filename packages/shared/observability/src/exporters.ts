import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

export class Exporters {
  private sdk: NodeSDK | null = null;

  constructor(serviceName: string, traceUrl?: string) {
    if (typeof globalThis !== 'undefined') {
      const traceExporter = new OTLPTraceExporter({
        url:
          traceUrl ||
          process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ||
          'http://localhost:4318/v1/traces',
      });

      this.sdk = new NodeSDK({
        serviceName,
        traceExporter,
      });
    }
  }

  start(): void {
    if (this.sdk) {
      this.sdk.start();
    }
  }

  async shutdown(): Promise<void> {
    if (this.sdk) {
      await this.sdk.shutdown();
    }
  }
}
