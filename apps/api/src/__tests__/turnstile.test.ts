import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Unit tests for the Cloudflare Turnstile verification helper.
import { isTurnstileEnabled, verifyTurnstile } from '../turnstile.js';

const baseEnv = { ...process.env };

beforeEach(() => {
  delete process.env.TURNSTILE_SECRET_KEY;
});

afterEach(() => {
  process.env = { ...baseEnv };
  vi.unstubAllGlobals();
});

describe('isTurnstileEnabled', () => {
  it('is disabled when secret is missing', () => {
    expect(isTurnstileEnabled()).toBe(false);
  });

  it('is enabled when secret is present', () => {
    process.env.TURNSTILE_SECRET_KEY = '0x4AAAAAA-secret';
    expect(isTurnstileEnabled()).toBe(true);
  });
});

describe('verifyTurnstile', () => {
  it('skips verification (returns true) when not configured', async () => {
    expect(await verifyTurnstile(undefined)).toBe(true);
    expect(await verifyTurnstile('')).toBe(true);
    expect(await verifyTurnstile('any-token')).toBe(true);
  });

  it('rejects a missing token when configured', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'secret';
    expect(await verifyTurnstile(undefined)).toBe(false);
    expect(await verifyTurnstile('')).toBe(false);
  });

  it('accepts a valid token (siteverify success)', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'secret';
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    vi.stubGlobal('fetch', fetchMock);
    expect(await verifyTurnstile('token-123')).toBe(true);
    // Secret + token dikirim sebagai form-encoded.
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = init.body as URLSearchParams;
    expect(body.get('secret')).toBe('secret');
    expect(body.get('response')).toBe('token-123');
  });

  it('rejects when siteverify returns success=false', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'secret';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: false }) }),
    );
    expect(await verifyTurnstile('bad-token')).toBe(false);
  });

  it('fails closed on network error', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'secret';
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));
    expect(await verifyTurnstile('token-123')).toBe(false);
  });

  it('rejects non-string token when configured', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'secret';
    expect(await verifyTurnstile(42)).toBe(false);
    expect(await verifyTurnstile({})).toBe(false);
  });
});
