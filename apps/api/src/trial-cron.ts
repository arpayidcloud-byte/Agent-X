/**
 * Trial cron endpoint (admin). Triggers expired trial downgrade + trial-ending list.
 * In production, replace with system cron / k8s CronJob.
 */
import type { Express, Request, Response } from 'express';
import { downgradeExpiredTrials, findTrialsEndingWithin } from '@agent-xai/billing';

export function registerTrialCronRoutes(app: Express): void {
  app.post(
    '/v1/internal/billing/cron/trial-downgrade',
    async (req: Request, res: Response): Promise<void> => {
      // Hardened: shared secret header
      const secret = process.env.BILLING_CRON_SECRET;
      if (secret && req.headers['x-billing-secret'] !== secret) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      try {
        const downgraded = await downgradeExpiredTrials();
        const endingSoon = await findTrialsEndingWithin(3);
        res.json({ ok: true, downgraded, endingSoon: endingSoon.length });
      } catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
      }
    },
  );
}
