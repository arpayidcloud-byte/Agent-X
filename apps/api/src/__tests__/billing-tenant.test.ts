import { afterAll, describe, expect, it } from 'vitest';
import jwt from 'jsonwebtoken';

process.env.AUTH_ENABLED = 'true';
process.env.JWT_SECRET = 'test-secret';

const { app } = await import('../agentx-server.js');

describe('Billing tenant boundary', () => {
  it.each(['/v1/billing/me', '/v1/billing/invoices', '/v1/billing/summary'])(
    'rejects authenticated user without organization on %s',
    async (path) => {
      const token = jwt.sign(
        {
          sub: `billing-no-org-${Date.now()}`,
          email: 'billing-no-org@agentx.dev',
          roles: ['user'],
        },
        'test-secret',
      );
      const response = await fetch(`http://127.0.0.1:${getPort()}/${path.slice(1)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(response.status).toBe(403);
      await expect(response.json()).resolves.toMatchObject({
        error: expect.stringContaining('organization'),
      });
    },
  );
});

let server: ReturnType<typeof app.listen> | undefined;
function getPort(): number {
  server ??= app.listen(0);
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('server did not bind');
  return address.port;
}

afterAll(async () => {
  if (server) await new Promise<void>((resolve) => server?.close(() => resolve()));
});
