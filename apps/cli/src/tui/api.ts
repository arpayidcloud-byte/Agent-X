/**
 * TUI API helpers — wraps cloud-api.ts for ink React context.
 * Provides fetch wrappers that return typed data for each panel.
 */
import {
  isCloudAuthed,
  cloudFetch,
  loadCloudConfig,
  saveCloudConfig,
  getApiUrl,
} from '../lib/cloud-api.js';
import type { HealthResponse, TaskItem, ProviderInfo, CostSummary } from './types.js';

export { isCloudAuthed, loadCloudConfig, getApiUrl };

/** Check API health. */
export async function fetchHealth(): Promise<HealthResponse> {
  const res = await cloudFetch<HealthResponse>('/health');
  return res;
}

/** Fetch stats summary. */
export async function fetchStats(): Promise<{
  total: number;
  active: number;
  completed: number;
  failed: number;
}> {
  try {
    const res = await cloudFetch<{
      stats: { total: number; active: number; completed: number; failed: number };
    }>('/v1/stats');
    return res.stats ?? { total: 0, active: 0, completed: 0, failed: 0 };
  } catch {
    return { total: 0, active: 0, completed: 0, failed: 0 };
  }
}

/** Fetch recent tasks from cloud API. */
export async function fetchTasks(limit = 20): Promise<TaskItem[]> {
  if (!isCloudAuthed()) return [];
  try {
    const res = await cloudFetch<{ tasks: TaskItem[]; total: number }>(
      `/v1/agentx/tasks?limit=${limit}`,
    );
    return res.tasks ?? [];
  } catch {
    return [];
  }
}

/** Fetch active LLM providers. */
export async function fetchProviders(): Promise<ProviderInfo[]> {
  if (!isCloudAuthed()) return [];
  try {
    const res = await cloudFetch<{ providers: ProviderInfo[] }>('/v1/admin/llm-providers');
    return res.providers ?? [];
  } catch {
    return [];
  }
}

/** Fetch cost summary. */
export async function fetchCost(): Promise<CostSummary> {
  if (!isCloudAuthed()) return { totalCost: 0, byProvider: {}, byModel: {} };
  try {
    const res = await cloudFetch<CostSummary>('/v1/cost/summary');
    return res ?? { totalCost: 0, byProvider: {}, byModel: {} };
  } catch {
    return { totalCost: 0, byProvider: {}, byModel: {} };
  }
}

/** Login via cloud API — returns user info on success. */
export async function loginApi(
  email: string,
  password: string,
): Promise<{ email: string; roles: string[] }> {
  const res = await cloudFetch<{
    tokens: { accessToken: string; refreshToken?: string };
    user: { id: string; email: string; roles: string[] };
  }>('/v1/auth/cli-login', {
    method: 'POST',
    body: { email, password },
  });
  // Save token for subsequent requests
  saveCloudConfig({ apiToken: res.tokens.accessToken });
  return { email: res.user.email, roles: res.user.roles };
}
