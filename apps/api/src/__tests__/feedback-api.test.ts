import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import type { Server } from 'node:http';

// Mock providers make the router executor work without API keys.
process.env.ENABLE_MOCK_PROVIDER = 'true';
process.env.AUTH_ENABLED = 'true';
process.env.JWT_SECRET = 'test-secret';
// Tests are DB-less: force in-memory backends regardless of DATABASE_URL.
delete process.env.DATABASE_URL;
const { app, resetQualityStore, resetAgentFeedbackStore } = await import('../agentx-server.js');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function asJson<T = any>(res: Response): Promise<T> {
  return (await res.json()) as T;
}

const PROMPT = 'Explain how an API gateway rate limiter works and list the main algorithms';
const SHORT_RESPONSE =
  'An API gateway rate limiter controls how many requests a client can make within a window.';

describe('Agent feedback loop API (Web Pro)', () => {
  let server: Server;
  let baseUrl: string;
  let authHeaders: Record<string, string>;

  beforeAll(async () => {
    server = app.listen(0);
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('no port');
    baseUrl = `http://127.0.0.1:${address.port}`;
    const email = `feedback-${Date.now()}@agentx.dev`;
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
    resetAgentFeedbackStore();
  });

  it('rejects generate without scoreId (400)', async () => {
    const res = await fetch(`${baseUrl}/v1/feedback/generate`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });

  it('returns 404 for an unknown scoreId', async () => {
    const res = await fetch(`${baseUrl}/v1/feedback/generate`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ scoreId: 'qs_nope' }),
    });
    expect(res.status).toBe(404);
  });

  it('generates feedback from a scored output (201) with weak dimensions + improvement prompt', async () => {
    const scoreRes = await fetch(`${baseUrl}/v1/quality/score`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        prompt: PROMPT,
        response: SHORT_RESPONSE,
        provider: 'openai',
        model: 'gpt-4o',
      }),
    });
    expect(scoreRes.status).toBe(201);
    const { score } = await asJson<{ score: { id: string; overall: number } }>(scoreRes);
    expect(score.overall).toBeLessThan(70);

    const res = await fetch(`${baseUrl}/v1/feedback/generate`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ scoreId: score.id }),
    });
    expect(res.status).toBe(201);
    const { feedback } = await asJson<{
      feedback: {
        id: string;
        scoreId: string;
        overall: number;
        weakDimensions: Array<{ name: string; score: number; suggestions: string[] }>;
        priorityAdvice: string[];
        improvementPrompt: string;
      };
    }>(res);
    expect(feedback.scoreId).toBe(score.id);
    expect(feedback.weakDimensions.length).toBeGreaterThan(0);
    expect(feedback.priorityAdvice.length).toBeGreaterThan(0);
    expect(feedback.improvementPrompt).toContain(PROMPT);
    expect(feedback.improvementPrompt).toContain('improve on these points');
  });

  it('reuses existing feedback for the same scoreId', async () => {
    const scoreRes = await fetch(`${baseUrl}/v1/quality/score`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ prompt: PROMPT, response: SHORT_RESPONSE }),
    });
    const { score } = await asJson<{ score: { id: string } }>(scoreRes);

    const first = await fetch(`${baseUrl}/v1/feedback/generate`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ scoreId: score.id }),
    });
    expect(first.status).toBe(201);

    const second = await fetch(`${baseUrl}/v1/feedback/generate`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ scoreId: score.id }),
    });
    expect(second.status).toBe(200);
    const body = await asJson<{ reused: boolean }>(second);
    expect(body.reused).toBe(true);
  });

  it('lists feedback and aggregates stats', async () => {
    const scoreRes = await fetch(`${baseUrl}/v1/quality/score`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ prompt: PROMPT, response: SHORT_RESPONSE }),
    });
    const { score } = await asJson<{ score: { id: string } }>(scoreRes);
    await fetch(`${baseUrl}/v1/feedback/generate`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ scoreId: score.id }),
    });

    const list = await fetch(`${baseUrl}/v1/feedback?limit=10`, {
      headers: { ...authHeaders },
    });
    const { feedback, total } = await asJson<{ feedback: unknown[]; total: number }>(list);
    expect(total).toBe(1);
    expect(feedback.length).toBe(1);

    const statsRes = await fetch(`${baseUrl}/v1/feedback/stats`, {
      headers: { ...authHeaders },
    });
    const { stats } = await asJson<{ stats: { total: number; byGrade: Record<string, number> } }>(
      statsRes,
    );
    expect(stats.total).toBe(1);
    expect(Object.values(stats.byGrade).reduce((a, b) => a + b, 0)).toBe(1);
  });

  it('builds a revision prompt for a follow-up run', async () => {
    const scoreRes = await fetch(`${baseUrl}/v1/quality/score`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ prompt: PROMPT, response: SHORT_RESPONSE }),
    });
    const { score } = await asJson<{ score: { id: string } }>(scoreRes);
    const gen = await fetch(`${baseUrl}/v1/feedback/generate`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ scoreId: score.id }),
    });
    const { feedback } = await asJson<{ feedback: { id: string } }>(gen);

    const rev = await fetch(`${baseUrl}/v1/feedback/${feedback.id}/revision`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ prompt: 'Build a production-grade rate limiter' }),
    });
    expect(rev.status).toBe(200);
    const { revisionPrompt } = await asJson<{ revisionPrompt: string }>(rev);
    expect(revisionPrompt).toContain('Build a production-grade rate limiter');
    expect(revisionPrompt).toContain('improve on these points');
  });

  it('returns 404 for revision of unknown feedback', async () => {
    const res = await fetch(`${baseUrl}/v1/feedback/af_nope/revision`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ prompt: 'x' }),
    });
    expect(res.status).toBe(404);
  });
});
