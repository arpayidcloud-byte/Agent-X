/**
 * @module cognitive-kernel/kernel-metrics
 * @description Operational metrics collector.
 */

export class KernelMetricsCollector {
  public sessionCount = 0;
  public totalThinkingTimeMs = 0;
  public checkpointCount = 0;
  public recoveryCount = 0;
  public failureCount = 0;

  recordSession(timeMs: number): void {
    this.sessionCount++;
    this.totalThinkingTimeMs += timeMs;
  }

  recordCheckpoint(): void {
    this.checkpointCount++;
  }

  recordRecovery(): void {
    this.recoveryCount++;
  }

  recordFailure(): void {
    this.failureCount++;
  }

  getAverageThinkingTime(): number {
    return this.sessionCount > 0 ? this.totalThinkingTimeMs / this.sessionCount : 0;
  }
}
