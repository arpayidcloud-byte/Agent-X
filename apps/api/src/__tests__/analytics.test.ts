import { describe, it, expect } from 'vitest';
import {
  computeAnalyticsSummary,
  histogramBuckets,
  histogramCount,
  histogramSum,
  histogramPercentile,
  groupByLabel,
  type MetricJson,
} from '../analytics.js';

// Deterministic synthetic snapshot shaped like prom-client getMetricsAsJSON().
function makeSnapshot(): MetricJson[] {
  return [
    {
      name: 'llm_requests_total',
      type: 'counter',
      values: [
        {
          labels: {
            provider: 'deepseek',
            model: 'deepseek-v3',
            complexity: 'medium',
            status: 'success',
          },
          value: 8,
        },
        {
          labels: {
            provider: 'anthropic',
            model: 'claude-3-5',
            complexity: 'medium',
            status: 'success',
          },
          value: 2,
        },
        {
          labels: {
            provider: 'deepseek',
            model: 'deepseek-v3',
            complexity: 'medium',
            status: 'error',
          },
          value: 1,
        },
      ],
    },
    {
      name: 'llm_errors_total',
      type: 'counter',
      values: [
        { labels: { provider: 'deepseek', model: 'deepseek-v3', error_type: 'timeout' }, value: 1 },
      ],
    },
    {
      name: 'llm_cache_hits_total',
      type: 'counter',
      values: [{ labels: { provider: 'deepseek', model: 'deepseek-v3' }, value: 3 }],
    },
    {
      name: 'llm_fallbacks_total',
      type: 'counter',
      values: [
        {
          labels: { from_provider: 'deepseek', to_provider: 'anthropic', reason: 'timeout' },
          value: 1,
        },
      ],
    },
    {
      name: 'llm_active_providers',
      type: 'gauge',
      values: [{ labels: {}, value: 3 }],
    },
    {
      name: 'llm_request_latency_seconds',
      type: 'histogram',
      values: [
        // deepseek: 5 requests at ~0.3s, 4 requests at ~1.5s
        { labels: { le: '0.1', provider: 'deepseek', model: 'deepseek-v3' }, value: 0 },
        { labels: { le: '0.5', provider: 'deepseek', model: 'deepseek-v3' }, value: 5 },
        { labels: { le: '1', provider: 'deepseek', model: 'deepseek-v3' }, value: 5 },
        { labels: { le: '2', provider: 'deepseek', model: 'deepseek-v3' }, value: 9 },
        { labels: { le: '+Inf', provider: 'deepseek', model: 'deepseek-v3' }, value: 9 },
        // anthropic: 2 requests at ~0.8s
        { labels: { le: '0.1', provider: 'anthropic', model: 'claude-3-5' }, value: 0 },
        { labels: { le: '0.5', provider: 'anthropic', model: 'claude-3-5' }, value: 0 },
        { labels: { le: '1', provider: 'anthropic', model: 'claude-3-5' }, value: 2 },
        { labels: { le: '2', provider: 'anthropic', model: 'claude-3-5' }, value: 2 },
        { labels: { le: '+Inf', provider: 'anthropic', model: 'claude-3-5' }, value: 2 },
      ],
    },
    {
      name: 'llm_token_usage',
      type: 'histogram',
      values: [
        {
          labels: { le: '100', provider: 'deepseek', model: 'deepseek-v3', type: 'input' },
          value: 2,
        },
        {
          labels: { le: '500', provider: 'deepseek', model: 'deepseek-v3', type: 'input' },
          value: 9,
        },
        {
          labels: { le: '+Inf', provider: 'deepseek', model: 'deepseek-v3', type: 'input' },
          value: 9,
        },
        {
          labels: { le: '100', provider: 'deepseek', model: 'deepseek-v3', type: 'output' },
          value: 4,
        },
        {
          labels: { le: '+Inf', provider: 'deepseek', model: 'deepseek-v3', type: 'output' },
          value: 4,
        },
      ],
    },
    {
      name: 'llm_cost_usd_total',
      type: 'counter',
      values: [
        { labels: { provider: 'deepseek', model: 'deepseek-v3' }, value: 0.000234 },
        { labels: { provider: 'anthropic', model: 'claude-3-5' }, value: 0.000512 },
      ],
    },
  ];
}

