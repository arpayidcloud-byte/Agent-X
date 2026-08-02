// Web Pro analytics: pure aggregation over the prom-client JSON snapshot
// produced by LLMMetrics.getSnapshot(). No side effects — easy to unit test.

export interface MetricJson {
  name: string;
  help?: string;
  type: string;
  values: Array<{ labels: Record<string, string>; value: number }>;
}

export interface AnalyticsSummary {
  generatedAt: string;
  overview: {
    totalRequests: number;
    totalErrors: number;
    successRate: number; // 0-100
    totalCacheHits: number;
    cacheHitRate: number; // 0-100
    totalFallbacks: number;
    activeProviders: number;
    avgLatencyMs: number;
    p50LatencyMs: number;
    p95LatencyMs: number;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  byProvider: Array<{
    provider: string;
    requests: number;
    errors: number;
    avgLatencyMs: number;
    tokens: number;
  }>;
  byModel: Array<{ model: string; requests: number }>;
}

export function findMetric(snapshot: unknown[], name: string): MetricJson | undefined {
  return (snapshot as MetricJson[]).find((m) => m.name === name);
}

export function sumValues(m: MetricJson | undefined): number {
  if (!m) return 0;
  return m.values.reduce((acc, v) => acc + v.value, 0);
}

export function groupByLabel(m: MetricJson | undefined, label: string): Map<string, number> {
  const out = new Map<string, number>();
  if (!m) return out;
  for (const v of m.values) {
    const key = v.labels[label] ?? 'unknown';
    out.set(key, (out.get(key) ?? 0) + v.value);
  }
  return out;
}

export interface HistogramBuckets {
  bounds: number[]; // upper bounds of each bucket, ascending; last is Infinity
  counts: number[]; // cumulative counts per bucket
}

/** Extract cumulative bucket counts from a histogram metric (all series merged). */
export function histogramBuckets(m: MetricJson | undefined): HistogramBuckets {
  const buckets = new Map<string, number>();
  if (m) {
    for (const v of m.values) {
      const le = v.labels.le;
      if (le === undefined) continue;
      buckets.set(le, (buckets.get(le) ?? 0) + v.value);
    }
  }
  const bounds = [...buckets.keys()]
    .map((le) => (le === '+Inf' ? Infinity : Number(le)))
    .sort((a, b) => a - b);
  const counts = bounds.map((b) => buckets.get(b === Infinity ? '+Inf' : String(b)) ?? 0);
  return { bounds, counts };
}

/** Total count from the last cumulative bucket (le=+Inf). */
export function histogramCount(h: HistogramBuckets): number {
  return h.counts.length > 0 ? (h.counts[h.counts.length - 1] ?? 0) : 0;
}

/** Approximate sum from bucket midpoints × deltas. */
export function histogramSum(h: HistogramBuckets): number {
  let sum = 0;
  let prevBound = 0;
  let prevCount = 0;
  for (let i = 0; i < h.bounds.length; i++) {
    const bound = h.bounds[i] ?? 0;
    const count = h.counts[i] ?? 0;
    const delta = count - prevCount;
    const upper = bound === Infinity ? prevBound * 2 + prevBound : bound;
    const mid = (prevBound + upper) / 2;
    sum += delta * mid;
    prevBound = upper;
    prevCount = count;
  }
  return sum;
}

/** Approximate percentile from cumulative buckets with linear interpolation. */
export function histogramPercentile(h: HistogramBuckets, p: number): number {
  const count = histogramCount(h);
  if (count === 0) return 0;
  const target = p * count;
  let prevBound = 0;
  let prevCount = 0;
  for (let i = 0; i < h.bounds.length; i++) {
    const bound = h.bounds[i] ?? 0;
    const cum = h.counts[i] ?? 0;
    if (cum >= target) {
      const upper = bound === Infinity ? prevBound * 2 + prevBound : bound;
      const span = cum - prevCount;
      if (span <= 0) return upper;
      const frac = (target - prevCount) / span;
      return prevBound + frac * (upper - prevBound);
    }
    prevBound = bound === Infinity ? prevBound : bound;
    prevCount = cum;
  }
  return prevBound;
}

export function computeAnalyticsSummary(
  snapshot: unknown[],
  generatedAt = new Date().toISOString(),
): AnalyticsSummary {
  const requests = findMetric(snapshot, 'llm_requests_total');
  const errors = findMetric(snapshot, 'llm_errors_total');
  const cacheHits = findMetric(snapshot, 'llm_cache_hits_total');
  const fallbacks = findMetric(snapshot, 'llm_fallbacks_total');
  const activeProviders = findMetric(snapshot, 'llm_active_providers');
  const latency = findMetric(snapshot, 'llm_request_latency_seconds');
  const tokens = findMetric(snapshot, 'llm_token_usage');

  const totalRequests = sumValues(requests);
  const totalErrors = sumValues(errors);
  const totalCacheHits = sumValues(cacheHits);
  const totalFallbacks = sumValues(fallbacks);

  const latencyBuckets = histogramBuckets(latency);
  const latencyCount = histogramCount(latencyBuckets);
  const latencySum = histogramSum(latencyBuckets);

  // Token histogram has a `type` label (input|output) — split by it.
  const tokenTypes = new Set<string>();
  if (tokens) {
    for (const v of tokens.values) {
      if (v.labels.le !== undefined) tokenTypes.add(v.labels.type ?? 'unknown');
    }
  }
  const tokenByType = new Map<string, HistogramBuckets>();
  for (const t of tokenTypes) {
    const filtered: MetricJson = {
      name: tokens?.name ?? 'llm_token_usage',
      type: 'histogram',
      values: (tokens?.values ?? []).filter((v) => (v.labels.type ?? 'unknown') === t),
    };
    tokenByType.set(t, histogramBuckets(filtered));
  }
  const inputTokens = histogramCount(tokenByType.get('input') ?? { bounds: [], counts: [] });
  const outputTokens = histogramCount(tokenByType.get('output') ?? { bounds: [], counts: [] });

  // Per-provider breakdown: requests, errors, latency, tokens.
  const providerRequests = groupByLabel(requests, 'provider');
  const providerErrors = groupByLabel(errors, 'provider');
  const providerLatencySum = new Map<string, number>();
  const providerLatencyCount = new Map<string, number>();
  if (latency) {
    const providerSet = new Set<string>();
    for (const v of latency.values) {
      if (v.labels.le !== undefined) providerSet.add(v.labels.provider ?? 'unknown');
    }
    for (const p of providerSet) {
      const filtered: MetricJson = {
        name: latency.name,
        type: 'histogram',
        values: latency.values.filter((v) => (v.labels.provider ?? 'unknown') === p),
      };
      const h = histogramBuckets(filtered);
      providerLatencySum.set(p, histogramSum(h));
      providerLatencyCount.set(p, histogramCount(h));
    }
  }
  const providerTokens = new Map<string, number>();
  if (tokens) {
    for (const v of tokens.values) {
      if (v.labels.le === '+Inf') {
        const p = v.labels.provider ?? 'unknown';
        providerTokens.set(p, (providerTokens.get(p) ?? 0) + v.value);
      }
    }
  }

  const providers = new Set([
    ...providerRequests.keys(),
    ...providerErrors.keys(),
    ...providerLatencyCount.keys(),
    ...providerTokens.keys(),
  ]);
  const byProvider = [...providers]
    .map((provider) => {
      const count = providerLatencyCount.get(provider) ?? 0;
      const sum = providerLatencySum.get(provider) ?? 0;
      return {
        provider,
        requests: providerRequests.get(provider) ?? 0,
        errors: providerErrors.get(provider) ?? 0,
        avgLatencyMs: count > 0 ? Math.round((sum / count) * 1000) : 0,
        tokens: providerTokens.get(provider) ?? 0,
      };
    })
    .sort((a, b) => b.requests - a.requests);

  const byModel = [...groupByLabel(requests, 'model').entries()]
    .map(([model, count]) => ({ model, requests: count }))
    .sort((a, b) => b.requests - a.requests);

  const activeCount = sumValues(activeProviders);
  const avgLatencyMs = latencyCount > 0 ? Math.round((latencySum / latencyCount) * 1000) : 0;

  return {
    generatedAt,
    overview: {
      totalRequests,
      totalErrors,
      successRate:
        totalRequests > 0
          ? Math.round(((totalRequests - totalErrors) / totalRequests) * 1000) / 10
          : 100,
      totalCacheHits,
      cacheHitRate:
        totalRequests > 0 ? Math.round((totalCacheHits / totalRequests) * 1000) / 10 : 0,
      totalFallbacks,
      activeProviders: activeCount,
      avgLatencyMs,
      p50LatencyMs: Math.round(histogramPercentile(latencyBuckets, 0.5) * 1000),
      p95LatencyMs: Math.round(histogramPercentile(latencyBuckets, 0.95) * 1000),
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
    },
    byProvider,
    byModel,
  };
}
