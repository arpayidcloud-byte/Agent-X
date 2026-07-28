import { describe, it, expect, beforeEach } from 'vitest';
import { Registry } from 'prom-client';
import { PrometheusExporter, createPrometheusBridge } from '../src/prometheus-exporter.js';
import { Metrics } from '../src/metrics.js';

describe('PrometheusExporter', () => {
  let exporter: PrometheusExporter;
  let registry: Registry;

  beforeEach(() => {
    registry = new Registry();
    exporter = new PrometheusExporter(registry);
  });

  it('should register default metrics', async () => {
    const metrics = await exporter.getMetrics();
    expect(metrics).toContain('nodejs_version_info');
  });

  it('should register custom metrics', async () => {
    const metrics = await exporter.getMetrics();
    expect(metrics).toContain('agentx_tasks_total');
    expect(metrics).toContain('agentx_task_duration_seconds');
    expect(metrics).toContain('agentx_agents_active');
    expect(metrics).toContain('agentx_tool_calls_total');
    expect(metrics).toContain('agentx_provider_latency_seconds');
    expect(metrics).toContain('agentx_health_status');
  });

  it('should set health status', async () => {
    exporter.setHealthStatus(true);
    let metrics = await exporter.getMetrics();
    expect(metrics).toContain('agentx_health_status 1');

    exporter.setHealthStatus(false);
    metrics = await exporter.getMetrics();
    expect(metrics).toContain('agentx_health_status 0');
  });

  it('should record task metrics', async () => {
    exporter.recordTask('completed', 1.5, 'agent-1');
    const metrics = await exporter.getMetrics();
    expect(metrics).toContain('agentx_tasks_total{status="completed",agent_id="agent-1"} 1');
    expect(metrics).toContain(
      'agentx_task_duration_seconds_bucket{le="2",status="completed",agent_id="agent-1"} 1',
    );
  });

  it('should record tool call metrics', async () => {
    exporter.recordToolCall('web_search', true);
    exporter.recordToolCall('file_read', false);
    const metrics = await exporter.getMetrics();
    expect(metrics).toContain('agentx_tool_calls_total{tool_name="web_search",status="success"} 1');
    expect(metrics).toContain('agentx_tool_calls_total{tool_name="file_read",status="error"} 1');
  });

  it('should record provider latency', async () => {
    exporter.recordProviderLatency('openai', 'gpt-4', 0.5);
    const metrics = await exporter.getMetrics();
    expect(metrics).toContain(
      'agentx_provider_latency_seconds_bucket{le="0.5",provider="openai",model="gpt-4"} 1',
    );
  });

  it('should set active agents count', async () => {
    exporter.setActiveAgents(5);
    const metrics = await exporter.getMetrics();
    expect(metrics).toContain('agentx_agents_active 5');
  });

  it('should return correct content type', () => {
    expect(exporter.getContentType()).toBe('text/plain; version=0.0.4; charset=utf-8');
  });
});

describe('createPrometheusBridge', () => {
  it('should bridge in-memory metrics to Prometheus', async () => {
    const registry = new Registry();
    const exporter = new PrometheusExporter(registry);
    const metrics = new Metrics();

    metrics.counter('tasks_total', 10);
    metrics.counter('tool_calls_total', 5);
    metrics.gauge('agents_active', 3);
    metrics.gauge('health_status', 1);
    metrics.histogram('task_duration_seconds', 0.5);
    metrics.histogram('task_duration_seconds', 1.2);
    metrics.histogram('provider_latency_seconds', 0.3);

    createPrometheusBridge(exporter, metrics);

    const promMetrics = await exporter.getMetrics();
    expect(promMetrics).toContain('agentx_tasks_total');
    expect(promMetrics).toContain('agentx_tool_calls_total');
    expect(promMetrics).toContain('agentx_agents_active 3');
    expect(promMetrics).toContain('agentx_health_status 1');
  });
});
