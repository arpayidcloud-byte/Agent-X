import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createApiServer } from '../src/index.js';
import type { FastifyInstance } from 'fastify';

describe('Health Endpoints', () => {
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

  describe('GET /api/v1/health', () => {
    it('should return healthy status', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/health',
        headers: {
          authorization: 'Bearer test-api-key',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.status).toBe('healthy');
      expect(body.timestamp).toBeDefined();
    });
  });

  describe('GET /api/v1/health/live', () => {
    it('should return alive status', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/health/live',
        headers: {
          authorization: 'Bearer test-api-key',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.status).toBe('alive');
    });
  });

  describe('GET /api/v1/health/ready', () => {
    it('should return ready status', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/health/ready',
        headers: {
          authorization: 'Bearer test-api-key',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.status).toBe('ready');
      expect(body.ready).toBe(true);
    });
  });
});
