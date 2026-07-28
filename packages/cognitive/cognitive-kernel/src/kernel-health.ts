/**
 * @module cognitive-kernel/kernel-health
 * @description Tracks overall kernel well-being.
 */

export class KernelHealthMonitor {
  private metrics: Record<string, number> = {};

  reportHealth(component: string, score: number): void {
    this.metrics[component] = score;
  }

  getOverallHealth(): number {
    const scores = Object.values(this.metrics);
    if (scores.length === 0) return 100;
    return Math.floor(scores.reduce((a, b) => a + b, 0) / scores.length);
  }
}
