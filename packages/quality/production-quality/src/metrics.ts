/**
 * @module production-quality/metrics
 * @description Exposes global quality metrics.
 */

export class QualityMetricsCollector {
  public totalValidations = 0;
  public totalFailures = 0;
  public overallScoreSum = 0;

  recordValidation(score: number, passed: boolean): void {
    this.totalValidations++;
    this.overallScoreSum += score;
    if (!passed) {
      this.totalFailures++;
    }
  }

  getMetrics(): Record<string, number> {
    return {
      totalValidations: this.totalValidations,
      totalFailures: this.totalFailures,
      averageScore: this.totalValidations > 0 ? this.overallScoreSum / this.totalValidations : 0,
    };
  }

  reset(): void {
    this.totalValidations = 0;
    this.totalFailures = 0;
    this.overallScoreSum = 0;
  }
}
