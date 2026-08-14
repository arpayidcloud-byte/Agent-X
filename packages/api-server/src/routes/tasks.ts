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
        description: 'Create a new task',
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
          201: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              goal: { type: 'string' },
              status: { type: 'string' },
              priority: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
            },
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
        description: 'List all tasks',
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
          200: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                goal: { type: 'string' },
                status: { type: 'string' },
                priority: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
              },
            },
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
        description: 'Get a task by ID',
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
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              goal: { type: 'string' },
              status: { type: 'string' },
              priority: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
          404: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
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
        description: 'Cancel a task',
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
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              status: { type: 'string' },
            },
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
