import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

interface TaskBody {
  goal: string;
  priority?: string;
  parentTaskId?: string;
  dependsOn?: string[];
}

export async function createTaskRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/tasks',
    {
      schema: {
        description:
          'Deprecated: legacy tenantless task API is permanently disabled. Migrate to the tenant-aware Agent-X API.',
        deprecated: true,
        tags: ['tasks'],
        body: {
          type: 'object',
          required: ['goal'],
          properties: {
            goal: { type: 'string' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            parentTaskId: { type: 'string' },
            dependsOn: { type: 'array', items: { type: 'string' } },
          },
        },
        response: {
          410: {
            type: 'object',
            properties: { error: { type: 'string' } },
          },
        },
      },
    },
    async (_request: FastifyRequest<{ Body: TaskBody }>, reply: FastifyReply) => {
      void reply.code(410).send({
        error: 'Legacy task API disabled: tenant-aware API required',
      });
    },
  );

  fastify.get(
    '/tasks',
    {
      schema: {
        description:
          'Deprecated: legacy tenantless task API is permanently disabled. Migrate to the tenant-aware Agent-X API.',
        deprecated: true,
        tags: ['tasks'],
        querystring: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            priority: { type: 'string' },
          },
        },
        response: {
          410: {
            type: 'object',
            properties: { error: { type: 'string' } },
          },
        },
      },
    },
    async (_request, reply) => {
      return reply.code(410).send({
        error: 'Legacy task API disabled: tenant-aware API required',
      });
    },
  );

  fastify.get(
    '/tasks/:id',
    {
      schema: {
        description:
          'Deprecated: legacy tenantless task API is permanently disabled. Migrate to the tenant-aware Agent-X API.',
        deprecated: true,
        tags: ['tasks'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
        response: {
          410: {
            type: 'object',
            properties: { error: { type: 'string' } },
          },
        },
      },
    },
    async (_request, reply) => {
      return reply.code(410).send({
        error: 'Legacy task API disabled: tenant-aware API required',
      });
    },
  );

  fastify.post(
    '/tasks/:id/cancel',
    {
      schema: {
        description:
          'Deprecated: legacy tenantless task API is permanently disabled. Migrate to the tenant-aware Agent-X API.',
        deprecated: true,
        tags: ['tasks'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
        response: {
          410: {
            type: 'object',
            properties: { error: { type: 'string' } },
          },
        },
      },
    },
    async (_request, reply) => {
      return reply.code(410).send({
        error: 'Legacy task API disabled: tenant-aware API required',
      });
    },
  );
}
