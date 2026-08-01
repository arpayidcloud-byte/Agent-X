import { Logger } from '@agent-xai/observability';

const logger = new Logger('agentx-api:slack');

export interface SlackBlock {
  type: string;
  text?: { type: string; text: string };
  fields?: Array<{ type: string; text: string }>;
}

export interface SlackPayload {
  text: string;
  blocks?: SlackBlock[];
}

/**
 * Send a Slack message via incoming webhook.
 * Returns true when delivered, false when the webhook is not configured
 * (SLACK_WEBHOOK_URL unset) or the delivery failed — never throws, so
 * notifications never break the API flow.
 */
export async function notifySlack(text: string, blocks?: SlackBlock[]): Promise<boolean> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    return false;
  }
  try {
    const payload: SlackPayload = { text, blocks };
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      logger.warn(`Slack webhook returned ${response.status}`, { status: response.status });
      return false;
    }
    logger.info('Slack notification sent', { text: text.slice(0, 80) });
    return true;
  } catch (error) {
    logger.error(
      'Slack notification failed',
      error instanceof Error ? error : new Error(String(error)),
    );
    return false;
  }
}
