import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export async function createEventRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/events',
    {
      schema: {
        description: 'Stream events via SSE',
        tags: ['events'],
        response: {
          410: {
            type: 'object',
            properties: { error: { type: 'string' } },
          },
          200: {
            type: 'object',
            properties: {
              events: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    type: { type: 'string' },
                    data: { type: 'object' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      return reply.code(410).send({
        error: 'Legacy event API disabled: tenant-aware API required',
      });
    },
  );
}
