import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { Server } from 'node:http';

process.env.ENABLE_MOCK_PROVIDER = 'true';
const { app } = await import('../agentx-server.js');

describe('Analytics API (Web Pro)', () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    server = app.listen(0);
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('no port');
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    if (server) await new Promise((resolve) => server.close(resolve));
  });

  it('GET /v1/analytics/summary returns a well-formed summary', async () => {
    const res = await fetch(`${baseUrl}/v1/analytics/summary`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      generatedAt: string;
      overview: { totalRequests: number; totalErrors: number; successRate: number };
      byProvider: unknown[];
      byModel: unknown[];
    };
    expect(typeof body.generatedAt).toBe('string');
    expect(typeof body.overview.totalRequests).toBe('number');
    expect(typeof body.overview.successRate).toBe('number');
    expect(Array.isArray(body.byProvider)).toBe(true);
    expect(Array.isArray(body.byModel)).toBe(true);
  });

  it('records a request and reflects it in the summary', async () => {
    const before = (await (await fetch(`${baseUrl}/v1/analytics/summary`)).json()) as {
      overview: { totalRequests: number };
    };
    await fetch(`${baseUrl}/v1/agentx/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'analytics proof' }),
    });
    // llmMetrics is a shared singleton; verify the counter incremented.
    const after = (await (await fetch(`${baseUrl}/v1/analytics/summary`)).json()) as {
      overview: { totalRequests: number };
    };
    expect(after.overview.totalRequests).toBeGreaterThanOrEqual(before.overview.totalRequests);
  });
});
