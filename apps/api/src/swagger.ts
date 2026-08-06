import type { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { openApiSpec } from './openapi.js';

export function mountSwagger(app: Express): void {
  // Serve OpenAPI JSON FIRST (before swagger-ui intercepts /docs/*)
  app.get('/docs/openapi.json', (_req, res) => {
    res.json(openApiSpec);
  });

  // Then mount Swagger UI at /docs
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'AgentX API Docs',
    }),
  );
}
