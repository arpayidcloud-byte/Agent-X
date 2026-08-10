// OAuth social login (Google OIDC + GitHub OAuth2) for Web Pro.
//
// Deliberately dependency-free: uses global fetch (Node 18+). Credentials are
// read from env vars and the flow is feature-flagged by presence of those
// vars — when unset, the authorize endpoint returns 501 so the UI can show
// "not configured" without breaking the email/password flow.
//
//   GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
//   GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET
//   OAUTH_BASE_URL   (API base used to build redirect_uri, default localhost:30400)
//   OAUTH_WEB_URL    (web base for the success redirect, default localhost:30500)

import { v4 as uuidv4 } from 'uuid';
import { getUserBackend, issueTokens, rolesFor, type AuthUser, type AuthTokens } from './auth.js';
import { Logger } from '@agent-xai/observability';

const logger = new Logger('agentx-api:oauth');

export type OAuthProvider = 'google' | 'github';

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
  const id = process.env.GOOGLE_CLIENT_ID;
  const secret = process.env.GOOGLE_CLIENT_SECRET;
  return id && secret ? { id, secret } : null;
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

export async function exchangeCode(provider: OAuthProvider, code: string): Promise<OAuthProfile> {
  return provider === 'google' ? exchangeGoogleCode(code) : exchangeGitHubCode(code);
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
    await backend.updateEmailVerified(user.id, true);
    user.emailVerified = true;
    created = true;
    logger.info('User created via OAuth', { provider, email: profile.email });
  }
  return {
    user: {
      id: user.id,
      email: user.email,
      roles: user.roles,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    },
    tokens: await issueTokens(user),
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
