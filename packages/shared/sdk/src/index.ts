/**
 * AgentX TypeScript SDK
 *
 * Official TypeScript client for the AgentX API.
 * Install: npm install @agent-xai/sdk
 *
 * Usage:
 *   import { AgentXClient } from '@agent-xai/sdk';
 *   const client = new AgentXClient({ baseUrl: 'https://api.id-tech.cloud' });
 *   await client.login('user@example.com', 'password');
 *   const task = await client.run('Hello, agent!');
 */

export interface AgentXConfig {
  /** API base URL (default: https://api.id-tech.cloud) */
  baseUrl?: string;
  /** Pre-existing auth token (skips login) */
  token?: string;
  /** Request timeout in ms (default: 30000) */
  timeout?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface User {
  id: string;
  email: string;
  roles: string[];
  createdAt: string;
}

export interface Task {
  id: string;
  prompt: string;
  response?: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  provider?: string;
  model?: string;
  createdAt: string;
}

export interface AgentTemplate {
  id: string;
  name: string;
  description?: string;
  systemPrompt?: string;
  tags?: string[];
  category?: string;
  priceUsd?: number;
  installCount?: number;
  rating?: number;
  ratingCount?: number;
  isPublished?: boolean;
  isFeatured?: boolean;
  authorId?: string;
  authorName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CostSummary {
  overview: {
    totalCostUsd: number;
    totalTokens: number;
    totalRequests: number;
    activeProviders: number;
    avgLatencyMs?: number;
  };
  byProvider: Array<{ provider: string; requests: number; costUsd: number; tokens: number }>;
  byModel: Array<{ model: string; requests: number; costUsd: number }>;
}

export interface ChatMessage {
  chatId: string;
  message: string;
  provider?: string;
  model?: string;
}

export interface Provider {
  name: string;
  type: string;
  baseUrl?: string;
  models?: string[];
  enabled?: boolean;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description?: string;
  content: string;
  tags?: string[];
  version?: number;
  usageCount?: number;
}

export interface Stats {
  total: number;
  completed: number;
  errors: number;
  pending: number;
}

export interface SSEEvent {
  type: string;
  [key: string]: unknown;
}

class AgentXError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
  ) {
    super(message);
    this.name = 'AgentXError';
  }
}

export class AgentXClient {
  private baseUrl: string;
  private token: string | null = null;
  private timeout: number;

  constructor(config: AgentXConfig = {}) {
    this.baseUrl = (config.baseUrl || 'https://api.id-tech.cloud').replace(/\/$/, '');
    this.timeout = config.timeout || 30000;
    if (config.token) this.token = config.token;
  }

  // ─── Auth ────

  /** Register a new account */
  async register(email: string, password: string): Promise<AuthTokens> {
    const data = await this.request<{ tokens: AuthTokens }>('POST', '/v1/auth/register', {
      email,
      password,
    });
    this.token = data.tokens.accessToken;
    return data.tokens;
  }

  /** Login with email/password (web — requires Turnstile) */
  async login(email: string, password: string, turnstileToken?: string): Promise<AuthTokens> {
    const data = await this.request<{ tokens: AuthTokens }>('POST', '/v1/auth/login', {
      email,
      password,
      turnstileToken,
    });
    this.token = data.tokens.accessToken;
    return data.tokens;
  }

  /** CLI login (no Turnstile required) */
  async cliLogin(email: string, password: string): Promise<AuthTokens> {
    const data = await this.request<{ tokens: AuthTokens }>('POST', '/v1/auth/cli-login', {
      email,
      password,
    });
    this.token = data.tokens.accessToken;
    return data.tokens;
  }

  /** Get current user profile */
  async getMe(): Promise<User> {
    const data = await this.request<{ user: User }>('GET', '/v1/auth/me');
    return data.user;
  }

