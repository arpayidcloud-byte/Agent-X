import { describe, it, expect } from 'vitest';
import { Metrics } from '../src/metrics';

describe('Metrics', () => {
  it('should track counters, histograms, and gauges', () => {
    const metrics = new Metrics();
    metrics.counter('requests', 1, { method: 'GET' });
    expect(metrics.getCounterValue('requests', { method: 'GET' })).toBe(1);

    metrics.histogram('latency', 100);
    expect(metrics.getHistogramValues('latency')).toEqual([100]);

    metrics.gauge('memory', 512);
    expect(metrics.getGaugeValue('memory')).toBe(512);
  });
});
