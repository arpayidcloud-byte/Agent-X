export interface PerformanceMetrics {
  executionDurationMs: number;
  providerLatencyMs?: number;
  queueLatencyMs?: number;
  workflowDurationMs?: number;
  retryCount?: number;
  tokenUsage?: {
    input: number;
    output: number;
    total: number;
  };
  estimatedCostUsd?: number;
}

export interface HealthMetrics {
  providerHealth: Record<string, 'healthy' | 'degraded' | 'unhealthy' | 'unknown'>;
  memoryUsageMb: number;
  cpuUsagePercent: number;
  redisConnected: boolean;
  postgresConnected: boolean;
  circuitBreakerState: Record<string, 'closed' | 'open' | 'half-open'>;
}

export interface IMetricsProvider {
  recordPerformance(metric: string, value: number, tags?: Record<string, string>): void;
  incrementCounter(counter: string, increment?: number, tags?: Record<string, string>): void;
  recordHealth(metrics: HealthMetrics): void;
}
