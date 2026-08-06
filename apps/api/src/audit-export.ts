import type { Request, Response, NextFunction } from 'express';
import { getPrisma } from '@agent-xai/persistence';

/**
 * Audit log export endpoints.
 * GET /v1/admin/audit-logs/export?format=csv|json
 * GET /v1/admin/audit-logs/stats
 */

interface AuditLog {
  id: string;
  action: string;
  target: string;
  email: string;
  details: string;
  createdAt: Date;
}

export function registerAuditExportRoutes(app: {
  get: (
    path: string,
    ...handlers: ((req: Request, res: Response, next: NextFunction) => void)[]
  ) => void;
}): void {
  // ─── Export audit logs as CSV or JSON ────
  app.get('/v1/admin/audit-logs/export', (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const format = (req.query.format as string) || 'json';
        const limit = Math.min(Number(req.query.limit) || 1000, 10000);
        const prisma = getPrisma();
        const logs = await (
          prisma as unknown as {
            adminAuditLog: { findMany: (args: unknown) => Promise<AuditLog[]> };
          }
        ).adminAuditLog.findMany({
          take: limit,
          orderBy: { createdAt: 'desc' },
        });

        if (format === 'csv') {
          const headers = ['id', 'action', 'target', 'email', 'details', 'createdAt'];
          const rows = logs.map((log) =>
            headers
              .map((h) => {
                const val = String(log[h as keyof AuditLog] ?? '');
                return val.includes(',') || val.includes('"') || val.includes('\n')
                  ? `"${val.replace(/"/g, '""')}"`
                  : val;
              })
              .join(','),
          );
          const csv = [headers.join(','), ...rows].join('\n');
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader(
            'Content-Disposition',
            `attachment; filename="audit-logs-${new Date().toISOString().split('T')[0]}.csv"`,
          );
          res.send(csv);
        } else {
          res.json({
            logs,
            total: logs.length,
            exportedAt: new Date().toISOString(),
          });
        }
      } catch (e) {
        next(e instanceof Error ? e : new Error(String(e)));
      }
    })();
  });

  // ─── Audit log statistics ────
  app.get('/v1/admin/audit-logs/stats', (_req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const prisma = getPrisma();
        const logs = await (
          prisma as unknown as {
            adminAuditLog: { findMany: (args: unknown) => Promise<AuditLog[]> };
          }
        ).adminAuditLog.findMany({
          orderBy: { createdAt: 'desc' },
          take: 1000,
        });

        // Group by action
        const byAction: Record<string, number> = {};
        const byUser: Record<string, number> = {};
        const byDay: Record<string, number> = {};

        for (const log of logs) {
          const action = String(log.action ?? 'unknown');
          const email = String(log.email ?? 'unknown');
          const day = String(new Date(log.createdAt).toISOString().split('T')[0] ?? 'unknown');

          byAction[action] = (byAction[action] || 0) + 1;
          byUser[email] = (byUser[email] || 0) + 1;
          byDay[day] = (byDay[day] || 0) + 1;
        }

        res.json({
          total: logs.length,
          byAction,
          byUser,
          byDay,
        });
      } catch (e) {
        next(e instanceof Error ? e : new Error(String(e)));
      }
    })();
  });
}
