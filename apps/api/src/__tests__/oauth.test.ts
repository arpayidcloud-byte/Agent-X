import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { generateKeyPairSync } from 'node:crypto';

// Unit tests for the OAuth layer. Network calls are stubbed so tests run
// offline; the token exchange + userinfo + upsert flow is covered.
import {
  isOAuthConfigured,
  buildAuthorizeUrl,
  createOAuthState,
  verifyOAuthState,
  oauthLogin,
  exchangeCode,
  oauthSuccessUrl,
  appleClientSecret,
  verifyAppleIdToken,
  resetAppleOAuthCaches,
} from '../oauth.js';
import { getUserBackend, type AuthTokens } from '../auth.js';

const googleCreds = { GOOGLE_CLIENT_ID: 'g-id', GOOGLE_CLIENT_SECRET: 'g-secret' };
const githubCreds = { GITHUB_CLIENT_ID: 'gh-id', GITHUB_CLIENT_SECRET: 'gh-secret' };
const appleCreds = {
  APPLE_CLIENT_ID: 'com.example.service',
  APPLE_TEAM_ID: 'ABCDE12345',
  APPLE_KEY_ID: 'ABC123DEFG',
};
const baseEnv = { ...process.env };

// A real EC P-256 key so Apple's ES256 client secret signing is exercised.
const ecKey = generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
const applePrivateKeyPem = ecKey.privateKey.export({ type: 'pkcs8', format: 'pem' }) as string;

// A real RSA key so Apple id_token (RS256) verification is exercised.
const rsaKey = generateKeyPairSync('rsa', { modulusLength: 2048 });
const rsaJwk = rsaKey.publicKey.export({ format: 'jwk' }) as { kty: string; n: string; e: string };
const APPLE_JWKS = { keys: [{ kid: 'apple-key-1', ...rsaJwk }] };

function signAppleIdToken(
  payload: Record<string, unknown>,
  overrides: jwt.SignOptions = {},
): string {
  return jwt.sign(payload, rsaKey.privateKey, {
    algorithm: 'RS256',
    keyid: 'apple-key-1',
    issuer: 'https://appleid.apple.com',
    audience: appleCreds.APPLE_CLIENT_ID,
    expiresIn: 3600,
    ...overrides,
  });
}

beforeEach(() => {
  vi.resetModules();
  delete process.env.GOOGLE_CLIENT_ID;
  delete process.env.GOOGLE_CLIENT_SECRET;
  delete process.env.GITHUB_CLIENT_ID;
  delete process.env.GITHUB_CLIENT_SECRET;
  delete process.env.APPLE_CLIENT_ID;
  delete process.env.APPLE_TEAM_ID;
  delete process.env.APPLE_KEY_ID;
  delete process.env.APPLE_PRIVATE_KEY;
  process.env.OAUTH_BASE_URL = 'http://api.test:30400';
  process.env.OAUTH_WEB_URL = 'http://web.test:30500';
  resetAppleOAuthCaches();
});

afterEach(() => {
  process.env = { ...baseEnv };
});

describe('oauth config', () => {
  it('reports not configured when env vars are missing', () => {
    expect(isOAuthConfigured('google')).toBe(false);
    expect(isOAuthConfigured('github')).toBe(false);
    expect(isOAuthConfigured('apple')).toBe(false);
  });

  it('reports configured when env vars are present', () => {
    process.env.GOOGLE_CLIENT_ID = googleCreds.GOOGLE_CLIENT_ID;
    process.env.GOOGLE_CLIENT_SECRET = googleCreds.GOOGLE_CLIENT_SECRET;
    process.env.GITHUB_CLIENT_ID = githubCreds.GITHUB_CLIENT_ID;
    process.env.GITHUB_CLIENT_SECRET = githubCreds.GITHUB_CLIENT_SECRET;
    process.env.APPLE_CLIENT_ID = appleCreds.APPLE_CLIENT_ID;
    process.env.APPLE_TEAM_ID = appleCreds.APPLE_TEAM_ID;
    process.env.APPLE_KEY_ID = appleCreds.APPLE_KEY_ID;
    process.env.APPLE_PRIVATE_KEY = applePrivateKeyPem;
    expect(isOAuthConfigured('google')).toBe(true);
    expect(isOAuthConfigured('github')).toBe(true);
    expect(isOAuthConfigured('apple')).toBe(true);
  });
});

