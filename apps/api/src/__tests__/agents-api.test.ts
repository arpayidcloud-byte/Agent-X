import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { Server } from 'node:http';

// Auth gates the admin guard (matches the deployed env).
// Unique admin email avoids collisions with persisted local postgres data
// (DATABASE_URL may be exported in the shell, activating the Prisma backend).
const ADMIN_EMAIL = `admin-${Date.now()}@agentx.dev`;
process.env.ENABLE_MOCK_PROVIDER = 'true';
process.env.AUTH_ENABLED = 'true';
process.env.ADMIN_EMAILS = ADMIN_EMAIL;
const { app } = await import('../agentx-server.js');

async function registerAndLogin(baseUrl: string): Promise<string> {
  const email = ADMIN_EMAIL;
  const reg = await fetch(`${baseUrl}/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'Test1234!' }),
  });
  expect(reg.status).toBe(201);
  const login = await fetch(`${baseUrl}/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'Test1234!' }),
  });
  const body = (await login.json()) as { tokens: { accessToken: string } };
  return body.tokens.accessToken;
}

describe('Agent configuration API (Web Pro)', () => {
  let server: Server;
  let baseUrl: string;
  let token: string;

  beforeAll(async () => {
    server = app.listen(0);
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('no port');
    baseUrl = `http://127.0.0.1:${address.port}`;
    token = await registerAndLogin(baseUrl);
  });

  afterAll(async () => {
    if (server) await new Promise((resolve) => server.close(resolve));
  });

  it('GET /v1/agents lists the specialist team + model options (public)', async () => {
    const res = await fetch(`${baseUrl}/v1/agents`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      agents: Array<{ id: string; role: string; enabled: boolean }>;
      modelOptions: string[];
    };
    expect(body.agents).toHaveLength(4);
    expect(body.modelOptions.length).toBeGreaterThan(0);
  });

  it('PATCH /v1/agents/:id requires admin (401 without token)', async () => {
    const res = await fetch(`${baseUrl}/v1/agents/agent-coder`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: false }),
    });
    expect(res.status).toBe(401);
  });

  it('PATCH with admin token updates config and validates input', async () => {
    const res = await fetch(`${baseUrl}/v1/agents/agent-coder`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ enabled: false, model: 'openai:gpt-4o-mini', complexity: 'simple' }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      agent: { id: string; enabled: boolean; model: string; complexity: string };
    };
    expect(body.agent.id).toBe('agent-coder');
    expect(body.agent.enabled).toBe(false);
    expect(body.agent.model).toBe('openai:gpt-4o-mini');
    expect(body.agent.complexity).toBe('simple');
  });

  it('PATCH with invalid model returns 400', async () => {
    const res = await fetch(`${baseUrl}/v1/agents/agent-coder`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ model: 'bogus:model' }),
    });
    expect(res.status).toBe(400);
  });

  it('PATCH unknown agent returns 404', async () => {
    const res = await fetch(`${baseUrl}/v1/agents/agent-nope`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ enabled: true }),
    });
    expect(res.status).toBe(404);
  });
});
