/**
 * Business metrics for Agent-X observability (§7.1).
 * Registers into the same prom-client registry as llmMetrics so
 * GET /metrics exposes business KPIs alongside LLM & HTTP metrics.
 */
import { Counter, Gauge } from 'prom-client';
import { llmMetrics } from './llm-metrics.js';

const registry = llmMetrics.getRegistry();

export const businessMetrics = {
  /** Incremented when a user joins the waitlist (POST /v1/beta/waitlist). */
  waitlistCreated: new Counter({
    name: 'agentx_waitlist_created_total',
    help: 'Total number of waitlist signups',
    labelNames: ['status'], // 'pending' | 'approved' | 'rejected'
    registers: [registry],
  }),

  /** Incremented when feedback is submitted (POST /v1/beta/feedback). */
  feedbackCreated: new Counter({
    name: 'agentx_feedback_created_total',
    help: 'Total feedback submissions',
    labelNames: ['category', 'rating'],
    registers: [registry],
  }),

  /** Incremented on login / cli-login success or failure. */
  authLogin: new Counter({
    name: 'agentx_auth_login_total',
    help: 'Total login attempts',
    labelNames: ['method', 'status'], // method: 'panel' | 'cli', status: 'success' | 'failure'
    registers: [registry],
  }),

  /** Incremented when a CLI sync token is created. */
  cliTokenCreated: new Counter({
    name: 'agentx_cli_token_created_total',
    help: 'Total CLI sync token creations',
    registers: [registry],
  }),

  /** Incremented on every CostEntry write (per provider). */
  costEntries: new Counter({
    name: 'agentx_cost_entries_total',
    help: 'Total cost entries recorded',
    labelNames: ['provider'],
    registers: [registry],
  }),

  /** Gauge: current number of active subscriptions. */
  activeSubscriptions: new Gauge({
    name: 'agentx_active_subscriptions',
    help: 'Current number of active subscriptions',
    registers: [registry],
  }),
};

/**
 * Convenience: record a business metric from anywhere.
 * Usage: `recordBusiness('auth_login_total', { method: 'panel', status: 'success' })`.
 * Falls back silently for unknown keys (no crash).
 */
export function recordBusiness(
  metric: keyof typeof businessMetrics,
  labels: Record<string, string> = {},
  value = 1,
): void {
  const m = businessMetrics[metric];
  if (m && 'inc' in m) {
    (m as Counter).inc(labels, value);
  }
}
