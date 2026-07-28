# Incident Response Runbook

## Severity Levels

| Severity      | Response Time | Examples                              |
| ------------- | ------------- | ------------------------------------- |
| P0 - Critical | 5 min         | Service down, data loss               |
| P1 - High     | 15 min        | High error rate, degraded performance |
| P2 - Medium   | 1 hour        | Non-critical bugs                     |
| P3 - Low      | 24 hours      | Feature requests                      |

## Response Process

### 1. Detect

- Monitor dashboards
- Check alerts (PagerDuty/Slack)
- Review error rates

### 2. Triage

- Assess severity
- Identify affected users
- Assign incident commander

### 3. Diagnose

- Check recent deployments
- Review logs
- Check dependencies

### 4. Mitigate

- Rollback if needed
- Scale resources
- Enable feature flags

### 5. Resolve

- Deploy fix
- Verify resolution
- Monitor for recurrence

### 6. Post-Mortem

- Document timeline
- Identify root cause
- Create action items
- Share learnings

## Communication Templates

**Initial:** "We're investigating reports of [issue]. Updates in 15 min."

**Update:** "Root cause identified: [cause]. Fix in progress. ETA: [time]."

**Resolved:** "Issue resolved at [time]. Post-mortem to follow."
