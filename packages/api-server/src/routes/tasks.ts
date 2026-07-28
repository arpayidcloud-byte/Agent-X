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
    async (request: FastifyRequest<{ Body: TaskBody }>, reply: FastifyReply) => {
      const { goal, priority = 'medium', parentTaskId, dependsOn = [] } = request.body;

      const task = {
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        goal,
        status: 'CREATED',
        priority,
        parentTaskId,
        dependsOn,
        createdAt: new Date().toISOString(),
      };

      reply.code(201).send(task);
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
    async (_request, _reply) => {
      return [];
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
    async (request, reply) => {
      const { id } = request.params as { id: string };

      const task = {
        id,
        goal: 'Sample task',
        status: 'CREATED',
        priority: 'medium',
        createdAt: new Date().toISOString(),
      };

      if (!task) {
        reply.code(404).send({ error: 'Task not found' });
        return;
      }

      reply.send(task);
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
    async (request, reply) => {
      const { id } = request.params as { id: string };

      reply.send({
        id,
        status: 'CANCELLED',
      });
    },
  );
}
