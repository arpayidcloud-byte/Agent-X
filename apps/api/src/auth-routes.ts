import type { Express, Request, Response } from 'express';
import { register, login, refresh, requireAuth, changePassword, AuthError } from './auth.js';
import type { AuthenticatedRequest } from './auth.js';
import { verifyTurnstile } from './turnstile.js';

export function registerAuthRoutes(app: Express): void {
  // ─── Register ────
  app.post('/v1/auth/register', async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, turnstileToken } = req.body ?? {};
      if (!(await verifyTurnstile(turnstileToken))) {
        res.status(403).json({ error: 'Human verification failed — please try again.' });
        return;
      }
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
      const { email, password, turnstileToken } = req.body ?? {};
      if (!(await verifyTurnstile(turnstileToken))) {
        res.status(403).json({ error: 'Human verification failed — please try again.' });
        return;
      }
      const result = await login(email, password);
      res.json(result);
    } catch (e) {
      const status = e instanceof Error && 'status' in e ? (e as { status: number }).status : 500;
      res.status(status).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  // ─── CLI Login (no Turnstile — trusted CLI client) ────
  app.post('/v1/auth/cli-login', async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body ?? {};
      if (!email || !password) {
        res.status(400).json({ error: 'Missing fields: email, password' });
        return;
      }
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

  // ─── Change password ────
  app.post(
    '/v1/auth/change-password',
    requireAuth,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      try {
        const { currentPassword, newPassword } = req.body ?? {};
        await changePassword(req.auth?.sub ?? '', currentPassword, newPassword);
        res.json({ ok: true });
      } catch (e) {
        const err = e instanceof AuthError ? e : new AuthError(String(e), 500);
        res.status(err.status).json({ error: err.message });
      }
    },
  );
}
