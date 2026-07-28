import { Registry, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';
import type { IMetrics } from './metrics.js';

export class PrometheusExporter {
  readonly registry: Registry;

  readonly tasksTotal: Counter;
  readonly taskDurationSeconds: Histogram;
  readonly agentsActive: Gauge;
  readonly toolCallsTotal: Counter;
  readonly providerLatencySeconds: Histogram;
  readonly healthStatus: Gauge;

  constructor(registry?: Registry) {
    this.registry = registry || new Registry();

    collectDefaultMetrics({ register: this.registry });

    this.tasksTotal = new Counter({
      name: 'agentx_tasks_total',
      help: 'Total number of tasks processed',
      labelNames: ['status', 'agent_id'],
      registers: [this.registry],
    });

    this.taskDurationSeconds = new Histogram({
      name: 'agentx_task_duration_seconds',
      help: 'Task execution duration in seconds',
      labelNames: ['agent_id', 'status'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10, 30, 60],
      registers: [this.registry],
    });

    this.agentsActive = new Gauge({
      name: 'agentx_agents_active',
      help: 'Number of currently active agents',
      registers: [this.registry],
    });

    this.toolCallsTotal = new Counter({
      name: 'agentx_tool_calls_total',
      help: 'Total number of tool calls',
      labelNames: ['tool_name', 'status'],
      registers: [this.registry],
    });

    this.providerLatencySeconds = new Histogram({
      name: 'agentx_provider_latency_seconds',
      help: 'LLM provider response latency in seconds',
      labelNames: ['provider', 'model'],
      buckets: [0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
      registers: [this.registry],
    });

    this.healthStatus = new Gauge({
      name: 'agentx_health_status',
      help: 'Service health status (0=down, 1=up)',
      registers: [this.registry],
    });
  }

  setHealthStatus(up: boolean): void {
    this.healthStatus.set(up ? 1 : 0);
  }

  recordTask(status: string, durationSeconds: number, agentId?: string): void {
    const labels = { status, agent_id: agentId || 'unknown' };
    this.tasksTotal.inc(labels);
    this.taskDurationSeconds.observe(
      { ...labels, agent_id: agentId || 'unknown' },
      durationSeconds,
    );
  }

  recordToolCall(toolName: string, success: boolean): void {
    this.toolCallsTotal.inc({ tool_name: toolName, status: success ? 'success' : 'error' });
  }

  recordProviderLatency(provider: string, model: string, seconds: number): void {
    this.providerLatencySeconds.observe({ provider, model }, seconds);
  }

  setActiveAgents(count: number): void {
    this.agentsActive.set(count);
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  getContentType(): string {
    return this.registry.contentType;
  }
}

interface MetricsWithMaps extends IMetrics {
  counters?: Map<string, number>;
  gauges?: Map<string, number>;
  histograms?: Map<string, number[]>;
}

export function createPrometheusBridge(exporter: PrometheusExporter, metrics: IMetrics): void {
  const original = metrics as MetricsWithMaps;
  if (original.counters) {
    for (const [key, value] of original.counters) {
      const name = key.split('{')[0];
      if (name === 'tasks_total') {
        exporter.tasksTotal.inc(value);
      } else if (name === 'tool_calls_total') {
        exporter.toolCallsTotal.inc(value);
      }
    }
  }
  if (original.gauges) {
    for (const [key, value] of original.gauges) {
      const name = key.split('{')[0];
      if (name === 'agents_active') {
        exporter.agentsActive.set(value);
      } else if (name === 'health_status') {
        exporter.healthStatus.set(value);
      }
    }
  }
  if (original.histograms) {
    for (const [key, values] of original.histograms) {
      const name = key.split('{')[0];
      for (const v of values) {
        if (name === 'task_duration_seconds') {
          exporter.taskDurationSeconds.observe(v);
        } else if (name === 'provider_latency_seconds') {
          exporter.providerLatencySeconds.observe(v);
        }
      }
    }
  }
}
