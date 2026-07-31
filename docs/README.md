# Agent-X Documentation

Welcome to the Agent-X documentation portal.

## Quick Links

- [Getting Started (onboarding)](./getting-started.md)
- [Installation Guide](../INSTALLATION.md)
- [API Reference](./api-reference.md)
- [Architecture Overview](../ARCHITECTURE.md)
- [Deployment Guide](../DEPLOYMENT.md)
- [Monitoring & Alerting](../deployments/monitoring/README.md)
- [Architecture Decision Records](./architecture/decisions/)

## What is Agent-X?

Agent-X is a production-grade agent orchestration platform for building, deploying,
and managing AI agents at scale. It provides:

- **LLM Router** — Provider-agnostic routing with auto-fallback (OpenAI, Anthropic,
  DeepSeek, Qwen, Groq, OpenRouter, or any OpenAI-compatible endpoint)
- **Core Runtime** — Task scheduling, state machines, event bus
- **Provider Platform** — Multi-LLM provider abstraction with circuit breakers
- **Tool SDK** — Sandboxed tool execution with approval gates
- **Multi-Agent Collaboration** — Sub-agent spawning, task delegation
- **Observability** — Prometheus metrics, structured logging, alerting (Grafana)
- **Security** — SAST scanning, secret detection, audit trail
- **Apps** — CLI (`agentx`), REST API server, web dashboard

## Guides

- [Logging Guide](./logging-guide.md) — structured JSON logging, correlation IDs
- [Metrics Guide](./metrics-guide.md) — Prometheus metrics exposed by the API
- [Alerting Guide](./alerting-guide.md) — alert rules, Alertmanager, webhooks
- [E2E Demo](./e2e-demo.md) — full pipeline demo (CLI → Runtime → Agent → LLM → Response)

## Deployment

- [Docker Deployment](./deployment/docker.md)
- [Kubernetes Deployment](./deployment/kubernetes.md)
- [Cloud Deployment](./deployment/cloud.md)
- [Runbooks](./runbooks/) — deployment & incident response
- [Monitoring Stack](../deployments/monitoring/README.md) — Docker Compose or native run
