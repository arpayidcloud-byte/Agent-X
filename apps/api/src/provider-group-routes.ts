// Admin CRUD for combo provider groups.
//
//   GET    /v1/admin/provider-groups          → list all groups
//   POST   /v1/admin/provider-groups          → create (validates members exist)
//   GET    /v1/admin/provider-groups/:name    → single group
//   PATCH  /v1/admin/provider-groups/:name    → update (strategy/members/enabled)
//   DELETE /v1/admin/provider-groups/:name    → delete
//   POST   /v1/admin/provider-groups/:name/test → resolve chain & report member
//          registration status (does NOT call real LLM endpoints — that would
//          burn tokens; provider health is checked via GET /health).
//
// Every mutation is written to the audit log.

import type { Express, Request } from 'express';
import type { AuthenticatedRequest } from './auth.js';
import { maybeRequireAdmin } from './auth.js';
import {
  listGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  type GroupStrategy,
} from './provider-group-store.js';
import { appendAuditLog } from './llm-provider-store.js';
import { resolveComboChain } from './combo-router.js';
import { router as llmRouter } from './agentx-server.js';

const VALID_STRATEGIES: GroupStrategy[] = ['priority', 'round-robin'];

function adminEmail(req: Request): string {
  const auth = (req as AuthenticatedRequest).auth;
  return (auth?.email as string | undefined) ?? 'unknown';
}

function groupName(req: Request): string {
  return String(req.params.name ?? '');
}

interface GroupBody {
  name?: string;
  description?: string | null;
  strategy?: string;
  members?: Array<{ provider: string }>;
  enabled?: boolean;
}

function parseGroupBody(body: unknown): GroupBody {
  return (body ?? {}) as GroupBody;
}

export function registerProviderGroupRoutes(app: Express): void {
  // ─── List groups ────
  app.get('/v1/admin/provider-groups', maybeRequireAdmin, async (_req, res) => {
    try {
      const groups = await listGroups();
      res.json({ groups });
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  // ─── Create group ────
  app.post('/v1/admin/provider-groups', maybeRequireAdmin, async (req, res) => {
    try {
      const body = parseGroupBody(req.body);
      const name = body.name?.trim();
      if (!name || !/^[a-z0-9][a-z0-9-]{0,63}$/.test(name)) {
        res.status(400).json({
          error: 'name wajib: huruf kecil, angka, atau dash (contoh: combo-utama)',
        });
        return;
      }
      const strategy = (body.strategy ?? 'priority') as GroupStrategy;
      if (!VALID_STRATEGIES.includes(strategy)) {
        res
          .status(400)
          .json({ error: `strategy harus salah satu dari: ${VALID_STRATEGIES.join(', ')}` });
        return;
      }
      const members = Array.isArray(body.members) ? body.members.filter((m) => m?.provider) : [];
      if (members.length === 0) {
        res.status(400).json({ error: 'members wajib: minimal 1 provider' });
        return;
      }
      const existing = await getGroup(name);
      if (existing) {
        res.status(409).json({ error: `Group "${name}" sudah ada` });
        return;
      }

      // Validate members exist among registered providers.
      const registered = llmRouter.listProviderNames();
      const unknown = members.filter((m) => !registered.includes(m.provider));
      if (unknown.length > 0) {
        res.status(400).json({
          error: `Member tidak terdaftar: ${unknown.map((m) => m.provider).join(', ')}. Provider tersedia: ${registered.join(', ') || '(kosong)'}`,
        });
        return;
      }

      const group = await createGroup({
        name,
        description: body.description ?? null,
        strategy,
        members,
        enabled: body.enabled ?? true,
      });
      await appendAuditLog(adminEmail(req), 'create', `group:${group.name}`, {
        strategy: group.strategy,
        members: group.members.map((m) => m.provider),
      });
      res.status(201).json({ group });
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  // ─── Get single group ────
  app.get('/v1/admin/provider-groups/:name', maybeRequireAdmin, async (req, res) => {
    try {
      const group = await getGroup(groupName(req));
      if (!group) {
        res.status(404).json({ error: `Group "${groupName(req)}" tidak ditemukan` });
        return;
      }
      res.json({ group });
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  // ─── Update group ────
  app.patch('/v1/admin/provider-groups/:name', maybeRequireAdmin, async (req, res) => {
    try {
      const body = parseGroupBody(req.body);
      const existing = await getGroup(groupName(req));
      if (!existing) {
        res.status(404).json({ error: `Group "${groupName(req)}" tidak ditemukan` });
        return;
      }

      if (body.strategy !== undefined) {
        if (!VALID_STRATEGIES.includes(body.strategy as GroupStrategy)) {
          res
            .status(400)
            .json({ error: `strategy harus salah satu dari: ${VALID_STRATEGIES.join(', ')}` });
          return;
        }
      }
      let members = existing.members;
      if (Array.isArray(body.members)) {
        members = body.members.filter((m) => m?.provider);
        if (members.length === 0) {
          res.status(400).json({ error: 'members wajib: minimal 1 provider' });
          return;
        }
        const registered = llmRouter.listProviderNames();
        const unknown = members.filter((m) => !registered.includes(m.provider));
        if (unknown.length > 0) {
          res.status(400).json({
            error: `Member tidak terdaftar: ${unknown.map((m) => m.provider).join(', ')}`,
          });
          return;
        }
      }

      const group = await updateGroup(groupName(req), {
        description: body.description !== undefined ? body.description : undefined,
        strategy: body.strategy as GroupStrategy | undefined,
        members,
        enabled: body.enabled,
      });
      await appendAuditLog(adminEmail(req), 'update', `group:${groupName(req)}`, {
        strategy: group?.strategy,
        members: group?.members.map((m) => m.provider),
        enabled: group?.enabled,
      });
      res.json({ group });
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  // ─── Delete group ────
  app.delete('/v1/admin/provider-groups/:name', maybeRequireAdmin, async (req, res) => {
    try {
      const ok = await deleteGroup(groupName(req));
      if (!ok) {
        res.status(404).json({ error: `Group "${groupName(req)}" tidak ditemukan` });
        return;
      }
      await appendAuditLog(adminEmail(req), 'delete', `group:${groupName(req)}`, {});
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  // ─── Test group (resolve chain, check member registration) ────
  app.post('/v1/admin/provider-groups/:name/test', maybeRequireAdmin, async (req, res) => {
    try {
      const group = await getGroup(groupName(req));
      if (!group) {
        res.status(404).json({ error: `Group "${groupName(req)}" tidak ditemukan` });
        return;
      }
      const chain = await resolveComboChain(group.name);
      const registered = llmRouter.listProviderNames();
      const result = {
        name: group.name,
        strategy: group.strategy,
        enabled: group.enabled,
        chain: chain ?? [],
        members: group.members.map((m) => ({
          provider: m.provider,
          registered: registered.includes(m.provider),
        })),
        usable: (chain ?? []).length > 0 && (chain ?? []).every((m) => registered.includes(m)),
      };
      await appendAuditLog(adminEmail(req), 'test', `group:${group.name}`, {
        usable: result.usable,
      });
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });
}
