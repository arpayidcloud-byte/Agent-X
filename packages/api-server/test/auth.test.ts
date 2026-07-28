import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createApiServer } from '../src/index.js';
import type { FastifyInstance } from 'fastify';

describe('Auth Middleware', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = await createApiServer({
      port: 3000,
      host: 'localhost',
      apiKey: 'test-api-key',
      allowedOrigins: ['*'],
      rateLimitMax: 100,
      rateLimitWindow: 60000,
    });
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  describe('Authorization Header', () => {
    it('should reject requests without authorization header', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/health',
      });

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('Missing or invalid authorization header');
    });

    it('should reject requests with invalid authorization header format', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/health',
        headers: {
          authorization: 'InvalidFormat',
        },
      });

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('Missing or invalid authorization header');
    });

    it('should reject requests with wrong API key', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/health',
        headers: {
          authorization: 'Bearer wrong-api-key',
        },
      });

      expect(response.statusCode).toBe(403);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('Invalid API key');
    });

    it('should accept requests with valid API key', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/health',
        headers: {
          authorization: 'Bearer test-api-key',
        },
      });

      expect(response.statusCode).toBe(200);
    });
  });
});
