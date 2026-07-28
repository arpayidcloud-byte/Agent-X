/**
 * @module otel-bootstrap
 * @description OpenTelemetry SDK bootstrap for AgentX distributed tracing.
 * Initialize this module at application entry point before any other imports.
 */

import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { trace, context, SpanStatusCode, type Tracer, type Span } from '@opentelemetry/api';

let sdk: NodeSDK | null = null;

export interface OTelBootstrapConfig {
  serviceName?: string;
  serviceVersion?: string;
  otlpEndpoint?: string;
  enabled?: boolean;
}

const DEFAULT_CONFIG: Required<OTelBootstrapConfig> = {
  serviceName: 'agentx',
  serviceVersion: '0.1.0',
  otlpEndpoint: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT || 'http://localhost:4318/v1/traces',
  enabled: true,
};

export function bootstrapOpenTelemetry(config: OTelBootstrapConfig = {}): NodeSDK | null {
  const merged = { ...DEFAULT_CONFIG, ...config };

  if (!merged.enabled) {
    return null;
  }

  const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: merged.serviceName,
    [ATTR_SERVICE_VERSION]: merged.serviceVersion,
  });

  const exporter = new OTLPTraceExporter({
    url: merged.otlpEndpoint,
  });

  sdk = new NodeSDK({
    resource,
    traceExporter: exporter,
    instrumentations: [new HttpInstrumentation()],
  });

  sdk.start();
  return sdk;
}

export async function shutdownOpenTelemetry(): Promise<void> {
  if (sdk) {
    await sdk.shutdown();
    sdk = null;
  }
}

export function getTracer(name: string = 'agentx'): Tracer {
  return trace.getTracer(name);
}

export { trace, context, SpanStatusCode, type Tracer, type Span };