describe('analytics helpers', () => {
  it('histogramBuckets merges series and sorts bounds', () => {
    const snap = makeSnapshot();
    const latency = snap.find((m) => m.name === 'llm_request_latency_seconds')!;
    const h = histogramBuckets(latency);
    expect(h.bounds).toEqual([0.1, 0.5, 1, 2, Infinity]);
    expect(h.counts).toEqual([0, 5, 7, 11, 11]);
  });

  it('histogramCount takes the +Inf bucket', () => {
    const snap = makeSnapshot();
    const latency = snap.find((m) => m.name === 'llm_request_latency_seconds')!;
    expect(histogramCount(histogramBuckets(latency))).toBe(11);
  });

  it('histogramSum approximates from midpoints', () => {
    const snap = makeSnapshot();
    const latency = snap.find((m) => m.name === 'llm_request_latency_seconds')!;
    const h = histogramBuckets(latency);
    // buckets: le=0.1→(0,0.1], le=0.5→(0.1,0.5], le=1→(0.5,1], le=2→(1,2]
    // 5 × (0.1..0.5 mid 0.3) + 2 × (0.5..1 mid 0.75) + 4 × (1..2 mid 1.5)
    const sum = histogramSum(h);
    expect(sum).toBeCloseTo(5 * 0.3 + 2 * 0.75 + 4 * 1.5, 5);
  });

  it('histogramPercentile interpolates within a bucket', () => {
    const snap = makeSnapshot();
    const latency = snap.find((m) => m.name === 'llm_request_latency_seconds')!;
    const h = histogramBuckets(latency);
    // p50: target 5.5 → in bucket (0.5, 1]: 0.5 + (5.5-5)/2 × 0.5 = 0.625
    expect(histogramPercentile(h, 0.5)).toBeCloseTo(0.625, 5);
    // p95: target 10.45 → in bucket (1, 2]: 1 + (10.45-7)/4 × 1 = 1.8625
    expect(histogramPercentile(h, 0.95)).toBeCloseTo(1.8625, 5);
  });

  it('groupByLabel sums across series', () => {
    const snap = makeSnapshot();
    const requests = snap.find((m) => m.name === 'llm_requests_total')!;
    const byProvider = groupByLabel(requests, 'provider');
    expect(byProvider.get('deepseek')).toBe(9);
    expect(byProvider.get('anthropic')).toBe(2);
  });
});

describe('computeAnalyticsSummary', () => {
  it('computes overview from a synthetic snapshot', () => {
    const summary = computeAnalyticsSummary(makeSnapshot(), '2026-08-02T00:00:00.000Z');
    expect(summary.generatedAt).toBe('2026-08-02T00:00:00.000Z');
    expect(summary.overview.totalRequests).toBe(11);
    expect(summary.overview.totalErrors).toBe(1);
    expect(summary.overview.successRate).toBeCloseTo(90.9, 1);
    expect(summary.overview.totalCacheHits).toBe(3);
    expect(summary.overview.cacheHitRate).toBeCloseTo(27.3, 1);
    expect(summary.overview.totalFallbacks).toBe(1);
    expect(summary.overview.activeProviders).toBe(3);
    expect(summary.overview.inputTokens).toBe(9);
    expect(summary.overview.outputTokens).toBe(4);
    expect(summary.overview.totalTokens).toBe(13);
    expect(summary.overview.totalCostUsd).toBeCloseTo(0.000234 + 0.000512, 10);
    // avg latency = 8.75 / 11 s → ~795ms
    expect(summary.overview.avgLatencyMs).toBeGreaterThan(700);
    expect(summary.overview.avgLatencyMs).toBeLessThan(900);
    expect(summary.overview.p50LatencyMs).toBeCloseTo(625, -1);
    expect(summary.overview.p95LatencyMs).toBeCloseTo(1863, -1);
  });

  it('breaks down by provider and model', () => {
    const summary = computeAnalyticsSummary(makeSnapshot());
    expect(summary.byProvider).toHaveLength(2);
    const deepseek = summary.byProvider.find((p) => p.provider === 'deepseek')!;
    expect(deepseek.requests).toBe(9);
    expect(deepseek.errors).toBe(1);
    expect(deepseek.tokens).toBe(13); // 9 input + 4 output
    expect(deepseek.costUsd).toBeCloseTo(0.000234, 10);
    expect(deepseek.avgLatencyMs).toBeGreaterThan(0);
    const anthropic = summary.byProvider.find((p) => p.provider === 'anthropic')!;
    expect(anthropic.requests).toBe(2);
    expect(anthropic.errors).toBe(0);
    expect(anthropic.costUsd).toBeCloseTo(0.000512, 10);
    expect(summary.byModel).toEqual([
      { model: 'deepseek-v3', requests: 9, costUsd: 0.000234 },
      { model: 'claude-3-5', requests: 2, costUsd: 0.000512 },
    ]);
  });

  it('handles an empty snapshot', () => {
    const summary = computeAnalyticsSummary([]);
    expect(summary.overview.totalRequests).toBe(0);
    expect(summary.overview.successRate).toBe(100);
    expect(summary.byProvider).toEqual([]);
    expect(summary.byModel).toEqual([]);
  });
});