describe('buildAuthorizeUrl', () => {
  beforeEach(() => {
    process.env.GOOGLE_CLIENT_ID = googleCreds.GOOGLE_CLIENT_ID;
    process.env.GOOGLE_CLIENT_SECRET = googleCreds.GOOGLE_CLIENT_SECRET;
    process.env.GITHUB_CLIENT_ID = githubCreds.GITHUB_CLIENT_ID;
    process.env.GITHUB_CLIENT_SECRET = githubCreds.GITHUB_CLIENT_SECRET;
  });

  it('builds a Google authorize URL with client_id, redirect_uri and state', () => {
    const url = buildAuthorizeUrl('google', 'state-123');
    expect(url).toContain('https://accounts.google.com/o/oauth2/v2/auth');
    expect(url).toContain('client_id=g-id');
    expect(url).toContain(
      encodeURIComponent('http://api.test:30400/v1/auth/oauth/google/callback'),
    );
    expect(url).toContain('state=state-123');
    expect(url).toContain('scope=openid');
  });

  it('builds a GitHub authorize URL', () => {
    const url = buildAuthorizeUrl('github', 'state-456');
    expect(url).toContain('https://github.com/login/oauth/authorize');
    expect(url).toContain('client_id=gh-id');
    expect(url).toContain('state=state-456');
  });

  it('builds an Apple authorize URL', () => {
    process.env.APPLE_CLIENT_ID = appleCreds.APPLE_CLIENT_ID;
    process.env.APPLE_TEAM_ID = appleCreds.APPLE_TEAM_ID;
    process.env.APPLE_KEY_ID = appleCreds.APPLE_KEY_ID;
    process.env.APPLE_PRIVATE_KEY = applePrivateKeyPem;
    const url = buildAuthorizeUrl('apple', 'state-789');
    expect(url).toContain('https://appleid.apple.com/auth/authorize');
    expect(url).toContain('client_id=com.example.service');
    expect(url).toContain(encodeURIComponent('http://api.test:30400/v1/auth/oauth/apple/callback'));
    expect(url).toContain('response_mode=query');
    expect(url).toContain('state=state-789');
  });

  it('throws when provider is not configured', () => {
    delete process.env.GOOGLE_CLIENT_ID;
    expect(() => buildAuthorizeUrl('google', 's')).toThrow(/not configured/);
  });
});

describe('oauth state (anti-CSRF)', () => {
  it('creates and verifies a state', () => {
    const state = createOAuthState('google');
    expect(verifyOAuthState(state)).toBe('google');
  });

  it('rejects unknown state', () => {
    expect(verifyOAuthState('nope')).toBeNull();
  });

  it('rejects reused state (single-use)', () => {
    const state = createOAuthState('github');
    verifyOAuthState(state);
    expect(verifyOAuthState(state)).toBeNull();
  });
});

describe('exchangeCode (stubbed network)', () => {
  beforeEach(() => {
    process.env.GOOGLE_CLIENT_ID = googleCreds.GOOGLE_CLIENT_ID;
    process.env.GOOGLE_CLIENT_SECRET = googleCreds.GOOGLE_CLIENT_SECRET;
    process.env.GITHUB_CLIENT_ID = githubCreds.GITHUB_CLIENT_ID;
    process.env.GITHUB_CLIENT_SECRET = githubCreds.GITHUB_CLIENT_SECRET;
  });

  it('exchanges a Google code into a verified profile', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'tok-1' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ email: 'Person@Test.com', name: 'Person', email_verified: true }),
      });
    vi.stubGlobal('fetch', fetchMock);
    const profile = await exchangeCode('google', 'code-1');
    expect(profile.email).toBe('person@test.com');
    expect(profile.name).toBe('Person');
    expect(profile.emailVerified).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    vi.unstubAllGlobals();
  });

  it('exchanges a GitHub code using the public email', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'tok-2' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ email: 'dev@github.com', name: 'Dev', login: 'dev' }),
      });
    vi.stubGlobal('fetch', fetchMock);
    const profile = await exchangeCode('github', 'code-2');
    expect(profile.email).toBe('dev@github.com');
    expect(profile.name).toBe('Dev');
    vi.unstubAllGlobals();
  });

  it('fetches the verified primary email when GitHub public email is hidden', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'tok-3' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ email: null, login: 'dev' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { email: 'dev@users.noreply.github.com', primary: false, verified: true },
          { email: 'real@github.com', primary: true, verified: true },
        ],
      });
    vi.stubGlobal('fetch', fetchMock);
    const profile = await exchangeCode('github', 'code-3');
    expect(profile.email).toBe('real@github.com');
    expect(fetchMock).toHaveBeenCalledTimes(3);
    vi.unstubAllGlobals();
  });
});

