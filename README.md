# 🚀 Agent-X Platform

**Enterprise AI Agent Platform** — Build, deploy, and manage intelligent agents at scale.

Agent-X is a monorepo of **49 TypeScript/Node.js packages** that provides a
provider-agnostic LLM router with auto-fallback, multi-agent orchestration, workflow
engines, sandboxed tool execution, observability (Prometheus/Grafana), and a CLI +
API + web dashboard.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 Quick Start (5 minutes, no API keys)

```bash
# 1. Clone & install
git clone https://github.com/arpayidcloud-byte/Agent-X.git
cd Agent-X
pnpm install
pnpm build

# 2. Run the API server with built-in mock providers (no keys needed)
ENABLE_MOCK_PROVIDER=true PORT=4000 node apps/api/dist/agentx-server.js

# 3. In another terminal — verify & run your first agent
curl http://localhost:4000/health
pnpm demo "Build a REST API with Node.js"
```

Full onboarding guide: [`docs/getting-started.md`](./docs/getting-started.md)

---

## 📦 Available Commands

| Command                       | Description                                           |
| ----------------------------- | ----------------------------------------------------- |
| `agentx submit <goal>`        | Submit a new task                                     |
| `agentx approve <task-id>`    | Approve a pending task                                |
| `agentx reject <task-id>`     | Reject a pending task                                 |
| `agentx status [task-id]`     | Check task status                                     |
| `agentx demo [goal...]`       | Run E2E demo (CLI → Runtime → Agent → LLM → Response) |
| `agentx config`               | Manage configuration                                  |
| `agentx cost`                 | Show cost analysis                                    |
| `agentx audit`                | Run security audit                                    |
| `agentx plugin`               | Manage plugins                                        |
| `agentx watch`                | Watch for changes                                     |
| `agentx dlq [action]`         | Manage Dead Letter Queue                              |
| `agentx shutdown [reason...]` | Trigger graceful shutdown                             |
| `agentx tui`                  | Launch interactive Terminal UI                        |

---

## 🏗️ Architecture

Agent-X consists of **49 npm packages** under the `@agent-xai` scope:

### Core Packages

- `@agent-xai/core-runtime` - Core runtime utilities
- `@agent-xai/shared` - Shared utilities and types
- `@agent-xai/observability` - Logging, metrics, tracing

### Agent & Workflow

- `@agent-xai/agent-platform` - Agent orchestration
- `@agent-xai/workflow-engine` - Workflow management
- `@agent-xai/multi-agent-collaboration` - Multi-agent systems

### Provider (LLM Routing)

- `@agent-xai/llm-router` - Provider-agnostic routing with auto-fallback
- `@agent-xai/provider-sdk` - Provider framework
- `@agent-xai/native-providers` - Built-in providers

### Apps

- `@agent-xai/api` - API server (REST + /metrics + /health)
- `@agent-xai/cli` - Command-line interface
- `@agent-xai/web` - Web dashboard

> Status: packages are not yet published to npm (registry scope reserved as
> `@agent-xai`). Install from source — see [Installation](./INSTALLATION.md).

---

## 📖 Documentation

- [Getting Started (onboarding)](./docs/getting-started.md)
- [Installation Guide](./INSTALLATION.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Monitoring & Alerting](./deployments/monitoring/README.md)
- [Contributing](./CONTRIBUTING.md)

---

## 🚀 For Developers

### Setup

```bash
git clone https://github.com/arpayidcloud-byte/Agent-X.git
cd Agent-X
pnpm install
```

### Build All Packages

```bash
pnpm build
```

### Run Tests

```bash
pnpm test       # unit tests (all packages)
pnpm test:e2e   # end-to-end tests
pnpm lint       # ESLint
pnpm typecheck  # TypeScript type checking
```

### Run the API Server

```bash
ENABLE_MOCK_PROVIDER=true pnpm --filter @agent-xai/api dev
```

### Run the Web Dashboard

```bash
pnpm --filter @agent-xai/web dev
```

---

## 🧪 Dev Mode (no API keys)

Set `ENABLE_MOCK_PROVIDER=true` to register mock LLM providers (OpenAI/DeepSeek/
Anthropic mocks). The API server then answers every request instantly with a `[MOCK]`
response — ideal for development, demos, and testing the full pipeline offline.

For real providers, add your keys to `.env` (see `.env.example`) and unset
`ENABLE_MOCK_PROVIDER`. The router auto-falls back:
`openai_compatible → deepseek → qwen`.

---

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `pnpm test`
5. Submit a PR

---

## 📄 License

MIT © Agent-X Platform

---

## 🔗 Links

- **GitHub:** https://github.com/arpayidcloud-byte/Agent-X
- **Getting Started:** https://github.com/arpayidcloud-byte/Agent-X/blob/main/docs/getting-started.md

---

**Built with ❤️ by the Agent-X Team**
