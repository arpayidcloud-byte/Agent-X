// OAuth social login (Google OIDC + GitHub OAuth2 + Apple Sign In) for Web Pro.
//
// Deliberately dependency-light: uses global fetch (Node 18+) plus the
// already-present jsonwebtoken for Apple's ES256 client secret and RS256
// id_token verification. Credentials are read from env vars and the flow is
// feature-flagged by presence of those vars — when unset, the authorize
// endpoint returns 501 so the UI can show "not configured" without breaking
// the email/password flow.
//
//   GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
//   GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET
//   APPLE_CLIENT_ID / APPLE_TEAM_ID / APPLE_KEY_ID / APPLE_PRIVATE_KEY (P8 PEM)
//   OAUTH_BASE_URL   (API base used to build redirect_uri, default localhost:30400)
//   OAUTH_WEB_URL    (web base for the success redirect, default localhost:30500)

import jwt from 'jsonwebtoken';
import { createPublicKey } from 'node:crypto';
import { v4 as uuidv4 } from 'uuid';
import { getUserBackend, issueTokens, rolesFor, type AuthUser, type AuthTokens } from './auth.js';
import { Logger } from '@agent-xai/observability';

const logger = new Logger('agentx-api:oauth');

export type OAuthProvider = 'google' | 'github' | 'apple';

export interface OAuthProfile {
  email: string;
  name?: string;
  emailVerified: boolean;
}

// Env is read lazily so tests can set process.env after import.
function oauthBaseUrl(): string {
  return process.env.OAUTH_BASE_URL ?? 'http://localhost:30400';
}

function oauthWebUrl(): string {
  return process.env.OAUTH_WEB_URL ?? 'http://localhost:30500';
}

function redirectUri(provider: OAuthProvider): string {
  return `${oauthBaseUrl()}/v1/auth/oauth/${provider}/callback`;
}

function clientCredentials(provider: OAuthProvider): { id: string; secret: string } | null {
  if (provider === 'google') {
    const id = process.env.GOOGLE_CLIENT_ID;
    const secret = process.env.GOOGLE_CLIENT_SECRET;
    return id && secret ? { id, secret } : null;
  }
  if (provider === 'github') {
    const id = process.env.GITHUB_CLIENT_ID;
    const secret = process.env.GITHUB_CLIENT_SECRET;
    return id && secret ? { id, secret } : null;
  }
  // Apple: the client secret is a signed JWT generated per-exchange, so only
  // the client id is returned here (secret filled by appleClientSecret()).
  const env = appleEnv();
  return env ? { id: env.clientId, secret: '' } : null;
}

/** Apple Sign In env (Service ID + team + key). */
function appleEnv(): {
  clientId: string;
  teamId: string;
  keyId: string;
  privateKey: string;
} | null {
  const clientId = process.env.APPLE_CLIENT_ID;
  const teamId = process.env.APPLE_TEAM_ID;
  const keyId = process.env.APPLE_KEY_ID;
  const privateKey = process.env.APPLE_PRIVATE_KEY;
  if (!clientId || !teamId || !keyId || !privateKey) return null;
  return { clientId, teamId, keyId, privateKey };
}

export function isOAuthConfigured(provider: OAuthProvider): boolean {
  return clientCredentials(provider) !== null;
}

/** Authorize URL the browser is redirected to. `state` is caller-generated. */
export function buildAuthorizeUrl(provider: OAuthProvider, state: string): string {
  const creds = clientCredentials(provider);
  if (!creds) {
    throw new Error(`OAuth not configured for provider: ${provider}`);
  }
  if (provider === 'google') {
    const params = new URLSearchParams({
      client_id: creds.id,
      redirect_uri: redirectUri('google'),
      response_type: 'code',
      scope: 'openid email profile',
      state,
      prompt: 'select_account',
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }
  if (provider === 'github') {
    const params = new URLSearchParams({
      client_id: creds.id,
      redirect_uri: redirectUri('github'),
      scope: 'read:user user:email',
      state,
    });
    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }
  // Apple Sign In web: response_mode=query so the code arrives on the
  // redirect_uri query string (form_post would need an HTML form POST page).
  const params = new URLSearchParams({
    client_id: creds.id,
    redirect_uri: redirectUri('apple'),
    response_type: 'code',
    scope: 'name email',
    response_mode: 'query',
    state,
  });
  return `https://appleid.apple.com/auth/authorize?${params.toString()}`;
}

async function exchangeGoogleCode(code: string): Promise<OAuthProfile> {
  const creds = clientCredentials('google');
  if (!creds) throw new Error('Google OAuth not configured');
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: creds.id,
      client_secret: creds.secret,
      redirect_uri: redirectUri('google'),
      grant_type: 'authorization_code',
    }),
  });
  if (!tokenRes.ok) {
    throw new Error(`Google token exchange failed: ${tokenRes.status}`);
  }
  const tokenData = (await tokenRes.json()) as { access_token: string };
  const infoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  if (!infoRes.ok) {
    throw new Error(`Google userinfo failed: ${infoRes.status}`);
  }
  const info = (await infoRes.json()) as {
    email?: string;
    name?: string;
    email_verified?: boolean;
  };
  if (!info.email) throw new Error('Google account has no email');
  return {
    email: info.email.toLowerCase(),
    name: info.name,
    emailVerified: info.email_verified === true,
  };
}

