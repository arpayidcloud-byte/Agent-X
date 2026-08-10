import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import type { Server } from 'node:http';

// Mock providers must be registered before the server module initializes.
process.env.ENABLE_MOCK_PROVIDER = 'true';
process.env.AUTH_ENABLED = 'true';
process.env.ADMIN_EMAILS = 'admin@agentx.dev';
process.env.JWT_SECRET = 'test-secret';
delete process.env.DATABASE_URL;
const { app, taskStore } = await import('../agentx-server.js');

async function authHeader(baseUrl: string): Promise<Record<string, string>> {
  const email = `stream-${Date.now()}-${Math.random().toString(36).slice(2, 6)}@agentx.dev`;
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

describe('Task stream (Web Pro SSE)', () => {
  let server: Server;
  let baseUrl: string;

  beforeEach(async () => {
    taskStore.clear();
    if (server) await new Promise((resolve) => server.close(resolve));
    server = app.listen(0);
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('no port');
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    if (server) await new Promise((resolve) => server.close(resolve));
  });

  it('POST /v1/agentx/run/stream returns 202 with taskId', async () => {
    const headers = await authHeader(baseUrl);
    const res = await fetch(`${baseUrl}/v1/agentx/run/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ prompt: 'stream me', taskId: 'sse-task-1' }),
    });
    expect(res.status).toBe(202);
    const body = (await res.json()) as { taskId: string; status: string };
    expect(body.taskId).toBe('sse-task-1');
    expect(body.status).toBe('accepted');
  });

  it('GET /v1/agentx/tasks/:id/events streams accepted -> generating -> complete', async () => {
    const headers = await authHeader(baseUrl);
    const runRes = await fetch(`${baseUrl}/v1/agentx/run/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ prompt: 'sse events', taskId: 'sse-task-2' }),
    });
    const { taskId } = (await runRes.json()) as { taskId: string };

    const controller = new AbortController();
    const res = await fetch(`${baseUrl}/v1/agentx/tasks/${taskId}/events`, {
      signal: controller.signal,
    });
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/event-stream');

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    const types: string[] = [];
    let buf = '';
    const deadline = Date.now() + 10_000;
    while (Date.now() < deadline && !types.includes('complete')) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const frames = buf.split('\n\n');
      buf = frames.pop() ?? '';
      for (const frame of frames) {
        for (const line of frame.split('\n')) {
          if (line.startsWith('data: ')) {
            const ev = JSON.parse(line.slice(6)) as { type: string };
            types.push(ev.type);
          }
        }
      }
    }
    controller.abort();

    expect(types).toContain('accepted');
    expect(types).toContain('generating');
    expect(types).toContain('complete');
    expect(types.indexOf('accepted')).toBeLessThan(types.indexOf('generating'));
    expect(types.indexOf('generating')).toBeLessThan(types.indexOf('complete'));
  });

  it('streamed task finishes in taskStore with success + response', async () => {
    const headers = await authHeader(baseUrl);
    const res = await fetch(`${baseUrl}/v1/agentx/run/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ prompt: 'store check', taskId: 'sse-task-3' }),
    });
    expect(res.status).toBe(202);
    // Worker completes in ~300ms (2 x STAGE_DELAY_MS + execute).
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const task = taskStore.get('sse-task-3');
    expect(task?.status).toBe('success');
    expect(task?.response).toBeTruthy();
    expect(task?.provider).toBeTruthy();
  });

  it('responds with CORS headers (web UI on :30500 -> API :30400)', async () => {
    const res = await fetch(`${baseUrl}/v1/agentx/tasks`);
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
  });
});
