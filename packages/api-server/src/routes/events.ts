import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export async function createEventRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/events',
    {
      schema: {
        description:
          'Deprecated: legacy tenantless event API is permanently disabled. Migrate to the tenant-aware Agent-X API.',
        deprecated: true,
        tags: ['events'],
        response: {
          410: {
            type: 'object',
            properties: { error: { type: 'string' } },
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
