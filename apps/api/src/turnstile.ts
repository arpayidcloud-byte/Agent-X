// Cloudflare Turnstile human-verification helper.
//
// Feature-flagged by presence of TURNSTILE_SECRET_KEY. When unset:
//   - development: verification is skipped (returns true) so local flows keep
//     working (warn-only).
//   - production: fail closed — the request is rejected because a missing
//     secret means human verification cannot be enforced.
// When set, every register/login must carry a valid Turnstile token from the
// client widget, otherwise the request is rejected.
//
//   TURNSTILE_SECRET_KEY  (server-side secret from Cloudflare dashboard)
//
// The client renders the widget with NEXT_PUBLIC_TURNSTILE_SITE_KEY and sends
// the resulting token as `turnstileToken` in the register/login body.

export function isTurnstileEnabled(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Verify a Turnstile token against Cloudflare's siteverify endpoint.
 * - Not configured (dev)          -> true (verification skipped, warns)
 * - Not configured (production)   -> throws (fail closed: misconfigured prod
 *                                    must not silently accept every request)
 * - Configured + missing/invalid token -> false
 * - Network error -> false (fail closed: block rather than let bots through)
 */
export async function verifyTurnstile(token: unknown): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (isProduction()) {
      throw new Error(
        'TURNSTILE_SECRET_KEY is not set — refusing to accept auth requests without human verification.',
      );
    }
    console.warn(
      '[turnstile] TURNSTILE_SECRET_KEY not set — skipping Turnstile verification (dev only).',
    );
    return true;
  }
  if (typeof token !== 'string' || token.length === 0) return false;
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
