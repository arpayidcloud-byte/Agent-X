import type { FastifyInstance, FastifyReply } from 'fastify';

export async function createEventRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/events',
    {
      schema: {
        description: 'Stream events via SSE',
        tags: ['events'],
        response: {
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
    async (_request, reply: FastifyReply) => {
      reply.sse(
        (async function* () {
          let id = 0;
          while (true) {
            yield {
              id: String(id++),
              event: 'heartbeat',
              data: JSON.stringify({
                type: 'heartbeat',
                timestamp: new Date().toISOString(),
              }),
            };
            await new Promise((resolve) => setTimeout(resolve, 5000));
          }
        })(),
      );
    },
  );
}
