// Admin-managed LLM provider connections.
//
// Persisted in Postgres via Prisma when DATABASE_URL is set (prod), with an
// in-memory fallback so unit tests / local dev without a DB keep working
// (mirrors the auth.ts user-storage pattern). API keys are encrypted at rest
// with AES-256-GCM (crypto.ts) — only the ciphertext touches the DB.

import { getPrisma } from '@agent-xai/persistence';
import { encryptSecret, decryptSecret } from './crypto.js';

export type ProviderType = 'openai-compatible' | 'anthropic-compatible';
export type AuthMethod = 'api-key' | 'oauth' | 'account';

export interface ProviderModel {
  id: string;
  name: string;
  inputCostPerMillion: number;
  outputCostPerMillion: number;
  capabilities: string[];
  complexityRating: string;
}

export interface LlmProviderRow {
  name: string;
  type: ProviderType;
  baseUrl: string;
  apiKey: string;
  models: ProviderModel[];
  enabled: boolean;
  provider?: string | null; // native preset slug
  authMethod?: AuthMethod;
  accountRef?: string | null;
  lastTestAt?: string | null;
  lastTestOk?: boolean | null;
  updatedAt?: string;
}

export interface AuditLogRow {
  id: string;
  email: string;
  action: string;
  target: string;
  detail: Record<string, unknown> | null;
  createdAt: string;
}

// ─── In-memory fallback ────
const memoryStore = new Map<string, LlmProviderRow>();
const memoryAudit: AuditLogRow[] = [];
let memoryAuditSeq = 0;

function db(): ReturnType<typeof getPrisma> {
  return getPrisma();
}

function mapRow(r: {
  name: string;
  type: string;
  baseUrl: string;
  apiKeyEncrypted: string;
  models: unknown;
  enabled: boolean;
  provider: string | null;
  authMethod: string;
  accountRef: string | null;
  lastTestAt: Date | null;
  lastTestOk: boolean | null;
  updatedAt: Date;
}): LlmProviderRow {
  return {
    name: r.name,
    type: r.type as ProviderType,
    baseUrl: r.baseUrl,
    apiKey: decryptSecret(r.apiKeyEncrypted),
    models: r.models as unknown as ProviderModel[],
    enabled: r.enabled,
    provider: r.provider,
    authMethod: (r.authMethod as AuthMethod) ?? 'api-key',
    accountRef: r.accountRef,
    lastTestAt: r.lastTestAt ? r.lastTestAt.toISOString() : null,
    lastTestOk: r.lastTestOk,
    updatedAt: r.updatedAt.toISOString(),
  };
}

export async function listProviders(): Promise<LlmProviderRow[]> {
  const prisma = db();
  if (prisma) {
    const rows = await prisma.llmProvider.findMany({ orderBy: { name: 'asc' } });
    return rows.map(mapRow);
  }
  return [...memoryStore.values()];
}

export async function getProvider(name: string): Promise<LlmProviderRow | null> {
  const prisma = db();
  if (prisma) {
    const r = await prisma.llmProvider.findUnique({ where: { name } });
    if (!r) return null;
    return mapRow(r);
  }
  return memoryStore.get(name) ?? null;
}

export async function upsertProvider(row: LlmProviderRow): Promise<LlmProviderRow> {
  const prisma = db();
  if (prisma) {
    await prisma.llmProvider.upsert({
      where: { name: row.name },
      create: {
        name: row.name,
        type: row.type,
        baseUrl: row.baseUrl,
        apiKeyEncrypted: encryptSecret(row.apiKey),
        models: row.models as unknown as object,
        enabled: row.enabled,
        provider: row.provider ?? 'custom',
        authMethod: row.authMethod ?? 'api-key',
        accountRef: row.accountRef ?? null,
      },
      update: {
        type: row.type,
        baseUrl: row.baseUrl,
        apiKeyEncrypted: encryptSecret(row.apiKey),
        models: row.models as unknown as object,
        enabled: row.enabled,
        provider: row.provider ?? 'custom',
        authMethod: row.authMethod ?? 'api-key',
        accountRef: row.accountRef ?? null,
      },
    });
  } else {
    memoryStore.set(row.name, { ...row });
  }
  return row;
}

/**
 * Partial update: only provided fields change. When apiKey is omitted the
 * existing encrypted key is kept (PATCH semantics from the admin panel).
 */
export async function updateProvider(
  name: string,
  patch: Partial<
    Pick<
      LlmProviderRow,
      | 'type'
      | 'baseUrl'
      | 'apiKey'
      | 'models'
      | 'enabled'
      | 'provider'
      | 'authMethod'
      | 'accountRef'
    >
  >,
): Promise<LlmProviderRow | null> {
  const prisma = db();
  if (prisma) {
    const existing = await prisma.llmProvider.findUnique({ where: { name } });
    if (!existing) return null;
    const data: Record<string, unknown> = {};
    if (patch.type) data.type = patch.type;
    if (patch.baseUrl !== undefined) data.baseUrl = patch.baseUrl;
    if (patch.apiKey !== undefined) data.apiKeyEncrypted = encryptSecret(patch.apiKey);
    if (patch.models !== undefined) data.models = patch.models as unknown as object;
    if (patch.enabled !== undefined) data.enabled = patch.enabled;
    if (patch.provider !== undefined) data.provider = patch.provider ?? 'custom';
    if (patch.authMethod !== undefined) data.authMethod = patch.authMethod;
    if (patch.accountRef !== undefined) data.accountRef = patch.accountRef;
    const r = await prisma.llmProvider.update({ where: { name }, data });
    return mapRow(r);
  }
  const existing = memoryStore.get(name);
  if (!existing) return null;
  const merged: LlmProviderRow = { ...existing, ...patch, apiKey: patch.apiKey ?? existing.apiKey };
  memoryStore.set(name, merged);
  return merged;
}

