/**
 * @module provider-sdk/provider-template
 * @description Official templates for AgentX Providers.
 */

import type { IQueueProvider } from '@agentx-fast/runtime-adapters';

export function createQueueTemplate(): IQueueProvider {
  return {
    getMetadata: () => ({
      id: 'template-queue',
      name: 'Template Queue',
      type: 'queue',
      version: '0.0.1',
    }),
    getCapabilities: () => ({ priorityQueue: true }),
    healthCheck: async () => ({
      healthy: true,
      latencyMs: 0,
      lastChecked: new Date(),
      status: 'ACTIVE',
    }),
    getMetrics: () => ({
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageLatencyMs: 0,
    }),
    enqueue: async () => {},
    dequeue: async () => undefined,
    peek: async () => undefined,
    ack: async () => {},
    retry: async () => {},
    deadLetter: async () => {},
    getDepth: async () => 0,
    purge: async () => {},
  };
}
