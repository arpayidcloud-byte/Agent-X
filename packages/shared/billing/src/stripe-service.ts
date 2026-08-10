/**
 * Stripe gateway stub (PLAN Phase3 §3.1).
 * Real STRIPE_SECRET_KEY wiring lands when env is present; until then throw.
 */
export type CheckoutResult = { url: string };

export async function createCheckoutSession(
  orgId: string,
  planSlug: string,
): Promise<CheckoutResult> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY not configured');
  }
  // Placeholder: real Stripe SDK call when keys present
  void orgId;
  void planSlug;
  throw new Error('Stripe Checkout not yet wired — set STRIPE_SECRET_KEY + PRICE ids');
}

export async function createPortalSession(customerId: string): Promise<{ url: string }> {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY not configured');
  }
  void customerId;
  throw new Error('Stripe Portal not yet wired');
}

export function verifyWebhook(rawBody: string, sig: string): boolean {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return false;
  // Signature check lands with stripe SDK; fail-closed without secret
  void rawBody;
  void sig;
  return false;
}
