import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { Server } from 'node:http';

// Mock providers make the router executor work without API keys.
process.env.ENABLE_MOCK_PROVIDER = 'true';
process.env.AUTH_ENABLED = 'true';
process.env.ADMIN_EMAILS = 'admin@agentx.dev';
process.env.JWT_SECRET = 'test-secret';
delete process.env.DATABASE_URL;
const { app } = await import('../agentx-server.js');

async function authHeader(baseUrl: string): Promise<Record<string, string>> {
  const email = `ma-${Date.now()}-${Math.random().toString(36).slice(2, 6)}@agentx.dev`;
  await fetch(`${baseUrl}/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'Test1234!' }),
  });
  const login = await fetch(`${baseUrl}/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'Test1234!' }),
  });
  const { tokens } = (await login.json()) as { tokens: { accessToken: string } };
  return { Authorization: `Bearer ${tokens.accessToken}` };
}
interface RunResponse {
  runId: string;
  status: string;
  concurrency: number;
}

interface RunDetail {
  run: {
    runId: string;
    status: string;
    concurrency: number;
    goals: Array<{ goalId: string; description: string }>;
    result?: {
      approvedCount: number;
      totalGoals: number;
      goals: Array<{ goalId: string; approved: boolean; iterations: number }>;
    };
    error?: string;
  };
}

describe('Parallel multi-agent API (Web Pro)', () => {
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

  it('rejects empty goals with 400', async () => {
    const headers = await authHeader(baseUrl);
    const res = await fetch(`${baseUrl}/v1/agentx/multi-agent/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ goals: [] }),
    });
    expect(res.status).toBe(400);
  });

  it('rejects non-string goals with 400', async () => {
    const headers = await authHeader(baseUrl);
    const res = await fetch(`${baseUrl}/v1/agentx/multi-agent/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ goals: ['ok', 42] }),
    });
    expect(res.status).toBe(400);
  });

  it('accepts goals, returns 202 + runId, and completes with per-goal results', async () => {
    const headers = await authHeader(baseUrl);
    const res = await fetch(`${baseUrl}/v1/agentx/multi-agent/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({
        goals: ['Design a caching layer', 'Design an auth module'],
        concurrency: 2,
      }),
    });
    expect(res.status).toBe(202);
    const body = (await res.json()) as RunResponse;
    expect(body.runId).toMatch(/^ma-/);
    expect(body.status).toBe('running');
    expect(body.concurrency).toBe(2);

    // Poll the run until it completes (mock providers are fast).
    const detail = await pollUntilDone(baseUrl, body.runId, headers);
    expect(detail.run.status).toBe('completed');
    expect(detail.run.result?.totalGoals).toBe(2);
    expect(detail.run.result?.approvedCount).toBe(2);
    for (const g of detail.run.result?.goals ?? []) {
      expect(g.approved).toBe(true);
      expect(g.iterations).toBeGreaterThanOrEqual(1);
    }
    expect(detail.run.error).toBeUndefined();
  });

  it('clamps concurrency to [1, 4]', async () => {
    const headers = await authHeader(baseUrl);
    const res = await fetch(`${baseUrl}/v1/agentx/multi-agent/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ goals: ['g1'], concurrency: 99 }),
    });
    const body = (await res.json()) as RunResponse;
    expect(body.concurrency).toBe(4);
    await pollUntilDone(baseUrl, body.runId, headers);
  });

  it('returns 404 for unknown runs', async () => {
    const headers = await authHeader(baseUrl);
    const res = await fetch(`${baseUrl}/v1/agentx/multi-agent/ma-nonexistent`, { headers });
    expect(res.status).toBe(404);
  });

  it('rejects anonymous and cross-tenant run status and event reads', async () => {
    const ownerHeaders = await authHeader(baseUrl);
    const otherHeaders = await authHeader(baseUrl);
    const start = await fetch(`${baseUrl}/v1/agentx/multi-agent/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...ownerHeaders },
      body: JSON.stringify({ goals: ['tenant-owned run'] }),
    });
    const { runId } = (await start.json()) as RunResponse;

    expect((await fetch(`${baseUrl}/v1/agentx/multi-agent/${runId}`)).status).toBe(401);
    expect((await fetch(`${baseUrl}/v1/agentx/multi-agent/${runId}/events`)).status).toBe(401);
    expect(
      (await fetch(`${baseUrl}/v1/agentx/multi-agent/${runId}`, { headers: otherHeaders })).status,
    ).toBe(404);
    expect(
      (await fetch(`${baseUrl}/v1/agentx/multi-agent/${runId}/events`, { headers: otherHeaders }))
        .status,
    ).toBe(404);
  });

  it('SSE events endpoint replays run history', async () => {
    const headers = await authHeader(baseUrl);
    const res = await fetch(`${baseUrl}/v1/agentx/multi-agent/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ goals: ['Replay me'] }),
    });
    const body = (await res.json()) as RunResponse;
    await pollUntilDone(baseUrl, body.runId, headers);

    const controller = new AbortController();
    const sse = await fetch(`${baseUrl}/v1/agentx/multi-agent/${body.runId}/events`, {
      headers: { Accept: 'text/event-stream', ...headers },
      signal: controller.signal,
    });
    expect(sse.status).toBe(200);

    // SSE never closes; read until run-complete then abort.
    let text = '';
    const reader = sse.body?.getReader();
    expect(reader).toBeTruthy();
    const decoder = new TextDecoder();
    const timer = setTimeout(() => controller.abort(), 5000);
    try {
      while (reader) {
        const { value, done } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        if (text.includes('run-complete')) break;
      }
    } finally {
      clearTimeout(timer);
      controller.abort();
    }
    expect(text).toContain('run-accepted');
    expect(text).toContain('run-complete');
    expect(text).toContain('goal-start');
  });
});

async function pollUntilDone(
  baseUrl: string,
  runId: string,
  headers: Record<string, string>,
): Promise<RunDetail> {
  for (let i = 0; i < 50; i++) {
    const res = await fetch(`${baseUrl}/v1/agentx/multi-agent/${runId}`, { headers });
    const detail = (await res.json()) as RunDetail;
    if (detail.run.status !== 'running') return detail;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`run ${runId} did not complete in time`);
}
