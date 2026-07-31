# AgentX Monitoring

Grafana dashboards, Prometheus scrape config, alert rules and Alertmanager
configuration for monitoring the Agent-X platform.

## Dashboards

| Dashboard    | UID                | Description                                                                                                                                                                |
| ------------ | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LLM Overview | `agentx-llm`       | **Live metrics from the API server** — request rate, latency p95/p50, error rate, token usage, provider health, fallbacks, cache hits, HTTP rate/5xx, process memory & CPU |
| Overview     | `agentx-overview`  | Tasks completed rate, active agents, system health, error rate                                                                                                             |
| Agents       | `agentx-agents`    | Tasks per agent type, execution time (p50/p95/p99), success rate                                                                                                           |
| Tasks        | `agentx-tasks`     | Duration histogram, status distribution, throughput, queue length                                                                                                          |
| Providers    | `agentx-providers` | Latency by model, token usage, cost tracking, error rate                                                                                                                   |
| Health       | `agentx-health`    | Component health (DB, Redis, Providers), uptime, last check                                                                                                                |

> **Note:** `agentx-llm` targets metrics that the Agent-X API server actually
> exposes today (`llm_*`, `http_requests_total`, `process_*`, `nodejs_*`).
> The other dashboards target `agentx_*` families that are not emitted by the
> current server yet — they will populate once those metrics are wired up.

## Quick Start (Docker)

```bash
# From the repo root — starts Prometheus (:9090), Alertmanager (:9093), Grafana (:3000)
docker compose -f docker-compose.monitoring.yml up -d
```

The API server must be reachable as `agentx-api:4000` for Prometheus scraping:

```bash
# Option A: run the API in the same Docker network
docker network connect agentx-monitoring <api-container>

# Option B: run the API locally and alias the hostname
#   echo '127.0.0.1 agentx-api' >> /etc/hosts
node apps/api/dist/agentx-server.js
```

Verify scraping at `http://localhost:9090/targets` (job `agentx-api` should be UP)
and alerts at `http://localhost:9090/alerts`.

## Access

- Grafana: `http://localhost:3000` (default `admin` / `admin`, override with `GRAFANA_ADMIN_USER` / `GRAFANA_ADMIN_PASSWORD`)
- Prometheus: `http://localhost:9090`
- Alertmanager: `http://localhost:9093`
- Alert webhook target: `ALERTMANAGER_WEBHOOK_URL` env var (defaults to a local placeholder)

## Alert Rules

Defined in `prometheus/alerting-rules.yml`, evaluated every 15s:

| Alert                  | Condition                               | Severity |
| ---------------------- | --------------------------------------- | -------- |
| `AgentXApiDown`        | `up{job="agentx-api"} == 0` for 1m      | critical |
| `LLMProviderUnhealthy` | `llm_provider_health == 0` for 2m       | critical |
| `LLMErrorRateHigh`     | error rate > 5% over 5m (per provider)  | warning  |
| `LLMLatencyP95High`    | p95 latency > 1s over 5m (per provider) | warning  |
| `LLMFallbackRateHigh`  | fallback rate > 0.1/s over 5m           | warning  |
| `Http5xxRateHigh`      | HTTP 5xx rate > 5% over 5m (per route)  | warning  |

## Metrics Exposed by the API Server (`GET /metrics`)

| Family                        | Type      | Description                                  |
| ----------------------------- | --------- | -------------------------------------------- |
| `llm_requests_total`          | counter   | LLM requests by provider/model/status        |
| `llm_errors_total`            | counter   | LLM errors by provider/model/error_type      |
| `llm_fallbacks_total`         | counter   | fallbacks by from/to provider                |
| `llm_cache_hits_total`        | counter   | cache hits                                   |
| `llm_request_latency_seconds` | histogram | latency buckets (p50/p95 computable)         |
| `llm_token_usage`             | histogram | tokens per request (input/output)            |
| `llm_active_providers`        | gauge     | number of registered providers               |
| `llm_provider_health`         | gauge     | 1 = healthy, 0 = unhealthy (per provider)    |
| `http_requests_total`         | counter   | HTTP requests by method/route/status         |
| `process_*` / `nodejs_*`      | various   | resource utilization (CPU, memory, GC, etc.) |

## Directory Structure

```
monitoring/
├── prometheus/
│   ├── prometheus.yml          # scrape config + rule/alertmanager wiring
│   └── alerting-rules.yml      # Prometheus alert rules
├── alertmanager/
│   └── alertmanager.yml        # routing + receivers (webhook/slack/email)
└── grafana/
    ├── dashboards/             # dashboard JSONs (auto-provisioned)
    │   ├── agentx-llm.json     # live LLM/HTTP/process metrics
    │   ├── overview.json
    │   ├── agents.json
    │   ├── tasks.json
    │   ├── providers.json
    │   └── health.json
    └── provisioning/
        ├── dashboards.yml
        └── datasources.yml     # Prometheus datasource (uid: prometheus)
```
