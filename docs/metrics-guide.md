# AgentX Metrics Guide

**Version:** 1.0  
**Created:** July 26, 2026  
**Status:** Active

---

## Overview

AgentX collects comprehensive metrics for monitoring system health, performance, and resource utilization using OpenTelemetry.

## Architecture

```
Application Code
    ↓
Metrics Collector (OpenTelemetry)
    ↓
Metrics Export (Prometheus/Datadog)
    ↓
Visualization (Grafana)
    ↓
Alerting (PagerDuty/Slack)
```

## Metrics Categories

### 1. Request Metrics

| Metric                          | Type      | Description                 | Labels               |
| ------------------------------- | --------- | --------------------------- | -------------------- |
| `http_requests_total`           | Counter   | Total HTTP requests         | method, path, status |
| `http_request_duration_seconds` | Histogram | Request latency             | method, path         |
| `http_requests_in_flight`       | Gauge     | Current processing requests | -                    |

### 2. Task Metrics

| Metric                   | Type      | Description               | Labels                 |
| ------------------------ | --------- | ------------------------- | ---------------------- |
| `tasks_created_total`    | Counter   | Total tasks created       | agent_role, priority   |
| `tasks_completed_total`  | Counter   | Total tasks completed     | status, agent_role     |
| `tasks_failed_total`     | Counter   | Total tasks failed        | error_type, agent_role |
| `tasks_duration_seconds` | Histogram | Task execution time       | agent_role             |
| `tasks_in_progress`      | Gauge     | Currently executing tasks | -                      |

### 3. LLM Provider Metrics

| Metric                         | Type      | Description         | Labels                        |
| ------------------------------ | --------- | ------------------- | ----------------------------- |
| `llm_requests_total`           | Counter   | Total LLM API calls | provider, model               |
| `llm_request_duration_seconds` | Histogram | LLM API latency     | provider, model               |
| `llm_tokens_total`             | Counter   | Total tokens used   | provider, type (input/output) |
| `llm_cost_usd`                 | Counter   | Total LLM cost      | provider                      |
| `llm_errors_total`             | Counter   | LLM API errors      | provider, error_type          |

### 4. Resource Metrics

| Metric                          | Type      | Description           | Labels                    |
| ------------------------------- | --------- | --------------------- | ------------------------- |
| `process_cpu_usage_percent`     | Gauge     | CPU utilization       | instance                  |
| `process_memory_usage_bytes`    | Gauge     | Memory usage          | instance, type (rss/heap) |
| `process_fds_open`              | Gauge     | Open file descriptors | instance                  |
| `nodejs_event_loop_lag_seconds` | Histogram | Event loop lag        | instance                  |

### 5. Database Metrics

| Metric                      | Type      | Description           | Labels            |
| --------------------------- | --------- | --------------------- | ----------------- |
| `db_connections_active`     | Gauge     | Active DB connections | pool              |
| `db_connections_idle`       | Gauge     | Idle DB connections   | pool              |
| `db_query_duration_seconds` | Histogram | Query latency         | operation         |
| `db_queries_total`          | Counter   | Total queries         | operation, status |

### 6. Queue Metrics

| Metric                       | Type      | Description               | Labels        |
| ---------------------------- | --------- | ------------------------- | ------------- |
| `queue_jobs_total`           | Counter   | Total jobs processed      | queue, status |
| `queue_jobs_active`          | Gauge     | Currently processing jobs | queue         |
| `queue_jobs_delayed`         | Gauge     | Delayed jobs              | queue         |
| `queue_job_duration_seconds` | Histogram | Job processing time       | queue         |

## Usage

### Basic Metrics Collection

```typescript
import { Metrics } from '@agentx/observability';

const metrics = new Metrics();

// Counter
metrics.counter('tasks_created_total', 1, {
  agent_role: 'coder',
  priority: 'high',
});

// Histogram
metrics.histogram('task_duration_seconds', durationMs / 1000, {
  agent_role: 'coder',
});

// Gauge
metrics.gauge('tasks_in_progress', currentCount);
```

### Custom Metrics

```typescript
// Define custom metric
const customCounter = metrics.createCounter('custom_metric_total', {
  description: 'Custom business metric',
  labelNames: ['type', 'status'],
});

// Use custom metric
customCounter.inc({ type: 'user_action', status: 'success' });
```

## Exporters

### Prometheus

