import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import type { Server } from 'node:http';

// Mock providers must be registered before the server module initializes.
process.env.ENABLE_MOCK_PROVIDER = 'true';
const { app, waitlistStore, feedbackStore } = await import('../agentx-server.js');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function asJson<T = any>(res: Response): Promise<T> {
  return (await res.json()) as T;
}

describe('Beta recruitment API (waitlist + feedback)', () => {
  let server: Server;
  let baseUrl: string;

  beforeEach(async () => {
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
    const res = await fetch(`${baseUrl}/v1/beta/waitlist`);
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
    const res = await fetch(`${baseUrl}/v1/beta/feedback`);
    const body = await asJson(res);
    expect(body.total).toBe(2);
    expect(body.entries[0].message).toBe('second issue');
  });
});
