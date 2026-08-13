import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

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
    async (request: FastifyRequest, reply: FastifyReply) => {
      const response = reply.raw;
      response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });

      let id = 0;
      const heartbeat = () => {
        response.write(
          `id: ${id++}\nevent: heartbeat\ndata: ${JSON.stringify({
            type: 'heartbeat',
            timestamp: new Date().toISOString(),
          })}\n\n`,
        );
      };
      heartbeat();
      const interval = setInterval(heartbeat, 5000);
      request.raw.on('close', () => clearInterval(interval));
    },
  );
}
