/**
 * @module cognitive-kernel/kernel-statistics
 * @description Advanced execution insights.
 */

import type { KernelMetricsCollector } from './kernel-metrics.js';

export class KernelStatistics {
  constructor(private metrics: KernelMetricsCollector) {}

  getStats(): Record<string, number> {
    return {
      totalSessions: this.metrics.sessionCount,
      averageThinkingTime: this.metrics.getAverageThinkingTime(),
      successRate:
        this.metrics.sessionCount > 0
          ? ((this.metrics.sessionCount - this.metrics.failureCount) / this.metrics.sessionCount) *
            100
          : 100,
    };
  }
}
