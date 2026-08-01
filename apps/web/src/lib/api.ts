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

// ─── Beta recruitment API (Phase 3 Week 19-20) ────

export interface WaitlistEntry {
  id: string;
  email: string;
  name?: string;
  source?: string;
  status: 'pending' | 'invited' | 'active';
  createdAt: string;
}

export interface WaitlistStats {
  total: number;
  byStatus: Record<string, number>;
  bySource: Record<string, number>;
  generatedAt: string;
}

export interface FeedbackEntry {
  id: string;
  email?: string;
  category: string;
  message: string;
  rating?: number;
  createdAt: string;
}

export interface WaitlistResponse {
  entry: WaitlistEntry;
  total: number;
}

export interface WaitlistListResponse {
  entries: WaitlistEntry[];
  total: number;
}

export interface FeedbackResponse {
  entry: FeedbackEntry;
  total: number;
}

export async function signupWaitlist(input: {
  email: string;
  name?: string;
  source?: string;
}): Promise<WaitlistResponse> {
  const res = await fetch(`${API_URL}/v1/beta/waitlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    cache: 'no-store',
  });
  const body = (await res.json()) as WaitlistResponse & { error?: string };
  if (!res.ok) {
    throw new Error(body.error ?? `POST /v1/beta/waitlist failed: ${res.status}`);
  }
  return body;
}

export async function fetchWaitlistStats(): Promise<WaitlistStats> {
  return getJson<WaitlistStats>('/v1/beta/waitlist/stats');
}

export async function fetchFeedback(
  limit = 20,
): Promise<{ entries: FeedbackEntry[]; total: number }> {
  return getJson<{ entries: FeedbackEntry[]; total: number }>(`/v1/beta/feedback?limit=${limit}`);
}

export async function submitFeedback(input: {
  email?: string;
  category: string;
  message: string;
  rating?: number;
}): Promise<FeedbackResponse> {
  const res = await fetch(`${API_URL}/v1/beta/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    cache: 'no-store',
  });
  const body = (await res.json()) as FeedbackResponse & { error?: string };
  if (!res.ok) {
    throw new Error(body.error ?? `POST /v1/beta/feedback failed: ${res.status}`);
  }
  return body;
}