/** Record the outcome of a connection test (latest status for the dashboard). */
export async function recordTestResult(name: string, ok: boolean): Promise<void> {
  const prisma = db();
  if (prisma) {
    await prisma.llmProvider.update({
      where: { name },
      data: { lastTestAt: new Date(), lastTestOk: ok },
    });
    return;
  }
  const existing = memoryStore.get(name);
  if (existing) {
    memoryStore.set(name, {
      ...existing,
      lastTestAt: new Date().toISOString(),
      lastTestOk: ok,
    });
  }
}

export async function deleteProvider(name: string): Promise<boolean> {
  const prisma = db();
  if (prisma) {
    const res = await prisma.llmProvider.deleteMany({ where: { name } });
    return res.count > 0;
  }
  return memoryStore.delete(name);
}

/** Mask an API key for API responses (never leak the real value back to UI). */
export function maskApiKey(key: string): string {
  if (key.length <= 8) return '***';
  return `${key.slice(0, 3)}***${key.slice(-3)}`;
}

// ─── Audit log ────

export async function appendAuditLog(
  email: string,
  action: string,
  target: string,
  detail?: Record<string, unknown>,
): Promise<void> {
  const prisma = db();
  if (prisma) {
    await prisma.adminAuditLog.create({
      data: {
        email,
        action,
        target,
        ...(detail ? { detail: detail as object } : {}),
      },
    });
    return;
  }
  memoryAudit.unshift({
    id: `mem-${++memoryAuditSeq}`,
    email,
    action,
    target,
    detail: detail ?? null,
    createdAt: new Date().toISOString(),
  });
}

export async function listAuditLogs(limit = 100): Promise<AuditLogRow[]> {
  const prisma = db();
  if (prisma) {
    const rows = await prisma.adminAuditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 500),
    });
    return rows.map((r) => ({
      id: r.id,
      email: r.email,
      action: r.action,
      target: r.target,
      detail: r.detail as Record<string, unknown> | null,
      createdAt: r.createdAt.toISOString(),
    }));
  }
  return memoryAudit.slice(0, Math.min(limit, 500));
}

// ─── Native provider presets (gallery) ────

export interface ProviderPreset {
  slug: string;
  label: string;
  type: ProviderType;
  baseUrl: string;
  models: string[];
  docs?: string;
}

export const PROVIDER_PRESETS: ProviderPreset[] = [
  {
    slug: 'openai',
    label: 'OpenAI (GPT)',
    type: 'openai-compatible',
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4.1', 'gpt-4.1-mini', 'o3-mini'],
  },
  {
    slug: 'grok',
    label: 'Grok (xAI)',
    type: 'openai-compatible',
    baseUrl: 'https://api.x.ai/v1',
    models: ['grok-4', 'grok-3', 'grok-3-mini', 'grok-2-latest'],
  },
  {
    slug: 'deepseek',
    label: 'DeepSeek',
    type: 'openai-compatible',
    baseUrl: 'https://api.deepseek.com/v1',
    models: ['deepseek-chat', 'deepseek-reasoner'],
  },
  {
    slug: 'qwen',
    label: 'Qwen (Alibaba DashScope)',
    type: 'openai-compatible',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    models: ['qwen-max', 'qwen-plus', 'qwen-turbo', 'qwen3-max', 'qwen3-plus'],
  },
  {
    slug: 'claude',
    label: 'Claude (Anthropic)',
    type: 'anthropic-compatible',
    baseUrl: 'https://api.anthropic.com',
    models: [
      'claude-sonnet-4-5',
      'claude-opus-4-1',
      'claude-haiku-4-5',
      'claude-3-5-sonnet-latest',
    ],
  },
  {
    slug: 'gemini',
    label: 'Gemini (Google)',
    type: 'openai-compatible',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    models: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.0-flash'],
  },
  {
    slug: 'mistral',
    label: 'Mistral AI',
    type: 'openai-compatible',
    baseUrl: 'https://api.mistral.ai/v1',
    models: ['mistral-large-latest', 'mistral-small-latest', 'codestral-latest'],
  },
  {
    slug: 'openrouter',
    label: 'OpenRouter',
    type: 'openai-compatible',
    baseUrl: 'https://openrouter.ai/api/v1',
    models: [
      'anthropic/claude-sonnet-4-5',
      'openai/gpt-4o',
      'x-ai/grok-3',
      'deepseek/deepseek-chat',
      'qwen/qwen3-max',
      'google/gemini-2.5-pro',
    ],
  },
  {
    slug: 'groq',
    label: 'Groq',
    type: 'openai-compatible',
    baseUrl: 'https://api.groq.com/openai/v1',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
  },
  {
    slug: 'perplexity',
    label: 'Perplexity (Sonar)',
    type: 'openai-compatible',
    baseUrl: 'https://api.perplexity.ai',
    models: ['sonar', 'sonar-pro'],
  },
];

export function getPreset(slug: string): ProviderPreset | undefined {
  return PROVIDER_PRESETS.find((p) => p.slug === slug);
}
