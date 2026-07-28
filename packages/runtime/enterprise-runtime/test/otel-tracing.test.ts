/**
 * @module otel-tracing.test
 * @description Tests for OpenTelemetry distributed tracing integration.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DistributedTracing } from '../src/infrastructure/observability/Observability.js';

vi.mock('@opentelemetry/api', () => {
  const mockSpan = {
    setStatus: vi.fn(),
    setAttribute: vi.fn(),
    end: vi.fn(),
  };

  const mockTracer = {
    startSpan: vi.fn(() => mockSpan),
  };

  return {
    trace: {
      getTracer: vi.fn(() => mockTracer),
    },
    context: {},
    SpanStatusCode: {
      OK: 2,
      ERROR: 2,
    },
  };
});

describe('DistributedTracing with OpenTelemetry', () => {
  let tracing: DistributedTracing;

  beforeEach(() => {
    tracing = new DistributedTracing('test-tracer');
  });

  afterEach(() => {
    tracing.clearSpans();
  });

  it('creates a span with OpenTelemetry tracer', () => {
    const spanId = tracing.startSpan('trace-1', 'test-operation');
    expect(spanId).toBeDefined();
    expect(spanId).toMatch(/^span-\d+-[a-z0-9]+$/);
  });

  it('finishes span and records to OpenTelemetry', () => {
    const spanId = tracing.startSpan('trace-1', 'test-operation');
    const startTime = new Date();
    const span = tracing.finishSpan(spanId, 'trace-1', 'test-operation', startTime, 'OK');

    expect(span.status).toBe('OK');
    expect(span.spanId).toBe(spanId);
    expect(span.traceId).toBe('trace-1');
    expect(span.operation).toBe('test-operation');
    expect(span.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('validates trace checksums', () => {
    const spanId = tracing.startSpan('trace-1', 'op1');
    const startTime = new Date();
    tracing.finishSpan(spanId, 'trace-1', 'op1', startTime, 'OK');

    expect(tracing.validateTrace('trace-1')).toBe(true);
  });

  it('returns spans for a given traceId', () => {
    const spanId1 = tracing.startSpan('trace-1', 'op1');
    const spanId2 = tracing.startSpan('trace-1', 'op2');
    const spanId3 = tracing.startSpan('trace-2', 'op3');

    tracing.finishSpan(spanId1, 'trace-1', 'op1', new Date(), 'OK');
    tracing.finishSpan(spanId2, 'trace-1', 'op2', new Date(), 'OK');
    tracing.finishSpan(spanId3, 'trace-2', 'op3', new Date(), 'OK');

    expect(tracing.getSpans('trace-1')).toHaveLength(2);
    expect(tracing.getSpans('trace-2')).toHaveLength(1);
    expect(tracing.getSpans('trace-3')).toHaveLength(0);
  });

  it('injects W3C trace context headers', () => {
    const spanId = tracing.startSpan('trace-1', 'test-op');
    const headers = tracing.injectContext(spanId);

    expect(headers).toHaveProperty('traceparent');
    expect(headers['traceparent']).toMatch(/^00-trace-1-span-.*-01$/);
  });

  it('returns empty headers for unknown span', () => {
    const headers = tracing.injectContext('unknown-span');
    expect(headers).toEqual({});
  });

  it('extracts context from W3C headers', () => {
    const headers = {
      traceparent: '00-trace-abc-span-xyz-01',
    };
    const spanId = tracing.extractContext(headers);
    expect(spanId).toBeDefined();
  });

  it('returns null for invalid traceparent header', () => {
    expect(tracing.extractContext({})).toBeNull();
    expect(tracing.extractContext({ traceparent: 'invalid' })).toBeNull();
    expect(tracing.extractContext({ traceparent: '00-trace-abc' })).toBeNull();
  });

  it('gets current traceId for active span', () => {
    const spanId = tracing.startSpan('trace-1', 'test-op');
    expect(tracing.getCurrentTraceId(spanId)).toBe('trace-1');
    expect(tracing.getCurrentTraceId('unknown')).toBeNull();
  });

  it('clears all spans', () => {
    const spanId = tracing.startSpan('trace-1', 'op1');
    tracing.finishSpan(spanId, 'trace-1', 'op1', new Date(), 'OK');

    tracing.clearSpans();
    expect(tracing.getSpans('trace-1')).toHaveLength(0);
  });

  it('handles ERROR status spans', () => {
    const spanId = tracing.startSpan('trace-1', 'failing-op');
    const span = tracing.finishSpan(spanId, 'trace-1', 'failing-op', new Date(), 'ERROR');

    expect(span.status).toBe('ERROR');
  });

  it('maintains backward compatibility with existing API', () => {
    const spanId = tracing.startSpan('trace-1', 'op1');
    const startTime = new Date();
    const span = tracing.finishSpan(spanId, 'trace-1', 'op1', startTime, 'OK');

    expect(span).toHaveProperty('spanId');
    expect(span).toHaveProperty('traceId');
    expect(span).toHaveProperty('operation');
    expect(span).toHaveProperty('startTime');
    expect(span).toHaveProperty('endTime');
    expect(span).toHaveProperty('durationMs');
    expect(span).toHaveProperty('status');
    expect(span).toHaveProperty('checksum');
  });
});
