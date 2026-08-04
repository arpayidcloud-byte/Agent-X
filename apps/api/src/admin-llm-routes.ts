// Admin-only LLM provider management API (protected by maybeRequireAdmin).
// Powers the dedicated admin panel (panel.id-tech.cloud): connect the app to
// any OpenAI-compatible / Anthropic-compatible LLM endpoint (OpenRouter,
// DeepSeek, Qwen, Grok, Gemini, Azure, Groq, etc.) entirely from the UI —
// no redeploy needed. Every mutation is written to the audit log.

import type { Express, Request, Response } from 'express';
import type { AuthenticatedRequest } from './auth.js';
import { maybeRequireAdmin } from './auth.js';
import type { LlmProviderRow, ProviderModel, AuthMethod } from './llm-provider-store.js';
import {
  listProviders,
  getProvider,
  upsertProvider,
  updateProvider,
  deleteProvider,
  recordTestResult,
  maskApiKey,
  appendAuditLog,
  listAuditLogs,
  PROVIDER_PRESETS,
  getPreset,
} from './llm-provider-store.js';
import { buildProvider, syncProvidersFromDb, registerProviderNow } from './llm-providers.js';
import type { LLMRouter } from '@agent-xai/llm-router';

const TYPES = new Set(['openai-compatible', 'anthropic-compatible']);
const AUTH_METHODS = new Set<AuthMethod>(['api-key', 'oauth', 'account']);
const NAME_RE = /^[a-z0-9][a-z0-9-_]{1,63}$/;
const URL_RE = /^https?:\/\/.+/;

function toView(row: LlmProviderRow) {
  return {
    name: row.name,
    type: row.type,
    baseUrl: row.baseUrl,
    apiKeyMasked: maskApiKey(row.apiKey),
    models: row.models.map((m) => m.id),
    enabled: row.enabled,
    provider: row.provider ?? 'custom',
    authMethod: row.authMethod ?? 'api-key',
    accountRef: row.accountRef ?? null,
    lastTestAt: row.lastTestAt ?? null,
    lastTestOk: row.lastTestOk ?? null,
    updatedAt: row.updatedAt ?? null,
  };
}

