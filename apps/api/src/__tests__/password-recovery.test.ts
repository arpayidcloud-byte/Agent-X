import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import type { Server } from 'node:http';

// Same env discipline as auth-api.test.ts: AUTH on, in-memory backends.
process.env.ENABLE_MOCK_PROVIDER = 'true';
process.env.AUTH_ENABLED = 'true';
process.env.ADMIN_EMAILS = 'admin@agentx.dev';
process.env.JWT_SECRET = 'test-secret';
delete process.env.DATABASE_URL;
delete process.env.RESEND_API_KEY; // dev-mode mailer (captured, no network)

const { app, resetBetaStores } = await import('../agentx-server.js');
const { oauthLogin } = await import('../oauth.js');
const { clearPasswordResetTokens } = await import('../auth.js');
const { getCapturedMails, clearCapturedMails } = await import('../mailer.js');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function asJson<T = any>(res: Response): Promise<T> {
  return (await res.json()) as T;
}

async function post(
  baseUrl: string,
  path: string,
  body: unknown,
  token?: string,
): Promise<Response> {
  return fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
}

describe('Password recovery (set / forgot / reset)', () => {
  let server: Server;
  let baseUrl: string;

  beforeEach(async () => {
    resetBetaStores();
    clearPasswordResetTokens();
    clearCapturedMails();
    if (server) await new Promise((resolve) => server.close(resolve));
    server = app.listen(0);
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('no port');
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    if (server) await new Promise((resolve) => server.close(resolve));
  });

  it('POST /v1/auth/me reports hasPassword=false for OAuth accounts', async () => {
    const { user, tokens } = await oauthLogin('google', {
      email: 'oauth-me@test.com',
      emailVerified: true,
    });
    expect(user.id).toBeTruthy();
    const res = await fetch(`${baseUrl}/v1/auth/me`, {
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });
    expect(res.status).toBe(200);
    const body = await asJson(res);
    expect(body.user.email).toBe('oauth-me@test.com');
    expect(body.user.hasPassword).toBe(false);
  });

  it('POST /v1/auth/set-password sets the first password; login then works; repeat is 409', async () => {
    const { tokens } = await oauthLogin('github', {
      email: 'oauth-set@test.com',
      emailVerified: true,
    });

    // Weak password rejected
    const weak = await post(
      baseUrl,
      '/v1/auth/set-password',
      { newPassword: 'short' },
      tokens.accessToken,
    );
    expect(weak.status).toBe(400);

    // Sets the first password
    const ok = await post(
      baseUrl,
      '/v1/auth/set-password',
      { newPassword: 'brand-new-pass' },
      tokens.accessToken,
    );
    expect(ok.status).toBe(200);

    // Email/password login now works for the OAuth account
    const login = await post(baseUrl, '/v1/auth/cli-login', {
      email: 'oauth-set@test.com',
      password: 'brand-new-pass',
    });
    expect(login.status).toBe(200);
    const loginBody = await asJson(login);
    expect(loginBody.tokens.accessToken).toBeTruthy();

    // Setting again is refused (account now has a password)
    const again = await post(
      baseUrl,
      '/v1/auth/set-password',
      { newPassword: 'another-pass' },
      tokens.accessToken,
    );
    expect(again.status).toBe(409);

    // /v1/auth/me now reports hasPassword=true
    const me = await fetch(`${baseUrl}/v1/auth/me`, {
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });
    const meBody = await asJson(me);
    expect(meBody.user.hasPassword).toBe(true);
  });

  it('POST /v1/auth/forgot-password mails a reset link only for existing accounts', async () => {
    await oauthLogin('google', { email: 'forgot@test.com', emailVerified: true });

    const res = await post(baseUrl, '/v1/auth/forgot-password', { email: 'forgot@test.com' });
    expect(res.status).toBe(200);

    const mails = getCapturedMails();
    expect(mails).toHaveLength(1);
    expect(mails[0]!.to).toBe('forgot@test.com');
    expect(mails[0]!.subject).toContain('password');
    const token = /token=([0-9a-f-]+)/.exec(mails[0]!.text)?.[1];
    expect(token).toBeTruthy();

    // Unknown email: still 200, no mail (no enumeration)
    const unknown = await post(baseUrl, '/v1/auth/forgot-password', { email: 'nobody@test.com' });
    expect(unknown.status).toBe(200);
    expect(getCapturedMails()).toHaveLength(1);

    // Missing email: 400
    const missing = await post(baseUrl, '/v1/auth/forgot-password', {});
    expect(missing.status).toBe(400);
  });

  it('POST /v1/auth/reset-password resets with the token; token is one-time', async () => {
    await oauthLogin('google', { email: 'reset@test.com', emailVerified: true });
    await post(baseUrl, '/v1/auth/forgot-password', { email: 'reset@test.com' });
    const token = /token=([0-9a-f-]+)/.exec(getCapturedMails()[0]!.text)?.[1];
    expect(token).toBeTruthy();

    // Invalid token rejected
    const bad = await post(baseUrl, '/v1/auth/reset-password', {
      token: 'not-a-real-token',
      newPassword: 'new-pass-123',
    });
    expect(bad.status).toBe(400);

    // Valid token resets the password
    const ok = await post(baseUrl, '/v1/auth/reset-password', {
      token,
      newPassword: 'new-pass-123',
    });
    expect(ok.status).toBe(200);

    // Login with the new password works
    const login = await post(baseUrl, '/v1/auth/cli-login', {
      email: 'reset@test.com',
      password: 'new-pass-123',
    });
    expect(login.status).toBe(200);

    // Token is one-time — reuse fails
    const reuse = await post(baseUrl, '/v1/auth/reset-password', {
      token,
      newPassword: 'yet-another',
    });
    expect(reuse.status).toBe(400);
  });

  it('change-password still requires the current password (no bypass)', async () => {
    await post(baseUrl, '/v1/auth/register', {
      email: 'pw@test.com',
      password: 'original-pass',
    });
    const loginRes = await post(baseUrl, '/v1/auth/cli-login', {
      email: 'pw@test.com',
      password: 'original-pass',
    });
    expect(loginRes.status).toBe(200);
    const { tokens } = await asJson(loginRes);

    const wrong = await post(
      baseUrl,
      '/v1/auth/change-password',
      { currentPassword: 'wrong-pass', newPassword: 'new-pass-123' },
      tokens.accessToken,
    );
    expect(wrong.status).toBe(401);

    const right = await post(
      baseUrl,
      '/v1/auth/change-password',
      { currentPassword: 'original-pass', newPassword: 'new-pass-123' },
      tokens.accessToken,
    );
    expect(right.status).toBe(200);
  });
});
