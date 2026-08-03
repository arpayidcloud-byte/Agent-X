// Admin-managed LLM provider connections.
//
// Persisted in Postgres via Prisma when DATABASE_URL is set (prod), with an
// in-memory fallback so unit tests / local dev without a DB keep working
// (mirrors the auth.ts user-storage pattern). API keys are encrypted at rest
// with AES-256-GCM (crypto.ts) — only the ciphertext touches the DB.

import { getPrisma } from '@agent-xai/persistence';
import { encryptSecret, decryptSecret } from './crypto.js';

export type ProviderType = 'openai-compatible' | 'anthropic-compatible';

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
  updatedAt?: string;
}

// ─── In-memory fallback ────
const memoryStore = new Map<string, LlmProviderRow>();

function db(): ReturnType<typeof getPrisma> {
  return getPrisma();
}

export async function listProviders(): Promise<LlmProviderRow[]> {
  const prisma = db();
  if (prisma) {
    const rows = await prisma.llmProvider.findMany({ orderBy: { name: 'asc' } });
    return rows.map((r) => ({
      name: r.name,
      type: r.type as ProviderType,
      baseUrl: r.baseUrl,
      apiKey: decryptSecret(r.apiKeyEncrypted),
      models: r.models as unknown as ProviderModel[],
      enabled: r.enabled,
      updatedAt: r.updatedAt.toISOString(),
    }));
  }
  return [...memoryStore.values()];
}

export async function getProvider(name: string): Promise<LlmProviderRow | null> {
  const prisma = db();
  if (prisma) {
    const r = await prisma.llmProvider.findUnique({ where: { name } });
    if (!r) return null;
    return {
      name: r.name,
      type: r.type as ProviderType,
      baseUrl: r.baseUrl,
      apiKey: decryptSecret(r.apiKeyEncrypted),
      models: r.models as unknown as ProviderModel[],
      enabled: r.enabled,
      updatedAt: r.updatedAt.toISOString(),
    };
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
      },
      update: {
        type: row.type,
        baseUrl: row.baseUrl,
        apiKeyEncrypted: encryptSecret(row.apiKey),
        models: row.models as unknown as object,
        enabled: row.enabled,
      },
    });
  } else {
    memoryStore.set(row.name, { ...row });
  }
  return row;
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
