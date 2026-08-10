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

// ─── Quality scoring ────
export interface QualityDimensionRecord {
  name: string;
  score: number;
  weight: number;
  notes: string[];
}

export interface QualityScoreRecord {
  id: string;
  taskId?: string;
  prompt: string;
  response: string;
  provider?: string;
  model?: string;
  dimensions: { dimensions: QualityDimensionRecord[]; overall: number };
  overall: number;
  grade: string;
  evaluator: string;
  createdAt: string;
}

export interface QualityScoresResponse {
  scores: QualityScoreRecord[];
  total: number;
}

export interface QualityStats {
  total: number;
  avgOverall: number;
  byGrade: Record<string, number>;
  byProvider: Record<string, number>;
  byEvaluator: Record<string, number>;
}

export async function fetchQualityScores(limit = 50): Promise<QualityScoresResponse> {
  return getJson<QualityScoresResponse>(`/v1/quality/scores?limit=${limit}`);
}

export async function fetchQualityStats(): Promise<{ stats: QualityStats; generatedAt: string }> {
  return getJson<{ stats: QualityStats; generatedAt: string }>('/v1/quality/stats');
}

export async function postQualityScore(input: {
  prompt: string;
  response: string;
  provider?: string;
  model?: string;
}): Promise<{ score: QualityScoreRecord }> {
  const res = await fetch(`${API_URL}/v1/quality/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(`POST /v1/quality/score failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as { score: QualityScoreRecord };
}

// ─── Agent feedback loop ────
export interface AgentFeedbackWeakDimension {
  name: string;
  score: number;
  weight: number;
  suggestions: string[];
  notes: string[];
}

export interface AgentFeedbackRecord {
  id: string;
  scoreId: string;
  taskId?: string;
  prompt: string;
  response: string;
  overall: number;
  grade: string;
  weakDimensions: AgentFeedbackWeakDimension[];
  priorityAdvice: string[];
  improvementPrompt: string;
  createdAt: string;
}

export interface AgentFeedbackStats {
  total: number;
  byGrade: Record<string, number>;
}

export async function fetchAgentFeedback(
  limit = 20,
): Promise<{ feedback: AgentFeedbackRecord[]; total: number }> {
  return getJson<{ feedback: AgentFeedbackRecord[]; total: number }>(`/v1/feedback?limit=${limit}`);
}

export async function fetchAgentFeedbackStats(): Promise<{
  stats: AgentFeedbackStats;
  generatedAt: string;
}> {
  return getJson<{ stats: AgentFeedbackStats; generatedAt: string }>('/v1/feedback/stats');
}

export async function postAgentFeedbackGenerate(scoreId: string): Promise<{
  feedback: AgentFeedbackRecord;
  reused?: boolean;
}> {
  const res = await fetch(`${API_URL}/v1/feedback/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scoreId }),
  });
  if (!res.ok) {
    throw new Error(`POST /v1/feedback/generate failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as { feedback: AgentFeedbackRecord; reused?: boolean };
}

export async function postAgentFeedbackRevision(
  feedbackId: string,
  prompt: string,
): Promise<{ revisionPrompt: string }> {
  const res = await fetch(`${API_URL}/v1/feedback/${feedbackId}/revision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) {
    throw new Error(
      `POST /v1/feedback/${feedbackId}/revision failed: ${res.status} ${res.statusText}`,
    );
  }
  return (await res.json()) as { revisionPrompt: string };
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

// ─── Web Pro: async stream run (SSE) ────

export interface StreamRunResponse {
  taskId: string;
  status: 'accepted';
}

export interface TaskStreamEvent {
  type: 'accepted' | 'generating' | 'complete';
  taskId: string;
  at: string;
  status?: 'success' | 'error';
  provider?: string;
  model?: string;
  response?: string;
  error?: string;
}

/** Start an async task; consume progress via GET /v1/agentx/tasks/:id/events. */
export async function startStreamTask(prompt: string): Promise<StreamRunResponse> {
  const res = await fetch(`${API_URL}/v1/agentx/run/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
    cache: 'no-store',
  });
  const body = (await res.json()) as StreamRunResponse & { error?: string };
  if (!res.ok) {
    throw new Error(body.error ?? `POST /v1/agentx/run/stream failed: ${res.status}`);
  }
  return body;
}

// ─── Web Pro: chat ────

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  message: string;
  provider: string;
  model: string;
  cached: boolean;
  latencyMs: number;
  cost: number;
  taskId: string;
}

