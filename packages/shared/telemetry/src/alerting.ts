import type { AlertEvent, AlertRule } from './interfaces.js';
import { AgentXLoggerFactory } from '@agentx-fast/shared';

export interface AlertNotifier {
  send(event: AlertEvent): Promise<void>;
}

export class SlackNotifier implements AlertNotifier {
  constructor(private webhookUrl: string) {}

  async send(event: AlertEvent): Promise<void> {
    const body = {
      text: `🚨 Alert: ${event.ruleName}`,
      attachments: [
        {
          color: 'danger',
          fields: [
            { title: 'Message', value: event.message, short: false },
            { title: 'Active Tasks', value: String(event.metrics.activeTasks), short: true },
            { title: 'Error Rate', value: `${event.metrics.errorRate}%`, short: true },
            { title: 'Cost Today', value: `$${event.metrics.totalCostUsd}`, short: true },
          ],
          timestamp: Math.floor(event.timestamp.getTime() / 1000),
        },
      ],
    };

    const response = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Slack webhook failed: ${response.status}`);
    }
  }
}

export class EmailNotifier implements AlertNotifier {
  private logger = new AgentXLoggerFactory().createLogger('telemetry:alerting');

  constructor(
    private _smtpHost: string,
    private _smtpPort: number,
    private _from: string,
    private to: string[],
  ) {}

  async send(event: AlertEvent): Promise<void> {
    const subject = `🚨 AgentX Alert: ${event.ruleName}`;
    const body = [
      `Alert: ${event.ruleName}`,
      `Message: ${event.message}`,
      `Active Tasks: ${event.metrics.activeTasks}`,
      `Error Rate: ${event.metrics.errorRate}%`,
      `Cost Today: $${event.metrics.totalCostUsd}`,
      `Avg Latency: ${event.metrics.avgLatencyMs}ms`,
      `Time: ${event.timestamp.toISOString()}`,
    ].join('\n');

    this.logger.info(
      `[Email] To: ${this.to.join(', ')} via ${this._smtpHost}:${this._smtpPort} from ${this._from}`,
    );
    this.logger.info(`[Email] Subject: ${subject}`);
    this.logger.info(`[Email] Body:\n${body}`);
  }
}

export class WebhookNotifier implements AlertNotifier {
  constructor(private url: string) {}

  async send(event: AlertEvent): Promise<void> {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        alert: event.ruleName,
        message: event.message,
        metrics: event.metrics,
        timestamp: event.timestamp.toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status}`);
    }
  }
}

export class AlertEngine {
  private rules: AlertRule[] = [];

  addRule(rule: AlertRule): void {
    this.rules.push(rule);
  }

  removeRule(ruleId: string): void {
    this.rules = this.rules.filter((r) => r.id !== ruleId);
  }

  getRules(): AlertRule[] {
    return [...this.rules];
  }

  async evaluate(metrics: Parameters<AlertRule['condition']>[0]): Promise<AlertEvent[]> {
    const events: AlertEvent[] = [];

    for (const rule of this.rules) {
      if (!rule.enabled) continue;
      if (rule.condition(metrics)) {
        const event: AlertEvent = {
          ruleId: rule.id,
          ruleName: rule.name,
          message: `Alert triggered: ${rule.name}`,
          metrics,
          timestamp: new Date(),
        };
        events.push(event);
        await rule.notify(event);
      }
    }

    return events;
  }
}
