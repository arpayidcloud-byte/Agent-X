/**
 * @module provider-sdk/provider-mocks
 * @description SDK-level mocks for provider validation.
 */

export class SDKMocks {
  static getValidQueue() {
    return {
      getMetadata: () => ({ id: 'mock-q', name: 'Mock Q', type: 'queue', version: '1.0' }),
      getCapabilities: () => ({ priorityQueue: true }),
      healthCheck: async () => ({
        healthy: true,
        latencyMs: 1,
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
}
