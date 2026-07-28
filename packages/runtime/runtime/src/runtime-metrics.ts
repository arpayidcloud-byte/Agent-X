/**
 * @module runtime/runtime-metrics
 * @description Runtime metrics collection and aggregation.
 */

import type { RuntimeMetrics } from './interfaces.js';
import { createEmptyMetrics } from './runtime-session.js';

export class MetricsCollector {
  private metrics: RuntimeMetrics;
  private startTime: number = 0;

  constructor() {
    this.metrics = createEmptyMetrics();
  }

  /**
   * Starts timing
   */
  startTiming(): void {
    this.startTime = Date.now();
  }

  /**
   * Records execution time
   */
  recordExecutionTime(): void {
    if (this.startTime > 0) {
      this.metrics.executionTimeMs = Date.now() - this.startTime;
    }
  }

  /**
   * Records workflow time
   */
  recordWorkflowTime(durationMs: number): void {
    this.metrics.workflowTimeMs += durationMs;
  }

  /**
   * Records planning time
   */
  recordPlanningTime(durationMs: number): void {
    this.metrics.planningTimeMs += durationMs;
  }

  /**
   * Records approval delay
   */
  recordApprovalDelay(durationMs: number): void {
    this.metrics.approvalDelayMs += durationMs;
  }

  /**
   * Increments tool usage
   */
  incrementToolUsage(): void {
    this.metrics.toolUsage++;
  }

  /**
   * Increments token usage
   */
  incrementTokenUsage(tokens: number): void {
    this.metrics.tokenUsage += tokens;
  }

  /**
   * Increments provider usage
   */
  incrementProviderUsage(): void {
    this.metrics.providerUsage++;
  }

  /**
   * Increments retry count
   */
  incrementRetryCount(): void {
    this.metrics.retryCount++;
  }

  /**
   * Increments checkpoint count
   */
  incrementCheckpointCount(): void {
    this.metrics.checkpointCount++;
  }

  /**
   * Sets success rate
   */
  setSuccessRate(successful: number, total: number): void {
    this.metrics.successRate = total > 0 ? successful / total : 0;
  }

  /**
   * Gets current metrics
   * @returns RuntimeMetrics
   */
  getMetrics(): RuntimeMetrics {
    return { ...this.metrics };
  }

  /**
   * Resets metrics
   */
  reset(): void {
    this.metrics = {
      executionTimeMs: 0,
      workflowTimeMs: 0,
      planningTimeMs: 0,
      approvalDelayMs: 0,
      agentUtilization: 0,
      parallelism: 0,
      memoryUsageMb: 0,
      tokenUsage: 0,
      providerUsage: 0,
      toolUsage: 0,
      successRate: 0,
      retryCount: 0,
      checkpointCount: 0,
      queueWaitMs: 0,
      criticalPathLength: 0,
      estimatedCostUsd: 0,
    };
  }
}
