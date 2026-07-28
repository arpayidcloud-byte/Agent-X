# AgentX Alerting Guide

**Version:** 1.0  
**Created:** July 26, 2026  
**Status:** Active

---

## Overview

AgentX implements comprehensive alerting for production incidents using PagerDuty, Slack, and Email notifications.

## Architecture

```
Metrics/Logs (Prometheus/Grafana)
    ↓
Alert Rules Evaluated
    ↓
Alertmanager
    ↓
Routing (severity-based)
    ↓
┌─────────────┬─────────────┬─────────────┐
│  PagerDuty  │    Slack    │    Email    │
│ (Critical)  │ (Warning)   │  (Info)     │
└─────────────┴─────────────┴─────────────┘
```

## Alert Channels

### 1. PagerDuty (Critical Alerts)

**Use Cases:**

- Service down
- High error rate (> 5%)
- Data loss detected
- Security breach
- P99 latency > 2s

**Configuration:**

```yaml
# alertmanager.yml
receivers:
  - name: pagerduty-critical
    pagerduty_configs:
      - service_key: <PAGERDUTY_SERVICE_KEY>
        severity: critical
        description: '{{ .CommonAnnotations.summary }}'
```

**On-Call Rotation:**

- Primary: Platform Team
- Secondary: Engineering Lead
- Escalation: CTO (after 30 min unacknowledged)

### 2. Slack (Warning Alerts)

**Use Cases:**

- Performance degradation
- Resource utilization high
- Non-critical errors
- Deployment notifications

**Configuration:**

```yaml
receivers:
  - name: slack-warnings
    slack_configs:
      - api_url: <SLACK_WEBHOOK_URL>
        channel: '#alerts-production'
        title: '{{ .Status | toUpper }}: {{ .CommonAnnotations.summary }}'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'
```

### 3. Email (Info & Digest)

**Use Cases:**

- Daily/weekly digests
- Low-priority notifications
- Compliance alerts
- Audit notifications

**Configuration:**

```yaml
receivers:
  - name: email-info
    email_configs:
      - to: platform-team@company.com
        from: alerts@agentx.io
        smarthost: smtp.company.com:587
        auth_username: alerts@agentx.io
        auth_password: <SMTP_PASSWORD>
```

## Alert Rules

### Critical Alerts (P0)

#### Service Down

```yaml
- alert: ServiceDown
  expr: up{job="agentx-api"} == 0
  for: 2m
  labels:
    severity: critical
    team: platform
    page: 'true'
  annotations:
    summary: 'AgentX API service is down'
    description: 'Instance {{ $labels.instance }} has been down for more than 2 minutes'
    runbook_url: 'https://runbooks.agentx.io/service-down'
```

#### High Error Rate

```yaml
- alert: HighErrorRate
  expr: |
    (
      sum(rate(http_requests_total{status=~"5.."}[5m]))
      / sum(rate(http_requests_total[5m]))
    ) * 100 > 5
  for: 5m
  labels:
    severity: critical
    team: platform
    page: 'true'
  annotations:
    summary: 'High error rate detected'
    description: 'Error rate is {{ $value }}% (threshold: 5%)'
    runbook_url: 'https://runbooks.agentx.io/high-error-rate'
```

#### Database Connection Pool Exhausted

```yaml
- alert: DatabasePoolExhausted
  expr: db_connections_active / db_connections_max > 0.9
  for: 5m
  labels:
    severity: critical
    team: platform
    page: 'true'
  annotations:
    summary: 'Database connection pool nearly exhausted'
    description: '{{ $value | humanizePercentage }} of connections in use'
    runbook_url: 'https://runbooks.agentx.io/db-pool-exhausted'
```

### Warning Alerts (P1)

#### High Latency

```yaml
- alert: HighLatency
  expr: |
    histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) 
    > 0.5
  for: 10m
  labels:
    severity: warning
    team: platform
    page: 'false'
  annotations:
    summary: 'High latency detected'
    description: 'P95 latency is {{ $value }}s (threshold: 500ms)'
    runbook_url: 'https://runbooks.agentx.io/high-latency'
```

#### High Memory Usage

```yaml
- alert: HighMemoryUsage
  expr: |
    (process_memory_usage_bytes / memory_limit_bytes) * 100 > 80
  for: 15m
  labels:
    severity: warning
    team: platform
    page: 'false'
  annotations:
    summary: 'High memory usage'
    description: 'Memory usage is {{ $value }}% (threshold: 80%)'
    runbook_url: 'https://runbooks.agentx.io/high-memory'
```

#### LLM Provider Degraded

```yaml
- alert: LLMProviderDegraded
  expr: |
    rate(llm_requests_total{provider="anthropic"}[5m]) 
    < 0.5 * avg_over_time(rate(llm_requests_total{provider="anthropic"}[5m])[1h:5m])
  for: 10m
  labels:
    severity: warning
    team: platform
    page: 'false'
  annotations:
    summary: 'Anthropic provider traffic degraded'
    description: 'Request rate dropped by more than 50%'
    runbook_url: 'https://runbooks.agentx.io/llm-degraded'
```

### Info Alerts (P2)

#### Deployment Notification

```yaml
- alert: DeploymentCompleted
  expr: deployment_created_total > 0
  for: 1m
  labels:
    severity: info
    team: platform
    page: 'false'
  annotations:
    summary: 'Deployment completed'
    description: 'Version {{ $labels.version }} deployed successfully'
```

