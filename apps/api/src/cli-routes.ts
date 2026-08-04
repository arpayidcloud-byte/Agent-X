// CLI sync routes.
//
//   Admin (JWT + role admin):
//     GET    /v1/admin/cli/token  → active token status (never the plaintext)
//     POST   /v1/admin/cli/token  → create token (plaintext returned ONCE)
//     DELETE /v1/admin/cli/token  → revoke active token
//
//   Public CLI sync (Bearer <cli-token>):
//     GET    /v1/cli/config       → provider config for `agentx config pull`
//
// Provider API keys are never included in the sync payload; the CLI stores
// its own keys locally (set via `agentx config set`).

import type { Express, Request, Response } from 'express';
import type { AuthenticatedRequest } from './auth.js';
import { maybeRequireAdmin } from './auth.js';
import { listProviders } from './llm-provider-store.js';
import { listGroups } from './provider-group-store.js';
import {
  activeCliToken,
  createCliToken,
  revokeCliToken,
  validateCliToken,
} from './cli-token-store.js';

function bearerToken(req: Request): string | null {
  const h = req.headers.authorization;
  if (!h || !h.startsWith('Bearer ')) return null;
  const t = h.slice(7).trim();
  return t.length > 0 ? t : null;
}

export function registerCliRoutes(app: Express): void {
  // ─── Admin: token status ────
  app.get(
    '/v1/admin/cli/token',
    maybeRequireAdmin,
    async (_req: AuthenticatedRequest, res: Response) => {
      try {
        const token = await activeCliToken();
        res.json({
          token: token
            ? {
                id: token.id,
                name: token.name,
                createdAt: token.createdAt,
                lastUsedAt: token.lastUsedAt,
                revokedAt: token.revokedAt,
              }
            : null,
        });
      } catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
      }
    },
  );

  // ─── Admin: create token (plaintext shown once) ────
  app.post(
    '/v1/admin/cli/token',
    maybeRequireAdmin,
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const { name } = req.body ?? {};
        const result = await createCliToken(
          typeof name === 'string' && name ? name.slice(0, 40) : 'default',
        );
        res.status(201).json({ token: result.token, view: result.view });
      } catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
      }
    },
  );

  // ─── Admin: revoke token ────
  app.delete(
    '/v1/admin/cli/token',
    maybeRequireAdmin,
    async (_req: AuthenticatedRequest, res: Response) => {
      try {
        await revokeCliToken();
        res.json({ ok: true });
      } catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
      }
    },
  );

  // ─── CLI sync: provider config ────
  app.get('/v1/cli/config', async (req: Request, res: Response) => {
    try {
      const token = bearerToken(req);
      if (!token) {
        res
          .status(401)
          .json({ error: 'Missing Bearer token (run: agentx config pull --token <cli-token>)' });
        return;
      }
      const row = await validateCliToken(token);
      if (!row) {
        res.status(401).json({ error: 'Invalid or revoked CLI token' });
        return;
      }
      const providers = await listProviders();
      const groups = await listGroups();
      res.json({
        schema: 2,
        syncedAt: new Date().toISOString(),
        providers: providers.map((p) => ({
          name: p.name,
          type: p.type,
          baseUrl: p.baseUrl,
          models: p.models.map((m) => m.id),
          enabled: p.enabled,
          provider: p.provider ?? 'custom',
          authMethod: p.authMethod ?? 'api-key',
        })),
        groups: groups.map((g) => ({
          name: g.name,
          description: g.description,
          strategy: g.strategy,
          members: g.members.map((m) => m.provider),
          enabled: g.enabled,
        })),
      });
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });
}
