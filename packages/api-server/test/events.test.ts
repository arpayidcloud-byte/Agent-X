import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createApiServer } from '../src/index.js';
import type { FastifyInstance } from 'fastify';

describe('Legacy event route', () => {
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

  it('fails closed without tenant-aware event context', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/events',
      headers: { authorization: 'Bearer test-api-key' },
    });

    expect(response.statusCode).toBe(410);
    expect(JSON.parse(response.body).error).toContain('tenant-aware');
  });
});
