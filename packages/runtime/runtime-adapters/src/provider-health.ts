/**
 * @module runtime-adapters/provider-health
 * @description Provider health monitoring abstraction.
 */

import type { IProvider, ProviderHealth } from './interfaces.js';

export class ProviderHealthMonitor {
  private history = new Map<string, ProviderHealth[]>();

  async health(provider: IProvider): Promise<ProviderHealth> {
    const health = await provider.healthCheck();
    const history = this.history.get(provider.getMetadata().id) || [];
    history.push(health);
    if (history.length > 100) history.shift();
    this.history.set(provider.getMetadata().id, history);
    return health;
  }

  async ping(provider: IProvider): Promise<number> {
    const start = Date.now();
    await provider.healthCheck();
    return Date.now() - start;
  }

  latency(providerId: string): number {
    const history = this.history.get(providerId) || [];
    if (history.length === 0) return 0;
    return history.reduce((sum, h) => sum + h.latencyMs, 0) / history.length;
  }

  availability(providerId: string): number {
    const history = this.history.get(providerId) || [];
    if (history.length === 0) return 100;
    const healthy = history.filter((h) => h.healthy).length;
    return (healthy / history.length) * 100;
  }

  failureCount(providerId: string): number {
    const history = this.history.get(providerId) || [];
    return history.filter((h) => !h.healthy).length;
  }

  lastFailure(providerId: string): Date | undefined {
    const history = this.history.get(providerId) || [];
    const failed = history.filter((h) => !h.healthy);
    const last = failed[failed.length - 1];
    return last ? last.lastChecked : undefined;
  }

  getHistory(providerId: string): ProviderHealth[] {
    return [...(this.history.get(providerId) || [])];
  }
}
