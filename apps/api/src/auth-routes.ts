import type { Express, Request, Response } from 'express';
import {
  register,
  login,
  refresh,
  requireAuth,
  changePassword,
  setPassword,
  createPasswordResetToken,
  resetPasswordWithToken,
  getUserById,
  hasPassword,
  createEmailVerificationToken,
  verifyEmailByToken,
  AuthError,
} from './auth.js';
import type { AuthenticatedRequest } from './auth.js';
import { verifyTurnstile } from './turnstile.js';
import { sendMail } from './mailer.js';

export function registerAuthRoutes(app: Express): void {
  // ─── Register ──── (email verify flow — no auto issueTokens)
  app.post('/v1/auth/register', async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, turnstileToken } = req.body ?? {};
      if (!(await verifyTurnstile(turnstileToken))) {
        res.status(403).json({ error: 'Human verification failed — please try again.' });
        return;
      }
      await register(email, password);
      const token = await createEmailVerificationToken(email);
      const webUrl = process.env.OAUTH_WEB_URL ?? 'http://localhost:30500';
      const verifyUrl = `${webUrl}/verify-email?token=${encodeURIComponent(token)}`;
      // Dev: log; prod: email via sendMail (kept non-blocking)
      await sendMail({
        to: email.trim().toLowerCase(),
        subject: 'Verify your AgentX email',
        text: `Welcome to AgentX!\n\nVerify your email (valid 24h):\n${verifyUrl}\n\nIf this wasn't you, ignore this email.`,
      }).catch(() => {});
      res
        .status(201)
        .json({ ok: true, message: 'Verification email sent — check your inbox (and spam).' });
    } catch (e) {
      const status = e instanceof Error && 'status' in e ? (e as { status: number }).status : 500;
      res.status(status).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  // ─── Verify email ────
  app.post('/v1/auth/verify-email', async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.body ?? {};
      const result = await verifyEmailByToken(token);
      res.json({ ok: true, email: result.email });
    } catch (e) {
      const err = e instanceof AuthError ? e : new AuthError(String(e), 500);
      res.status(err.status).json({ error: err.message });
    }
  });

  app.post('/v1/auth/resend-verification', async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body ?? {};
      if (!email || typeof email !== 'string') {
        res.status(400).json({ error: 'Missing field: email' });
        return;
      }
      const token = await createEmailVerificationToken(email);
      const webUrl = process.env.OAUTH_WEB_URL ?? 'http://localhost:30500';
      const verifyUrl = `${webUrl}/verify-email?token=${encodeURIComponent(token)}`;
      await sendMail({
        to: email.trim().toLowerCase(),
        subject: 'Verify your AgentX email',
        text: `Verify your email (valid 24h):\n${verifyUrl}`,
      }).catch(() => {});
      res.json({ ok: true });
    } catch (e) {
      const err = e instanceof AuthError ? e : new AuthError(String(e), 500);
      res.status(err.status).json({ error: err.message });
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
  app.get('/v1/auth/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    const user = await getUserById(req.auth?.sub ?? '');
    res.json({
      user: {
        id: req.auth?.sub,
        email: req.auth?.email,
        roles: req.auth?.roles,
        // Whether the account has a local password (false for OAuth-only
        // accounts) — lets the UI show "Set password" vs "Change password".
        hasPassword: user ? hasPassword(user) : true,
      },
    });
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

  // ─── Set first password (OAuth accounts) ────
  // For users created via Google/GitHub (no local password): sets one without
  // requiring a current password. Refuses once a password exists.
  app.post(
    '/v1/auth/set-password',
    requireAuth,
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const { newPassword } = req.body ?? {};
        await setPassword(req.auth?.sub ?? '', newPassword);
        res.json({ ok: true });
      } catch (e) {
        const err = e instanceof AuthError ? e : new AuthError(String(e), 500);
        res.status(err.status).json({ error: err.message });
      }
    },
  );

  // ─── Forgot password ────
  // Always answers 200 (even for unknown emails) so the endpoint cannot be
  // used to enumerate registered accounts. Email is only sent when the
  // account exists.
  app.post('/v1/auth/forgot-password', async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body ?? {};
      if (!email || typeof email !== 'string') {
        res.status(400).json({ error: 'Missing field: email' });
        return;
      }
      const token = await createPasswordResetToken(email);
      if (token) {
        const webUrl = process.env.OAUTH_WEB_URL ?? 'http://localhost:30500';
        const resetUrl = `${webUrl}/reset-password?token=${encodeURIComponent(token)}`;
        const text =
          `Someone requested a password reset for your AgentX account.\n\n` +
          `Reset your password here (valid for 30 minutes):\n${resetUrl}\n\n` +
          `If this wasn't you, ignore this email.`;
        await sendMail({
          to: email.trim().toLowerCase(),
          subject: 'Reset your AgentX password',
          text,
        });
      }
      res.json({ ok: true });
    } catch (e) {
      const err = e instanceof AuthError ? e : new AuthError(String(e), 500);
      res.status(err.status).json({ error: err.message });
    }
  });

  // ─── Reset password (token from email) ────
  app.post('/v1/auth/reset-password', async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, newPassword } = req.body ?? {};
      await resetPasswordWithToken(token, newPassword);
      res.json({ ok: true });
    } catch (e) {
      const err = e instanceof AuthError ? e : new AuthError(String(e), 500);
      res.status(err.status).json({ error: err.message });
    }
  });
}
