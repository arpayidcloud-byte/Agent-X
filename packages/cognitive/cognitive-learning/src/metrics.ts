/**
 * @module cognitive-learning/metrics
 * @description Learning metrics collector.
 */

export interface LearningMetrics {
  learningRuns: number;
  patternsLearned: number;
  patternsRejected: number;
  feedbackProcessed: number;
  reflectionsCreated: number;
  adaptationsGenerated: number;
  improvementsGenerated: number;
  averageConfidenceDelta: number;
  successRate: number;
  failureRate: number;
}

export class LearningMetricsCollector {
  public learningRuns = 0;
  public patternsLearned = 0;
  public patternsRejected = 0;
  public feedbackProcessed = 0;
  public reflectionsCreated = 0;
  public adaptationsGenerated = 0;
  public improvementsGenerated = 0;
  public experiencesCollected = 0;
  public totalConfidenceDelta = 0;
  public totalSuccesses = 0;
  public totalFailures = 0;

  recordRun(success: boolean): void {
    this.learningRuns++;
    if (success) this.totalSuccesses++;
    else this.totalFailures++;
  }

  getMetrics(): LearningMetrics {
    return {
      learningRuns: this.learningRuns,
      patternsLearned: this.patternsLearned,
      patternsRejected: this.patternsRejected,
      feedbackProcessed: this.feedbackProcessed,
      reflectionsCreated: this.reflectionsCreated,
      adaptationsGenerated: this.adaptationsGenerated,
      improvementsGenerated: this.improvementsGenerated,
      averageConfidenceDelta:
        this.learningRuns > 0 ? this.totalConfidenceDelta / this.learningRuns : 0,
      successRate: this.learningRuns > 0 ? (this.totalSuccesses / this.learningRuns) * 100 : 0,
      failureRate: this.learningRuns > 0 ? (this.totalFailures / this.learningRuns) * 100 : 0,
    };
  }
}
