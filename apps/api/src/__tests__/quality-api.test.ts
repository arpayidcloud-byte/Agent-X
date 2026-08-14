import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import type { Server } from 'node:http';

// Mock providers make the router executor work without API keys.
process.env.ENABLE_MOCK_PROVIDER = 'true';
process.env.AUTH_ENABLED = 'true';
process.env.JWT_SECRET = 'test-secret';
// Tests are DB-less: force the in-memory quality backend regardless of DATABASE_URL.
delete process.env.DATABASE_URL;
const { app, resetQualityStore } = await import('../agentx-server.js');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function asJson<T = any>(res: Response): Promise<T> {
  return (await res.json()) as T;
}

const GOOD_PROMPT = 'Explain how an API gateway rate limiter works and list the main algorithms';
const GOOD_RESPONSE =
  'An API gateway rate limiter controls how many requests a client can make within a window. ' +
  'The main algorithms are:\n\n- Token bucket: tokens refill at a fixed rate.\n' +
  '- Leaky bucket: requests are processed at a constant rate.\n' +
  '- Fixed window: a counter resets at the end of each window.\n\n' +
  'Token bucket is the most common choice because it allows bursts while bounding the average rate.';

describe('Quality scoring API (Web Pro)', () => {
  let server: Server;
  let baseUrl: string;
  let authHeaders: Record<string, string>;

  beforeAll(async () => {
    server = app.listen(0);
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('no port');
    baseUrl = `http://127.0.0.1:${address.port}`;
    const email = `quality-${Date.now()}@agentx.dev`;
    await fetch(`${baseUrl}/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password123' }),
    });
    const login = await fetch(`${baseUrl}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password123' }),
    });
    const body = await asJson<{ tokens: { accessToken: string } }>(login);
    authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${body.tokens.accessToken}`,
    };
  });

  afterAll(async () => {
    if (server) await new Promise((resolve) => server.close(resolve));
  });

  beforeEach(() => {
    resetQualityStore();
  });

  it('rejects missing fields with 400', async () => {
    const res = await fetch(`${baseUrl}/v1/quality/score`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ prompt: 'hi' }),
    });
    expect(res.status).toBe(400);
  });

  it('scores a prompt+response and persists the result (201)', async () => {
    const res = await fetch(`${baseUrl}/v1/quality/score`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        prompt: GOOD_PROMPT,
        response: GOOD_RESPONSE,
        provider: 'openai',
        model: 'gpt-4o',
      }),
    });
    expect(res.status).toBe(201);
    const body = await asJson<{
      score: {
        id: string;
        overall: number;
        grade: string;
        evaluator: string;
        dimensions: { dimensions: unknown[] };
        provider?: string;
        model?: string;
      };
    }>(res);
    expect(body.score.id).toMatch(/^qs_/);
    expect(body.score.overall).toBeGreaterThanOrEqual(0);
    expect(body.score.overall).toBeLessThanOrEqual(100);
    expect(body.score.grade).toBeTruthy();
    expect(body.score.evaluator).toBe('heuristic');
    expect(body.score.dimensions.dimensions).toHaveLength(6);
    expect(body.score.provider).toBe('openai');
    expect(body.score.model).toBe('gpt-4o');
  });

  it('scores poorly when the response is empty', async () => {
    const res = await fetch(`${baseUrl}/v1/quality/score`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ prompt: GOOD_PROMPT, response: '' }),
    });
    expect(res.status).toBe(201);
    const body = await asJson<{ score: { overall: number; grade: string } }>(res);
    expect(body.score.overall).toBeLessThan(60);
    expect(body.score.grade).toBe('Poor');
  });

  it('lists recent scores via GET /v1/quality/scores', async () => {
    await fetch(`${baseUrl}/v1/quality/score`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ prompt: GOOD_PROMPT, response: GOOD_RESPONSE }),
    });
    const res = await fetch(`${baseUrl}/v1/quality/scores?limit=10`, {
      headers: { ...authHeaders },
    });
    expect(res.status).toBe(200);
    const body = await asJson<{ scores: unknown[]; total: number }>(res);
    expect(body.scores.length).toBeGreaterThanOrEqual(1);
    expect(body.total).toBeGreaterThanOrEqual(1);
  });

  it('aggregates stats via GET /v1/quality/stats', async () => {
    await fetch(`${baseUrl}/v1/quality/score`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ prompt: GOOD_PROMPT, response: GOOD_RESPONSE }),
    });
    const res = await fetch(`${baseUrl}/v1/quality/stats`, {
      headers: { ...authHeaders },
    });
    expect(res.status).toBe(200);
    const body = await asJson<{
      stats: {
        total: number;
        avgOverall: number;
        byGrade: Record<string, number>;
        byProvider: Record<string, number>;
        byEvaluator: Record<string, number>;
      };
    }>(res);
    expect(body.stats.total).toBeGreaterThanOrEqual(1);
    expect(typeof body.stats.avgOverall).toBe('number');
    expect(body.stats.byGrade).toBeTruthy();
    expect(body.stats.byProvider).toBeTruthy();
    expect(body.stats.byEvaluator).toBeTruthy();
  });
});
