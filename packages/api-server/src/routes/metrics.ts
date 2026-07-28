import type { FastifyInstance, FastifyReply } from 'fastify';
import type { PrometheusExporter } from '@agentx-fast/observability';

export async function createMetricsRoutes(
  fastify: FastifyInstance,
  opts: { exporter: PrometheusExporter },
) {
  const { exporter } = opts;

  fastify.get(
    '/metrics',
    {
      schema: {
        description: 'Prometheus metrics endpoint',
        tags: ['observability'],
        response: {
          200: { type: 'string' },
        },
      },
    },
    async (_request, reply: FastifyReply) => {
      const metrics = await exporter.getMetrics();
      reply.header('Content-Type', exporter.getContentType()).send(metrics);
    },
  );
}
