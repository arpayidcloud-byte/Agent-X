// Agent-X API client — dashboard consumes the live API server.
// The API server runs on PORT (default 4000), see apps/api/src/agentx-server.ts.
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export interface ProviderHealth {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  lastChecked: string;
}

export interface HealthReport {
  status: string;
  uptime: number;
  providers: ProviderHealth[];
  timestamp: string;
}

export interface TaskRecord {
  id: string;
  prompt: string;
  description: string;
  status: 'pending' | 'success' | 'error';
  provider?: string;
  model?: string;
  response?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export interface TasksResponse {
  tasks: TaskRecord[];
  total: number;
}

export interface StatsResponse {
  stats: Record<string, number>;
  generatedAt: string;
}

export interface RunResponse {
  message: string;
  provider: string;
  model: string;
  cached: boolean;
  latencyMs: number;
  cost: number;
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`GET ${path} failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export async function fetchHealth(): Promise<HealthReport> {
  return getJson<HealthReport>('/health');
}

export async function fetchStats(): Promise<StatsResponse> {
  return getJson<StatsResponse>('/v1/agentx/stats');
}

export async function fetchTasks(limit = 50): Promise<TasksResponse> {
  return getJson<TasksResponse>(`/v1/agentx/tasks?limit=${limit}`);
}

export async function runTask(prompt: string): Promise<RunResponse> {
  const res = await fetch(`${API_URL}/v1/agentx/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
    cache: 'no-store',
  });
  const body = (await res.json()) as RunResponse & { error?: string };
  if (!res.ok) {
    throw new Error(body.error ?? `POST /v1/agentx/run failed: ${res.status}`);
  }
  return body;
}
