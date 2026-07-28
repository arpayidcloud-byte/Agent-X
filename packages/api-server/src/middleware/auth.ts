import { timingSafeEqual } from 'crypto';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { RBACRole } from './rbac.js';

export interface UserMetadata {
  role: string;
  sub?: string;
  email?: string;
  [key: string]: unknown;
}

export function createAuthMiddleware(apiKey: string, defaultRole: string = RBACRole.OWNER) {
  const apiKeyBuffer = Buffer.from(apiKey, 'utf8');

  return async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      request.log.warn(
        { path: request.url },
        'Auth failure: Missing or invalid authorization header',
      );
      void reply.code(401).send({ error: 'Missing or invalid authorization header' });
      return;
    }

    const token = authHeader.substring(7);
    const tokenBuffer = Buffer.from(token, 'utf8');

    if (tokenBuffer.length !== apiKeyBuffer.length) {
      request.log.warn(
        { path: request.url, ip: request.ip },
        'Auth failure: Invalid API key length',
      );
      void reply.code(403).send({ error: 'Invalid API key' });
      return;
    }

    const isValid = timingSafeEqual(tokenBuffer, apiKeyBuffer);

    if (!isValid) {
      request.log.warn({ path: request.url, ip: request.ip }, 'Auth failure: Invalid API key');
      void reply.code(403).send({ error: 'Invalid API key' });
      return;
    }

    request.userMetadata = { role: defaultRole } as UserMetadata;
    request.log.info({ path: request.url, ip: request.ip }, 'Auth success');
  };
}
