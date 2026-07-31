# Agent-X API Reference

**Version:** 1.0.0
**Base URL:** `http://localhost:4000` (override with `PORT`)

The API server is `@agent-xai/api` (`apps/api`). It exposes three endpoints:
health check, Prometheus metrics, and the LLM run endpoint wired to the
provider-agnostic router.

---

## GET /health

Health report of the API server and all registered LLM providers.

**Response `200`:**

```json
{
  "status": "healthy",
  "uptime": 12345,
  "providers": [
    { "name": "openai", "status": "healthy", "lastChecked": "2026-07-31T17:00:00.000Z" },
    { "name": "deepseek", "status": "healthy", "lastChecked": "2026-07-31T17:00:00.000Z" },
    { "name": "anthropic", "status": "healthy", "lastChecked": "2026-07-31T17:00:00.000Z" }
  ],
  "timestamp": "2026-07-31T17:00:00.000Z"
}
```

`status` is `"healthy"` when all providers are healthy, `"degraded"` when at least
one provider is degraded, `"unhealthy"` otherwise. Provider statuses:
`healthy` | `degraded` | `unhealthy`.

---

## GET /metrics

Prometheus text-format metrics, scraped by Prometheus (`scrape_configs` targets
`agentx-api:3000/metrics`). Exposes:

- `llm_requests_total{provider,model,status}` — LLM request counter
- `llm_errors_total{provider,error_type}` — error counter
- `llm_fallbacks_total{from,to}` — auto-fallback counter
- `llm_request_latency_seconds{provider}` — latency histogram
- `llm_tokens_total{provider}` — token usage
- `llm_provider_health{provider}` — 1 = healthy, 0 = unhealthy
- `http_requests_total{method,route,status}` — HTTP request counter
- Node.js runtime metrics (`nodejs_*`, `process_*`) via `collectDefaultMetrics`

---

## POST /v1/agentx/run

Execute a prompt through the provider-agnostic LLM router. The router selects a
provider by request type and falls back automatically on failure.

**Request body (JSON):**

```json
{
  "prompt": "Explain REST APIs", // required, string
  "taskId": "api-123", // optional, default `api-<timestamp>`
  "description": "short description", // optional, default = first 120 chars of prompt
  "complexity": "simple", // optional, default "medium"
  "type": "reasoning", // optional, default "reasoning"
  "budget": "medium" // optional, default "medium"
}
```

`type` influences provider selection — e.g. `"code"` routes to Anthropic
(Claude) by default.

**Response `200`:**

```json
{
  "provider": "openai",
  "model": "gpt-4o-mini",
  "message": "[MOCK] ..."
}
```

**Errors:**

- `400` — `{"error": "Missing required field: prompt (string)"}` when `prompt` is absent
- `500` — `{"error": "<message>"}` when router execution fails (e.g. no providers configured)

---

## Example

```bash
# Health
curl http://localhost:4000/health

# Metrics
curl http://localhost:4000/metrics

# Run an LLM request (dev mode: ENABLE_MOCK_PROVIDER=true)
curl -X POST http://localhost:4000/v1/agentx/run \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"Explain REST APIs","type":"reasoning","budget":"medium"}'
```

---

## Environment Variables

See [`.env.example`](../.env.example) — key variables:

| Variable                                                                                  | Purpose                                          |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `PORT`                                                                                    | Server port (default `4000`)                     |
| `ENABLE_MOCK_PROVIDER`                                                                    | `"true"` = register mock providers (no API keys) |
| `LLM_PROVIDER_DEFAULT` / `_FALLBACK` / `_BACKUP`                                          | Provider chain                                   |
| `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `DEEPSEEK_API_KEY`, `QWEN_API_KEY`, `GROQ_API_KEY` | Real provider keys                               |
| `OPENAI_COMPATIBLE_ENDPOINT`                                                              | Any OpenAI-compatible endpoint                   |
