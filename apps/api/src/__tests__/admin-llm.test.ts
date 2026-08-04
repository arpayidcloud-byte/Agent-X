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

const TEST_KEY = 'sk-test-1234567890';
const TEST_KEY_MASKED = 'sk-***890';

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

  it('exposes the native provider preset gallery', async () => {
    const res = await fetch(`${baseUrl}/v1/admin/llm-providers/presets`, {
      headers: authHeaders(),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { presets: Array<{ slug: string; baseUrl: string }> };
    const slugs = body.presets.map((p) => p.slug);
    expect(slugs).toEqual(
      expect.arrayContaining([
        'openai',
        'grok',
        'deepseek',
        'qwen',
        'claude',
        'gemini',
        'openrouter',
      ]),
    );
    const grok = body.presets.find((p) => p.slug === 'grok');
    expect(grok?.baseUrl).toContain('x.ai');
  });

  it('creates a provider (201) and lists it with masked key', async () => {
    const create = await fetch(`${baseUrl}/v1/admin/llm-providers`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        name: 'stub-provider',
        type: 'openai-compatible',
        baseUrl: stubUrl,
        apiKey: TEST_KEY,
        models: ['stub-model'],
        provider: 'deepseek',
        authMethod: 'api-key',
      }),
    });
    expect(create.status).toBe(201);

    const list = await fetch(`${baseUrl}/v1/admin/llm-providers`, { headers: authHeaders() });
    const body = (await list.json()) as {
      providers: Array<{
        name: string;
        apiKeyMasked: string;
        models: string[];
        provider: string;
        authMethod: string;
      }>;
    };
    const p = body.providers.find((x) => x.name === 'stub-provider');
    expect(p).toBeTruthy();
    expect(p?.apiKeyMasked).toBe(TEST_KEY_MASKED);
    expect(p?.models).toEqual(['stub-model']);
    expect(p?.provider).toBe('deepseek');
    expect(p?.authMethod).toBe('api-key');
  });

  it('rejects invalid payloads (400)', async () => {
    const res = await fetch(`${baseUrl}/v1/admin/llm-providers`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ name: 'Bad Name!', type: 'weird', baseUrl: 'nope', apiKey: 'x' }),
    });
    expect(res.status).toBe(400);
  });

  it('PATCH updates fields; keeps existing key when apiKey omitted', async () => {
    // Disable + change provider slug without sending a new apiKey.
    const patch = await fetch(`${baseUrl}/v1/admin/llm-providers/stub-provider`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ enabled: false, provider: 'qwen' }),
    });
    expect(patch.status).toBe(200);
    const body = (await patch.json()) as {
      provider: { enabled: boolean; provider: string; apiKeyMasked: string };
    };
    expect(body.provider.enabled).toBe(false);
    expect(body.provider.provider).toBe('qwen');
    // Key unchanged (still the original masked value).
    expect(body.provider.apiKeyMasked).toBe(TEST_KEY_MASKED);

    // Rotate the key via PATCH with a new apiKey.
    const rotate = await fetch(`${baseUrl}/v1/admin/llm-providers/stub-provider`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ apiKey: 'sk-rotated-abcdef123' }),
    });
    expect(rotate.status).toBe(200);
    const rotated = (await rotate.json()) as { provider: { apiKeyMasked: string } };
    expect(rotated.provider.apiKeyMasked).toBe('sk-***123');

    // Re-enable for the connection test below.
    await fetch(`${baseUrl}/v1/admin/llm-providers/stub-provider`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ enabled: true }),
    });
  });

  it('tests provider connection against the stub (ok:true) and records result', async () => {
    const res = await fetch(`${baseUrl}/v1/admin/llm-providers/stub-provider/test`, {
      method: 'POST',
      headers: authHeaders(),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; model: string };
    expect(body.ok).toBe(true);
    expect(body.model).toBe('stub-model');

    const list = await fetch(`${baseUrl}/v1/admin/llm-providers`, { headers: authHeaders() });
    const lb = (await list.json()) as {
      providers: Array<{ name: string; lastTestOk: boolean | null; lastTestAt: string | null }>;
    };
    const p = lb.providers.find((x) => x.name === 'stub-provider');
    expect(p?.lastTestOk).toBe(true);
    expect(p?.lastTestAt).toBeTruthy();
  });

  it('writes audit log entries for mutations', async () => {
    const res = await fetch(`${baseUrl}/v1/admin/audit-logs`, { headers: authHeaders() });
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      logs: Array<{ action: string; target: string; email: string }>;
    };
    const actions = body.logs.map((l) => `${l.action}:${l.target}`);
    expect(actions).toContain('create:stub-provider');
    expect(actions).toContain('update:stub-provider');
    expect(actions).toContain('test:stub-provider');
    expect(body.logs.every((l) => l.email === ADMIN_EMAIL)).toBe(true);
  });

  it('exports providers without any API key material', async () => {
    const res = await fetch(`${baseUrl}/v1/admin/llm-providers/export`, {
      headers: authHeaders(),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      schema: number;
      exportedAt: string;
      providers: Array<Record<string, unknown>>;
    };
    expect(body.schema).toBe(1);
    const raw = JSON.stringify(body);
    expect(raw).not.toMatch(/apiKey|secret|sk-/i);
    const p = body.providers.find((x) => x.name === 'stub-provider');
    expect(p?.models).toEqual(['stub-model']);
    expect(p?.baseUrl).toBe(stubUrl);
    expect(p?.enabled).toBe(true);
  });

  it('imports: creates new providers (with key), updates existing (keeps key), reports errors', async () => {
    const res = await fetch(`${baseUrl}/v1/admin/llm-providers/import`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        providers: [
          // 1) brand-new provider WITH a key → imported
          {
            name: 'imported-new',
            type: 'openai-compatible',
            baseUrl: stubUrl,
            apiKey: TEST_KEY,
            models: ['imported-model'],
            provider: 'custom',
          },
          // 2) existing provider WITHOUT a key → updated, key preserved
          {
            name: 'stub-provider',
            type: 'openai-compatible',
            baseUrl: stubUrl,
            models: ['stub-model'],
          },
          // 3) brand-new provider WITHOUT a key → error
          { name: 'imported-nokey', type: 'openai-compatible', baseUrl: stubUrl, models: ['x'] },
        ],
      }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      imported: number;
      updated: number;
      errors: Array<{ name: string; error: string }>;
    };
    expect(body.imported).toBe(1);
    expect(body.updated).toBe(1);
    expect(body.errors).toHaveLength(1);
    expect(body.errors[0]?.name).toBe('imported-nokey');

    const list = await fetch(`${baseUrl}/v1/admin/llm-providers`, { headers: authHeaders() });
    const lb = (await list.json()) as {
      providers: Array<{ name: string; apiKeyMasked: string; models: string[] }>;
    };
    const imported = lb.providers.find((x) => x.name === 'imported-new');
    expect(imported?.apiKeyMasked).toBe(TEST_KEY_MASKED);
    const existing = lb.providers.find((x) => x.name === 'stub-provider');
    expect(existing?.apiKeyMasked).toBe('sk-***123'); // key preserved (rotated earlier, not blanked)
    expect(existing?.models).toEqual(['stub-model']);
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

    const audit = await fetch(`${baseUrl}/v1/admin/audit-logs`, { headers: authHeaders() });
    const ab = (await audit.json()) as { logs: Array<{ action: string; target: string }> };
    expect(ab.logs.map((l) => `${l.action}:${l.target}`)).toContain('delete:stub-provider');
  });
});