async function exchangeGitHubCode(code: string): Promise<OAuthProfile> {
  const creds = clientCredentials('github');
  if (!creds) throw new Error('GitHub OAuth not configured');
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      code,
      client_id: creds.id,
      client_secret: creds.secret,
      redirect_uri: redirectUri('github'),
    }),
  });
  if (!tokenRes.ok) {
    throw new Error(`GitHub token exchange failed: ${tokenRes.status}`);
  }
  const tokenData = (await tokenRes.json()) as { access_token?: string };
  if (!tokenData.access_token) {
    throw new Error(`GitHub token exchange failed: ${JSON.stringify(tokenData)}`);
  }
  const userRes = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${tokenData.access_token}`, Accept: 'application/json' },
  });
  if (!userRes.ok) {
    throw new Error(`GitHub user failed: ${userRes.status}`);
  }
  const user = (await userRes.json()) as {
    email?: string | null;
    name?: string | null;
    login?: string;
  };
  let email = user.email?.toLowerCase();
  let verified = Boolean(email);
  if (!email) {
    // Public email hidden — fetch verified primary email via /user/emails.
    const emailsRes = await fetch('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${tokenData.access_token}`, Accept: 'application/json' },
    });
    if (emailsRes.ok) {
      const emails = (await emailsRes.json()) as Array<{
        email: string;
        primary?: boolean;
        verified?: boolean;
      }>;
      const primary = emails.find((e) => e.primary && e.verified) ?? emails.find((e) => e.verified);
      if (primary) {
        email = primary.email.toLowerCase();
        verified = true;
      }
    }
  }
  if (!email) throw new Error('GitHub account has no public email');
  return { email, name: user.name ?? user.login, emailVerified: verified };
}

// ─── Apple Sign In ──────────────────────────────────────────────────────────
// Apple's OAuth is OIDC with two twists: the client secret is a JWT signed
// (ES256) with a per-key private key from the Apple Developer portal, and the
// user profile comes from the id_token (RS256) verified against Apple's JWKS.

let cachedAppleSecret: { jwt: string; expiresAt: number } | null = null;

/** Build the Apple client_secret JWT (ES256, kid=APPLE_KEY_ID). Cached until ~1h before expiry. */
export async function appleClientSecret(): Promise<string> {
  const env = appleEnv();
  if (!env) throw new Error('Apple OAuth not configured');
  if (cachedAppleSecret && cachedAppleSecret.expiresAt - Date.now() > 60 * 60 * 1000) {
    return cachedAppleSecret.jwt;
  }
  const now = Math.floor(Date.now() / 1000);
  const token = jwt.sign({}, env.privateKey, {
    algorithm: 'ES256',
    keyid: env.keyId,
    issuer: env.teamId,
    audience: 'https://appleid.apple.com',
    subject: env.clientId,
    expiresIn: 180 * 24 * 60 * 60, // 180 days = Apple max
    notBefore: now - 60,
  });
  const decoded = jwt.decode(token) as { exp?: number };
  cachedAppleSecret = { jwt: token, expiresAt: (decoded.exp ?? now) * 1000 };
  return token;
}

let jwksCache: { keys: Array<{ kid?: string; n?: string; e?: string }>; fetchedAt: number } | null =
  null;

/** Reset cached Apple client secret / JWKS — used by tests. */
export function resetAppleOAuthCaches(): void {
  cachedAppleSecret = null;
  jwksCache = null;
}

async function appleJwks(): Promise<Array<{ kid?: string; n?: string; e?: string }>> {
  if (jwksCache && Date.now() - jwksCache.fetchedAt < 12 * 60 * 60 * 1000) {
    return jwksCache.keys;
  }
  const res = await fetch('https://appleid.apple.com/auth/keys');
  if (!res.ok) throw new Error(`Apple keys fetch failed: ${res.status}`);
  const data = (await res.json()) as { keys: Array<{ kid?: string; n?: string; e?: string }> };
  jwksCache = { keys: data.keys, fetchedAt: Date.now() };
  return data.keys;
}

