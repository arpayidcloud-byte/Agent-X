import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { Server } from 'node:http';

// CLI sync token + `agentx config pull` endpoint tests.
const ADMIN_EMAIL = `cli-${Date.now()}@agentx.dev`;
process.env.ENABLE_MOCK_PROVIDER = 'true';
process.env.AUTH_ENABLED = 'true';
process.env.ADMIN_EMAILS = ADMIN_EMAIL;
delete process.env.DATABASE_URL; // DB-less: in-memory store fallback
const { app } = await import('../agentx-server.js');

describe('CLI sync API', () => {
  let server: Server;
  let baseUrl: string;
  let adminToken: string;

  beforeAll(async () => {
    server = app.listen(0);
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('no port');
    baseUrl = `http://127.0.0.1:${address.port}`;

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
    adminToken = body.tokens.accessToken;
  });

  afterAll(async () => {
    if (server) await new Promise((resolve) => server.close(resolve));
  });

  function adminHeaders(): Record<string, string> {
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` };
  }

  it('admin endpoints require auth (401)', async () => {
    const get = await fetch(`${baseUrl}/v1/admin/cli/token`);
    expect(get.status).toBe(401);
    const post = await fetch(`${baseUrl}/v1/admin/cli/token`, { method: 'POST' });
    expect(post.status).toBe(401);
    const del = await fetch(`${baseUrl}/v1/admin/cli/token`, { method: 'DELETE' });
    expect(del.status).toBe(401);
  });

  it('no active token initially (null)', async () => {
    const res = await fetch(`${baseUrl}/v1/admin/cli/token`, { headers: adminHeaders() });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { token: unknown };
    expect(body.token).toBeNull();
  });

  it('creates a token; plaintext returned once, status shows hashed view', async () => {
    const res = await fetch(`${baseUrl}/v1/admin/cli/token`, {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify({ name: 'dev-laptop' }),
    });
    expect(res.status).toBe(201);
    const body = (await res.json()) as { token: string; view: { name: string } };
    expect(body.token).toMatch(/^agxt_/);
    expect(body.view.name).toBe('dev-laptop');

    const status = await fetch(`${baseUrl}/v1/admin/cli/token`, { headers: adminHeaders() });
    const sb = (await status.json()) as { token: { name: string } | null };
    expect(sb.token?.name).toBe('dev-laptop');

    // The plaintext must NOT be readable back from the status endpoint.
    expect(JSON.stringify(sb)).not.toContain(body.token);
  });

  it('CLI config requires a valid bearer token (401 without / with bad token)', async () => {
    const noToken = await fetch(`${baseUrl}/v1/cli/config`);
    expect(noToken.status).toBe(401);
    const badToken = await fetch(`${baseUrl}/v1/cli/config`, {
      headers: { Authorization: 'Bearer agxt_invalid' },
    });
    expect(badToken.status).toBe(401);
  });

  it('CLI config pulls provider list (no apiKey material) and bumps lastUsedAt', async () => {
    const created = await fetch(`${baseUrl}/v1/admin/cli/token`, {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify({ name: 'puller' }),
    });
    const { token } = (await created.json()) as { token: string };

    const res = await fetch(`${baseUrl}/v1/cli/config`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { schema: number; providers: unknown[] };
    expect(body.schema).toBe(2);
    expect(Array.isArray(body.providers)).toBe(true);
    expect(JSON.stringify(body)).not.toMatch(/apiKey|secret|sk-/i);

    const status = await fetch(`${baseUrl}/v1/admin/cli/token`, { headers: adminHeaders() });
    const sb = (await status.json()) as { token: { lastUsedAt: string | null } | null };
    expect(sb.token?.lastUsedAt).toBeTruthy();
  });

  it('revoked token is rejected by the CLI config endpoint', async () => {
    const created = await fetch(`${baseUrl}/v1/admin/cli/token`, {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify({ name: 'to-revoke' }),
    });
    const { token } = (await created.json()) as { token: string };

    const revoke = await fetch(`${baseUrl}/v1/admin/cli/token`, {
      method: 'DELETE',
      headers: adminHeaders(),
    });
    expect(revoke.status).toBe(200);

    const res = await fetch(`${baseUrl}/v1/cli/config`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(401);

    // Status: no active token remains (single-active-token policy).
    const status = await fetch(`${baseUrl}/v1/admin/cli/token`, { headers: adminHeaders() });
    const sb = (await status.json()) as { token: { revokedAt: string | null } | null };
    expect(sb.token).toBeNull();
  });
});
