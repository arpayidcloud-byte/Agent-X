/**
 * @module coordinator/coordinator-metrics
 * @description Metrics collection and aggregation for the coordinator.
 */

import type { ExecutionCoordinatorMetrics } from './interfaces.js';

export class CoordinatorMetricsCollector {
  private total = 0;
  private active = 0;
  private completed = 0;
  private failed = 0;
  private cancelled = 0;
  private retries = 0;
  private recoveries = 0;
  private totalTimeMs = 0;
  private totalQueueTimeMs = 0;

  incrementExecutions(): void {
    this.total++;
    this.active++;
  }

  decrementActive(): void {
    this.active = Math.max(0, this.active - 1);
  }

  incrementCompleted(timeMs: number): void {
    this.completed++;
    this.decrementActive();
    this.totalTimeMs += timeMs;
  }

  incrementFailed(timeMs: number): void {
    this.failed++;
    this.decrementActive();
    this.totalTimeMs += timeMs;
  }

  incrementCancelled(): void {
    this.cancelled++;
    this.decrementActive();
  }

  incrementRetries(): void {
    this.retries++;
  }

  incrementRecoveries(): void {
    this.recoveries++;
  }

  addQueueTime(timeMs: number): void {
    this.totalQueueTimeMs += timeMs;
  }

  getMetrics(): ExecutionCoordinatorMetrics {
    return {
      executionTimeMs: this.totalTimeMs,
      queueTimeMs: this.totalQueueTimeMs,
      totalExecutions: this.total,
      activeExecutions: this.active,
      completedExecutions: this.completed,
      failedExecutions: this.failed,
      cancelledExecutions: this.cancelled,
      retryCount: this.retries,
      recoveryCount: this.recoveries,
    };
  }

  reset(): void {
    this.total = 0;
    this.active = 0;
    this.completed = 0;
    this.failed = 0;
    this.cancelled = 0;
    this.retries = 0;
    this.recoveries = 0;
    this.totalTimeMs = 0;
    this.totalQueueTimeMs = 0;
  }
}
