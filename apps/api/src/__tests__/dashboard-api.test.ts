import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import type { Server } from 'node:http';

process.env.ENABLE_MOCK_PROVIDER = 'true';
process.env.AUTH_ENABLED = 'true';
process.env.ADMIN_EMAILS = 'admin@agentx.dev';
process.env.JWT_SECRET = 'test-secret';
delete process.env.DATABASE_URL;
const { app, taskStore } = await import('../agentx-server.js');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function asJson<T = any>(res: Response): Promise<T> {
  return (await res.json()) as T;
}
async function authHeader(baseUrl: string): Promise<Record<string, string>> {
  const email = `dash-${Date.now()}-${Math.random().toString(36).slice(2, 6)}@agentx.dev`;
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

describe('Dashboard API (task store, stats)', () => {
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

  it('POST /v1/agentx/run records a task and GET /v1/agentx/tasks returns it', async () => {
    const headers = await authHeader(baseUrl);
    const runRes = await fetch(`${baseUrl}/v1/agentx/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ prompt: 'Hello from dashboard test', taskId: 'test-task-1' }),
    });
    expect(runRes.status).toBe(200);
    const runBody = await asJson(runRes);
    expect(runBody.provider).toBeTruthy();
    expect(runBody.message).toBeTruthy();

    const tasksRes = await fetch(`${baseUrl}/v1/agentx/tasks`, { headers });
    expect(tasksRes.status).toBe(200);
    const tasksBody = await asJson(tasksRes);
    expect(tasksBody.total).toBe(1);
    expect(tasksBody.tasks[0].id).toBe('test-task-1');
    expect(tasksBody.tasks[0].status).toBe('success');
    expect(tasksBody.tasks[0].provider).toBeTruthy();
    expect(tasksBody.tasks[0].response).toBeTruthy();
  });

  it('GET /v1/agentx/tasks respects limit and orders newest first', async () => {
    const headers = await authHeader(baseUrl);
    for (let i = 0; i < 5; i++) {
      await fetch(`${baseUrl}/v1/agentx/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ prompt: `task ${i}`, taskId: `limit-task-${i}` }),
      });
    }
    const res = await fetch(`${baseUrl}/v1/agentx/tasks?limit=2`, { headers });
    const body = await asJson(res);
    expect(body.tasks.length).toBe(2);
    expect(body.total).toBe(5);
    expect(body.tasks[0].id).toBe('limit-task-4');
    expect(body.tasks[1].id).toBe('limit-task-3');
  });

  it('POST /v1/agentx/run without prompt returns 400 and records nothing', async () => {
    const headers = await authHeader(baseUrl);
    const res = await fetch(`${baseUrl}/v1/agentx/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
    const body = await asJson(res);
    expect(body.error).toContain('prompt');
    const tasks = await asJson(await fetch(`${baseUrl}/v1/agentx/tasks`, { headers }));
    expect(tasks.total).toBe(0);
  });

  it('scopes task list to the authenticated organization and rejects anonymous reads', async () => {
    const ownerHeaders = await authHeader(baseUrl);
    const otherHeaders = await authHeader(baseUrl);
    await fetch(`${baseUrl}/v1/agentx/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...ownerHeaders },
      body: JSON.stringify({ prompt: 'tenant-owned task', taskId: 'tenant-owned-task' }),
    });

    const anonymous = await fetch(`${baseUrl}/v1/agentx/tasks`);
    expect(anonymous.status).toBe(401);

    const other = await fetch(`${baseUrl}/v1/agentx/tasks`, { headers: otherHeaders });
    expect(other.status).toBe(200);
    expect((await asJson(other)).total).toBe(0);

    const owner = await fetch(`${baseUrl}/v1/agentx/tasks`, { headers: ownerHeaders });
    expect(owner.status).toBe(200);
    expect((await asJson(owner)).total).toBe(1);
  });

  it('requires authentication for tenant dashboard stats', async () => {
    const anonymous = await fetch(`${baseUrl}/v1/agentx/stats`);
    expect(anonymous.status).toBe(401);
  });

  it('GET /v1/agentx/stats returns metric totals as JSON', async () => {
    const headers = await authHeader(baseUrl);
    // Fire one request so at least llm_requests_total > 0
    await fetch(`${baseUrl}/v1/agentx/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ prompt: 'stats probe', taskId: 'stats-task-1' }),
    });
    const res = await fetch(`${baseUrl}/v1/agentx/stats`, { headers });
    expect(res.status).toBe(200);
    const body = await asJson(res);
    expect(body.generatedAt).toBeTruthy();
    expect(typeof body.stats).toBe('object');
    expect(body.stats.llm_requests_total).toBeGreaterThanOrEqual(1);
  });
});
