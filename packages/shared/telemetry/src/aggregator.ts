import type { DashboardMetrics, TaskEvent, TelemetryStore } from './interfaces.js';

export class MetricsAggregator implements TelemetryStore {
  private tasks: TaskEvent[] = [];
  private maxHistory: number;

  constructor(maxHistory = 1000) {
    this.maxHistory = maxHistory;
  }

  recordTask(event: TaskEvent): void {
    this.tasks.push(event);
    if (this.tasks.length > this.maxHistory) {
      this.tasks = this.tasks.slice(-this.maxHistory);
    }
  }

  getActiveTasks(): TaskEvent[] {
    return this.tasks.filter(
      (t) => t.status === 'RUNNING' || t.status === 'QUEUED' || t.status === 'CREATED',
    );
  }

  getMetrics(): DashboardMetrics {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const completedToday = this.tasks.filter(
      (t) => t.status === 'COMPLETED' && t.timestamp >= startOfDay,
    );
    const failedToday = this.tasks.filter(
      (t) => t.status === 'FAILED' && t.timestamp >= startOfDay,
    );
    const totalToday = completedToday.length + failedToday.length;

    const totalCostUsd = completedToday.reduce((sum, t) => sum + (t.costUsd ?? 0), 0);
    const latencies = completedToday
      .filter((t) => t.durationMs !== undefined)
      .map((t) => t.durationMs!);
    const avgLatencyMs =
      latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0;

    return {
      activeTasks: this.getActiveTasks().length,
      completedToday: completedToday.length,
      totalCostUsd: Math.round(totalCostUsd * 10000) / 10000,
      avgLatencyMs: Math.round(avgLatencyMs * 100) / 100,
      errorRate: totalToday > 0 ? Math.round((failedToday.length / totalToday) * 10000) / 100 : 0,
    };
  }

  getTaskHistory(limit: number): TaskEvent[] {
    return this.tasks.slice(-limit);
  }
}
