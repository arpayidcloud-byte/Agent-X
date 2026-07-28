/**
 * @module provider-qualification/qualification-metrics
 * @description Operational metrics tracker.
 */

export class QualificationMetricsCollector {
  public qualifiedProviders = 0;
  public rejectedProviders = 0;
  public totalQualificationTimeMs = 0;
  public totalBenchmarkTimeMs = 0;
  public totalChaosTimeMs = 0;
  public averagePerformanceScore = 0;
  public averageReliabilityScore = 0;
  public certificationCount = 0;
  public failureCount = 0;
  public warningCount = 0;

  getMetrics(): Record<string, number> {
    return {
      qualifiedProviders: this.qualifiedProviders,
      rejectedProviders: this.rejectedProviders,
      totalQualificationTimeMs: this.totalQualificationTimeMs,
      totalBenchmarkTimeMs: this.totalBenchmarkTimeMs,
      totalChaosTimeMs: this.totalChaosTimeMs,
      averagePerformanceScore: this.averagePerformanceScore,
      averageReliabilityScore: this.averageReliabilityScore,
      certificationCount: this.certificationCount,
      failureCount: this.failureCount,
      warningCount: this.warningCount,
    };
  }

  reset(): void {
    this.qualifiedProviders = 0;
    this.rejectedProviders = 0;
    this.totalQualificationTimeMs = 0;
    this.totalBenchmarkTimeMs = 0;
    this.totalChaosTimeMs = 0;
    this.averagePerformanceScore = 0;
    this.averageReliabilityScore = 0;
    this.certificationCount = 0;
    this.failureCount = 0;
    this.warningCount = 0;
  }
}
