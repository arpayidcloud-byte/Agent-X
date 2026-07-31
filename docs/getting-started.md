# Getting Started with Agent-X

Onboarding guide — from zero to a running Agent-X platform in ~5 minutes.

## Prerequisites

- **Node.js >= 20** (`node --version`)
- **pnpm >= 9** (`pnpm --version`) — install with `npm install -g pnpm`
- Git

> No API keys are required to get started. The platform ships with **mock providers**
> (`ENABLE_MOCK_PROVIDER=true`) so you can run and explore everything locally for free.
> Real LLM providers (OpenAI, Anthropic, DeepSeek, Qwen, Groq, OpenRouter) are optional
> and can be added later — see [Configuration](#configuration).

---

## Option A — 5 Minute Quick Start (from source)

> Note: the `@agent-xai/*` packages are not yet published to npm, so installation is
> from source. The legacy published CLI (`@agentx-fast/cli`) is out of date and not
> recommended — use the source build below.

```bash
# 1. Clone
git clone https://github.com/arpayidcloud-byte/Agent-X.git
cd Agent-X

# 2. Install dependencies
pnpm install

# 3. Build all packages
pnpm build

# 4. Run the API server with mock providers (no API keys needed)
ENABLE_MOCK_PROVIDER=true pnpm --filter @agent-xai/api dev
# or from compiled output:
#   ENABLE_MOCK_PROVIDER=true PORT=4000 node apps/api/dist/agentx-server.js
```

The API server starts at `http://localhost:4000` (override with `PORT`).

### Verify it works

```bash
# Health check — 3 mock providers should report healthy
curl http://localhost:4000/health

# Prometheus metrics (counters, histograms, default Node.js metrics)
curl http://localhost:4000/metrics

# Run an LLM request through the router (mock provider answers instantly)
curl -X POST http://localhost:4000/v1/agentx/run \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"Explain REST APIs","type":"reasoning","budget":"medium"}'
```

Expected: `{"provider":"openai","model":"gpt-4o-mini","message":"[MOCK] ..."}` — a real
response routed through the provider-agnostic LLM router.

### Try the CLI (in a second terminal)

```bash
# Demo: full pipeline CLI → Runtime → Agent → LLM → Response
pnpm demo "Build a REST API with Node.js"

# Or run the CLI directly
pnpm agentx --help
pnpm agentx status
pnpm agentx tui          # interactive Terminal UI
```

---

## Option B — Docker Compose (all services)

If you have Docker, the whole platform (API + monitoring stack) runs with one command:

```bash
docker compose -f docker-compose.monitoring.yml up -d
# Prometheus :9090 · Alertmanager :9093 · Grafana :3000 (admin/admin)
```

---

## Configuration

Copy the example environment file and adjust what you need:

```bash
cp .env.example .env
```

| Variable                                           | Purpose                                                          | Default                        |
| -------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------ |
| `ENABLE_MOCK_PROVIDER`                             | `"true"` registers mock providers (no API keys, instant answers) | `"false"`                      |
| `LLM_PROVIDER_DEFAULT`                             | Primary provider in the fallback chain                           | `openai_compatible`            |
| `LLM_PROVIDER_FALLBACK` / `LLM_PROVIDER_BACKUP`    | Auto-fallback providers on failure                               | `deepseek` / `qwen`            |
| `OPENAI_API_KEY`                                   | OpenAI key (used via `openai_compatible` default endpoint)       | —                              |
| `ANTHROPIC_API_KEY`                                | Anthropic key (used automatically for `type: "code"` requests)   | —                              |
| `DEEPSEEK_API_KEY`, `QWEN_API_KEY`, `GROQ_API_KEY` | Alternative providers                                            | —                              |
| `OPENAI_COMPATIBLE_ENDPOINT`                       | Any OpenAI-compatible endpoint (OpenRouter, Gemini, local vLLM…) | `https://api.openrouter.ai/v1` |
| `PORT`                                             | API server port                                                  | `4000`                         |
| `PROMETHEUS_PORT`                                  | Metrics port                                                     | `9090`                         |

### Going live with real providers

1. Set `ENABLE_MOCK_PROVIDER=false` (or unset it)
2. Add at least one real key, e.g. `OPENAI_API_KEY=sk-...` or `DEEPSEEK_API_KEY=...`
3. Restart the API server
4. Verify: `curl http://localhost:4000/health` shows your real provider as `healthy`

The router auto-falls back through the chain
(`openai_compatible → deepseek → qwen`) when a provider fails, so a single key is
enough to start.

---

## Next Steps

| Topic               | Where                                                                     |
| ------------------- | ------------------------------------------------------------------------- |
| CLI commands        | [`INSTALLATION.md`](../INSTALLATION.md)                                   |
| API reference       | [`docs/api-reference.md`](../docs/api-reference.md)                       |
| Monitoring & alerts | [`deployments/monitoring/README.md`](../deployments/monitoring/README.md) |
| Architecture        | [`ARCHITECTURE.md`](../ARCHITECTURE.md)                                   |
| Deployment          | [`DEPLOYMENT.md`](../DEPLOYMENT.md)                                       |

---

## Troubleshooting

| Problem                               | Fix                                                                                 |
| ------------------------------------- | ----------------------------------------------------------------------------------- |
| `Cannot find module '@agent-xai/...'` | Run `pnpm install` then `pnpm build` (monorepo needs internal packages built first) |
| Port 4000 already in use              | `PORT=4001 pnpm --filter @agent-xai/api dev`                                        |
| `@prisma/client did not initialize`   | `pnpm prisma generate` (only needed for persistence features)                       |
| No LLM provider configured            | Start with `ENABLE_MOCK_PROVIDER=true` — see Configuration above                    |
