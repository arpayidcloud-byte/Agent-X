# AgentX Monitoring

Grafana dashboards and Prometheus configuration for monitoring the AgentX platform.

## Dashboards

| Dashboard | UID                | Description                                                       |
| --------- | ------------------ | ----------------------------------------------------------------- |
| Overview  | `agentx-overview`  | Tasks completed rate, active agents, system health, error rate    |
| Agents    | `agentx-agents`    | Tasks per agent type, execution time (p50/p95/p99), success rate  |
| Tasks     | `agentx-tasks`     | Duration histogram, status distribution, throughput, queue length |
| Providers | `agentx-providers` | Latency by model, token usage, cost tracking, error rate          |
| Health    | `agentx-health`    | Component health (DB, Redis, Providers), uptime, last check       |

## Access

Grafana is available at `http://localhost:3000` (default credentials: `admin` / `admin`).

## Directory Structure

```
grafana/
├── dashboards/
│   ├── overview.json
│   ├── agents.json
│   ├── tasks.json
│   ├── providers.json
│   └── health.json
└── provisioning/
    ├── dashboards.yml
    └── datasources.yml
```

## Expected Prometheus Metrics

The dashboards expect the following metric families:

- `agentx_tasks_completed_total` / `agentx_tasks_failed_total` — task counters
- `agentx_task_duration_seconds_bucket` — task duration histogram
- `agentx_task_status` — current task status distribution
- `agentx_task_queue_length` — pending task queue depth
- `agentx_agent_active` — active agent gauge (labelled by `agent_type`)
- `agentx_agent_tasks_total` / `agentx_agent_tasks_success_total` — per-agent counters
- `agentx_agent_execution_duration_seconds_bucket` — agent execution histogram
- `agentx_provider_latency_seconds_bucket` — LLM latency histogram (labelled by `provider`, `model`)
- `agentx_provider_tokens_total` — token usage counter
- `agentx_provider_cost_usd_total` — cost counter
- `agentx_provider_requests_total` / `agentx_provider_errors_total` — provider request counters
- `agentx_component_health_status` — component health gauge (labelled by `component`)
- `agentx_system_start_time_seconds` — system start timestamp
- `agentx_health_last_check_timestamp` — last health check Unix timestamp
- `agentx_health_check_duration_seconds` — health check duration

## Docker Compose

Grafana is included in the project `docker-compose.yml` and auto-provisions the Prometheus datasource and all dashboards on startup.
