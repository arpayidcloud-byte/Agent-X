export interface DashboardMetrics {
  activeTasks: number;
  completedToday: number;
  totalCostUsd: number;
  avgLatencyMs: number;
  errorRate: number;
}

export interface TaskEvent {
  taskId: string;
  status: string;
  traceId: string;
  timestamp: Date;
  durationMs?: number;
  costUsd?: number;
  error?: string;
}

export interface AlertRule {
  id: string;
  name: string;
  condition: (metrics: DashboardMetrics) => boolean;
  notify: (event: AlertEvent) => Promise<void>;
  enabled: boolean;
}

export interface AlertEvent {
  ruleId: string;
  ruleName: string;
  message: string;
  metrics: DashboardMetrics;
  timestamp: Date;
}

export interface TelemetryStore {
  recordTask(event: TaskEvent): void;
  getActiveTasks(): TaskEvent[];
  getMetrics(): DashboardMetrics;
  getTaskHistory(limit: number): TaskEvent[];
}
