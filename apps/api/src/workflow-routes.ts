import type { Express, Response } from 'express';
import { getWorkflowRepository } from '@agent-xai/persistence';
import { maybeRequireAdmin, requireAuth, type AuthenticatedRequest } from './auth.js';
import { withOrg } from './middleware/withOrg.js';

/**
 * Workflow CRUD API for the visual workflow builder.
 *
 * GET    /v1/workflows            — list workflows (public read)
 * POST   /v1/workflows            — create workflow (admin)
 * GET    /v1/workflows/:id        — get workflow detail
 * PUT    /v1/workflows/:id        — update workflow (admin)
 * DELETE /v1/workflows/:id        — delete workflow (admin)
 */

export function registerWorkflowRoutes(app: Express): void {
  const repo = getWorkflowRepository();

  // ─── List workflows ────
  app.get(
    '/v1/workflows',
    requireAuth,
    withOrg,
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const limit = Math.min(Number(req.query.limit) || 50, 200);
        const offset = Number(req.query.offset) || 0;
        const orgId = req.auth?.orgId;
        if (!orgId) {
          res.status(403).json({ error: 'Organization context required' });
          return;
        }
        const [workflows, total] = await Promise.all([
          repo.list(orgId, limit, offset),
          repo.count(orgId),
        ]);
        res.json({ workflows, total });
      } catch (e) {
        res.status(500).json({ error: String(e) });
      }
    },
  );

  // ─── Get workflow detail ────
  app.get(
    '/v1/workflows/:id',
    requireAuth,
    withOrg,
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const orgId = req.auth?.orgId;
        if (!orgId) {
          res.status(403).json({ error: 'Organization context required' });
          return;
        }
        const workflow = await repo.getById(orgId, String(req.params.id));
        if (!workflow) {
          res.status(404).json({ error: 'Workflow not found' });
          return;
        }
        res.json({ workflow });
      } catch (e) {
        res.status(500).json({ error: String(e) });
      }
    },
  );

  // ─── Create workflow ────
  app.post(
    '/v1/workflows',
    maybeRequireAdmin,
    withOrg,
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const { name, description, nodes, edges, isPublished, ownerId } = req.body ?? {};
        if (!name || typeof name !== 'string') {
          res.status(400).json({ error: 'name is required' });
          return;
        }
        const orgId = req.auth?.orgId;
        if (!orgId) {
          res.status(403).json({ error: 'Organization context required' });
          return;
        }
        const workflow = await repo.create(orgId, {
          name,
          description: description ?? undefined,
          nodes: nodes ?? [],
          edges: edges ?? [],
          isPublished: isPublished ?? false,
          ownerId: ownerId ?? undefined,
        });
        res.status(201).json({ workflow });
      } catch (e) {
        res.status(500).json({ error: String(e) });
      }
    },
  );

  // ─── Update workflow ────
  app.put(
    '/v1/workflows/:id',
    maybeRequireAdmin,
    withOrg,
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const { name, description, nodes, edges, isPublished, ownerId } = req.body ?? {};
        const orgId = req.auth?.orgId;
        if (!orgId) {
          res.status(403).json({ error: 'Organization context required' });
          return;
        }
        const existing = await repo.getById(orgId, String(req.params.id));
        if (!existing) {
          res.status(404).json({ error: 'Workflow not found' });
          return;
        }
        const workflow = await repo.update(orgId, String(req.params.id), {
          name: name ?? undefined,
          description: description ?? undefined,
          nodes: nodes ?? undefined,
          edges: edges ?? undefined,
          isPublished: isPublished ?? undefined,
          ownerId: ownerId ?? undefined,
        });
        res.json({ workflow });
      } catch (e) {
        res.status(500).json({ error: String(e) });
      }
    },
  );

  // ─── Delete workflow ────
  app.delete(
    '/v1/workflows/:id',
    maybeRequireAdmin,
    withOrg,
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const orgId = req.auth?.orgId;
        if (!orgId) {
          res.status(403).json({ error: 'Organization context required' });
          return;
        }
        const ok = await repo.remove(orgId, String(req.params.id));
        if (!ok) {
          res.status(404).json({ error: 'Workflow not found' });
          return;
        }
        res.json({ success: true });
      } catch (e) {
        res.status(500).json({ error: String(e) });
      }
    },
  );
}
