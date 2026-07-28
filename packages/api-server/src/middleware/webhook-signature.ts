import { createHmac, timingSafeEqual } from 'crypto';
import type { FastifyRequest, FastifyReply } from 'fastify';

const GITHUB_SIGNATURE_HEADER = 'x-hub-signature-256';

/**
 * Verify GitHub webhook signature using HMAC-SHA256
 *
 * @param payload - Raw request body string
 * @param signature - Signature from X-Hub-Signature-256 header
 * @param secret - Webhook secret from GitHub
 * @returns true if signature is valid, false otherwise
 */
function verifySignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = `sha256=${createHmac('sha256', secret).update(payload).digest('hex')}`;

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(signatureBuffer, expectedBuffer);
}

export interface WebhookSignatureMiddlewareOptions {
  secret: string;
}

/**
 * Create webhook signature verification middleware
 *
 * @param options - Middleware options including webhook secret
 * @returns Fastify middleware function
 */
export function createWebhookSignatureMiddleware(options: WebhookSignatureMiddlewareOptions) {
  const { secret } = options;

  return async (request: FastifyRequest, reply: FastifyReply) => {
    const signature = request.headers[GITHUB_SIGNATURE_HEADER] as string;

    if (!signature) {
      reply.code(401).send({ error: 'Missing signature header' });
      return;
    }

    const rawBody = (request.rawBody as string) || JSON.stringify(request.body);

    if (!verifySignature(rawBody, signature, secret)) {
      reply.code(403).send({ error: 'Invalid signature' });
      return;
    }
  };
}

export { verifySignature };