#### Daily Digest

```yaml
# Configured in alertmanager as grouping + summary
group_wait: 24h
group_by: [severity]
```

## Alert Routing

### Routing Rules

```yaml
route:
  receiver: slack-warnings
  group_by: ['alertname', 'severity']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h

  routes:
    - match:
        severity: critical
      receiver: pagerduty-critical
      continue: true

    - match:
        severity: warning
      receiver: slack-warnings

    - match:
        severity: info
      receiver: email-info
      group_wait: 1h
      repeat_interval: 24h
```

### Inhibition Rules

```yaml
inhibit_rules:
  # If service is down, don't alert on high latency
  - source_match:
      alertname: ServiceDown
    target_match:
      alertname: HighLatency
    equal: ['instance']

  # If cluster is down, don't alert on node issues
  - source_match:
      alertname: ClusterDown
    target_match_re:
      alertname: 'Node.*'
    equal: ['cluster']
```

## On-Call Rotation

### Schedule

| Week   | Primary | Secondary | Escalation |
| ------ | ------- | --------- | ---------- |
| Week 1 | Alice   | Bob       | Charlie    |
| Week 2 | Bob     | Charlie   | Alice      |
| Week 3 | Charlie | Alice     | Bob        |

### Escalation Policy

```
Level 1: Primary on-call (0-15 min)
Level 2: Secondary on-call (15-30 min)
Level 3: Engineering Lead (30-60 min)
Level 4: CTO (60+ min)
```

### Handoff Process

1. **Shift Change:** 9 AM UTC daily
2. **Handoff Call:** 15 min sync
3. **Status Review:** Open incidents, recent alerts
4. **Documentation:** Update on-call log

## Runbooks

### Alert Response Template

```markdown
# Alert: [Alert Name]

## Summary

[Brief description]

## Impact

[What users are affected]

## Diagnosis Steps

1. Check [dashboard link]
2. Review recent deployments
3. Check [related service]

## Mitigation Steps

1. [Immediate action 1]
2. [Immediate action 2]

## Resolution

[Long-term fix]

## Prevention

[How to prevent recurrence]
```

### Example Runbook: High Error Rate

````markdown
# Runbook: High Error Rate

## Summary

Error rate > 5% for 5+ minutes

## Impact

Users experiencing failures in API requests

## Diagnosis

1. **Check Error Dashboard**
   - Navigate to Grafana → Error Analysis
   - Filter by status code (5xx)
   - Identify affected endpoints

2. **Review Recent Changes**
   - Check deployment history
   - Review recent commits
   - Check config changes

3. **Check Dependencies**
   - Database connectivity
   - LLM provider status
   - External service health

## Mitigation

1. **If recent deployment:**
   ```bash
   # Rollback immediately
   kubectl rollout undo deployment/agentx-api
   ```
````

2. **If database issue:**

   ```bash
   # Check connection pool
   kubectl exec -it agentx-api -- psql -c "SELECT count(*) FROM pg_stat_activity;"

   # Restart if needed
   kubectl rollout restart deployment/agentx-db
   ```

3. **If LLM provider:**
   - Switch to fallback provider
   - Enable request queuing

## Resolution

- Fix root cause
- Deploy fix with canary
- Monitor error rate

## Prevention

- Add additional test coverage
- Improve monitoring
- Update runbook with learnings

````

## Testing Alerts

### Alert Testing Procedure

1. **Create Test Alert**
   ```bash
   # Manually trigger alert
   curl -X POST http://alertmanager:9093/api/v1/alerts \
     -H "Content-Type: application/json" \
     -d '[{
       "labels": {
         "alertname": "TestAlert",
         "severity": "warning"
       },
       "annotations": {
         "summary": "Test alert"
       }
     }]'
````

2. **Verify Notification**
   - Check Slack channel
   - Check PagerDuty (if critical)
   - Check email inbox

3. **Clear Test Alert**
   ```bash
   curl -X DELETE http://alertmanager:9093/api/v1/alerts
   ```

### Chaos Engineering

Regular chaos testing to validate alerting:

- **Game Days:** Monthly
- **Scenarios:** Service failure, network partition, resource exhaustion
- **Metrics:** MTTD (Mean Time to Detect), MTTR (Mean Time to Respond)

## Metrics & KPIs

### Alerting Metrics

| Metric                      | Target   | Current |
| --------------------------- | -------- | ------- |
| MTTD (Mean Time to Detect)  | < 5 min  | -       |
| MTTR (Mean Time to Respond) | < 15 min | -       |
| Alert Accuracy              | > 95%    | -       |
| False Positive Rate         | < 5%     | -       |

### Review Cadence

- **Daily:** On-call handoff review
- **Weekly:** Alert volume review
- **Monthly:** Alert tuning & optimization
- **Quarterly:** Full alerting system audit

## Best Practices

### ✅ DO

- Set meaningful thresholds based on SLOs
- Include runbook URLs in alerts
- Test alerts regularly
- Rotate on-call fairly
- Document all incidents
- Tune alerts to reduce noise

### ❌ DON'T

- Alert on symptoms, not causes
- Set thresholds too sensitive (alert fatigue)
- Page for non-urgent issues
- Forget to test after changes
- Ignore false positives

---

**Last Updated:** July 26, 2026  
**Owner:** Platform Team  
**Status:** Active