function adminEmail(req: AuthenticatedRequest): string {
  return req.auth?.email ?? 'unknown';
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

  // ─── Native provider preset gallery ────
  // NOTE: registered BEFORE /:name routes so "presets" is not captured as a name.
  app.get(
    '/v1/admin/llm-providers/presets',
    maybeRequireAdmin,
    async (_req: Request, res: Response) => {
      res.json({ presets: PROVIDER_PRESETS });
    },
  );

  // ─── Export providers (config backup — API keys are never included) ────
  app.get(
    '/v1/admin/llm-providers/export',
    maybeRequireAdmin,
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const rows = await listProviders();
        const providers = rows.map((r) => ({
          name: r.name,
          type: r.type,
          baseUrl: r.baseUrl,
          models: r.models.map((m) => m.id),
          enabled: r.enabled,
          provider: r.provider ?? 'custom',
          authMethod: r.authMethod ?? 'api-key',
          accountRef: r.accountRef ?? null,
          updatedAt: r.updatedAt ?? null,
        }));
        await appendAuditLog(adminEmail(req), 'export', 'providers', {
          count: providers.length,
        });
        res.json({ schema: 1, exportedAt: new Date().toISOString(), providers });
      } catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
      }
    },
  );

  // ─── Import providers (config restore — apiKey optional per item) ────
  app.post(
    '/v1/admin/llm-providers/import',
    maybeRequireAdmin,
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const raw = (req.body ?? {}).providers;
        if (!Array.isArray(raw) || raw.length === 0) {
          res.status(400).json({ error: 'providers: non-empty array required' });
          return;
        }
        const imported: string[] = [];
        const updated: string[] = [];
        const errors: { name: string; error: string }[] = [];
        for (const item of raw) {
          const base = (item ?? {}) as Record<string, unknown>;
          const name = base.name;
          if (typeof name !== 'string' || !NAME_RE.test(name)) {
            errors.push({
              name: typeof name === 'string' ? name : '?',
              error: 'name: lowercase slug 2-64 chars (a-z0-9-_)',
            });
            continue;
          }
          if (typeof base.type !== 'string' || !TYPES.has(base.type)) {
            errors.push({ name, error: 'type: openai-compatible | anthropic-compatible' });
            continue;
          }
          if (typeof base.baseUrl !== 'string' || !URL_RE.test(base.baseUrl)) {
            errors.push({ name, error: 'baseUrl: must be http(s)://...' });
            continue;
          }
          if (
            base.authMethod !== undefined &&
            (typeof base.authMethod !== 'string' ||
              !AUTH_METHODS.has(base.authMethod as AuthMethod))
          ) {
            errors.push({ name, error: 'authMethod: api-key | oauth | account' });
            continue;
          }
          let models: ProviderModel[];
          try {
            models = parseModels(base.models);
          } catch (e) {
            errors.push({ name, error: e instanceof Error ? e.message : String(e) });
            continue;
          }
          const apiKey = typeof base.apiKey === 'string' ? base.apiKey.trim() : '';
          const existing = await getProvider(name);
          if (!existing && apiKey.length < 8) {
            errors.push({ name, error: 'apiKey: required for new providers (min 8 chars)' });
            continue;
          }
          if (existing) {
            const patch: Partial<LlmProviderRow> = {
              type: base.type as LlmProviderRow['type'],
              baseUrl: (base.baseUrl as string).replace(/\/+$/, ''),
              models,
              enabled: base.enabled !== false,
              provider: (base.provider as string | undefined) ?? existing.provider ?? 'custom',
              authMethod:
                (base.authMethod as AuthMethod | undefined) ?? existing.authMethod ?? 'api-key',
              accountRef:
                (base.accountRef as string | null | undefined) ?? existing.accountRef ?? null,
            };
            if (apiKey.length >= 8) patch.apiKey = apiKey;
            const row = await updateProvider(name, patch);
            if (!row) {
              errors.push({ name, error: 'update failed' });
              continue;
            }
            registerProviderNow(router, row);
            updated.push(name);
          } else {
            const row: LlmProviderRow = {
              name,
              type: base.type as LlmProviderRow['type'],
              baseUrl: (base.baseUrl as string).replace(/\/+$/, ''),
              apiKey,
              models,
              enabled: base.enabled !== false,
              provider: (base.provider as string | undefined) ?? 'custom',
              authMethod: (base.authMethod as AuthMethod | undefined) ?? 'api-key',
            };
            await upsertProvider(row);
            registerProviderNow(router, row);
            imported.push(name);
          }
        }
        await appendAuditLog(adminEmail(req), 'import', 'providers', {
          imported: imported.length,
          updated: updated.length,
          errors: errors.length,
        });
        res.json({ imported: imported.length, updated: updated.length, errors });
      } catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
      }
    },
  );

  // ─── Create provider ────
  app.post(
    '/v1/admin/llm-providers',
    maybeRequireAdmin,
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const { name, type, baseUrl, apiKey, models, enabled, provider, authMethod } =
          req.body ?? {};
        if (typeof name !== 'string' || !NAME_RE.test(name)) {
          res.status(400).json({ error: 'name: lowercase slug 2-64 chars (a-z0-9-_ )' });
          return;
        }
        if (typeof type !== 'string' || !TYPES.has(type)) {
          res.status(400).json({ error: 'type: openai-compatible | anthropic-compatible' });
          return;
        }
        if (typeof baseUrl !== 'string' || !URL_RE.test(baseUrl)) {
          res.status(400).json({ error: 'baseUrl: must be http(s)://...' });
          return;
        }
        if (typeof apiKey !== 'string' || apiKey.trim().length < 8) {
          res.status(400).json({ error: 'apiKey: must be at least 8 characters' });
          return;
        }
        if (
          authMethod !== undefined &&
          (typeof authMethod !== 'string' || !AUTH_METHODS.has(authMethod as AuthMethod))
        ) {
          res.status(400).json({ error: 'authMethod: api-key | oauth | account' });
          return;
        }
        if (provider !== undefined && typeof provider !== 'string') {
          res.status(400).json({ error: 'provider: must be a string slug' });
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
          provider: provider ?? 'custom',
          authMethod: (authMethod as AuthMethod) ?? 'api-key',
        };
        await upsertProvider(row);
        registerProviderNow(router, row);
        await appendAuditLog(adminEmail(req), 'create', row.name, {
          type: row.type,
          provider: row.provider,
        });
        res.status(201).json({ provider: toView(row) });
      } catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
      }
    },
  );

  // ─── Update provider (partial) ────
  app.patch(
    '/v1/admin/llm-providers/:name',
    maybeRequireAdmin,
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const name = String(req.params.name);
        const existing = await getProvider(name);
        if (!existing) {
          res.status(404).json({ error: 'Provider not found' });
          return;
        }
        const { type, baseUrl, apiKey, models, enabled, provider, authMethod, accountRef } =
          req.body ?? {};

        if (type !== undefined && (typeof type !== 'string' || !TYPES.has(type))) {
          res.status(400).json({ error: 'type: openai-compatible | anthropic-compatible' });
          return;
        }
        if (baseUrl !== undefined && (typeof baseUrl !== 'string' || !URL_RE.test(baseUrl))) {
          res.status(400).json({ error: 'baseUrl: must be http(s)://...' });
          return;
        }
        if (apiKey !== undefined && (typeof apiKey !== 'string' || apiKey.trim().length < 8)) {
          res.status(400).json({ error: 'apiKey: must be at least 8 characters' });
          return;
        }
        if (
          authMethod !== undefined &&
          (typeof authMethod !== 'string' || !AUTH_METHODS.has(authMethod as AuthMethod))
        ) {
          res.status(400).json({ error: 'authMethod: api-key | oauth | account' });
          return;
        }

        let parsedModels: ProviderModel[] | undefined;
        if (models !== undefined) {
          try {
            parsedModels = parseModels(models);
          } catch (e) {
            res.status(400).json({ error: e instanceof Error ? e.message : String(e) });
            return;
          }
        }

        const patch: Partial<LlmProviderRow> = {};
        if (type !== undefined) patch.type = type;
        if (baseUrl !== undefined) patch.baseUrl = baseUrl.replace(/\/+$/, '');
        if (apiKey !== undefined) patch.apiKey = apiKey.trim();
        if (parsedModels !== undefined) patch.models = parsedModels;
        if (enabled !== undefined) patch.enabled = enabled === true;
        if (provider !== undefined) patch.provider = provider;
        if (authMethod !== undefined) patch.authMethod = authMethod;
        if (accountRef !== undefined) patch.accountRef = accountRef;

        const updated = await updateProvider(name, patch);
        if (!updated) {
          res.status(404).json({ error: 'Provider not found' });
          return;
        }
        registerProviderNow(router, updated);
        await appendAuditLog(adminEmail(req), 'update', name, {
          fields: Object.keys(patch).filter((k) => k !== 'apiKey'),
        });
        res.json({ provider: toView(updated) });
      } catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
      }
    },
  );

  // ─── Test provider connection ────
  app.post(
    '/v1/admin/llm-providers/:name/test',
    maybeRequireAdmin,
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const name = String(req.params.name);
        const row = await getProvider(name);
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
        await recordTestResult(name, true);
        await appendAuditLog(adminEmail(req), 'test', name, { ok: true, model: firstModel });
        res.json({
          ok: true,
          provider: row.name,
          model: firstModel,
          latencyMs: Date.now() - started,
          cost: resp.cost,
        });
      } catch (e) {
        await recordTestResult(String(req.params.name), false).catch(() => undefined);
        await appendAuditLog(adminEmail(req), 'test', String(req.params.name), {
          ok: false,
          error: e instanceof Error ? e.message : String(e),
        }).catch(() => undefined);
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
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const name = String(req.params.name);
        const removed = await deleteProvider(name);
        if (!removed) {
          res.status(404).json({ error: 'Provider not found' });
          return;
        }
        await syncProvidersFromDb(router);
        await appendAuditLog(adminEmail(req), 'delete', name);
        res.json({ ok: true, name });
      } catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
      }
    },
  );

  // ─── Audit log ────
  app.get('/v1/admin/audit-logs', maybeRequireAdmin, async (req: Request, res: Response) => {
    try {
      const limit = Number(req.query.limit) || 100;
      const logs = await listAuditLogs(limit);
      res.json({ logs });
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  // ─── Resolve a preset slug (used by the panel wizard) ────
  app.get(
    '/v1/admin/llm-providers/presets/:slug',
    maybeRequireAdmin,
    async (req: Request, res: Response) => {
      const preset = getPreset(String(req.params.slug));
      if (!preset) {
        res.status(404).json({ error: 'Preset not found' });
        return;
      }
      res.json({ preset });
    },
  );
}

export type { AuthenticatedRequest };
