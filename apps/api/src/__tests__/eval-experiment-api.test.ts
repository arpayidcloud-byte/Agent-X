import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { Server } from 'node:http';

process.env.AUTH_ENABLED = 'true';
process.env.ADMIN_EMAILS = 'eval-admin@agentx.dev';
process.env.JWT_SECRET = 'test-secret';
delete process.env.DATABASE_URL;

const { app } = await import('../agentx-server.js');

describe('Eval experiment tenant safety', () => {
  let server: Server;
  let baseUrl: string;
  let userToken: string;
  let adminToken: string;

  beforeAll(async () => {
    server = app.listen(0);
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('no port');
    baseUrl = `http://127.0.0.1:${address.port}`;

    for (const email of ['eval-user@agentx.dev', 'eval-admin@agentx.dev']) {
      await fetch(`${baseUrl}/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'password123' }),
      });
    }
    const login = async (email: string) => {
      const response = await fetch(`${baseUrl}/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'password123' }),
      });
      const body = (await response.json()) as { tokens: { accessToken: string } };
      return body.tokens.accessToken;
    };
    userToken = await login('eval-user@agentx.dev');
    adminToken = await login('eval-admin@agentx.dev');
  });

  afterAll(async () => {
    if (server) await new Promise((resolve) => server.close(resolve));
  });

  it('rejects anonymous reads before the disabled endpoint contract', async () => {
    const response = await fetch(`${baseUrl}/v1/eval/experiments`);
    expect(response.status).toBe(401);
  });

  it('returns 410 for authenticated tenantless experiment reads', async () => {
    for (const path of ['/v1/eval/experiments', '/v1/eval/winrates']) {
      const response = await fetch(`${baseUrl}${path}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      expect(response.status).toBe(410);
      await expect(response.json()).resolves.toMatchObject({
        error: 'Eval experiments are unavailable until tenant scoping is migrated',
      });
    }
  });

  it('returns 410 for admin experiment creation instead of writing tenantless data', async () => {
    const response = await fetch(`${baseUrl}/v1/eval/experiment`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'prompt',
        responseA: 'a',
        responseB: 'b',
      }),
    });
    expect(response.status).toBe(410);
  });
});
