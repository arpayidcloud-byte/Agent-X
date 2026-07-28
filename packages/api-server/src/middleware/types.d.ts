import type { UserMetadata } from './auth.js';

declare module 'fastify' {
  interface FastifyRequest {
    userMetadata: UserMetadata | undefined;
  }
}
