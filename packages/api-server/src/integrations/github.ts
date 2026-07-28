import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { createWebhookSignatureMiddleware } from '../middleware/webhook-signature.js';

interface GitHubWebhookPayload {
  action: string;
  pull_request?: {
    id: number;
    number: number;
    title: string;
    state: string;
    html_url: string;
  };
  repository?: {
    full_name: string;
  };
}

export interface GitHubWebhookConfig {
  secret: string;
}

export async function createGitHubWebhookRoutes(
  fastify: FastifyInstance,
  config: GitHubWebhookConfig,
) {
  const webhookMiddleware = createWebhookSignatureMiddleware({ secret: config.secret });

  fastify.post(
    '/webhooks/github',
    {
      schema: {
        description: 'GitHub webhook endpoint with signature verification',
        tags: ['webhooks'],
        headers: {
          type: 'object',
          required: ['x-hub-signature-256', 'x-github-event'],
          properties: {
            'x-hub-signature-256': {
              type: 'string',
              description: 'GitHub webhook signature (HMAC-SHA256)',
            },
            'x-github-event': {
              type: 'string',
              description: 'GitHub event type',
            },
          },
        },
        body: {
          type: 'object',
          properties: {
            action: { type: 'string' },
            pull_request: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                number: { type: 'number' },
                title: { type: 'string' },
                state: { type: 'string' },
                html_url: { type: 'string' },
              },
            },
            repository: {
              type: 'object',
              properties: {
                full_name: { type: 'string' },
              },
            },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              received: { type: 'boolean' },
              event: { type: 'string' },
            },
          },
          401: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
          403: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: GitHubWebhookPayload }>, reply: FastifyReply) => {
      await webhookMiddleware(request, reply);

      const event = request.headers['x-github-event'] as string;
      const payload = request.body;

      request.log.info({ event, action: payload.action }, 'GitHub webhook received and verified');

      reply.send({
        received: true,
        event,
      });
    },
  );
}