```typescript
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

const exporter = new PrometheusExporter({
  port: 9464,
  startServer: true,
});

exporter.start();
// Metrics available at http://localhost:9464/metrics
```

### Datadog

```typescript
import { DatadogExporter } from '@opentelemetry/exporter-datadog';

const exporter = new DatadogExporter({
  apiKey: process.env.DATADOG_API_KEY,
  site: 'datadoghq.com',
});
```

## Grafana Dashboards

### Dashboard 1: System Overview

**Panels:**

- Request rate (req/s)
- Error rate (%)
- P95 latency (ms)
- Active tasks
- CPU/Memory usage

**Query Example:**

```promql
# Request rate
rate(http_requests_total[5m])

# Error rate
rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) * 100

# P95 latency
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

### Dashboard 2: Task Processing

**Panels:**

- Tasks created vs completed
- Task duration by agent role
- Task failure rate
- Queue depth
- Agent utilization

### Dashboard 3: LLM Provider Health

**Panels:**

- LLM request rate by provider
- LLM latency comparison
- Token usage trends
- Cost tracking
- Error rate by provider

## Performance Budgets

| Metric              | Budget   | Alert Threshold |
| ------------------- | -------- | --------------- |
| P95 Latency         | < 500ms  | > 750ms         |
| P99 Latency         | < 1000ms | > 1500ms        |
| Error Rate          | < 1%     | > 2%            |
| Task Duration (P95) | < 30s    | > 60s           |
| LLM Latency (P95)   | < 5s     | > 10s           |
| Memory Usage        | < 80%    | > 90%           |
| CPU Usage           | < 70%    | > 85%           |

## Alerting Rules

### High Error Rate

```yaml
- alert: HighErrorRate
  expr: |
    sum(rate(http_requests_total{status=~"5.."}[5m])) 
    / sum(rate(http_requests_total[5m])) * 100 > 2
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: 'High error rate detected'
    description: 'Error rate is {{ $value }}% (threshold: 2%)'
```

### High Latency

```yaml
- alert: HighLatency
  expr: |
    histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) 
    > 0.75
  for: 10m
  labels:
    severity: warning
  annotations:
    summary: 'High latency detected'
    description: 'P95 latency is {{ $value }}s (threshold: 750ms)'
```

### LLM Provider Down

```yaml
- alert: LLMProviderDown
  expr: |
    rate(llm_requests_total{provider="anthropic"}[5m]) == 0
  for: 2m
  labels:
    severity: critical
  annotations:
    summary: 'Anthropic provider appears down'
    description: 'No LLM requests in last 2 minutes'
```

## Best Practices

### ✅ DO

```typescript
// Use meaningful metric names
metrics.counter('user_signups_total', 1);

// Include relevant labels
metrics.counter('api_requests_total', 1, {
  method: 'POST',
  path: '/api/users',
  status: '200',
});

// Clean up unused metrics
metrics.remove('old_metric');

// Use appropriate metric types
// - Counter for cumulative counts
// - Gauge for current values
// - Histogram for distributions
```

### ❌ DON'T

```typescript
// High cardinality labels
metrics.counter('requests', 1, { userId: '12345' }); // ❌

// Unbounded histograms
metrics.histogram('duration', veryLargeNumber); // ❌

// Metrics without labels
metrics.counter('errors', 1); // ❌ (no context)
```

## Monitoring Setup

### Docker Compose

```yaml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - '9090:9090'
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:latest
    ports:
      - '3000:3000'
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana

volumes:
  grafana-data:
```

### Kubernetes

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: agentx
spec:
  selector:
    matchLabels:
      app: agentx
  endpoints:
    - port: metrics
      interval: 30s
      path: /metrics
```

## Troubleshooting

### Metrics Not Appearing

**Check:**

1. Exporter is configured and started
2. Scrape interval is appropriate
3. Labels are not too high cardinality
4. Application is exporting on correct port

### High Cardinality

**Symptoms:**

- Prometheus memory usage high
- Slow queries
- Too many time series

**Solutions:**

1. Remove unique identifiers from labels
2. Aggregate metrics at application level
3. Use recording rules in Prometheus

### Missing Labels

**Check:**

1. All metrics have required labels
2. Label values are consistent
3. No typos in label names

---

**Last Updated:** July 26, 2026  
**Owner:** Platform Team  
**Status:** Active
