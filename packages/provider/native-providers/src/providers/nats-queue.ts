/**
 * @module native-providers/providers/nats-queue
 * @description Native NATS PubSub and streaming queue provider wrapper (Stub implementation).
 */

import type {
  IQueueProvider,
  ProviderMetadata,
  ProviderCapabilities,
  ProviderHealth,
  ProviderMetrics,
} from '@agentx-fast/runtime-adapters';
import type { IConfigurationProvider, INativeProvider } from '../interfaces.js';
import { ConfigurationError } from '../errors.js';

export class NATSQueueProvider implements IQueueProvider, INativeProvider {
  id = 'nats-queue';
  name = 'NATS Queue Provider';
  private connected = false;
  private config!: IConfigurationProvider;

  async initialize(config: IConfigurationProvider): Promise<void> {
    this.config = config;
    if (!this.config.has('NATS_URL')) {
      throw new ConfigurationError('NATS_URL is required for NATS', this.id);
    }
  }

  async connect(): Promise<void> {
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }

  async getHealth(): Promise<{ status: 'UP' | 'DOWN' | 'DEGRADED'; latencyMs: number }> {
    return { status: this.connected ? 'UP' : 'DOWN', latencyMs: 4 };
  }

  getMetadata(): ProviderMetadata {
    return { id: this.id, name: this.name, type: 'queue', version: '1.0.0' };
  }

  getCapabilities(): ProviderCapabilities {
    return { priorityQueue: false };
  }

  async healthCheck(): Promise<ProviderHealth> {
    return {
      healthy: this.connected,
      latencyMs: 4,
      lastChecked: new Date(),
      status: this.connected ? 'ACTIVE' : 'DOWN',
    };
  }

  getMetrics(): ProviderMetrics {
    return { totalRequests: 0, successfulRequests: 0, failedRequests: 0, averageLatencyMs: 0 };
  }

  async enqueue(_topic: string, _message: unknown, _priority?: number): Promise<void> {}
  async dequeue(_topic: string): Promise<unknown> {
    return undefined;
  }
  async peek(_topic: string): Promise<unknown> {
    return undefined;
  }
  async ack(_topic: string, _messageId: string): Promise<void> {}
  async retry(_topic: string, _messageId: string): Promise<void> {}
  async deadLetter(_topic: string, _messageId: string): Promise<void> {}
  async getDepth(_topic: string): Promise<number> {
    return 0;
  }
  async purge(_topic: string): Promise<void> {}
}
