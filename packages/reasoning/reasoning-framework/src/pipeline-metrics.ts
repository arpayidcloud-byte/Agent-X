/**
 * @module reasoning-framework/pipeline-metrics
 * @description Operational metrics collector.
 */

import type { PipelineStageName } from './interfaces.js';

export class PipelineMetrics {
  private stageDurations: Record<string, number> = {};
  public totalTimeMs = 0;

  recordStageDuration(stage: PipelineStageName, durationMs: number): void {
    this.stageDurations[stage] = durationMs;
    this.totalTimeMs += durationMs;
  }

  getMetrics(): Record<string, number> {
    return { ...this.stageDurations, totalTimeMs: this.totalTimeMs };
  }
}
