import type { Express, Request, Response } from 'express';
import { getWorkflowRepository } from '@agent-xai/persistence';

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
  app.get('/v1/workflows', async (req: Request, res: Response) => {
    try {
      const limit = Math.min(Number(req.query.limit) || 50, 200);
      const offset = Number(req.query.offset) || 0;
      const [workflows, total] = await Promise.all([repo.list(limit, offset), repo.count()]);
      res.json({ workflows, total });
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  });

  // ─── Get workflow detail ────
  app.get('/v1/workflows/:id', async (req: Request, res: Response) => {
    try {
      const workflow = await repo.getById(String(req.params.id));
      if (!workflow) {
        res.status(404).json({ error: 'Workflow not found' });
        return;
      }
      res.json({ workflow });
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  });

  // ─── Create workflow ────
  app.post('/v1/workflows', async (req: Request, res: Response) => {
    try {
      const { name, description, nodes, edges, isPublished, ownerId } = req.body ?? {};
      if (!name || typeof name !== 'string') {
        res.status(400).json({ error: 'name is required' });
        return;
      }
      const workflow = await repo.create({
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
  });

  // ─── Update workflow ────
  app.put('/v1/workflows/:id', async (req: Request, res: Response) => {
    try {
      const { name, description, nodes, edges, isPublished, ownerId } = req.body ?? {};
      const existing = await repo.getById(String(req.params.id));
      if (!existing) {
        res.status(404).json({ error: 'Workflow not found' });
        return;
      }
      const workflow = await repo.update(String(req.params.id), {
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
  });

  // ─── Delete workflow ────
  app.delete('/v1/workflows/:id', async (req: Request, res: Response) => {
    try {
      const ok = await repo.remove(String(req.params.id));
      if (!ok) {
        res.status(404).json({ error: 'Workflow not found' });
        return;
      }
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  });
}
