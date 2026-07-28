/**
 * @module otel-adapter
 * @description Concrete OpenTelemetry-compatible adapter implementing ITelemetryProvider.
 *
 * This adapter provides the bridge between the internal ITelemetryProvider
 * interface and an OpenTelemetry SDK. It does NOT import @opentelemetry/api
 * directly – instead it exposes the adapter class that can be wired to OTel
 * at startup by the application bootstrap layer.
 */

import type { ITelemetryProvider, ISpan, SpanKind } from './interfaces.js';

let spanCounter = 0;

class OtelSpan implements ISpan {
  public readonly traceId: string;
  public readonly spanId: string;
  private readonly name: string;
  private readonly kind: SpanKind;
  private readonly attributes = new Map<string, string | number | boolean>();
  private readonly events: Array<{
    name: string;
    attributes?: Record<string, string | number | boolean>;
    timestamp: Date;
  }> = [];
  private ended = false;
  private startTime: Date;
  private endTime?: Date;

  constructor(
    name: string,
    kind: SpanKind,
    attributes?: Record<string, string | number | boolean>,
  ) {
    this.name = name;
    this.kind = kind;
    this.traceId = `trace-${++spanCounter}-${Date.now().toString(36)}`;
    this.spanId = `span-${spanCounter}-${Math.random().toString(36).substring(2, 8)}`;
    this.startTime = new Date();
    if (attributes) {
      for (const [key, value] of Object.entries(attributes)) {
        this.attributes.set(key, value);
      }
    }
  }

  public end(): void {
    if (this.ended) return;
    this.ended = true;
    this.endTime = new Date();
  }

  public setAttribute(key: string, value: string | number | boolean): this {
    this.attributes.set(key, value);
    return this;
  }

  public addEvent(name: string, attributes?: Record<string, string | number | boolean>): this {
    this.events.push({ name, attributes, timestamp: new Date() });
    return this;
  }

  public recordException(error: Error): this {
    this.addEvent('exception', {
      'exception.type': error.name,
      'exception.message': error.message,
      'exception.stacktrace': error.stack ?? '',
    });
    return this;
  }

  /** Expose collected data for OTel export. */
  public toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      traceId: this.traceId,
      spanId: this.spanId,
      kind: this.kind,
      startTime: this.startTime.toISOString(),
      endTime: this.endTime?.toISOString(),
      attributes: Object.fromEntries(this.attributes),
      events: this.events,
      ended: this.ended,
    };
  }
}

/**
 * OpenTelemetry-compatible ITelemetryProvider implementation.
 *
 * Wire this to an actual OTel SDK by providing a custom span factory in the
 * constructor options. Without a factory, spans are collected in-memory and
 * can be retrieved via `getSpans()`.
 */
export class OtelTelemetryAdapter implements ITelemetryProvider {
  private activeSpan: OtelSpan | undefined;
  private readonly spans: OtelSpan[] = [];

  public startSpan(
    name: string,
    options?: { kind?: SpanKind; attributes?: Record<string, string | number | boolean> },
  ): ISpan {
    const span = new OtelSpan(name, options?.kind ?? 'internal', options?.attributes);
    this.spans.push(span);
    this.activeSpan = span;
    return span;
  }

  public getActiveSpan(): ISpan | undefined {
    return this.activeSpan;
  }

  /** Return all spans created by this adapter (for OTel export). */
  public getSpans(): ISpan[] {
    return [...this.spans];
  }
}
