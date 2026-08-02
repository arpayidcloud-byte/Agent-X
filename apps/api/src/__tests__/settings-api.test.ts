import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { Server } from 'node:http';

// Auth gates the admin guard (matches the deployed env). Unique admin email
// avoids collisions with persisted local postgres data.
const ADMIN_EMAIL = `team-${Date.now()}@agentx.dev`;
process.env.ENABLE_MOCK_PROVIDER = 'true';
process.env.AUTH_ENABLED = 'true';
process.env.ADMIN_EMAILS = ADMIN_EMAIL;
const { app } = await import('../agentx-server.js');

describe('Settings & Team API (Web Pro)', () => {
  let server: Server;
  let baseUrl: string;
  let token: string;
  let memberEmail: string;

  beforeAll(async () => {
    server = app.listen(0);
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('no port');
    baseUrl = `http://127.0.0.1:${address.port}`;

    // Admin registers
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

    // A regular member registers (so the team list has >1 row)
    memberEmail = `member-${Date.now()}@agentx.dev`;
    const mreg = await fetch(`${baseUrl}/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: memberEmail, password: 'Test1234!' }),
    });
    expect(mreg.status).toBe(201);
  });

  afterAll(async () => {
    if (server) await new Promise((resolve) => server.close(resolve));
  });

  it('POST /v1/auth/change-password rejects wrong current password', async () => {
    const res = await fetch(`${baseUrl}/v1/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ currentPassword: 'WrongPass1!', newPassword: 'NewPass123!' }),
    });
    expect(res.status).toBe(401);
  });

  it('POST /v1/auth/change-password works and new password is usable', async () => {
    const res = await fetch(`${baseUrl}/v1/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ currentPassword: 'Test1234!', newPassword: 'NewPass123!' }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean };
    expect(body.ok).toBe(true);

    // Old password no longer works
    const oldLogin = await fetch(`${baseUrl}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: 'Test1234!' }),
    });
    expect(oldLogin.status).toBe(401);

    // New password works
    const newLogin = await fetch(`${baseUrl}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: 'NewPass123!' }),
    });
    expect(newLogin.status).toBe(200);
  });

  it('GET /v1/team requires admin (401 without token)', async () => {
    const res = await fetch(`${baseUrl}/v1/team`);
    expect(res.status).toBe(401);
  });

  it('GET /v1/team lists users without password hashes', async () => {
    const res = await fetch(`${baseUrl}/v1/team`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      users: Array<{ id: string; email: string; roles: string[] }>;
    };
    expect(body.users.length).toBeGreaterThanOrEqual(2);
    const emails = body.users.map((u) => u.email);
    expect(emails).toContain(ADMIN_EMAIL);
    expect(emails).toContain(memberEmail);
    // No passwordHash field leaks
    expect(JSON.stringify(body)).not.toContain('passwordHash');
    const admin = body.users.find((u) => u.email === ADMIN_EMAIL);
    expect(admin?.roles).toContain('admin');
  });
});
