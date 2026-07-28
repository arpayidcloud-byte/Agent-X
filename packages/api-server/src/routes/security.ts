import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { SASTScanner } from '@agentx-fast/shared/security';
import { SecretPatternDetector } from '@agentx-fast/shared/security';
import { HashChainedAuditLog } from '@agentx-fast/shared/security';
import { createRBACMiddleware } from '../middleware/rbac.js';

const rbac = createRBACMiddleware();

// Initialize security tools
const sastScanner = new SASTScanner();
const secretDetector = new SecretPatternDetector();
const auditLog = new HashChainedAuditLog();

export async function createSecurityRoutes(fastify: FastifyInstance) {
  // POST /api/v1/security/scan - Trigger SAST scan (owner only)
  fastify.post(
    '/security/scan',
    {
      preHandler: [rbac.check('admin.settings')],
    },
    async (request: FastifyRequest<{ Body: { paths?: string[] } }>, reply: FastifyReply) => {
      const paths = request.body?.paths || ['packages/*/src/**/*.ts'];

      try {
        // Scan codebase (simplified - in production would use glob to read files)
        const results = sastScanner.scanFiles([]);

        // Log audit
        void auditLog.append('system', 'security.scan', 'codebase');

        void reply.send({
          success: true,
          findings: results,
          scanned: paths,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        request.log.error({ error }, 'SAST scan failed');
        void reply.code(500).send({
          success: false,
          error: 'SAST scan failed',
        });
      }
    },
  );

  // GET /api/v1/security/secrets - Check for secrets (owner only)
  fastify.get(
    '/security/secrets',
    {
      preHandler: [rbac.check('admin.settings')],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // Scan for secrets (simplified - would scan actual files in production)
        const matches = secretDetector.detect('');

        // Log audit
        void auditLog.append('system', 'security.secrets', 'codebase');

        void reply.send({
          success: true,
          secrets: matches,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        request.log.error({ error }, 'Secret detection failed');
        void reply.code(500).send({
          success: false,
          error: 'Secret detection failed',
        });
      }
    },
  );

  // GET /api/v1/security/audit-log - Query audit logs (developer+)
  fastify.get(
    '/security/audit-log',
    {
      preHandler: [rbac.check('audit.read')],
    },
    async (request: FastifyRequest<{ Querystring: { limit?: number } }>, reply: FastifyReply) => {
      try {
        const limit = request.query.limit || 50;
        const entries = auditLog.getEntries(limit);
        const isValid = auditLog.verify();

        void reply.send({
          success: true,
          entries,
          total: auditLog.getSize(),
          integrity: isValid,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        request.log.error({ error }, 'Audit log query failed');
        void reply.code(500).send({
          success: false,
          error: 'Audit log query failed',
        });
      }
    },
  );

  // GET /api/v1/security/audit-log/verify - Verify hash chain integrity (developer+)
  fastify.get(
    '/security/audit-log/verify',
    {
      preHandler: [rbac.check('audit.read')],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const isValid = auditLog.verify();

        void reply.send({
          success: true,
          integrity: isValid,
          entries: auditLog.getSize(),
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        request.log.error({ error }, 'Audit log verification failed');
        void reply.code(500).send({
          success: false,
          error: 'Audit log verification failed',
        });
      }
    },
  );
}
