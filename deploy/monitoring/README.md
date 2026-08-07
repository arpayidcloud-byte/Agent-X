# AgentX Monitoring Stack (Phase 7 — Observability)

Stack: **Prometheus** (scrape + alerting rules) → **Alertmanager** (routing) → webhook (Slack/Telegram).
Grafana (dashboard) & Loki (log aggregation) menyusul di PR terpisah.

## Komponen

| Komponen     | Image                     | Port | Fungsi                                           |
| ------------ | ------------------------- | ---- | ------------------------------------------------ |
| Prometheus   | prom/prometheus:v2.55.1   | 9090 | Scrape `agentx-api:4000/metrics`, evaluasi rules |
| Alertmanager | prom/alertmanager:v0.27.0 | 9093 | Routing alert → webhook                          |

## Deploy

```bash
kubectl apply -f deploy/monitoring/prometheus-config.yaml
kubectl apply -f deploy/monitoring/alertmanager-config.yaml
kubectl apply -f deploy/monitoring/prometheus.yaml
kubectl apply -f deploy/monitoring/alertmanager.yaml
```

Karena k3s memakai containerd (bukan docker), image perlu di-import dulu:

```bash
docker pull prom/prometheus:v2.55.1 prom/alertmanager:v0.27.0
docker save prom/prometheus:v2.55.1 prom/alertmanager:v0.27.0 | k3s ctr images import -
```

## Alert Rules (deploy/monitoring/prometheus-config.yaml)

| Rule              | Ekspresi                         | Severity |
| ----------------- | -------------------------------- | -------- |
| LLMHighErrorRate  | error rate/provider > 10% (5m)   | warning  |
| LLMHighLatency    | P95 latency > 30s (10m)          | warning  |
| LLMCostSpike      | cost naik > $5 dalam 1h          | critical |
| HTTPHigh5xxRate   | 5xx rate > 5% (5m)               | warning  |
| APIInstanceDown   | `up{job="agentx-api"} == 0` (2m) | critical |
| ProviderUnhealthy | `llm_provider_health == 0` (10m) | warning  |

## Webhook Notifikasi

Alertmanager mengirim ke `${ALERT_WEBHOOK_URL}` (env substitution). Set secret dulu:

```bash
kubectl create secret generic agentx-alerting -n agentx \
  --from-literal=ALERT_WEBHOOK_URL='https://hooks.slack.com/services/XXX/YYY/ZZZ'
```

Tanpa secret, Alertmanager tetap jalan & menampilkan alert di UI-nya (9093), hanya delivery webhook yang tidak aktif.

## Verifikasi

```bash
# Prometheus healthy + target scrape
kubectl exec -n agentx deploy/prometheus -- wget -qO- http://localhost:9090/-/healthy
kubectl exec -n agentx deploy/prometheus -- wget -qO- 'http://localhost:9090/api/v1/targets' | grep -o '"health":"[a-z]*"'
# Rules termuat
kubectl exec -n agentx deploy/prometheus -- wget -qO- 'http://localhost:9090/api/v1/rules' | grep -o '"name":"[A-Za-z0-9]*"'
# Alertmanager healthy
kubectl exec -n agentx deploy/agentx-alertmanager -- wget -qO- http://localhost:9093/-/healthy
```

## Metrik yang di-scrape (dari @agent-xai/observability)

- `llm_requests_total`, `llm_errors_total`, `llm_fallbacks_total`, `llm_cache_hits_total`
- `llm_cost_usd_total`, `llm_request_latency_seconds`, `llm_token_usage`
- `llm_active_providers`, `llm_provider_health`
- `http_requests_total` (labels: method, route, status)
