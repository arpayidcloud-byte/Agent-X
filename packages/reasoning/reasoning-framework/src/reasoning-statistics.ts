/**
 * @module reasoning-framework/reasoning-statistics
 * @description Renders statistical overview of reasoning execution.
 */

import type { PipelineMetrics } from './pipeline-metrics.js';

export class ReasoningStatistics {
  constructor(private metrics: PipelineMetrics) {}

  getStats(): Record<string, number> {
    return {
      totalTimeMs: this.metrics.totalTimeMs,
      averageStageMs: this.metrics.totalTimeMs / 10, // simplified
    };
  }
}
