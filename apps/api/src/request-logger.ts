import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { Logger } from '@agent-xai/observability';
import { httpMetrics } from './http-metrics.js';

const logger = new Logger('http');

export const CORRELATION_ID_HEADER = 'x-correlation-id';

function getRoutePath(req: Request): string {
  // Prefer the matched route pattern (e.g. /v1/agentx/run) to keep
  // label cardinality low; fall back to the raw path.
  return (req.route?.path as string | undefined) ?? req.path ?? 'unknown';
}

/**
 * Express middleware that:
 *  - assigns a correlation ID per request (honours an incoming header)
 *  - exposes it via the X-Correlation-Id response header
 *  - emits a structured JSON log line per request (method, path, status, duration)
 *  - records an http_requests_total counter for Prometheus
 */
export function createRequestLogger(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const correlationId = req.header(CORRELATION_ID_HEADER) ?? randomUUID();
    const startTime = performance.now();

    res.setHeader('X-Correlation-Id', correlationId);

    res.on('finish', () => {
      const durationMs = Number(((performance.now() - startTime) / 1000).toFixed(3));
      const route = getRoutePath(req);
      const status = res.statusCode;

      httpMetrics.recordRequest(req.method, route, status);

      const meta = {
        correlationId,
        method: req.method,
        path: req.originalUrl,
        route,
        status,
        durationMs,
      };
      const message = `${req.method} ${req.originalUrl} -> ${status}`;

      if (status >= 500) {
        logger.error(message, undefined, meta);
      } else if (status >= 400) {
        logger.warn(message, meta);
      } else {
        logger.info(message, meta);
      }
    });

    next();
  };
}