export interface ChatStreamResponse {
  chatId: string;
  status: 'accepted';
}

export type ChatStreamEvent =
  | { type: 'start'; chatId: string; provider: string; model: string; at: string }
  | { type: 'chunk'; chatId: string; text: string; at: string }
  | {
      type: 'complete';
      chatId: string;
      usage: { inputTokens: number; outputTokens: number; totalTokens: number };
      cost: number;
      latencyMs: number;
      at: string;
    }
  | { type: 'error'; chatId: string; error: string; at: string };

/** Single-turn chat with transcript context (sync response). */
export async function sendChat(messages: ChatMessage[]): Promise<ChatResponse> {
  const res = await fetch(`${API_URL}/v1/agentx/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
    cache: 'no-store',
  });
  const body = (await res.json()) as ChatResponse & { error?: string };
  if (!res.ok) {
    throw new Error(body.error ?? `POST /v1/agentx/chat failed: ${res.status}`);
  }
  return body;
}

/** Start a streamed chat; consume events via GET /v1/agentx/chat/:id/events. */
export async function startChatStream(messages: ChatMessage[]): Promise<ChatStreamResponse> {
  const res = await fetch(`${API_URL}/v1/agentx/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
    cache: 'no-store',
  });
  const body = (await res.json()) as ChatStreamResponse & { error?: string };
  if (!res.ok) {
    throw new Error(body.error ?? `POST /v1/agentx/chat/stream failed: ${res.status}`);
  }
  return body;
}

// ─── Web Pro: analytics ────

export interface AnalyticsSummary {
  generatedAt: string;
  overview: {
    totalRequests: number;
    totalErrors: number;
    successRate: number;
    totalCacheHits: number;
    cacheHitRate: number;
    totalFallbacks: number;
    activeProviders: number;
    avgLatencyMs: number;
    p50LatencyMs: number;
    p95LatencyMs: number;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    totalCostUsd: number;
  };
  byProvider: Array<{
    provider: string;
    requests: number;
    errors: number;
    avgLatencyMs: number;
    tokens: number;
    costUsd: number;
  }>;
  byModel: Array<{ model: string; requests: number; costUsd: number }>;
}

/** Fetch the analytics summary (aggregated LLM metrics). */
export async function fetchAnalytics(): Promise<AnalyticsSummary> {
  return getJson<AnalyticsSummary>('/v1/analytics/summary');
}

// ─── Web Pro: agent configuration ────

export interface AgentConfig {
  id: string;
  role: 'architect' | 'coder' | 'reviewer' | 'tester';
  name: string;
  description: string;
  capabilities: string[];
  enabled: boolean;
  model: string;
  complexity: 'simple' | 'medium' | 'complex';
}

export interface AgentsResponse {
  agents: AgentConfig[];
  modelOptions: string[];
}

/** Fetch the specialist agent configs (public). */
export async function fetchAgents(): Promise<AgentsResponse> {
  return getJson<AgentsResponse>('/v1/agents');
}

/** Update an agent config (admin only). */
export async function updateAgent(
  id: string,
  patch: { enabled?: boolean; model?: string; complexity?: string },
): Promise<{ agent: AgentConfig }> {
  return authJson<{ agent: AgentConfig }>(
    `/v1/agents/${encodeURIComponent(id)}`,
    { method: 'PATCH', body: JSON.stringify(patch) },
    true,
  );
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

// ─── Auth API (Phase 3: web auth) ────

const TOKEN_KEY = 'agentx_token';

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

export interface AuthUser {
  id: string;
  email: string;
  roles: string[];
  createdAt: string;
  /** False for OAuth-only accounts (no local password yet). */
  hasPassword?: boolean;
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

export async function registerAccount(
  email: string,
  password: string,
  turnstileToken?: string,
): Promise<AuthResponse> {
  return authJson<AuthResponse>('/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, turnstileToken }),
  });
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

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ ok: boolean }> {
  return authJson<{ ok: boolean }>(
    '/v1/auth/change-password',
    { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) },
    true,
  );
}

