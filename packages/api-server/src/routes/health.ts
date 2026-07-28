import type { FastifyInstance, FastifyReply } from 'fastify';

export async function createHealthRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/health',
    {
      schema: {
        description: 'Health check endpoint',
        tags: ['health'],
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    async (_request, reply: FastifyReply) => {
      reply.send({
        status: 'healthy',
        timestamp: new Date().toISOString(),
      });
    },
  );

  fastify.get(
    '/health/live',
    {
      schema: {
        description: 'Liveness probe',
        tags: ['health'],
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
            },
          },
        },
      },
    },
    async (_request, reply: FastifyReply) => {
      reply.send({ status: 'alive' });
    },
  );

  fastify.get(
    '/health/ready',
    {
      schema: {
        description: 'Readiness probe',
        tags: ['health'],
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              ready: { type: 'boolean' },
            },
          },
        },
      },
    },
    async (_request, reply: FastifyReply) => {
      reply.send({
        status: 'ready',
        ready: true,
      });
    },
  );
}
