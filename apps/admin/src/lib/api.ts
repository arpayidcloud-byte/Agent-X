// AgentX Panel API client — talks to the shared AgentX API (api.id-tech.cloud).
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

const TOKEN_KEY = 'agentx_admin_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
}

export function isAuthed(): boolean {
  return getToken() !== null;
}

async function authJson<T>(path: string, options: RequestInit = {}, withAuth = false): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (withAuth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${path}`, { ...options, headers, cache: 'no-store' });
  const body = (await res.json()) as T & { error?: string };
  if (!res.ok) {
    const err = new Error(body.error ?? `${options.method ?? 'GET'} ${path} failed: ${res.status}`);
    (err as Error & { status?: number }).status = res.status;
    throw err;
  }
  return body;
}

// ─── Auth ────

export interface AuthUser {
  id: string;
  email: string;
  roles: string[];
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export async function loginAccount(
  email: string,
  password: string,
  turnstileToken?: string,
): Promise<AuthResponse> {
  return authJson<AuthResponse>('/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, turnstileToken }),
  });
}

export async function fetchMe(): Promise<{ user: AuthUser }> {
  return authJson<{ user: AuthUser }>('/v1/auth/me', {}, true);
}

export function isAdminUser(user: AuthUser): boolean {
  return user.roles.includes('admin');
}

// ─── Admin: LLM providers ────

export type ProviderType = 'openai-compatible' | 'anthropic-compatible';
export type AuthMethod = 'api-key' | 'oauth' | 'account';

export interface LlmProviderView {
  name: string;
  type: ProviderType;
  baseUrl: string;
  apiKeyMasked: string;
  models: string[];
  enabled: boolean;
  provider: string;
  authMethod: AuthMethod;
  accountRef: string | null;
  lastTestAt: string | null;
  lastTestOk: boolean | null;
  updatedAt: string | null;
}

export interface ProviderPreset {
  slug: string;
  label: string;
  type: ProviderType;
  baseUrl: string;
  models: string[];
  docs?: string;
}

export interface LlmUpsertInput {
  name: string;
  type: ProviderType;
  baseUrl: string;
  apiKey: string;
  models: string[];
  enabled?: boolean;
  provider?: string;
  authMethod?: AuthMethod;
}

export async function adminListLlmProviders(): Promise<{ providers: LlmProviderView[] }> {
  return authJson<{ providers: LlmProviderView[] }>('/v1/admin/llm-providers', {}, true);
}

export async function adminCreateLlmProvider(
  input: LlmUpsertInput,
): Promise<{ provider: LlmProviderView }> {
  return authJson<{ provider: LlmProviderView }>(
    '/v1/admin/llm-providers',
    { method: 'POST', body: JSON.stringify(input) },
    true,
  );
}

export async function adminPatchLlmProvider(
  name: string,
  input: Partial<Omit<LlmUpsertInput, 'name'>>,
): Promise<{ provider: LlmProviderView }> {
  return authJson<{ provider: LlmProviderView }>(
    `/v1/admin/llm-providers/${encodeURIComponent(name)}`,
    { method: 'PATCH', body: JSON.stringify(input) },
    true,
  );
}

export async function adminDeleteLlmProvider(name: string): Promise<{ ok: boolean }> {
  return authJson<{ ok: boolean }>(
    `/v1/admin/llm-providers/${encodeURIComponent(name)}`,
    { method: 'DELETE' },
    true,
  );
}

export async function adminTestLlmProvider(
  name: string,
): Promise<{ ok: boolean; latencyMs?: number; cost?: number; error?: string }> {
  return authJson<{ ok: boolean; latencyMs?: number; cost?: number; error?: string }>(
    `/v1/admin/llm-providers/${encodeURIComponent(name)}/test`,
    { method: 'POST' },
    true,
  );
}

export async function adminListPresets(): Promise<{ presets: ProviderPreset[] }> {
  return authJson<{ presets: ProviderPreset[] }>('/v1/admin/llm-providers/presets', {}, true);
}

// ─── Admin: export / import config (API keys never exported) ────

export interface ExportProvider {
  name: string;
  type: ProviderType;
  baseUrl: string;
  models: string[];
  enabled: boolean;
  provider: string;
  authMethod: AuthMethod;
  accountRef: string | null;
  updatedAt: string | null;
}

export interface ImportProviderInput {
  name: string;
  type: ProviderType;
  baseUrl: string;
  models: string[];
  enabled?: boolean;
  provider?: string;
  authMethod?: AuthMethod;
  apiKey?: string;
}

export interface ImportResult {
  imported: number;
  updated: number;
  errors: { name: string; error: string }[];
}

export async function adminExportProviders(): Promise<{
  schema: number;
  exportedAt: string;
  providers: ExportProvider[];
}> {
  return authJson<{ schema: number; exportedAt: string; providers: ExportProvider[] }>(
    '/v1/admin/llm-providers/export',
    {},
    true,
  );
}

export async function adminImportProviders(
  providers: ImportProviderInput[],
): Promise<ImportResult> {
  return authJson<ImportResult>(
    '/v1/admin/llm-providers/import',
    { method: 'POST', body: JSON.stringify({ providers }) },
    true,
  );
}

// ─── Auth: change password ────

export async function changeAccountPassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ ok: boolean }> {
  return authJson<{ ok: boolean }>(
    '/v1/auth/change-password',
    { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) },
    true,
  );
}

// ─── Admin: CLI sync token ────

export interface CliTokenView {
  id: string;
  name: string;
  createdAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
}

export async function adminGetCliToken(): Promise<{ token: CliTokenView | null }> {
  return authJson<{ token: CliTokenView | null }>('/v1/admin/cli/token', {}, true);
}

export async function adminCreateCliToken(name?: string): Promise<{
  token: string;
  view: CliTokenView;
}> {
  return authJson<{ token: string; view: CliTokenView }>(
    '/v1/admin/cli/token',
    { method: 'POST', body: JSON.stringify({ name: name ?? 'default' }) },
    true,
  );
}

export async function adminRevokeCliToken(): Promise<{ ok: boolean }> {
  return authJson<{ ok: boolean }>('/v1/admin/cli/token', { method: 'DELETE' }, true);
}

// ─── Admin: audit log ────

export interface AuditLogEntry {
  id: string;
  email: string;
  action: string;
  target: string;
  detail: Record<string, unknown> | null;
  createdAt: string;
}

export async function adminListAuditLogs(limit = 100): Promise<{ logs: AuditLogEntry[] }> {
  return authJson<{ logs: AuditLogEntry[] }>(`/v1/admin/audit-logs?limit=${limit}`, {}, true);
}

// ─── Admin: dashboard status ────

export async function fetchHealth(): Promise<{ status: string; uptime: number }> {
  const res = await fetch(`${API_URL}/health`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`GET /health failed: ${res.status}`);
  return (await res.json()) as { status: string; uptime: number };
}