/** Set a first password on an OAuth-only account (no current password needed). */
export async function setPassword(newPassword: string): Promise<{ ok: boolean }> {
  return authJson<{ ok: boolean }>(
    '/v1/auth/set-password',
    { method: 'POST', body: JSON.stringify({ newPassword }) },
    true,
  );
}

/** Request a password reset email. Always succeeds (no account enumeration). */
export async function forgotPassword(email: string): Promise<{ ok: boolean }> {
  return authJson<{ ok: boolean }>('/v1/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/** Reset the password with the one-time token from the email. */
export async function resetPassword(token: string, newPassword: string): Promise<{ ok: boolean }> {
  return authJson<{ ok: boolean }>('/v1/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
}

/** Verify email address with the one-time token from the email. */
export async function verifyEmail(token: string): Promise<{ ok: boolean }> {
  return authJson<{ ok: boolean }>('/v1/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export interface TeamMember {
  id: string;
  email: string;
  roles: string[];
  createdAt: string;
}

/** Admin-only: list registered users (no password hashes). */
export async function fetchTeam(): Promise<{ users: TeamMember[] }> {
  return authJson<{ users: TeamMember[] }>('/v1/team', {}, true);
}

// ─── Web Pro: parallel multi-agent runs ────

export interface MultiAgentRunStart {
  runId: string;
  status: string;
  concurrency: number;
}

export interface MultiAgentGoalResult {
  goalId: string;
  approved: boolean;
  iterations: number;
  error?: string;
  phases: Array<{ role: string; status: string; output: string }>;
}

export interface MultiAgentRunDetail {
  run: {
    runId: string;
    status: 'running' | 'completed' | 'error';
    concurrency: number;
    goals: Array<{ goalId: string; description: string }>;
    startedAt: string;
    completedAt?: string;
    result?: {
      approvedCount: number;
      totalGoals: number;
      wallTimeMs: number;
      goals: MultiAgentGoalResult[];
    };
    error?: string;
  };
}

export type MultiAgentStreamEvent =
  | { type: 'run-accepted'; runId: string; goalIds: string[]; concurrency: number; at: string }
  | { type: 'goal-start'; runId: string; goalId: string; index: number; at: string }
  | {
      type: 'goal-complete';
      runId: string;
      goalId: string;
      approved: boolean;
      iterations: number;
      error?: string;
      at: string;
    }
  | {
      type: 'run-complete';
      runId: string;
      approvedCount: number;
      totalGoals: number;
      wallTimeMs: number;
      at: string;
    };

/** Start a parallel multi-agent run (202 + runId). */
export async function startMultiAgentRun(
  goals: string[],
  concurrency: number,
): Promise<MultiAgentRunStart> {
  return authJson<MultiAgentRunStart>(
    '/v1/agentx/multi-agent/run',
    { method: 'POST', body: JSON.stringify({ goals, concurrency }) },
    false,
  );
}

/** Fetch a run's status + result (JSON polling). */
export async function fetchMultiAgentRun(runId: string): Promise<MultiAgentRunDetail> {
  return getJson<MultiAgentRunDetail>(`/v1/agentx/multi-agent/${encodeURIComponent(runId)}`);
}

/** Admin-only (AUTH_ENABLED): list waitlist entries. */
export async function fetchWaitlistAdmin(limit = 100): Promise<WaitlistListResponse> {
  return authJson<WaitlistListResponse>(`/v1/beta/waitlist?limit=${limit}`, {}, true);
}

/** Admin-only (AUTH_ENABLED): invite / activate a waitlist entry. */
export async function inviteWaitlistEntry(
  id: string,
  status: 'invited' | 'active',
): Promise<{ entry: WaitlistEntry }> {
  return authJson<{ entry: WaitlistEntry }>(
    `/v1/beta/waitlist/${id}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    },
    true,
  );
}
