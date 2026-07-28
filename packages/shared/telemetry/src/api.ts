import type { DashboardMetrics, TaskEvent, AlertRule, AlertEvent } from './interfaces.js';
import { MetricsAggregator } from './aggregator.js';
import { AlertEngine } from './alerting.js';

export class TelemetryAPI {
  private aggregator: MetricsAggregator;
  private alertEngine: AlertEngine;
  private subscribers: Set<(event: TaskEvent) => void> = new Set();

  constructor() {
    this.aggregator = new MetricsAggregator();
    this.alertEngine = new AlertEngine();
  }

  recordTask(event: TaskEvent): void {
    this.aggregator.recordTask(event);
    this.notifySubscribers(event);
  }

  getMetrics(): DashboardMetrics {
    return this.aggregator.getMetrics();
  }

  getActiveTasks(): TaskEvent[] {
    return this.aggregator.getActiveTasks();
  }

  getTaskHistory(limit: number): TaskEvent[] {
    return this.aggregator.getTaskHistory(limit);
  }

  addAlertRule(rule: AlertRule): void {
    this.alertEngine.addRule(rule);
  }

  removeAlertRule(ruleId: string): void {
    this.alertEngine.removeRule(ruleId);
  }

  getAlertRules(): AlertRule[] {
    return this.alertEngine.getRules();
  }

  async evaluateAlerts(): Promise<AlertEvent[]> {
    return this.alertEngine.evaluate(this.aggregator.getMetrics());
  }

  subscribe(callback: (event: TaskEvent) => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(event: TaskEvent): void {
    for (const cb of Array.from(this.subscribers)) {
      cb(event);
    }
  }
}
