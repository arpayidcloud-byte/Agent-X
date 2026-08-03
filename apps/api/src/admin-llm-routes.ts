// Admin-only LLM provider management API (protected by maybeRequireAdmin).
// Lets admins connect the app to any OpenAI-compatible / Anthropic-compatible
// LLM endpoint (OpenRouter, DeepSeek, Qwen, Azure, Together, Groq, etc.)
// entirely from the web UI — no redeploy needed.

import type { Express, Request, Response } from 'express';
import type { AuthenticatedRequest } from './auth.js';
import { maybeRequireAdmin } from './auth.js';
import type { LlmProviderRow, ProviderModel } from './llm-provider-store.js';
import {
  listProviders,
  getProvider,
  upsertProvider,
  deleteProvider,
  maskApiKey,
} from './llm-provider-store.js';
import { buildProvider, syncProvidersFromDb, registerProviderNow } from './llm-providers.js';
import type { LLMRouter } from '@agent-xai/llm-router';

const TYPES = new Set(['openai-compatible', 'anthropic-compatible']);

function toView(row: LlmProviderRow) {
  return {
    name: row.name,
    type: row.type,
    baseUrl: row.baseUrl,
    apiKeyMasked: maskApiKey(row.apiKey),
    models: row.models.map((m) => m.id),
    enabled: row.enabled,
    updatedAt: row.updatedAt ?? null,
  };
}

function parseModels(raw: unknown): ProviderModel[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error('models: array of model ids required (e.g. ["deepseek-chat"])');
  }
  return raw.map((m) => {
    if (typeof m === 'string') {
      return {
        id: m.trim(),
        name: m.trim(),
        inputCostPerMillion: 0.5,
        outputCostPerMillion: 1.5,
        capabilities: ['reasoning'],
        complexityRating: 'medium',
      };
    }
    const o = m as Record<string, unknown>;
    if (typeof o.id !== 'string' || !o.id.trim()) {
      throw new Error('models: each entry needs an id');
    }
    return {
      id: o.id.trim(),
      name: typeof o.name === 'string' ? o.name : o.id.trim(),
      inputCostPerMillion: Number(o.inputCostPerMillion) || 0.5,
      outputCostPerMillion: Number(o.outputCostPerMillion) || 1.5,
      capabilities: Array.isArray(o.capabilities) ? (o.capabilities as string[]) : ['reasoning'],
      complexityRating: typeof o.complexityRating === 'string' ? o.complexityRating : 'medium',
    };
  });
}

export function registerAdminLlmRoutes(app: Express, router: LLMRouter): void {
  // ─── List providers ────
  app.get('/v1/admin/llm-providers', maybeRequireAdmin, async (_req: Request, res: Response) => {
    try {
      const rows = await listProviders();
      res.json({ providers: rows.map(toView) });
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  // ─── Create / update provider ────
  app.post('/v1/admin/llm-providers', maybeRequireAdmin, async (req: Request, res: Response) => {
    try {
      const { name, type, baseUrl, apiKey, models, enabled } = req.body ?? {};
      if (typeof name !== 'string' || !/^[a-z0-9][a-z0-9-_]{1,63}$/.test(name)) {
        res.status(400).json({ error: 'name: lowercase slug 2-64 chars (a-z0-9-_ )' });
        return;
      }
      if (typeof type !== 'string' || !TYPES.has(type)) {
        res.status(400).json({ error: 'type: openai-compatible | anthropic-compatible' });
        return;
      }
      if (typeof baseUrl !== 'string' || !/^https?:\/\/.+/.test(baseUrl)) {
        res.status(400).json({ error: 'baseUrl: must be http(s)://...' });
        return;
      }
      if (typeof apiKey !== 'string' || apiKey.trim().length < 8) {
        res.status(400).json({ error: 'apiKey: required (min 8 chars)' });
        return;
      }
      let parsedModels: ProviderModel[];
      try {
        parsedModels = parseModels(models);
      } catch (e) {
        res.status(400).json({ error: e instanceof Error ? e.message : String(e) });
        return;
      }

      const row: LlmProviderRow = {
        name,
        type: type as LlmProviderRow['type'],
        baseUrl: baseUrl.replace(/\/+$/, ''),
        apiKey: apiKey.trim(),
        models: parsedModels,
        enabled: enabled !== false,
      };
      await upsertProvider(row);
      registerProviderNow(router, row);
      res.status(201).json({ provider: toView(row) });
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  // ─── Test provider connection ────
  app.post(
    '/v1/admin/llm-providers/:name/test',
    maybeRequireAdmin,
    async (req: Request, res: Response) => {
      try {
        const row = await getProvider(String(req.params.name));
        if (!row) {
          res.status(404).json({ error: 'Provider not found' });
          return;
        }
        const provider = buildProvider(row);
        const firstModel = row.models[0]?.id;
        if (!firstModel) {
          res.status(400).json({ error: 'Provider has no models configured' });
          return;
        }
        const started = Date.now();
        const resp = await provider.generate(firstModel, 'ping');
        res.json({
          ok: true,
          provider: row.name,
          model: firstModel,
          latencyMs: Date.now() - started,
          cost: resp.cost,
        });
      } catch (e) {
        res.status(502).json({
          ok: false,
          error: e instanceof Error ? e.message : String(e),
        });
      }
    },
  );

  // ─── Delete provider ────
  app.delete(
    '/v1/admin/llm-providers/:name',
    maybeRequireAdmin,
    async (req: Request, res: Response) => {
      try {
        const name = String(req.params.name);
        const removed = await deleteProvider(name);
        if (!removed) {
          res.status(404).json({ error: 'Provider not found' });
          return;
        }
        await syncProvidersFromDb(router);
        res.json({ ok: true, name });
      } catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
      }
    },
  );
}

export type { AuthenticatedRequest };
