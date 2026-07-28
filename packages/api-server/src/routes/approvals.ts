import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

interface ApprovalBody {
  decision: 'approve' | 'reject';
  reason?: string;
}

export async function createApprovalRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/approvals/:id/decide',
    {
      schema: {
        description: 'Approve or reject a task',
        tags: ['approvals'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
        body: {
          type: 'object',
          required: ['decision'],
          properties: {
            decision: { type: 'string', enum: ['approve', 'reject'] },
            reason: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              status: { type: 'string' },
              decision: { type: 'string' },
              decidedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Body: ApprovalBody; Params: { id: string } }>,
      reply: FastifyReply,
    ) => {
      const { id } = request.params;
      const { decision, reason } = request.body;

      const approval = {
        id,
        status: decision === 'approve' ? 'APPROVED' : 'REJECTED',
        decision,
        reason,
        decidedAt: new Date().toISOString(),
      };

      reply.send(approval);
    },
  );
}