describe('apple sign in', () => {
  beforeEach(() => {
    process.env.APPLE_CLIENT_ID = appleCreds.APPLE_CLIENT_ID;
    process.env.APPLE_TEAM_ID = appleCreds.APPLE_TEAM_ID;
    process.env.APPLE_KEY_ID = appleCreds.APPLE_KEY_ID;
    process.env.APPLE_PRIVATE_KEY = applePrivateKeyPem;
  });

  it('builds an ES256 client secret JWT with the right claims', async () => {
    const secret = await appleClientSecret();
    const parts = secret.split('.');
    expect(parts).toHaveLength(3);
    const [headerB64, payloadB64] = parts as [string, string, string];
    const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString());
    expect(header.alg).toBe('ES256');
    expect(header.kid).toBe(appleCreds.APPLE_KEY_ID);
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
    expect(payload.iss).toBe(appleCreds.APPLE_TEAM_ID);
    expect(payload.aud).toBe('https://appleid.apple.com');
    expect(payload.sub).toBe(appleCreds.APPLE_CLIENT_ID);
    expect(payload.exp).toBeGreaterThan(payload.iat);
  });

  it('verifies an id_token signature against Apple JWKS', async () => {
    const idToken = signAppleIdToken({ sub: '001234.abc', email: 'user@icloud.com' });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => APPLE_JWKS }));
    const claims = await verifyAppleIdToken(idToken);
    expect(claims.sub).toBe('001234.abc');
    expect(claims.email).toBe('user@icloud.com');
    vi.unstubAllGlobals();
  });

  it('rejects an id_token with a wrong issuer', async () => {
    const idToken = signAppleIdToken(
      { sub: '001234.abc', email: 'user@icloud.com' },
      { issuer: 'https://evil.example' },
    );
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => APPLE_JWKS }));
    await expect(verifyAppleIdToken(idToken)).rejects.toThrow(/issuer/);
    vi.unstubAllGlobals();
  });

  it('rejects an id_token with a wrong audience', async () => {
    const idToken = signAppleIdToken(
      { sub: '001234.abc', email: 'user@icloud.com' },
      { audience: 'com.other.service' },
    );
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => APPLE_JWKS }));
    await expect(verifyAppleIdToken(idToken)).rejects.toThrow(/audience/);
    vi.unstubAllGlobals();
  });

  it('rejects an id_token signed by an unknown key', async () => {
    const idToken = jwt.sign({ sub: '001234.abc', email: 'user@icloud.com' }, rsaKey.privateKey, {
      algorithm: 'RS256',
      keyid: 'unknown-kid',
      issuer: 'https://appleid.apple.com',
      audience: appleCreds.APPLE_CLIENT_ID,
      expiresIn: 3600,
    });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => APPLE_JWKS }));
    await expect(verifyAppleIdToken(idToken)).rejects.toThrow(/key not found/);
    vi.unstubAllGlobals();
  });

  it('exchanges an Apple code into a verified profile', async () => {
    const idToken = signAppleIdToken({ sub: '001234.abc', email: 'User@icloud.com' });
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id_token: idToken }) })
      .mockResolvedValueOnce({ ok: true, json: async () => APPLE_JWKS });
    vi.stubGlobal('fetch', fetchMock);
    const profile = await exchangeCode('apple', 'code-apple');
    expect(profile.email).toBe('user@icloud.com');
    expect(profile.emailVerified).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    vi.unstubAllGlobals();
  });
});

describe('oauthLogin (upsert)', () => {
  it('creates a new user and returns tokens', async () => {
    const backend = await getUserBackend();
    // Use a unique email so it does not collide across runs.
    const email = `oauth-${Date.now()}-${Math.random().toString(36).slice(2)}@test.com`;
    const result = await oauthLogin('google', { email, emailVerified: true });
    expect(result.created).toBe(true);
    expect(result.user.roles).toContain('user');
    expect(result.tokens.accessToken).toBeTruthy();
    expect(await backend.findByEmail(email)).toBeDefined();
  });

  it('reuses an existing user instead of creating a duplicate', async () => {
    const email = `oauth-existing-${Date.now()}-${Math.random().toString(36).slice(2)}@test.com`;
    await oauthLogin('github', { email, emailVerified: true });
    const second = await oauthLogin('github', { email, emailVerified: true });
    expect(second.created).toBe(false);
    expect(second.user.email).toBe(email);
  });

  it('rejects unverified emails', async () => {
    await expect(
      oauthLogin('google', { email: 'x@test.com', emailVerified: false }),
    ).rejects.toThrow(/not verified/);
  });
});

describe('oauthSuccessUrl', () => {
  it('builds a web redirect URL carrying the tokens', () => {
    const tokens: AuthTokens = {
      accessToken: 'at',
      refreshToken: 'rt',
      expiresIn: 3600,
    };
    const url = oauthSuccessUrl(tokens);
    expect(url).toContain('http://web.test:30500/oauth/callback');
    expect(url).toContain('accessToken=at');
    expect(url).toContain('refreshToken=rt');
  });
});
