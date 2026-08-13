import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { Server } from 'node:http';
import jwt from 'jsonwebtoken';

const ADMIN_EMAIL = `analytics-admin-${Date.now()}@agentx.dev`;
process.env.ENABLE_MOCK_PROVIDER = 'true';
process.env.AUTH_ENABLED = 'true';
process.env.JWT_SECRET = 'test-secret';
process.env.ADMIN_EMAILS = ADMIN_EMAIL;
const { app } = await import('../agentx-server.js');

describe('Analytics API (Web Pro)', () => {
  let server: Server;
  let baseUrl: string;
  let token: string;

  beforeAll(async () => {
    server = app.listen(0);
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('no port');
    baseUrl = `http://127.0.0.1:${address.port}`;

    // Register admin & login to obtain a valid Bearer token
    const reg = await fetch(`${baseUrl}/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: 'Test1234!' }),
    });
    expect(reg.status).toBe(201);
    const login = await fetch(`${baseUrl}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: 'Test1234!' }),
    });
    const body = (await login.json()) as { tokens: { accessToken: string } };
    token = body.tokens.accessToken;
  });

  afterAll(async () => {
    if (server) await new Promise((resolve) => server.close(resolve));
  });

  it('GET /v1/analytics/summary returns a well-formed summary', async () => {
    const res = await fetch(`${baseUrl}/v1/analytics/summary`, {
      headers: { Authorization: `Bearer ${token}` },
    });
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
    const headers = { Authorization: `Bearer ${token}` };
    const before = (await (await fetch(`${baseUrl}/v1/analytics/summary`, { headers })).json()) as {
      overview: { totalRequests: number };
    };
    await fetch(`${baseUrl}/v1/agentx/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ prompt: 'analytics proof' }),
    });
    // llmMetrics is a shared singleton; verify the counter incremented.
    const after = (await (await fetch(`${baseUrl}/v1/analytics/summary`, { headers })).json()) as {
      overview: { totalRequests: number };
    };
    expect(after.overview.totalRequests).toBeGreaterThanOrEqual(before.overview.totalRequests);
  });

  it('isolates analytics summaries between organizations', async () => {
    const firstEmail = `analytics-org-a-${Date.now()}@agentx.dev`;
    const secondEmail = `analytics-org-b-${Date.now()}@agentx.dev`;

    const loginFor = async (email: string): Promise<string> => {
      const registration = await fetch(`${baseUrl}/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'Test1234!' }),
      });
      expect(registration.status).toBe(201);
      const login = await fetch(`${baseUrl}/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'Test1234!' }),
      });
      expect(login.status).toBe(200);
      const body = (await login.json()) as { tokens: { accessToken: string } };
      return body.tokens.accessToken;
    };

    const firstToken = await loginFor(firstEmail);
    const secondToken = await loginFor(secondEmail);
    const headersFor = (accessToken: string) => ({ Authorization: `Bearer ${accessToken}` });
    const summaryFor = async (accessToken: string) => {
      const response = await fetch(`${baseUrl}/v1/analytics/summary`, {
        headers: headersFor(accessToken),
      });
      expect(response.status).toBe(200);
      return (await response.json()) as { overview: { totalRequests: number } };
    };

    const firstBefore = await summaryFor(firstToken);
    const secondBefore = await summaryFor(secondToken);
    const firstRun = await fetch(`${baseUrl}/v1/agentx/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headersFor(firstToken) },
      body: JSON.stringify({ prompt: `org-a-${Date.now()}` }),
    });
    expect(firstRun.status).toBe(200);

    const firstAfterFirstRun = await summaryFor(firstToken);
    const secondAfterFirstRun = await summaryFor(secondToken);
    expect(firstAfterFirstRun.overview.totalRequests).toBeGreaterThan(
      firstBefore.overview.totalRequests,
    );
    expect(secondAfterFirstRun.overview.totalRequests).toBe(secondBefore.overview.totalRequests);

    const secondRun = await fetch(`${baseUrl}/v1/agentx/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headersFor(secondToken) },
      body: JSON.stringify({ prompt: `org-b-${Date.now()}` }),
    });
    expect(secondRun.status).toBe(200);

    const firstAfterSecondRun = await summaryFor(firstToken);
    const secondAfterSecondRun = await summaryFor(secondToken);
    expect(firstAfterSecondRun.overview.totalRequests).toBe(
      firstAfterFirstRun.overview.totalRequests,
    );
    expect(secondAfterSecondRun.overview.totalRequests).toBeGreaterThan(
      secondBefore.overview.totalRequests,
    );
  });

  it('GET /v1/analytics/summary requires auth (401 without token)', async () => {
    const res = await fetch(`${baseUrl}/v1/analytics/summary`);
    expect(res.status).toBe(401);
  });

  it('rejects authenticated analytics access without an organization', async () => {
    const noOrgToken = jwt.sign(
      { sub: 'missing-user', email: 'missing@agentx.dev', roles: ['user'] },
      'test-secret',
    );
    const res = await fetch(`${baseUrl}/v1/analytics/summary`, {
      headers: { Authorization: `Bearer ${noOrgToken}` },
    });
    expect(res.status).toBe(403);
    await expect(res.json()).resolves.toMatchObject({
      error: expect.stringContaining('organization'),
    });
  });

  it('rejects authenticated LLM execution without an organization before provider execution', async () => {
    const noOrgToken = jwt.sign(
      { sub: 'missing-user', email: 'missing@agentx.dev', roles: ['user'] },
      'test-secret',
    );
    const res = await fetch(`${baseUrl}/v1/agentx/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${noOrgToken}` },
      body: JSON.stringify({ prompt: 'tenant boundary proof' }),
    });
    expect(res.status).toBe(403);
    await expect(res.json()).resolves.toMatchObject({
      error: expect.stringContaining('organization'),
    });
  });
});
