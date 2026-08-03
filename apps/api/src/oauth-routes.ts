import type { Express, Request, Response } from 'express';
import { Logger } from '@agent-xai/observability';
import {
  isOAuthConfigured,
  buildAuthorizeUrl,
  createOAuthState,
  verifyOAuthState,
  exchangeCode,
  oauthLogin,
  oauthSuccessUrl,
  type OAuthProvider,
} from './oauth.js';

const logger = new Logger('agentx-api:oauth-routes');

function parseProvider(value: unknown): OAuthProvider | null {
  return value === 'google' || value === 'github' || value === 'apple' ? value : null;
}

export function registerOAuthRoutes(app: Express): void {
  // ─── Start OAuth flow: redirect browser to the provider ────
  app.get('/v1/auth/oauth/:provider', (req: Request, res: Response) => {
    const provider = parseProvider(req.params.provider);
    if (!provider) {
      res.status(400).json({ error: 'Unknown provider (expected google, github or apple)' });
      return;
    }
    if (!isOAuthConfigured(provider)) {
      res.status(501).json({
        error: `OAuth not configured for ${provider} — set ${provider.toUpperCase()}_CLIENT_ID / _CLIENT_SECRET env vars`,
      });
      return;
    }
    const state = createOAuthState(provider);
    res.redirect(buildAuthorizeUrl(provider, state));
  });

  // ─── OAuth callback: exchange code, upsert user, redirect to web ────
  app.get('/v1/auth/oauth/:provider/callback', async (req: Request, res: Response) => {
    const provider = parseProvider(req.params.provider);
    const code = typeof req.query.code === 'string' ? req.query.code : '';
    const state = typeof req.query.state === 'string' ? req.query.state : '';

    const fail = (message: string, status = 400): void => {
      res.status(status).send(
        `<!doctype html><html><body style="font-family:system-ui;background:#0b1220;color:#cbd5e1;display:flex;align-items:center;justify-content:center;height:100vh">
        <div style="text-align:center"><h2>Sign-in failed</h2><p>${message}</p>
        <a href="${process.env.OAUTH_WEB_URL ?? 'http://localhost:30500'}/settings" style="color:#22d3ee">Back to sign in</a></div></body></html>`,
      );
    };

    if (!provider) {
      fail('Unknown provider.', 400);
      return;
    }
    if (!code || !state) {
      fail('Missing code or state.', 400);
      return;
    }
    const verifiedProvider = verifyOAuthState(state);
    if (verifiedProvider !== provider) {
      fail('Invalid or expired state — please try again.', 400);
      return;
    }
    try {
      const profile = await exchangeCode(provider, code);
      const result = await oauthLogin(provider, profile);
      res.redirect(oauthSuccessUrl(result.tokens));
    } catch (e) {
      logger.error(
        `OAuth callback failed (${provider}): ${e instanceof Error ? e.message : String(e)}`,
      );
      fail(e instanceof Error ? e.message : 'OAuth exchange failed.', 502);
    }
  });
}
