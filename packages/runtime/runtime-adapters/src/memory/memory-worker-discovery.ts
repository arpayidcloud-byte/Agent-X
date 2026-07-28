/**
 * @module runtime-adapters/memory/memory-worker-discovery
 * @description Reference in-memory service discovery provider.
 */

import type {
  IWorkerDiscoveryProvider,
  ProviderMetadata,
  ProviderCapabilities,
  ProviderHealth,
  ProviderMetrics,
} from '../interfaces.js';

export class MemoryWorkerDiscoveryProvider implements IWorkerDiscoveryProvider {
  private workers = new Map<
    string,
    { metadata: Record<string, unknown>; capabilities: string[] }
  >();
  private total = 0;

  getMetadata(): ProviderMetadata {
    return {
      id: 'memory-worker-discovery',
      name: 'Memory Worker Discovery Provider',
      type: 'worker-discovery',
      version: '0.1.0',
    };
  }

  getCapabilities(): ProviderCapabilities {
    return { leaderElection: true };
  }

  async healthCheck(): Promise<ProviderHealth> {
    return { healthy: true, latencyMs: 0, lastChecked: new Date(), status: 'ACTIVE' };
  }

  getMetrics(): ProviderMetrics {
    return {
      totalRequests: this.total,
      successfulRequests: this.total,
      failedRequests: 0,
      averageLatencyMs: 0,
    };
  }

  async registerWorker(workerId: string, metadata: Record<string, unknown>): Promise<void> {
    this.total++;
    const caps = (metadata.capabilities as string[]) || [];
    this.workers.set(workerId, { metadata, capabilities: caps });
  }

  async heartbeat(_workerId: string): Promise<void> {
    // Memory store assumes alive if present
  }

  async listWorkers(): Promise<Array<{ id: string; metadata: Record<string, unknown> }>> {
    return Array.from(this.workers.entries()).map(([id, w]) => ({ id, metadata: w.metadata }));
  }

  async removeWorker(workerId: string): Promise<void> {
    this.workers.delete(workerId);
  }

  async discover(capability: string): Promise<string[]> {
    return Array.from(this.workers.entries())
      .filter(([_, w]) => w.capabilities.includes(capability))
      .map(([id]) => id);
  }
}
