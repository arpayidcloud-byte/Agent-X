/**
 * @module runtime-adapters/memory/memory-storage
 * @description Reference in-memory database and storage provider.
 */

import type {
  IStorageProvider,
  ProviderMetadata,
  ProviderCapabilities,
  ProviderHealth,
  ProviderMetrics,
} from '../interfaces.js';

export class MemoryStorageProvider implements IStorageProvider {
  private store = new Map<string, Map<string, string>>();
  private total = 0;
  private successes = 0;

  getMetadata(): ProviderMetadata {
    return {
      id: 'memory-storage',
      name: 'Memory Storage Provider',
      type: 'storage',
      version: '0.1.0',
    };
  }

  getCapabilities(): ProviderCapabilities {
    return { transactions: true };
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

  async put(bucket: string, key: string, value: string): Promise<void> {
    this.total++;
    const b = this.store.get(bucket) || new Map<string, string>();
    b.set(key, value);
    this.store.set(bucket, b);
    this.successes++;
  }

  async get(bucket: string, key: string): Promise<string | undefined> {
    return this.store.get(bucket)?.get(key);
  }

  async delete(bucket: string, key: string): Promise<void> {
    this.store.get(bucket)?.delete(key);
  }

  async list(bucket: string, prefix?: string): Promise<string[]> {
    const keys = Array.from(this.store.get(bucket)?.keys() || []);
    if (prefix) {
      return keys.filter((k) => k.startsWith(prefix));
    }
    return keys;
  }

  async exists(bucket: string, key: string): Promise<boolean> {
    return this.store.get(bucket)?.has(key) || false;
  }

  async transaction(operations: () => Promise<void>): Promise<void> {
    // Basic synchronous transaction execution
    await operations();
  }
}
