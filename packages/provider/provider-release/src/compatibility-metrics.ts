/**
 * @module provider-release/compatibility-metrics
 * @description Exposes operational release metrics.
 */

export class CompatibilityMetricsCollector {
  public compatibleProviders = 0;
  public rejectedProviders = 0;
  public deprecatedProviders = 0;
  public stableReleases = 0;
  public ltsReleases = 0;
  public breakingChangesDetected = 0;
  public migrationPlansGenerated = 0;
  public totalScoreSum = 0;
  public scoreCount = 0;

  getMetrics(): Record<string, number> {
    return {
      compatibleProviders: this.compatibleProviders,
      rejectedProviders: this.rejectedProviders,
      deprecatedProviders: this.deprecatedProviders,
      stableReleases: this.stableReleases,
      ltsReleases: this.ltsReleases,
      breakingChangesDetected: this.breakingChangesDetected,
      migrationPlansGenerated: this.migrationPlansGenerated,
      averageCompatibilityScore: this.scoreCount > 0 ? this.totalScoreSum / this.scoreCount : 0,
    };
  }

  recordScore(score: number): void {
    this.totalScoreSum += score;
    this.scoreCount++;
  }

  reset(): void {
    this.compatibleProviders = 0;
    this.rejectedProviders = 0;
    this.deprecatedProviders = 0;
    this.stableReleases = 0;
    this.ltsReleases = 0;
    this.breakingChangesDetected = 0;
    this.migrationPlansGenerated = 0;
    this.totalScoreSum = 0;
    this.scoreCount = 0;
  }
}
