import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import type { Server } from 'node:http';

// Mock providers must be registered before the server module initializes.
process.env.ENABLE_MOCK_PROVIDER = 'true';
process.env.AUTH_ENABLED = 'true';
process.env.ADMIN_EMAILS = 'admin@agentx.dev';
process.env.JWT_SECRET = 'test-secret';
// Tests are DB-less: force the in-memory beta backend regardless of DATABASE_URL.
delete process.env.DATABASE_URL;
const { app, waitlistStore, feedbackStore, resetBetaStores } = await import('../agentx-server.js');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function asJson<T = any>(res: Response): Promise<T> {
  return (await res.json()) as T;
}

async function adminHeaders(baseUrl: string): Promise<Record<string, string>> {
  const email = 'admin@agentx.dev';
  const password = 'password123';
  // Ensure admin exists — register is idempotent (409 if already exists)
  await fetch(`${baseUrl}/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const loginRes = await fetch(`${baseUrl}/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!loginRes.ok)
    throw new Error(`admin login failed: ${loginRes.status} ${await loginRes.text()}`);
  const body = (await loginRes.json()) as { tokens: { accessToken: string } };
  return { Authorization: `Bearer ${body.tokens.accessToken}` };
}

describe('Beta recruitment API (waitlist + feedback)', () => {
  let server: Server;
  let baseUrl: string;

  beforeEach(async () => {
    resetBetaStores();
    waitlistStore.clear();
    feedbackStore.clear();
    if (server) await new Promise((resolve) => server.close(resolve));
    server = app.listen(0);
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('no port');
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    if (server) await new Promise((resolve) => server.close(resolve));
  });

  it('POST /v1/beta/waitlist creates a pending entry (201)', async () => {
    const res = await fetch(`${baseUrl}/v1/beta/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'beta@example.com', name: 'Beta User', source: 'landing' }),
    });
    expect(res.status).toBe(201);
    const body = await asJson(res);
    expect(body.entry.email).toBe('beta@example.com');
    expect(body.entry.status).toBe('pending');
    expect(body.total).toBe(1);
  });

  it('POST /v1/beta/waitlist rejects invalid email (400)', async () => {
    const res = await fetch(`${baseUrl}/v1/beta/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'not-an-email' }),
    });
    expect(res.status).toBe(400);
    const body = await asJson(res);
    expect(body.error).toContain('email');
  });

  it('POST /v1/beta/waitlist dedupes email (409) and normalizes case', async () => {
    await fetch(`${baseUrl}/v1/beta/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'Dup@Example.com' }),
    });
    const res = await fetch(`${baseUrl}/v1/beta/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'dup@example.com' }),
    });
    expect(res.status).toBe(409);
    const body = await asJson(res);
    expect(body.entry.email).toBe('dup@example.com');
  });

  it('GET /v1/beta/waitlist returns entries sorted newest-first', async () => {
    await fetch(`${baseUrl}/v1/beta/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'first@example.com' }),
    });
    await new Promise((r) => setTimeout(r, 5));
    await fetch(`${baseUrl}/v1/beta/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'second@example.com' }),
    });
    const headers = await adminHeaders(baseUrl);
    const res = await fetch(`${baseUrl}/v1/beta/waitlist`, { headers });
    const body = await asJson(res);
    expect(body.total).toBe(2);
    expect(body.entries[0].email).toBe('second@example.com');
  });

  it('GET /v1/beta/waitlist/stats aggregates byStatus and bySource', async () => {
    await fetch(`${baseUrl}/v1/beta/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'a@example.com', source: 'landing' }),
    });
    await fetch(`${baseUrl}/v1/beta/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'b@example.com', source: 'producthunt' }),
    });
    const res = await fetch(`${baseUrl}/v1/beta/waitlist/stats`);
    const body = await asJson(res);
    expect(body.total).toBe(2);
    expect(body.byStatus.pending).toBe(2);
    expect(body.bySource.landing).toBe(1);
    expect(body.bySource.producthunt).toBe(1);
  });

  it('PATCH /v1/beta/waitlist/:id/status invites an entry (pending -> invited)', async () => {
    const signup = await fetch(`${baseUrl}/v1/beta/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'invite@example.com' }),
    });
    const signupBody = await asJson(signup);
    const id = signupBody.entry.id;

    const headers = await adminHeaders(baseUrl);
    const res = await fetch(`${baseUrl}/v1/beta/waitlist/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ status: 'invited' }),
    });
    expect(res.status).toBe(200);
    const body = await asJson(res);
    expect(body.entry.id).toBe(id);
    expect(body.entry.status).toBe('invited');
  });

  it('PATCH /v1/beta/waitlist/:id/status rejects invalid status (400)', async () => {
    const signup = await fetch(`${baseUrl}/v1/beta/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'invite2@example.com' }),
    });
    const signupBody = await asJson(signup);
    const id = signupBody.entry.id;

    const headers = await adminHeaders(baseUrl);
    const res = await fetch(`${baseUrl}/v1/beta/waitlist/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ status: 'bogus' }),
    });
    expect(res.status).toBe(400);
    const body = await asJson(res);
    expect(body.error).toContain('status');
  });

  it('PATCH /v1/beta/waitlist/:id/status returns 404 for unknown id', async () => {
    const headers = await adminHeaders(baseUrl);
    const res = await fetch(`${baseUrl}/v1/beta/waitlist/nonexistent/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ status: 'active' }),
    });
    expect(res.status).toBe(404);
    const body = await asJson(res);
    expect(body.error).toContain('not found');
  });

  it('POST /v1/beta/feedback creates entry (201) with rating', async () => {
    const res = await fetch(`${baseUrl}/v1/beta/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'beta@example.com',
        category: 'feature',
        message: 'Add streaming output please',
        rating: 5,
      }),
    });
    expect(res.status).toBe(201);
    const body = await asJson(res);
    expect(body.entry.category).toBe('feature');
    expect(body.entry.rating).toBe(5);
    expect(body.total).toBe(1);
  });

  it('POST /v1/beta/feedback rejects invalid category (400)', async () => {
    const res = await fetch(`${baseUrl}/v1/beta/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'bogus', message: 'hello world' }),
    });
    expect(res.status).toBe(400);
    const body = await asJson(res);
    expect(body.error).toContain('category');
  });

  it('POST /v1/beta/feedback rejects invalid rating (400)', async () => {
    const res = await fetch(`${baseUrl}/v1/beta/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'bug', message: 'something broke', rating: 9 }),
    });
    expect(res.status).toBe(400);
    const body = await asJson(res);
    expect(body.error).toContain('rating');
  });

  it('POST /v1/beta/feedback rejects too-short message (400)', async () => {
    const res = await fetch(`${baseUrl}/v1/beta/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'ux', message: 'ok' }),
    });
    expect(res.status).toBe(400);
    const body = await asJson(res);
    expect(body.error).toContain('message');
  });

  it('GET /v1/beta/feedback returns entries sorted newest-first', async () => {
    await fetch(`${baseUrl}/v1/beta/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'bug', message: 'first issue' }),
    });
    await new Promise((r) => setTimeout(r, 5));
    await fetch(`${baseUrl}/v1/beta/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'ux', message: 'second issue' }),
    });
    const headers = await adminHeaders(baseUrl);
    const res = await fetch(`${baseUrl}/v1/beta/feedback`, { headers });
    const body = await asJson(res);
    expect(body.total).toBe(2);
    expect(body.entries[0].message).toBe('second issue');
  });
});
