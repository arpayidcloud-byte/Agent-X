import { describe, it, expect } from 'vitest';
import { MetricsAggregator } from '../src/aggregator.js';

describe('MetricsAggregator', () => {
  it('records and retrieves tasks', () => {
    const agg = new MetricsAggregator();
    agg.recordTask({
      taskId: 't1',
      status: 'RUNNING',
      traceId: 'tr1',
      timestamp: new Date(),
    });
    expect(agg.getActiveTasks()).toHaveLength(1);
  });

  it('computes metrics correctly', () => {
    const agg = new MetricsAggregator();
    const now = new Date();
    agg.recordTask({
      taskId: 't1',
      status: 'COMPLETED',
      traceId: 'tr1',
      timestamp: now,
      durationMs: 100,
      costUsd: 0.01,
    });
    agg.recordTask({
      taskId: 't2',
      status: 'COMPLETED',
      traceId: 'tr2',
      timestamp: now,
      durationMs: 200,
      costUsd: 0.02,
    });
    agg.recordTask({ taskId: 't3', status: 'FAILED', traceId: 'tr3', timestamp: now });

    const metrics = agg.getMetrics();
    expect(metrics.completedToday).toBe(2);
    expect(metrics.totalCostUsd).toBe(0.03);
    expect(metrics.avgLatencyMs).toBe(150);
    expect(metrics.errorRate).toBe(33.33);
  });

  it('respects maxHistory limit', () => {
    const agg = new MetricsAggregator(3);
    for (let i = 0; i < 5; i++) {
      agg.recordTask({
        taskId: `t${i}`,
        status: 'COMPLETED',
        traceId: `tr${i}`,
        timestamp: new Date(),
      });
    }
    expect(agg.getTaskHistory(10)).toHaveLength(3);
  });

  it('returns task history with limit', () => {
    const agg = new MetricsAggregator();
    for (let i = 0; i < 10; i++) {
      agg.recordTask({
        taskId: `t${i}`,
        status: 'COMPLETED',
        traceId: `tr${i}`,
        timestamp: new Date(),
      });
    }
    expect(agg.getTaskHistory(5)).toHaveLength(5);
  });
});
