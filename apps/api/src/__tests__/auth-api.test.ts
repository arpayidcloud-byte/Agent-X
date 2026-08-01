import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import type { Server } from 'node:http';

// Auth tests run with AUTH_ENABLED=true so the admin guard is exercised.
process.env.ENABLE_MOCK_PROVIDER = 'true';
process.env.AUTH_ENABLED = 'true';
process.env.ADMIN_EMAILS = 'admin@agentx.dev';
process.env.JWT_SECRET = 'test-secret';
// DB-less: force in-memory backends.
delete process.env.DATABASE_URL;
const { app, resetBetaStores } = await import('../agentx-server.js');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function asJson<T = any>(res: Response): Promise<T> {
  return (await res.json()) as T;
}

describe('Auth API (register/login/me + admin guard)', () => {
  let server: Server;
  let baseUrl: string;

  beforeEach(async () => {
    resetBetaStores();
    if (server) await new Promise((resolve) => server.close(resolve));
    server = app.listen(0);
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('no port');
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    if (server) await new Promise((resolve) => server.close(resolve));
  });

  it('POST /v1/auth/register creates a user (201)', async () => {
    const res = await fetch(`${baseUrl}/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@example.com', password: 'password123' }),
    });
    expect(res.status).toBe(201);
    const body = await asJson(res);
    expect(body.user.email).toBe('user@example.com');
    expect(body.user.roles).toContain('user');
    expect(body.tokens.accessToken).toBeTruthy();
    expect(body.tokens.refreshToken).toBeTruthy();
  });

  it('POST /v1/auth/register rejects weak password (400) and duplicate (409)', async () => {
    const weak = await fetch(`${baseUrl}/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'weak@example.com', password: 'short' }),
    });
    expect(weak.status).toBe(400);

    await fetch(`${baseUrl}/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'dup@example.com', password: 'password123' }),
    });
    const dup = await fetch(`${baseUrl}/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'dup@example.com', password: 'password123' }),
    });
    expect(dup.status).toBe(409);
  });

  it('POST /v1/auth/login returns tokens, wrong password -> 401', async () => {
    await fetch(`${baseUrl}/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'login@example.com', password: 'password123' }),
    });
    const ok = await fetch(`${baseUrl}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'login@example.com', password: 'password123' }),
    });
    expect(ok.status).toBe(200);
    const body = await asJson(ok);
    expect(body.tokens.accessToken).toBeTruthy();

    const bad = await fetch(`${baseUrl}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'login@example.com', password: 'wrongpass' }),
    });
    expect(bad.status).toBe(401);
  });

  it('GET /v1/auth/me requires Bearer token', async () => {
    const noToken = await fetch(`${baseUrl}/v1/auth/me`);
    expect(noToken.status).toBe(401);

    const reg = await fetch(`${baseUrl}/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'me@example.com', password: 'password123' }),
    });
    const { tokens } = await asJson(reg);
    const me = await fetch(`${baseUrl}/v1/auth/me`, {
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });
    expect(me.status).toBe(200);
    const meBody = await asJson(me);
    expect(meBody.user.email).toBe('me@example.com');
  });

  it('admin email gets role admin; non-admin gets 403 on admin endpoints', async () => {
    // Non-admin user
    await fetch(`${baseUrl}/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'staff@example.com', password: 'password123' }),
    });
    const loginRes = await fetch(`${baseUrl}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'staff@example.com', password: 'password123' }),
    });
    const { tokens: staffTokens } = await asJson(loginRes);

    const forbidden = await fetch(`${baseUrl}/v1/beta/waitlist`, {
      headers: { Authorization: `Bearer ${staffTokens.accessToken}` },
    });
    expect(forbidden.status).toBe(403);

    // No token
    const noToken = await fetch(`${baseUrl}/v1/beta/waitlist`);
    expect(noToken.status).toBe(401);

    // Admin (ADMIN_EMAILS=admin@agentx.dev)
    const adminReg = await fetch(`${baseUrl}/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@agentx.dev', password: 'password123' }),
    });
    const adminBody = await asJson(adminReg);
    expect(adminBody.user.roles).toContain('admin');

    const ok = await fetch(`${baseUrl}/v1/beta/waitlist`, {
      headers: { Authorization: `Bearer ${adminBody.tokens.accessToken}` },
    });
    expect(ok.status).toBe(200);
    const list = await asJson(ok);
    expect(list.entries).toEqual([]);
  });

  it('POST /v1/auth/refresh rotates the refresh token', async () => {
    const reg = await fetch(`${baseUrl}/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'refresh@example.com', password: 'password123' }),
    });
    const { tokens } = await asJson(reg);

    const refreshed = await fetch(`${baseUrl}/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    });
    expect(refreshed.status).toBe(200);
    const body = await asJson(refreshed);
    expect(body.accessToken).toBeTruthy();

    // Old refresh token is now invalid
    const reused = await fetch(`${baseUrl}/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    });
    expect(reused.status).toBe(401);
  });
});
