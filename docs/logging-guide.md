# AgentX Logging Guide

**Version:** 1.0  
**Created:** July 26, 2026  
**Status:** Active

---

## Overview

AgentX uses **structured JSON logging** with automatic correlation ID propagation, secret redaction, and multi-level log filtering.

## Architecture

```
Application Code
    ↓
Logger (structured JSON)
    ↓
Correlation ID Injection
    ↓
Secret Redaction
    ↓
stdout/stderr
    ↓
Log Aggregator (ELK/Datadog/Splunk)
```

## Features

### ✅ Structured Logging

All logs are JSON formatted for easy parsing:

```json
{
  "timestamp": "2026-07-26T16:30:00.000Z",
  "level": "INFO",
  "context": "task-scheduler",
  "message": "Task enqueued successfully",
  "traceId": "abc123",
  "spanId": "def456",
  "taskId": "task-789"
}
```

### ✅ Correlation IDs

Automatic trace ID propagation across services:

```typescript
import { Logger } from '@agentx/observability';

const logger = new Logger('my-service');

// Trace ID automatically injected from context
logger.info('Processing request', { requestId: 'req-123' });
```

### ✅ Secret Redaction

Automatic redaction of sensitive data:

```typescript
// Before redaction
logger.error('Auth failed', { password: 'secret123', apiKey: 'sk-abc' });

// After redaction (in logs)
{
  "password": "[REDACTED]",
  "apiKey": "[REDACTED]"
}
```

### ✅ Log Levels

| Level   | Usage                               | Example                  |
| ------- | ----------------------------------- | ------------------------ |
| `TRACE` | Fine-grained debugging              | Function entry/exit      |
| `DEBUG` | Development debugging               | Variable values          |
| `INFO`  | Normal operations                   | Task completed           |
| `WARN`  | Potential issues                    | High latency detected    |
| `ERROR` | Errors that don't stop execution    | API call failed          |
| `FATAL` | Critical errors that stop execution | Database connection lost |

---

## Usage

### Basic Logging

```typescript
import { Logger } from '@agentx/observability';

const logger = new Logger('my-module');

// Info log
logger.info('User logged in', { userId: 'user-123' });

// Error log with error object
logger.error('Database connection failed', dbError, {
  database: 'users',
  retryCount: 3,
});

// Debug log (filtered in production)
logger.debug('Request payload', { payload: requestData });

// Warning log
logger.warn('High memory usage', { memoryUsage: '85%' });
```

### Child Loggers

Create child loggers with inherited context:

```typescript
const parentLogger = new Logger('api-server');

// Child logger inherit parent context
const requestLogger = parentLogger.child({
  requestId: 'req-456',
  userId: 'user-789',
});

// All logs from requestLogger include requestId and userId
requestLogger.info('Processing request');
// → { ..., "requestId": "req-456", "userId": "user-789" }
```

### Context Propagation

Trace IDs are automatically propagated:

```typescript
import { TraceContext } from '@agentx/shared';

// Set trace context at request boundary
TraceContext.set({
  traceId: 'trace-abc',
  spanId: 'span-def',
  sessionId: 'session-ghi',
});

// All logs automatically include trace context
logger.info('Processing');
// → { "traceId": "trace-abc", "spanId": "span-def", ... }
```

---

## Configuration

### Environment Variables

| Variable            | Default                         | Description                             |
| ------------------- | ------------------------------- | --------------------------------------- |
| `LOG_LEVEL`         | `INFO`                          | Minimum log level to output             |
| `LOG_FORMAT`        | `json`                          | Log format (`json` or `text`)           |
| `LOG_SAMPLING_RATE` | `1.0`                           | Sampling rate for DEBUG/TRACE (0.0-1.0) |
| `LOG_REDACT_KEYS`   | `password,secret,api_key,token` | Comma-separated keys to redact          |

### Example Configuration

```typescript
import { Logger } from '@agentx/observability';

const logger = new Logger('my-service', {
  traceId: 'custom-trace-id',
  environment: 'production',
  version: '1.0.0',
});
```

---

## Log Aggregation

### ELK Stack (Elasticsearch, Logstash, Kibana)

**Filebeat Configuration:**

```yaml
filebeat.inputs:
  - type: container
    paths:
      - /var/lib/docker/containers/*/*.log
    processors:
      - add_kubernetes_metadata:
          host: ${NODE_NAME}
          matchers:
            - logs_path:
                logs_path: '/var/lib/docker/containers/'

output.logstash:
  hosts: ['logstash:5044']
```

