import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { Server } from 'node:http';
import { llmMetrics } from '@agent-xai/observability';

process.env.ENABLE_MOCK_PROVIDER = 'true';
process.env.AUTH_ENABLED = 'true';
process.env.ADMIN_EMAILS = 'admin@agentx.dev';
process.env.JWT_SECRET = 'test-secret';
delete process.env.DATABASE_URL;
const { app } = await import('../agentx-server.js');

async function authHeader(baseUrl: string): Promise<Record<string, string>> {
  const email = `deck-${Date.now()}-${Math.random().toString(36).slice(2, 6)}@agentx.dev`;
  await fetch(`${baseUrl}/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'Test1234!' }),
  });
  const login = await fetch(`${baseUrl}/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'Test1234!' }),
  });
  const { tokens } = (await login.json()) as { tokens: { accessToken: string } };
  return { Authorization: `Bearer ${tokens.accessToken}` };
}

interface DeckPayload {
  generatedAt: string;
  system: { cpu: number; memUsedGb: number; memTotalGb: number; memPct: number };
  agents: Array<{ id: string; name: string; role: string; status: string }>;
  task: {
    id: string;
    description: string;
    status: string;
    progress: number;
    tokensIn: number;
    tokensOut: number;
    files: { modified: number; created: number };
    elapsedMs: number;
  } | null;
  logs: Array<{ at: string; level: string; agent: string; type: string; message: string }>;
  stats: { totalTasks: number; totalCostUsd: number; totalTokens: number };
}

describe('Command Deck API (Web Pro)', () => {
  let server: Server;
  let baseUrl: string;
  let deckHeaders: Record<string, string>;

  beforeAll(async () => {
    server = app.listen(0);
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('no port');
    baseUrl = `http://127.0.0.1:${address.port}`;
    deckHeaders = await authHeader(baseUrl);
  });

  afterAll(async () => {
    if (server) await new Promise((resolve) => server.close(resolve));
  });

  async function getDeck(): Promise<DeckPayload> {
    const res = await fetch(`${baseUrl}/v1/agentx/deck`, { headers: deckHeaders });
    expect(res.status).toBe(200);
    return (await res.json()) as DeckPayload;
  }

  it('GET /v1/agentx/deck returns a well-formed aggregate', async () => {
    const deck = await getDeck();
    expect(typeof deck.generatedAt).toBe('string');
    // Real host metrics from node:os.
    expect(deck.system.cpu).toBeGreaterThanOrEqual(0);
    expect(deck.system.cpu).toBeLessThanOrEqual(100);
    expect(deck.system.memTotalGb).toBeGreaterThan(0);
    expect(deck.system.memPct).toBeGreaterThanOrEqual(0);
    expect(deck.system.memPct).toBeLessThanOrEqual(100);
    // Shape contracts.
    expect(Array.isArray(deck.agents)).toBe(true);
    expect(Array.isArray(deck.logs)).toBe(true);
    expect(typeof deck.stats.totalTasks).toBe('number');
  });

  it('scopes metric totals to the authenticated organization', async () => {
    const token = deckHeaders['Authorization']!.split(' ')[1]!;
    const payload = JSON.parse(Buffer.from(token.split('.')[1]!, 'base64url').toString()) as {
      sub: string;
    };
    const ownOrg = `memory-org-${payload.sub}`;
    llmMetrics.recordCost('test-deck', 'model-a', 1.25, ownOrg);
    llmMetrics.recordCost('test-deck', 'model-b', 9.5, 'org-deck-b');
    llmMetrics.recordTokenUsage('test-deck', 'model-a', 'input', 10, ownOrg);
    llmMetrics.recordTokenUsage('test-deck', 'model-a', 'output', 10, ownOrg);
    llmMetrics.recordTokenUsage('test-deck', 'model-b', 'input', 100, 'org-deck-b');
    llmMetrics.recordTokenUsage('test-deck', 'model-b', 'output', 100, 'org-deck-b');

    const deck = await getDeck();
    expect(deck.stats.totalCostUsd).toBe(1.25);
    expect(deck.stats.totalTokens).toBe(22);
  });
  it('records a run/stream task and reflects real progress + token usage in deck.task', async () => {
    const start = Date.now();
    const headers = deckHeaders;
    const res = await fetch(`${baseUrl}/v1/agentx/run/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ prompt: 'deck proof task', description: 'deck proof' }),
    });
    expect(res.status).toBe(202);
    const { taskId } = (await res.json()) as { taskId: string };

    // Poll until the task completes (mock provider resolves in ms).
    let deck: DeckPayload | null = null;
    for (let i = 0; i < 50; i += 1) {
      deck = await getDeck();
      if (deck.task?.id === taskId && deck.task.status === 'success') break;
      await new Promise((r) => setTimeout(r, 100));
    }
    expect(deck?.task?.id).toBe(taskId);
    expect(deck?.task?.status).toBe('success');
    expect(deck?.task?.progress).toBe(100);
    expect(typeof deck?.task?.tokensIn).toBe('number');
    expect(typeof deck?.task?.tokensOut).toBe('number');
    expect(typeof deck?.task?.files.modified).toBe('number');
    expect(typeof deck?.task?.elapsedMs).toBe('number');
    expect(deck?.task?.elapsedMs).toBeGreaterThanOrEqual(0);
    // The run should have produced at least the accepted + complete events.
    const taskLogs = deck?.logs.filter((l) => l.agent === 'task' && l.type === 'complete') ?? [];
    expect(taskLogs.length).toBeGreaterThan(0);
    expect(Date.now() - start).toBeLessThan(15_000);
  });

  it('deck.logs entries are sorted newest-first and well-formed', async () => {
    const deck = await getDeck();
    if (deck.logs.length > 1) {
      for (let i = 1; i < deck.logs.length; i += 1) {
        expect(deck.logs[i - 1]!.at >= deck.logs[i]!.at).toBe(true);
      }
    }
    for (const log of deck.logs) {
      expect(typeof log.at).toBe('string');
      expect(['info', 'warn', 'error']).toContain(log.level);
      expect(typeof log.agent).toBe('string');
      expect(typeof log.message).toBe('string');
    }
  });

  it('GET /v1/agentx/providers is public (no auth) and returns safe provider info', async () => {
    const res = await fetch(`${baseUrl}/v1/agentx/providers`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { providers: Array<Record<string, unknown>> };
    expect(Array.isArray(body.providers)).toBe(true);
    for (const p of body.providers) {
      expect(typeof p.name).toBe('string');
      expect(typeof p.isActive).toBe('boolean');
      expect(Array.isArray(p.models)).toBe(true);
      // Secret-free contract: no apiKey/baseUrl may leak through the public view.
      expect('apiKey' in p).toBe(false);
      expect('baseUrl' in p).toBe(false);
    }
  });
});
