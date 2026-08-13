import { Counter, Histogram, Gauge, Registry, collectDefaultMetrics } from 'prom-client';

export interface MetricSnapshot {
  name: string;
  help?: string;
  type: string;
  values: Array<{ labels: Record<string, string>; value: number }>;
  [key: string]: unknown;
}

const UNSCOPED_ORG = 'unscoped';

function orgLabel(orgId?: string): string {
  return orgId ?? UNSCOPED_ORG;
}

export class LLMMetrics {
  private registry: Registry;

  // Counters
  private llmRequestsTotal: Counter;
  private llmErrorsTotal: Counter;
  private llmFallbacksTotal: Counter;
  private llmCacheHitsTotal: Counter;
  private llmCostUsdTotal: Counter;

  // Histograms
  private llmLatencyHistogram: Histogram;
  private llmTokenUsageHistogram: Histogram;

  // Gauges
  private llmActiveProviders: Gauge;
  private llmProviderHealth: Gauge;

  constructor() {
    this.registry = new Registry();

    // Node.js runtime + process resource metrics (CPU, memory, event loop, GC)
    collectDefaultMetrics({ register: this.registry });

    // Counter: Total LLM requests
    this.llmRequestsTotal = new Counter({
      name: 'llm_requests_total',
      help: 'Total number of LLM requests',
      labelNames: ['provider', 'model', 'complexity', 'status', 'org_id'],
      registers: [this.registry],
    });

    // Counter: Total LLM errors
    this.llmErrorsTotal = new Counter({
      name: 'llm_errors_total',
      help: 'Total number of LLM errors',
      labelNames: ['provider', 'model', 'error_type', 'org_id'],
      registers: [this.registry],
    });

    // Counter: Total fallbacks
    this.llmFallbacksTotal = new Counter({
      name: 'llm_fallbacks_total',
      help: 'Total number of provider fallbacks',
      labelNames: ['from_provider', 'to_provider', 'reason', 'org_id'],
      registers: [this.registry],
    });

    // Counter: Cache hits
    this.llmCacheHitsTotal = new Counter({
      name: 'llm_cache_hits_total',
      help: 'Total number of cache hits',
      labelNames: ['provider', 'model', 'org_id'],
      registers: [this.registry],
    });

    // Counter: Cost in USD
    this.llmCostUsdTotal = new Counter({
      name: 'llm_cost_usd_total',
      help: 'Total LLM cost in USD',
      labelNames: ['provider', 'model', 'org_id'],
      registers: [this.registry],
    });

    // Histogram: Latency
    this.llmLatencyHistogram = new Histogram({
      name: 'llm_request_latency_seconds',
      help: 'LLM request latency in seconds',
      labelNames: ['provider', 'model', 'org_id'],
      buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
      registers: [this.registry],
    });

    // Histogram: Token usage
    this.llmTokenUsageHistogram = new Histogram({
      name: 'llm_token_usage',
      help: 'LLM token usage per request',
      labelNames: ['provider', 'model', 'type', 'org_id'], // type: 'input' | 'output'
      buckets: [10, 50, 100, 500, 1000, 5000, 10000],
      registers: [this.registry],
    });

    // Gauge: Active providers
    this.llmActiveProviders = new Gauge({
      name: 'llm_active_providers',
      help: 'Number of active LLM providers',
      labelNames: ['org_id'],
      registers: [this.registry],
    });

    // Gauge: Provider health
    this.llmProviderHealth = new Gauge({
      name: 'llm_provider_health',
      help: 'Health status of LLM providers (1=healthy, 0=unhealthy)',
      labelNames: ['provider', 'org_id'],
      registers: [this.registry],
    });
  }

  recordRequest(
    provider: string,
    model: string,
    complexity: string,
    status: 'success' | 'error',
    orgId?: string,
  ) {
    this.llmRequestsTotal.inc({ provider, model, complexity, status, org_id: orgLabel(orgId) });
  }

  recordError(provider: string, model: string, errorType: string, orgId?: string) {
    this.llmErrorsTotal.inc({ provider, model, error_type: errorType, org_id: orgLabel(orgId) });
  }

  recordFallback(fromProvider: string, toProvider: string, reason: string, orgId?: string) {
    this.llmFallbacksTotal.inc({
      from_provider: fromProvider,
      to_provider: toProvider,
      reason,
      org_id: orgLabel(orgId),
    });
  }

  recordCacheHit(provider: string, model: string, orgId?: string) {
    this.llmCacheHitsTotal.inc({ provider, model, org_id: orgLabel(orgId) });
  }

  recordCost(provider: string, model: string, usd: number, orgId?: string) {
    this.llmCostUsdTotal.inc({ provider, model, org_id: orgLabel(orgId) }, usd);
  }

  recordLatency(provider: string, model: string, seconds: number, orgId?: string) {
    this.llmLatencyHistogram.observe({ provider, model, org_id: orgLabel(orgId) }, seconds);
  }

  recordTokenUsage(
    provider: string,
    model: string,
    type: 'input' | 'output',
    tokens: number,
    orgId?: string,
  ) {
    this.llmTokenUsageHistogram.observe({ provider, model, type, org_id: orgLabel(orgId) }, tokens);
  }

  setActiveProviders(count: number, orgId?: string) {
    this.llmActiveProviders.set({ org_id: orgLabel(orgId) }, count);
  }

  setProviderHealth(provider: string, healthy: boolean, orgId?: string) {
    this.llmProviderHealth.set({ provider, org_id: orgLabel(orgId) }, healthy ? 1 : 0);
  }

  async getMetrics(): Promise<string> {
    return await this.registry.metrics();
  }

  getRegistry(): Registry {
    return this.registry;
  }

  /**
   * Raw JSON snapshot of the LLM metrics (llm_* series only) for analytics
   * aggregation. Filtering keeps the payload small and scoped.
   */
  async getSnapshot(orgId?: string): Promise<MetricSnapshot[]> {
    const all = await this.registry.getMetricsAsJSON();
    return all
      .filter((m) => m.name.startsWith('llm_'))
      .map((metric) => ({
        name: metric.name,
        help: metric.help,
        type: String(metric.type),
        values: (orgId
          ? metric.values.filter((value) => value.labels.org_id === orgId)
          : metric.values
        ).map((value) => ({
          labels: Object.fromEntries(
            Object.entries(value.labels).map(([key, label]) => [key, String(label)]),
          ),
          value: Number(value.value),
        })),
      }));
  }
}

// Singleton instance
export const llmMetrics = new LLMMetrics();
