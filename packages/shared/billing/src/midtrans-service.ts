/**
 * Midtrans Snap gateway stub (PLAN Phase3 §3.1 IDR).
 */
export type SnapResult = { token: string; redirectUrl?: string };

export async function createSnapTransaction(orgId: string, planSlug: string): Promise<SnapResult> {
  const key = process.env.MIDTRANS_SERVER_KEY;
  if (!key) {
    throw new Error('MIDTRANS_SERVER_KEY not configured');
  }
  void orgId;
  void planSlug;
  throw new Error('Midtrans Snap not yet wired — set MIDTRANS_SERVER_KEY');
}

/**
 * Midtrans webhook: SHA512(order_id+status_code+gross_amount+serverKey)
 */
export function verifyWebhook(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signature: string,
): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) return false;
  // crypto.createHash('sha512') lands with real wiring; fail-closed
  void orderId;
  void statusCode;
  void grossAmount;
  void signature;
  return false;
}
