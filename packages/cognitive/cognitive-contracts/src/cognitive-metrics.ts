/**
 * @module cognitive-contracts/cognitive-metrics
 * @description Cognitive metrics contract base implementation.
 */

export interface CognitiveMetrics {
  thinkingDurationMs: number;
  reasoningDurationMs: number;
  reflectionDurationMs: number;
  decisionDurationMs: number;
  planningDurationMs: number;
  averageConfidence: number;
  riskDistribution: Record<string, number>;
  budgetConsumption: Record<string, number>;
}

export class CognitiveMetricsBase {
  private metrics: CognitiveMetrics;

  constructor(metrics: CognitiveMetrics) {
    this.metrics = metrics;
  }

  getMetrics(): CognitiveMetrics {
    return { ...this.metrics };
  }
}
