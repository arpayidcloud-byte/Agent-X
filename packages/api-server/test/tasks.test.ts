import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createApiServer } from '../src/index.js';
import type { FastifyInstance } from 'fastify';

describe('Task Routes', () => {
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

  describe('POST /api/v1/tasks', () => {
    it('should create a task with valid body', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/tasks',
        headers: {
          authorization: 'Bearer test-api-key',
          'content-type': 'application/json',
        },
        payload: JSON.stringify({
          goal: 'Test task',
          priority: 'high',
        }),
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.id).toBeDefined();
      expect(body.goal).toBe('Test task');
      expect(body.status).toBe('CREATED');
      expect(body.priority).toBe('high');
      expect(body.createdAt).toBeDefined();
    });

    it('should create a task with default priority', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/tasks',
        headers: {
          authorization: 'Bearer test-api-key',
          'content-type': 'application/json',
        },
        payload: JSON.stringify({
          goal: 'Test task with default priority',
        }),
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.priority).toBe('medium');
    });

    it('should create a task with parentTaskId and dependsOn', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/tasks',
        headers: {
          authorization: 'Bearer test-api-key',
          'content-type': 'application/json',
        },
        payload: JSON.stringify({
          goal: 'Child task',
          parentTaskId: 'task-123',
          dependsOn: ['task-456', 'task-789'],
        }),
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.id).toBeDefined();
      expect(body.goal).toBe('Child task');
      expect(body.status).toBe('CREATED');
    });

    it('should reject request without goal', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/tasks',
        headers: {
          authorization: 'Bearer test-api-key',
          'content-type': 'application/json',
        },
        payload: JSON.stringify({
          priority: 'high',
        }),
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/v1/tasks', () => {
    it('should return empty array when no tasks', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/tasks',
        headers: {
          authorization: 'Bearer test-api-key',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBe(0);
    });

    it('should accept status filter', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/tasks?status=CREATED',
        headers: {
          authorization: 'Bearer test-api-key',
        },
      });

      expect(response.statusCode).toBe(200);
    });

    it('should accept priority filter', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/tasks?priority=high',
        headers: {
          authorization: 'Bearer test-api-key',
        },
      });

      expect(response.statusCode).toBe(200);
    });
  });

  describe('GET /api/v1/tasks/:id', () => {
    it('should return a task by id', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/tasks/task-123',
        headers: {
          authorization: 'Bearer test-api-key',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.id).toBe('task-123');
      expect(body.goal).toBe('Sample task');
      expect(body.status).toBe('CREATED');
    });
  });

  describe('POST /api/v1/tasks/:id/cancel', () => {
    it('should cancel a task', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/tasks/task-123/cancel',
        headers: {
          authorization: 'Bearer test-api-key',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.id).toBe('task-123');
      expect(body.status).toBe('CANCELLED');
    });
  });
});
