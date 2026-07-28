export type SpanKind = 'internal' | 'server' | 'client' | 'producer' | 'consumer';

export interface ISpan {
  traceId: string;
  spanId: string;
  end(): void;
  setAttribute(key: string, value: string | number | boolean): this;
  addEvent(name: string, attributes?: Record<string, string | number | boolean>): this;
  recordException(error: Error): this;
}

/**
 * An abstraction layer over OpenTelemetry.
 * Allows business logic to create spans without importing `@opentelemetry/api`.
 */
export interface ITelemetryProvider {
  startSpan(
    name: string,
    options?: { kind?: SpanKind; attributes?: Record<string, string | number | boolean> },
  ): ISpan;
  getActiveSpan(): ISpan | undefined;
}
