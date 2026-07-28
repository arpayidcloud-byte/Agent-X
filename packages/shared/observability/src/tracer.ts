import type { Span, SpanOptions } from '@opentelemetry/api';
import { trace } from '@opentelemetry/api';

export interface ITracer {
  startSpan(name: string, options?: SpanOptions): ISpan;
}

export interface ISpan {
  setAttribute(key: string, value: string | number | boolean): void;
  setAttributes(attributes: Record<string, string | number | boolean>): void;
  addEvent(name: string, attributes?: Record<string, string | number | boolean>): void;
  setStatus(status: { code: number; message?: string }): void;
  end(): void;
  isRecording(): boolean;
}

export class Tracer implements ITracer {
  private tracer: unknown;

  constructor(serviceName: string) {
    this.tracer = trace.getTracer(serviceName);
  }

  startSpan(name: string, options?: SpanOptions): ISpan {
    const span = (this.tracer as Tracer).startSpan(name, options) as Span;
    return new SpanWrapper(span);
  }
}

class SpanWrapper implements ISpan {
  constructor(private span: Span) {}

  setAttribute(key: string, value: string | number | boolean): void {
    this.span.setAttribute(key, value);
  }

  setAttributes(attributes: Record<string, string | number | boolean>): void {
    this.span.setAttributes(attributes);
  }

  addEvent(name: string, attributes?: Record<string, string | number | boolean>): void {
    this.span.addEvent(name, attributes);
  }

  setStatus(status: { code: number; message?: string }): void {
    this.span.setStatus(status);
  }

  end(): void {
    this.span.end();
  }

  isRecording(): boolean {
    return this.span.isRecording();
  }
}
