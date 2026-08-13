import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import type { Server } from 'node:http';
import { chunkText, buildChatPrompt, parseChatMessages } from '../chat-stream.js';

// Mock providers must be registered before the server module initializes.
process.env.ENABLE_MOCK_PROVIDER = 'true';
process.env.AUTH_ENABLED = 'true';
process.env.ADMIN_EMAILS = 'admin@agentx.dev';
process.env.JWT_SECRET = 'test-secret';
delete process.env.DATABASE_URL;
const { app } = await import('../agentx-server.js');

async function authHeader(baseUrl: string): Promise<Record<string, string>> {
  const email = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}@agentx.dev`;
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

describe('Chat API (Web Pro)', () => {
  let server: Server;
  let baseUrl: string;

  beforeEach(async () => {
    if (server) await new Promise((resolve) => server.close(resolve));
    server = app.listen(0);
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('no port');
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    if (server) await new Promise((resolve) => server.close(resolve));
  });

  it('POST /v1/agentx/chat returns a routed response with transcript context', async () => {
    const headers = await authHeader(baseUrl);
    const res = await fetch(`${baseUrl}/v1/agentx/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'Hello' },
          { role: 'assistant', content: 'Hi! How can I help?' },
          { role: 'user', content: 'What is Agent-X?' },
        ],
      }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { message: string; provider: string; taskId: string };
    expect(body.message).toBeTruthy();
    expect(body.provider).toBeTruthy();
    expect(body.taskId).toMatch(/^chat-/);
  });

  it('POST /v1/agentx/chat rejects malformed messages with 400', async () => {
    const headers = await authHeader(baseUrl);
    const cases = [
      {},
      { messages: [] },
      { messages: 'nope' },
      { messages: [{ role: 'system', content: 'x' }] },
      { messages: [{ role: 'user', content: '' }] },
    ];
    for (const body of cases) {
      const res = await fetch(`${baseUrl}/v1/agentx/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(body),
      });
      expect(res.status).toBe(400);
    }
  });

  it('POST /v1/agentx/chat/stream returns 202 + SSE start/chunk/complete sequence', async () => {
    const headers = await authHeader(baseUrl);
    const runRes = await fetch(`${baseUrl}/v1/agentx/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Stream this answer' }] }),
    });
    expect(runRes.status).toBe(202);
    const { chatId } = (await runRes.json()) as { chatId: string };

    const controller = new AbortController();
    const res = await fetch(`${baseUrl}/v1/agentx/chat/${chatId}/events`, {
      headers,
      signal: controller.signal,
    });
    expect(res.headers.get('content-type')).toContain('text/event-stream');

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    const events: Array<{ type: string; text?: string }> = [];
    let buf = '';
    const deadline = Date.now() + 10_000;
    while (
      Date.now() < deadline &&
      !events.some((e) => e.type === 'complete' || e.type === 'error')
    ) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const frames = buf.split('\n\n');
      buf = frames.pop() ?? '';
      for (const frame of frames) {
        for (const line of frame.split('\n')) {
          if (line.startsWith('data: ')) {
            events.push(JSON.parse(line.slice(6)) as { type: string; text?: string });
          }
        }
      }
    }
    controller.abort();

    const types = events.map((e) => e.type);
    expect(types[0]).toBe('start');
    expect(events.some((e) => e.type === 'complete')).toBe(true);
    expect(types).toContain('chunk');
    expect(types[types.length - 1]).toBe('complete');
    const chunkCount = events.filter((e) => e.type === 'chunk').length;
    expect(chunkCount).toBeGreaterThan(0);
    const joined = events
      .filter((e) => e.type === 'chunk')
      .map((e) => e.text ?? '')
      .join(' ');
    expect(joined.length).toBeGreaterThan(0);
  });

  it('chunkText splits on word boundaries within maxLen', () => {
    expect(chunkText('')).toEqual(['']);
    expect(chunkText('one two three', 10)).toEqual(['one two', 'three']);
    expect(chunkText('a'.repeat(200), 60).every((c) => c.length <= 60)).toBe(true);
  });

  it('buildChatPrompt formats transcript and bounds history', () => {
    const prompt = buildChatPrompt([
      { role: 'user', content: 'hi' },
      { role: 'assistant', content: 'hello' },
    ]);
    expect(prompt).toBe('User: hi\nAssistant: hello');
  });

  it('parseChatMessages validates payloads', () => {
    expect(parseChatMessages(null)).toBeNull();
    expect(parseChatMessages([])).toBeNull();
    expect(parseChatMessages([{ role: 'user', content: 'ok' }])).toEqual([
      { role: 'user', content: 'ok' },
    ]);
    expect(parseChatMessages([{ role: 'bot', content: 'x' }])).toBeNull();
  });
});
