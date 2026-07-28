import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import helmet from '@fastify/helmet';
import { createTaskRoutes } from './routes/tasks.js';
import { createApprovalRoutes } from './routes/approvals.js';
import { createHealthRoutes } from './routes/health.js';
import { createEventRoutes } from './routes/events.js';
import { createMetricsRoutes } from './routes/metrics.js';
import { createGitHubWebhookRoutes } from './integrations/github.js';
import { createSecurityRoutes } from './routes/security.js';
import { createAuthMiddleware } from './middleware/auth.js';
import { createRBACMiddleware } from './middleware/rbac.js';
import { createRateLimitMiddleware } from './middleware/rate-limit.js';
import type { Permission, Role } from './middleware/rbac.js';
import type { PrometheusExporter } from '@agentx-fast/observability';

export { SlackNotifier } from './integrations/slack.js';

export interface ApiServerConfig {
  port: number;
  host: string;
  apiKey: string;
  githubWebhookSecret?: string;
  allowedOrigins: string[];
  rateLimitMax: number;
  rateLimitWindow: number;
  prometheusExporter?: PrometheusExporter;
  defaultRole?: Role;
}

export async function createApiServer(config: ApiServerConfig) {
  const fastify = Fastify({
    logger: true,
  });

  const rbac = createRBACMiddleware();

  // Permission matrix: route path + method → required permission
  const permissionMatrix: {
    method: string;
    path: string;
    permission: Permission;
  }[] = [
    { method: 'POST', path: '/api/v1/tasks', permission: 'task.create' },
    { method: 'GET', path: '/api/v1/tasks', permission: 'task.read' },
    { method: 'GET', path: '/api/v1/tasks/:id', permission: 'task.read' },
    { method: 'POST', path: '/api/v1/tasks/:id/cancel', permission: 'task.execute' },
    { method: 'POST', path: '/api/v1/approvals/:id/decide', permission: 'task.approve' },
  ];

  // Fastify onRequest hook for RBAC (after auth middleware)
  fastify.addHook('onRequest', async (request, reply) => {
    const url = request.url;
    const method = request.method.toUpperCase();

    // Extract the base path (strip query string)
    const cleanPath = url.split('?')[0];

    for (const entry of permissionMatrix) {
      // Match using a simplified approach: check if the path starts with the route pattern
      // Fastify route patterns use params like :id, match them with a regex
      const pathPattern = entry.path.replace(/:([^/]+)/g, '[^/]+');
      const regex = new RegExp(`^${pathPattern}$`);

      if (method === entry.method.toUpperCase() && regex.test(cleanPath)) {
        const check = rbac.check(entry.permission);
        await check(request, reply);
        return;
      }
    }
  });

  await fastify.register(helmet, {
    contentSecurityPolicy:
      process.env.NODE_ENV === 'production'
        ? {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              imgSrc: ["'self'", 'data:'],
              fontSrc: ["'self'"],
              objectSrc: ["'none'"],
              frameAncestors: ["'none'"],
              baseUri: ["'self'"],
              formAction: ["'self'"],
            },
          }
        : false,
    hsts:
      process.env.NODE_ENV === 'production'
        ? {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
          }
        : false,
    frameguard: { action: 'deny' },
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  });

  await fastify.register(cors, {
    origin: config.allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
    credentials: true,
    maxAge: 86400,
  });

  await fastify.register(rateLimit, {
    max: config.rateLimitMax,
    timeWindow: config.rateLimitWindow,
    keyGenerator: (request: { userMetadata?: { role?: string; sub?: string }; ip: string }) => {
      const userMetadata = request.userMetadata as { role?: string; sub?: string } | undefined;
      if (userMetadata?.sub) {
        return `user:${userMetadata.sub}:${userMetadata.role ?? 'unknown'}`;
      }
      return `apikey:${request.ip}`;
    },
  });

  await fastify.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'AgentX API',
        description: 'AgentX Cognitive Intelligence Platform API',
        version: '1.0.0',
      },
      servers: [
        {
          url: `http://${config.host}:${config.port}/`,
          description: 'Development server',
        },
      ],
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
  });

  fastify.addHook('onRequest', createAuthMiddleware(config.apiKey, config.defaultRole));
  fastify.addHook('onRequest', createRateLimitMiddleware(config.defaultRole));

  await fastify.register(createTaskRoutes, { prefix: '/api/v1' });
  await fastify.register(createApprovalRoutes, { prefix: '/api/v1' });
  await fastify.register(createHealthRoutes, { prefix: '/api/v1' });
  await fastify.register(createEventRoutes, { prefix: '/api/v1' });
  await fastify.register(createSecurityRoutes, { prefix: '/api/v1' });
  await fastify.register(createGitHubWebhookRoutes, {
    secret: config.githubWebhookSecret || '',
  });

  if (config.prometheusExporter) {
    await fastify.register(createMetricsRoutes, { exporter: config.prometheusExporter });
  }

  return fastify;
}