  /** Change password */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.request('POST', '/v1/auth/change-password', { currentPassword, newPassword });
  }

  /** Set auth token manually */
  setToken(token: string): void {
    this.token = token;
  }

  // ─── Agent ────

  /** Submit an agent task */
  async run(prompt: string, options?: { provider?: string; model?: string }): Promise<Task> {
    return this.request('POST', '/v1/agentx/run', { prompt, ...options });
  }

  /** List tasks */
  async listTasks(limit?: number): Promise<{ tasks: Task[]; total: number }> {
    const params = limit ? `?limit=${limit}` : '';
    return this.request('GET', `/v1/agentx/tasks${params}`);
  }

  /** Get task statistics */
  async getStats(): Promise<Stats> {
    return this.request('GET', '/v1/agentx/stats');
  }

  /** Chat with agent (non-streaming) */
  async chat(message: string, sessionId?: string): Promise<ChatMessage> {
    return this.request('POST', '/v1/agentx/chat', { message, sessionId });
  }

  // ─── Streaming ────

  /** Submit task with SSE streaming */
  async *runStream(
    prompt: string,
    options?: { provider?: string; model?: string },
  ): AsyncGenerator<SSEEvent> {
    yield* this.stream('/v1/agentx/run/stream', { prompt, ...options });
  }

  /** Chat with SSE streaming */
  async *chatStream(message: string, sessionId?: string): AsyncGenerator<SSEEvent> {
    yield* this.stream('/v1/agentx/chat/stream', { message, sessionId });
  }

  // ─── Marketplace ────

  /** Browse marketplace templates */
  async listTemplates(options?: {
    search?: string;
    category?: string;
    limit?: number;
  }): Promise<{ templates: AgentTemplate[]; total: number }> {
    const params = new URLSearchParams();
    if (options?.search) params.set('search', options.search);
    if (options?.category) params.set('category', options.category);
    if (options?.limit) params.set('limit', String(options.limit));
    const qs = params.toString();
    return this.request('GET', `/v1/marketplace/templates${qs ? `?${qs}` : ''}`);
  }

  /** Get featured templates */
  async getFeaturedTemplates(): Promise<{ templates: AgentTemplate[] }> {
    return this.request('GET', '/v1/marketplace/featured');
  }

  /** Get marketplace categories */
  async getCategories(): Promise<{ categories: Array<{ category: string; count: number }> }> {
    return this.request('GET', '/v1/marketplace/categories');
  }

  /** Get template detail */
  async getTemplate(id: string): Promise<{ template: AgentTemplate }> {
    return this.request('GET', `/v1/marketplace/templates/${id}`);
  }

  /** Install a marketplace template */
  async installTemplate(id: string): Promise<unknown> {
    return this.request('POST', `/v1/marketplace/templates/${id}/install`);
  }

  /** Rate a marketplace template (1-5) */
  async rateTemplate(id: string, rating: number): Promise<unknown> {
    return this.request('POST', `/v1/marketplace/templates/${id}/rate`, { rating });
  }

  // ─── Cost ────

  /** Get cost summary */
  async getCostSummary(days?: number): Promise<CostSummary> {
    const params = days ? `?days=${days}` : '';
    return this.request('GET', `/v1/cost/summary${params}`);
  }

  /** List cost entries */
  async listCostEntries(
    limit?: number,
    offset?: number,
  ): Promise<{ entries: unknown[]; total: number }> {
    const params = new URLSearchParams();
    if (limit) params.set('limit', String(limit));
    if (offset) params.set('offset', String(offset));
    const qs = params.toString();
    return this.request('GET', `/v1/cost/entries${qs ? `?${qs}` : ''}`);
  }

  // ─── Admin (requires admin role) ────

  /** List LLM providers (admin) */
  async listProviders(): Promise<{ providers: Provider[] }> {
    return this.request('GET', '/v1/admin/llm-providers');
  }

  /** Create LLM provider (admin) */
  async createProvider(provider: Omit<Provider, 'id'>): Promise<{ provider: Provider }> {
    return this.request('POST', '/v1/admin/llm-providers', provider);
  }

  /** Update LLM provider (admin) */
  async updateProvider(name: string, updates: Partial<Provider>): Promise<{ provider: Provider }> {
    return this.request('PATCH', `/v1/admin/llm-providers/${name}`, updates);
  }

  /** Delete LLM provider (admin) */
  async deleteProvider(name: string): Promise<void> {
    await this.request('DELETE', `/v1/admin/llm-providers/${name}`);
  }

  /** Test LLM provider connection (admin) */
  async testProvider(name: string): Promise<{ ok: boolean; latencyMs?: number; error?: string }> {
    return this.request('POST', `/v1/admin/llm-providers/${name}/test`);
  }

  /** List prompt templates (admin) */
  async listPromptTemplates(): Promise<{ templates: PromptTemplate[] }> {
    return this.request('GET', '/v1/prompt-templates');
  }

  /** Create prompt template (admin) */
  async createPromptTemplate(template: {
    name: string;
    content: string;
    description?: string;
    tags?: string[];
  }): Promise<{ template: PromptTemplate }> {
    return this.request('POST', '/v1/prompt-templates', template);
  }

  // ─── Health ────

  /** Health check */
  async health(): Promise<{ status: string; uptime: number }> {
    return this.request('GET', '/health', undefined, true);
  }

  // ─── Internal ────

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    public_ = false,
  ): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (!public_ && this.token) headers['Authorization'] = `Bearer ${this.token}`;

    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(this.timeout),
    });

    const text = await res.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (!res.ok) {
      const msg =
        data && typeof data === 'object' && 'error' in data
          ? String((data as { error: unknown }).error)
          : `HTTP ${res.status}`;
      throw new AgentXError(msg, res.status, data);
    }

    return data as unknown as T;
  }

  private async *stream(path: string, body?: unknown): AsyncGenerator<SSEEvent> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      throw new AgentXError(`SSE connection failed: ${res.status}`, res.status);
    }

    const reader = res.body?.getReader();
    if (!reader) throw new AgentXError('No response body', 500);

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') return;
          try {
            yield JSON.parse(jsonStr) as SSEEvent;
          } catch {
            /* skip malformed */
          }
        }
      }
    }
  }
}

export { AgentXError };
