import { describe, it, expect } from 'vitest';
import { Tracer } from '../src/tracer';

describe('Tracer', () => {
  it('should create and start a span', () => {
    const tracer = new Tracer('test-service');
    const span = tracer.startSpan('test-span');
    expect(span).toBeDefined();
    span.end();
  });
});
