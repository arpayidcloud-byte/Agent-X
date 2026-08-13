import { describe, expect, it } from 'vitest';
import { LLMMetrics } from './llm-metrics.js';

describe('LLMMetrics tenant isolation', () => {
  it('keeps analytics snapshots isolated by organization', async () => {
    const metrics = new LLMMetrics();

    metrics.recordRequest('openai', 'gpt-4o', 'medium', 'success', 'org-a');
    metrics.recordRequest('openai', 'gpt-4o', 'medium', 'success', 'org-b');
    metrics.recordCost('openai', 'gpt-4o', 0.25, 'org-a');

    const orgA = await metrics.getSnapshot('org-a');
    const orgB = await metrics.getSnapshot('org-b');

    expect(orgA.find((metric) => metric.name === 'llm_requests_total')?.values).toHaveLength(1);
    expect(orgA.find((metric) => metric.name === 'llm_cost_usd_total')?.values).toHaveLength(1);
    expect(orgB.find((metric) => metric.name === 'llm_requests_total')?.values).toHaveLength(1);
    expect(orgB.find((metric) => metric.name === 'llm_cost_usd_total')?.values).toHaveLength(0);
  });
});
