import type { AgentMessage } from './interfaces.js';
import type { IEventBus } from '@agent-xai/core-runtime';

export class MessageBus {
  private handlers = new Map<string, Set<(msg: AgentMessage) => void>>();

  constructor(private globalEventBus: IEventBus) {}

  public subscribe(topic: AgentMessage['topic'], handler: (msg: AgentMessage) => void): void {
    if (!this.handlers.has(topic)) {
      this.handlers.set(topic, new Set());
    }
    this.handlers.get(topic)!.add(handler);
  }

  public publish(message: AgentMessage): void {
    const topicHandlers = this.handlers.get(message.topic);
    if (topicHandlers) {
      for (const handler of topicHandlers) {
        handler(message);
      }
    }
  }

  public async broadcastToGlobalBus(message: AgentMessage): Promise<void> {
    const orgId = message.orgId;
    if (!orgId) throw new Error('Organization context required for global agent broadcast');
    await this.globalEventBus.publish<AgentMessage>(
      orgId,
      `agent.${message.topic}`,
      message,
      'trace-bus',
    );
  }
}