**Logstash Pipeline:**

```conf
input {
  beats {
    port => 5044
  }
}

filter {
  json {
    source => "message"
  }

  date {
    match => ["timestamp", "ISO8601"]
    target => "@timestamp"
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "agentx-logs-%{+YYYY.MM.dd}"
  }
}
```

### Datadog

**docker-compose.yml:**

```yaml
services:
  datadog:
    image: datadog/agent:latest
    environment:
      - DD_API_KEY=${DATADOG_API_KEY}
      - DD_LOGS_ENABLED=true
      - DD_LOGS_CONFIG_CONTAINER_COLLECT_ALL=true
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
```

### Splunk

**splunk.yml:**

```yaml
version: '3'
services:
  splunk:
    image: splunk/splunk:latest
    environment:
      - SPLUNK_START_ARGS=--accept-license
      - SPLUNK_PASSWORD=${SPLUNK_PASSWORD}
    ports:
      - '8000:8000'
      - '8088:8088'
```

---

## Log Retention Policy

### Production

| Log Level    | Retention | Storage                   |
| ------------ | --------- | ------------------------- |
| ERROR, FATAL | 90 days   | Hot storage (fast query)  |
| WARN         | 30 days   | Warm storage              |
| INFO         | 14 days   | Warm storage              |
| DEBUG, TRACE | 24 hours  | Not stored (sampled only) |

### Development

| Log Level  | Retention |
| ---------- | --------- |
| All levels | 7 days    |

### Implementation

**Elasticsearch ILM Policy:**

```json
{
  "policy": {
    "phases": {
      "hot": {
        "min_age": "0ms",
        "actions": {
          "rollover": {
            "max_size": "50gb",
            "max_age": "7d"
          }
        }
      },
      "warm": {
        "min_age": "7d",
        "actions": {
          "shrink": {
            "number_of_shards": 1
          }
        }
      },
      "delete": {
        "min_age": "30d",
        "actions": {
          "delete": {}
        }
      }
    }
  }
}
```

---

## Best Practices

### ✅ DO

```typescript
// Use appropriate log levels
logger.info('User action', { action: 'login' });
logger.warn('Degraded performance', { latency: '2s' });
logger.error('External service failed', error, { service: 'stripe' });

// Include contextual metadata
logger.info('Payment processed', {
  userId: 'user-123',
  amount: 99.99,
  currency: 'USD',
  transactionId: 'txn-456',
});

// Use child loggers for request-scoped logging
const requestLogger = logger.child({ requestId });
requestLogger.info('Request started');
```

### ❌ DON'T

```typescript
// Don't log sensitive data
logger.error('Auth failed', { password: 'secret' }); // ❌

// Don't use console.log directly
console.log('Debug info'); // ❌

// Don't log without context
logger.info('Failed'); // ❌ (what failed?)

// Don't over-log in loops
for (const item of items) {
  logger.debug('Processing', { item }); // ❌ (spam)
}
```

---

## Troubleshooting

### Logs Not Appearing

**Check:**

1. Log level configuration: `LOG_LEVEL=DEBUG`
2. Sampling rate: `LOG_SAMPLING_RATE=1.0`
3. Output destination: stdout/stderr

### Too Many Logs

**Solutions:**

1. Increase log level: `LOG_LEVEL=WARN`
2. Reduce sampling rate: `LOG_SAMPLING_RATE=0.1`
3. Filter by context in aggregator

### Missing Correlation IDs

**Check:**

1. TraceContext is set: `TraceContext.set({...})`
2. Logger is created after context
3. Child loggers inherit context

---

## Monitoring & Alerts

### Key Metrics

- **Log Volume:** Logs per minute by level
- **Error Rate:** Errors / Total logs
- **Log Latency:** Time from log to queryable

### Alert Rules

```yaml
# High error rate
- alert: HighErrorRate
  expr: rate(logs_total{level="ERROR"}[5m]) > 0.05
  for: 5m
  annotations:
    summary: 'High error rate detected'

# Log volume spike
- alert: LogVolumeSpike
  expr: rate(logs_total[5m]) > 10000
  for: 5m
  annotations:
    summary: 'Unusual log volume'
```

---

## Related Documentation

- [Observability Architecture](../ARCHITECTURE.md#observability)
- [Tracing Guide](./tracing.md)
- [Metrics Guide](./metrics.md)
- [Alerting Guide](./alerting.md)

---

**Last Updated:** July 26, 2026  
**Owner:** Platform Team  
**Status:** Active
