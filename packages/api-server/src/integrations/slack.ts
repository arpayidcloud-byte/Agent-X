export interface SlackNotification {
  channel: string;
  text: string;
  blocks?: Array<{
    type: string;
    text?: {
      type: string;
      text: string;
    };
    fields?: Array<{
      type: string;
      text: string;
    }>;
  }>;
}

import { AgentXLoggerFactory } from '@agentx-fast/shared';

export class SlackNotifier {
  private webhookUrl: string;
  private logger = new AgentXLoggerFactory().createLogger('api-server:slack');

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl;
  }

  async send(notification: SlackNotification): Promise<void> {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      });

      if (!response.ok) {
        throw new Error(`Slack API returned ${response.status}`);
      }
    } catch (error) {
      this.logger.error('Failed to send Slack notification', error);
      throw error;
    }
  }

  async notifyTaskStatus(taskId: string, status: string, goal: string): Promise<void> {
    await this.send({
      channel: '#agentx-tasks',
      text: `Task ${status}: ${goal}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Task ${status}*\n${goal}`,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Task ID*\n${taskId}`,
            },
            {
              type: 'mrkdwn',
              text: `*Status*\n${status}`,
            },
          ],
        },
      ],
    });
  }

  async notifyApprovalRequired(taskId: string, goal: string): Promise<void> {
    await this.send({
      channel: '#agentx-approvals',
      text: `Approval required for task: ${goal}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Approval Required*\n${goal}`,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Task ID*\n${taskId}`,
            },
          ],
        },
      ],
    });
  }
}
