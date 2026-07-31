import { Counter } from 'prom-client';
import { llmMetrics } from '@agent-xai/observability';

/**
 * HTTP-level metrics for the Agent-X API server.
 * Uses the shared prom-client registry from llmMetrics so that
 * GET /metrics exposes http_requests_total alongside LLM metrics.
 */
export class HttpMetrics {
  private readonly httpRequestsTotal: Counter;

  constructor() {
    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests handled by the API server',
      labelNames: ['method', 'route', 'status'],
      registers: [llmMetrics.getRegistry()],
    });
  }

  recordRequest(method: string, route: string, status: number): void {
    this.httpRequestsTotal.inc({ method, route, status: String(status) });
  }
}

export const httpMetrics = new HttpMetrics();
