export type AlertLevel = 'info' | 'warning' | 'critical';

export interface AlertPayload {
  level: AlertLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
}

export interface ThresholdRule {
  metric: string;
  max: number;
  min: number;
  level: AlertLevel;
}

export class AlertManager {
  private webhookUrl: string | null;
  private thresholds: ThresholdRule[] = [];

  constructor(webhookUrl?: string) {
    this.webhookUrl = webhookUrl ?? process.env.ALERTING_WEBHOOK_URL ?? null;
  }

  setWebhookUrl(url: string): void {
    this.webhookUrl = url;
  }

  addThreshold(rule: ThresholdRule): void {
    this.thresholds.push(rule);
  }

  async sendAlert(
    level: AlertLevel,
    message: string,
    context?: Record<string, unknown>,
  ): Promise<void> {
    const payload: AlertPayload = {
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
    };

    if (this.webhookUrl) {
      try {
        const response = await fetch(this.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          console.error(`[AlertManager] Webhook returned status ${response.status}`);
        }
      } catch (error) {
        console.error('[AlertManager] Failed to send webhook alert:', error);
        this.consoleFallback(payload);
      }
    } else {
      this.consoleFallback(payload);
    }
  }

  async checkThresholds(metrics: Record<string, number>): Promise<void> {
    for (const rule of this.thresholds) {
      const value = metrics[rule.metric];
      if (value !== undefined) {
        if (value > rule.max || value < rule.min) {
          await this.sendAlert(
            rule.level,
            `Threshold breached for "${rule.metric}": ${value} (max: ${rule.max}, min: ${rule.min})`,
            {
              metric: rule.metric,
              value,
              max: rule.max,
              min: rule.min,
              thresholdRule: rule.metric,
            },
          );
        }
      }
    }
  }

  private consoleFallback(payload: AlertPayload): void {
    const prefix = `[AlertManager] [${payload.level.toUpperCase()}]`;
    if (payload.context && Object.keys(payload.context).length > 0) {
      console.log(`${prefix} ${payload.message}`, JSON.stringify(payload.context));
    } else {
      console.log(`${prefix} ${payload.message}`);
    }
  }
}

export const alertManager = new AlertManager();