/** Verify an Apple id_token (RS256, JWKS) and return its claims. Exported for tests. */
export async function verifyAppleIdToken(idToken: string): Promise<{
  sub: string;
  email?: string;
  email_verified?: boolean;
}> {
  const env = appleEnv();
  if (!env) throw new Error('Apple OAuth not configured');
  const decoded = jwt.decode(idToken, { complete: true }) as {
    header: { kid?: string };
    payload: { iss?: string; aud?: string; exp?: number };
  } | null;
  if (!decoded) throw new Error('id_token invalid');
  if (decoded.payload.iss !== 'https://appleid.apple.com') {
    throw new Error('id_token bad issuer');
  }
  if (decoded.payload.aud !== env.clientId) {
    throw new Error('id_token bad audience');
  }
  const keys = await appleJwks();
  const key = keys.find((k) => k.kid === decoded.header.kid);
  if (!key || !key.n || !key.e) throw new Error('id_token signing key not found');
  const publicKey = createPublicKey({ key: { kty: 'RSA', n: key.n, e: key.e }, format: 'jwk' });
  const payload = jwt.verify(idToken, publicKey, {
    algorithms: ['RS256'],
    issuer: 'https://appleid.apple.com',
    audience: env.clientId,
  }) as { sub: string; email?: string; email_verified?: boolean };
  return { sub: payload.sub, email: payload.email, email_verified: payload.email_verified };
}

async function exchangeAppleCode(code: string): Promise<OAuthProfile> {
  const env = appleEnv();
  if (!env) throw new Error('Apple OAuth not configured');
  const secret = await appleClientSecret();
  const tokenRes = await fetch('https://appleid.apple.com/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.clientId,
      client_secret: secret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri('apple'),
    }),
  });
  if (!tokenRes.ok) {
    throw new Error(`Apple token exchange failed: ${tokenRes.status}`);
  }
  const tokenData = (await tokenRes.json()) as { id_token?: string; error?: string };
  if (!tokenData.id_token) {
    throw new Error(`Apple token exchange failed: ${JSON.stringify(tokenData)}`);
  }
  const claims = await verifyAppleIdToken(tokenData.id_token);
  const email = claims.email?.toLowerCase();
  if (!email) throw new Error('Apple account has no email');
  // Apple does not expose a name claim over response_mode=query; fall back to
  // the local part of the email. Email from Apple is always verified.
  return { email, name: email.split('@')[0], emailVerified: true };
}

export async function exchangeCode(provider: OAuthProvider, code: string): Promise<OAuthProfile> {
  if (provider === 'google') return exchangeGoogleCode(code);
  if (provider === 'github') return exchangeGitHubCode(code);
  return exchangeAppleCode(code);
}

/**
 * Find or create a user for an OAuth profile and issue tokens — the same
 * token shape as register/login so the frontend treats it identically.
 */
export async function oauthLogin(
  provider: OAuthProvider,
  profile: OAuthProfile,
): Promise<{ user: AuthUser; tokens: AuthTokens; created: boolean }> {
  if (!profile.emailVerified) {
    throw new Error(`${provider} email is not verified`);
  }
  const backend = await getUserBackend();
  let user = await backend.findByEmail(profile.email);
  let created = false;
  if (!user) {
    user = await backend.create({
      id: uuidv4(),
      email: profile.email,
      passwordHash: '', // no local password; login via OAuth only
      roles: rolesFor(profile.email),
    });
    created = true;
    logger.info('User created via OAuth', { provider, email: profile.email });
  }
  return {
    user: { id: user.id, email: user.email, roles: user.roles, createdAt: user.createdAt },
    tokens: issueTokens(user),
    created,
  };
}

/** In-memory OAuth state store (anti-CSRF), like other demo-grade stores. */
const stateStore = new Map<string, { provider: OAuthProvider; createdAt: number }>();
const STATE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export function createOAuthState(provider: OAuthProvider): string {
  const state = uuidv4();
  stateStore.set(state, { provider, createdAt: Date.now() });
  return state;
}

export function verifyOAuthState(state: string): OAuthProvider | null {
  const entry = stateStore.get(state);
  if (!entry) return null;
  stateStore.delete(state);
  if (Date.now() - entry.createdAt > STATE_TTL_MS) return null;
  return entry.provider;
}

export function oauthSuccessUrl(tokens: AuthTokens): string {
  const params = new URLSearchParams({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
  return `${oauthWebUrl()}/oauth/callback?${params.toString()}`;
}
