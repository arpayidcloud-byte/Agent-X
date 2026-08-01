import type { Express, Request, Response } from 'express';
import { register, login, refresh, requireAuth } from './auth.js';
import type { AuthenticatedRequest } from './auth.js';

export function registerAuthRoutes(app: Express): void {
  // ─── Register ────
  app.post('/v1/auth/register', async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body ?? {};
      const result = await register(email, password);
      res.status(201).json(result);
    } catch (e) {
      const status = e instanceof Error && 'status' in e ? (e as { status: number }).status : 500;
      res.status(status).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  // ─── Login ────
  app.post('/v1/auth/login', async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body ?? {};
      const result = await login(email, password);
      res.json(result);
    } catch (e) {
      const status = e instanceof Error && 'status' in e ? (e as { status: number }).status : 500;
      res.status(status).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  // ─── Refresh ────
  app.post('/v1/auth/refresh', async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body ?? {};
      if (!refreshToken || typeof refreshToken !== 'string') {
        res.status(400).json({ error: 'Missing field: refreshToken' });
        return;
      }
      const tokens = await refresh(refreshToken);
      res.json(tokens);
    } catch (e) {
      const status = e instanceof Error && 'status' in e ? (e as { status: number }).status : 500;
      res.status(status).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  // ─── Me ────
  app.get('/v1/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    res.json({ user: { id: req.auth?.sub, email: req.auth?.email, roles: req.auth?.roles } });
  });
}
