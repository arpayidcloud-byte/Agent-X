// Cloudflare Turnstile human-verification helper.
//
// Feature-flagged by presence of TURNSTILE_SECRET_KEY: when unset, the
// verification is skipped (returns true) so local/dev flows keep working.
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

/**
 * Verify a Turnstile token against Cloudflare's siteverify endpoint.
 * - Not configured -> true (verification skipped)
 * - Configured + missing/invalid token -> false
 * - Network error -> false (fail closed: block rather than let bots through)
 */
export async function verifyTurnstile(token: unknown): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
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
