import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { Server } from 'node:http';

// Combo provider group CRUD + execution tests.
const ADMIN_EMAIL = `combo-${Date.now()}@agentx.dev`;
process.env.ENABLE_MOCK_PROVIDER = 'true';
process.env.AUTH_ENABLED = 'true';
process.env.ADMIN_EMAILS = ADMIN_EMAIL;
delete process.env.DATABASE_URL; // DB-less: in-memory store fallback
const { app } = await import('../agentx-server.js');

describe('Combo provider groups API', () => {
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

  it('list groups returns empty array initially', async () => {
    const res = await fetch(`${baseUrl}/v1/admin/provider-groups`, { headers: adminHeaders() });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { groups: unknown[] };
    expect(Array.isArray(body.groups)).toBe(true);
  });

  it('rejects creation with unknown member provider', async () => {
    const res = await fetch(`${baseUrl}/v1/admin/provider-groups`, {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify({ name: 'combo-bad', members: [{ provider: 'does-not-exist' }] }),
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toMatch(/tidak terdaftar/);
  });

  it('creates a group with mock provider members', async () => {
    const res = await fetch(`${baseUrl}/v1/admin/provider-groups`, {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify({
        name: 'combo-e2e',
        description: 'Combo E2E test group',
        strategy: 'priority',
        members: [{ provider: 'openai' }, { provider: 'deepseek' }],
      }),
    });
    expect(res.status).toBe(201);
    const body = (await res.json()) as {
      group: { name: string; strategy: string; members: unknown[] };
    };
    expect(body.group.name).toBe('combo-e2e');
    expect(body.group.strategy).toBe('priority');
    expect(body.group.members).toHaveLength(2);
  });

  it('creates a round-robin group and tests it', async () => {
    const res = await fetch(`${baseUrl}/v1/admin/provider-groups`, {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify({
        name: 'combo-rr',
        strategy: 'round-robin',
        members: [{ provider: 'deepseek' }, { provider: 'openai' }],
      }),
    });
    expect(res.status).toBe(201);

    const testRes = await fetch(`${baseUrl}/v1/admin/provider-groups/combo-rr/test`, {
      method: 'POST',
      headers: adminHeaders(),
    });
    expect(testRes.status).toBe(200);
    const body = (await testRes.json()) as {
      chain: string[];
      usable: boolean;
      members: Array<{ provider: string; registered: boolean }>;
    };
    expect(body.usable).toBe(true);
    expect(body.members.every((m) => m.registered)).toBe(true);
    // Round-robin rotates: chain is a rotation of both members.
    expect(body.chain).toContain('deepseek');
    expect(body.chain).toContain('openai');
  });

  it('rejects duplicate group name with 409', async () => {
    const res = await fetch(`${baseUrl}/v1/admin/provider-groups`, {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify({ name: 'combo-e2e', members: [{ provider: 'openai' }] }),
    });
    expect(res.status).toBe(409);
  });

  it('updates group strategy/members and reflects in test', async () => {
    const res = await fetch(`${baseUrl}/v1/admin/provider-groups/combo-e2e`, {
      method: 'PATCH',
      headers: adminHeaders(),
      body: JSON.stringify({ strategy: 'round-robin', enabled: false }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { group: { strategy: string; enabled: boolean } };
    expect(body.group.strategy).toBe('round-robin');
    expect(body.group.enabled).toBe(false);

    // Disabled group → test shows not usable.
    const testRes = await fetch(`${baseUrl}/v1/admin/provider-groups/combo-e2e/test`, {
      method: 'POST',
      headers: adminHeaders(),
    });
    const testBody = (await testRes.json()) as { usable: boolean };
    expect(testBody.usable).toBe(false);
  });

  it('deletes a group', async () => {
    const res = await fetch(`${baseUrl}/v1/admin/provider-groups/combo-rr`, {
      method: 'DELETE',
      headers: adminHeaders(),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean };
    expect(body.ok).toBe(true);

    const after = await fetch(`${baseUrl}/v1/admin/provider-groups/combo-rr`, {
      headers: adminHeaders(),
    });
    expect(after.status).toBe(404);
  });

  it('requires admin auth (401 without token)', async () => {
    const res = await fetch(`${baseUrl}/v1/admin/provider-groups`);
    expect(res.status).toBe(401);
  });
});
