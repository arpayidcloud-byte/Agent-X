import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { Server } from 'node:http';
import { createServer } from 'node:http';

// Admin LLM provider management API tests.
const ADMIN_EMAIL = `admin-llm-${Date.now()}@agentx.dev`;
process.env.ENABLE_MOCK_PROVIDER = 'true';
process.env.AUTH_ENABLED = 'true';
process.env.ADMIN_EMAILS = ADMIN_EMAIL;
delete process.env.DATABASE_URL; // DB-less: in-memory store fallback
const { app } = await import('../agentx-server.js');

// Minimal OpenAI-compatible stub so the "test connection" endpoint can
// actually hit a real HTTP server (no external network needed).
function startStub(): Promise<{ server: Server; url: string }> {
  return new Promise((resolve) => {
    const server = createStubServer();
    server.listen(0, () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      resolve({ server, url: `http://127.0.0.1:${port}/v1` });
    });
  });
}

function createStubServer(): Server {
  return createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.method === 'POST' && req.url === '/v1/chat/completions') {
      res.end(
        JSON.stringify({
          choices: [{ message: { content: 'pong' } }],
          usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
        }),
      );
      return;
    }
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'not found' }));
  });
}

describe('Admin LLM provider API', () => {
  let server: Server;
  let baseUrl: string;
  let token: string;
  let stub: Server;
  let stubUrl: string;

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
    token = body.tokens.accessToken;

    const stubRes = await startStub();
    stub = stubRes.server;
    stubUrl = stubRes.url;
  });

  afterAll(async () => {
    if (stub) await new Promise((resolve) => stub.close(resolve));
    if (server) await new Promise((resolve) => server.close(resolve));
  });

  function authHeaders(): Record<string, string> {
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  }

  it('requires auth (401 for missing token)', async () => {
    const res = await fetch(`${baseUrl}/v1/admin/llm-providers`);
    expect(res.status).toBe(401);
  });

  it('creates a provider (201) and lists it with masked key', async () => {
    const create = await fetch(`${baseUrl}/v1/admin/llm-providers`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        name: 'stub-provider',
        type: 'openai-compatible',
        baseUrl: stubUrl,
        apiKey: 'sk-test-1234567890',
        models: ['stub-model'],
      }),
    });
    expect(create.status).toBe(201);

    const list = await fetch(`${baseUrl}/v1/admin/llm-providers`, { headers: authHeaders() });
    const body = (await list.json()) as {
      providers: { name: string; apiKeyMasked: string; models: string[] }[];
    };
    const p = body.providers.find((x) => x.name === 'stub-provider');
    expect(p).toBeTruthy();
    expect(p?.apiKeyMasked).not.toContain('sk-test-1234567890');
    expect(p?.apiKeyMasked).toBe('sk-***890');
    expect(p?.models).toEqual(['stub-model']);
  });

  it('rejects invalid payloads (400)', async () => {
    const res = await fetch(`${baseUrl}/v1/admin/llm-providers`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ name: 'Bad Name!', type: 'weird', baseUrl: 'nope', apiKey: 'x' }),
    });
    expect(res.status).toBe(400);
  });

  it('tests provider connection against the stub (ok:true)', async () => {
    const res = await fetch(`${baseUrl}/v1/admin/llm-providers/stub-provider/test`, {
      method: 'POST',
      headers: authHeaders(),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; model: string };
    expect(body.ok).toBe(true);
    expect(body.model).toBe('stub-model');
  });

  it('deletes provider (ok:true) then 404 on next fetch', async () => {
    const del = await fetch(`${baseUrl}/v1/admin/llm-providers/stub-provider`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    expect(del.status).toBe(200);

    const list = await fetch(`${baseUrl}/v1/admin/llm-providers`, { headers: authHeaders() });
    const body = (await list.json()) as { providers: { name: string }[] };
    expect(body.providers.find((x) => x.name === 'stub-provider')).toBeUndefined();
  });
});
