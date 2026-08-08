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
import type { HealthResponse, TaskItem, ProviderInfo, CostSummary, DeckData } from './types.js';

export { isCloudAuthed, loadCloudConfig, getApiUrl };

/** Check API health. */
export async function fetchHealth(): Promise<HealthResponse> {
  const res = await cloudFetch<HealthResponse>('/health');
  return res;
}

/** Fetch the Command Deck aggregate (system/agents/task/logs/stats) in one poll. */
export async function fetchDeck(): Promise<DeckData> {
  const res = await cloudFetch<DeckData>('/v1/agentx/deck');
  return res;
}

/** Fetch recent tasks from cloud API. Throws on 401/403 (session expired). */
export async function fetchTasks(limit = 20): Promise<TaskItem[]> {
  if (!isCloudAuthed()) return [];
  try {
    const res = await cloudFetch<{ tasks: TaskItem[]; total: number }>(
      `/v1/agentx/tasks?limit=${limit}`,
    );
    return res.tasks ?? [];
  } catch (e) {
    const status = (e as Error & { status?: number }).status;
    if (status === 401 || status === 403) throw e;
    return [];
  }
}

/** Fetch active LLM providers (public endpoint — admin-only /v1/admin/llm-providers
 * would 403 for non-admin roles and bounce the TUI back to login). */
export async function fetchProviders(): Promise<ProviderInfo[]> {
  if (!isCloudAuthed()) return [];
  try {
    const res = await cloudFetch<{ providers: ProviderInfo[] }>('/v1/agentx/providers');
    return res.providers ?? [];
  } catch (e) {
    const status = (e as Error & { status?: number }).status;
    if (status === 401 || status === 403) throw e;
    return [];
  }
}

/** Fetch cost summary. Throws on 401/403 (session expired). */
export async function fetchCost(): Promise<CostSummary> {
  if (!isCloudAuthed()) return { totalCost: 0, byProvider: {}, byModel: {} };
  try {
    const res = await cloudFetch<CostSummary>('/v1/cost/summary');
    return res ?? { totalCost: 0, byProvider: {}, byModel: {} };
  } catch (e) {
    const status = (e as Error & { status?: number }).status;
    if (status === 401 || status === 403) throw e;
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
