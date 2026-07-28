/**
 * @module runtime-adapters/memory/memory-secret
 * @description Reference in-memory secret storage provider.
 */

import type {
  ISecretProvider,
  ProviderMetadata,
  ProviderCapabilities,
  ProviderHealth,
  ProviderMetrics,
} from '../interfaces.js';

export class MemorySecretProvider implements ISecretProvider {
  private secrets = new Map<string, string>();
  private total = 0;
  private successes = 0;

  getMetadata(): ProviderMetadata {
    return {
      id: 'memory-secret',
      name: 'Memory Secret Provider',
      type: 'secret',
      version: '0.1.0',
    };
  }

  getCapabilities(): ProviderCapabilities {
    return { secretRotation: true };
  }

  async healthCheck(): Promise<ProviderHealth> {
    return { healthy: true, latencyMs: 0, lastChecked: new Date(), status: 'ACTIVE' };
  }

  getMetrics(): ProviderMetrics {
    return {
      totalRequests: this.total,
      successfulRequests: this.successes,
      failedRequests: 0,
      averageLatencyMs: 0,
    };
  }

  async getSecret(key: string): Promise<string | undefined> {
    this.total++;
    this.successes++;
    return this.secrets.get(key);
  }

  async putSecret(key: string, value: string): Promise<void> {
    this.total++;
    this.secrets.set(key, value);
    this.successes++;
  }

  async deleteSecret(key: string): Promise<void> {
    this.secrets.delete(key);
  }

  async listSecrets(): Promise<string[]> {
    return Array.from(this.secrets.keys());
  }

  async rotateSecret(key: string, newValue: string): Promise<void> {
    this.secrets.set(key, newValue);
  }
}
