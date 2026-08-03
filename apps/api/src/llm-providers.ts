// Builds live LLMProvider instances from admin-managed DB rows and keeps the
// shared LLMRouter in sync (register at boot + re-register on CRUD).
//
// No import of agentx-server.ts here (that would create an import cycle);
// the caller passes the router singleton explicitly.

import type { LLMRouter, LLMProvider, ModelMetadata } from '@agent-xai/llm-router';
import { OpenAICompatibleProvider, AnthropicCompatibleProvider } from '@agent-xai/llm-router';
import type { LlmProviderRow, ProviderModel } from './llm-provider-store.js';
import { listProviders } from './llm-provider-store.js';

export type { ProviderModel };

export function buildProvider(row: LlmProviderRow): LLMProvider {
  const models: Record<string, ModelMetadata> = {};
  for (const m of row.models) {
    models[m.id] = {
      name: m.name || m.id,
      provider: row.name,
      pricing: {
        inputCostPerMillion: m.inputCostPerMillion ?? 0.5,
        outputCostPerMillion: m.outputCostPerMillion ?? 1.5,
      },
      capabilities: (m.capabilities ?? ['reasoning']) as ModelMetadata['capabilities'],
      complexityRating: (m.complexityRating ?? 'medium') as ModelMetadata['complexityRating'],
    };
  }
  const config = { apiKey: row.apiKey, endpoint: row.baseUrl };
  if (row.type === 'anthropic-compatible') {
    return new AnthropicCompatibleProvider(row.name, models, config);
  }
  return new OpenAICompatibleProvider(row.name, models, config);
}

/** Register every enabled provider from the store (call once at boot). */
export async function syncProvidersFromDb(router: LLMRouter): Promise<number> {
  const rows = await listProviders();
  let count = 0;
  for (const row of rows) {
    if (!row.enabled) continue;
    router.registerProvider(buildProvider(row));
    count += 1;
  }
  return count;
}

/** Re-register a single provider after upsert (idempotent Map overwrite). */
export function registerProviderNow(router: LLMRouter, row: LlmProviderRow): void {
  router.registerProvider(buildProvider(row));
}

/** Re-sync all providers from the store after a delete. */
export async function resyncProviders(router: LLMRouter): Promise<number> {
  return syncProvidersFromDb(router);
}
