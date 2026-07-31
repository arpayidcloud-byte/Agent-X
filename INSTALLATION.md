# 🚀 Agent-X — Installation Guide

Install and run Agent-X from source. This is the **recommended** way to install —
the `@agent-xai/*` packages are not yet published to npm (the legacy published
CLI `@agentx-fast/cli` is outdated and not recommended).

## Quick Install (from source)

```bash
# 1. Clone repository
git clone https://github.com/arpayidcloud-byte/Agent-X.git
cd Agent-X

# 2. Install dependencies
pnpm install

# 3. Build all packages
pnpm build

# 4. Verify the CLI works
pnpm agentx --version
pnpm agentx --help
```

> Requires Node.js >= 20 and pnpm >= 9. If you don't have pnpm:
> `npm install -g pnpm`

## Available Commands

```
agentx submit <goal>           Submit a new task
agentx approve <task-id>       Approve a pending task
agentx reject <task-id>        Reject a pending task
agentx status [task-id]        Check task status
agentx demo [goal...]          Run E2E demo (CLI → Runtime → Agent → LLM → Response)
agentx config                  Manage configuration
agentx cost                    Show cost analysis
agentx audit                   Run security audit
agentx plugin                  Manage plugins
agentx watch                   Watch for changes
agentx dlq [action]            Manage Dead Letter Queue (list|clear|size)
agentx shutdown [reason...]    Trigger graceful shutdown
agentx tui                     Launch interactive Terminal UI
```

Run any command locally with:

```bash
pnpm agentx <command>
# or directly:
node apps/cli/dist/index.js <command>
```

## Run the API Server

```bash
# Development mode (watch)
pnpm --filter @agent-xai/api dev

# Production mode (compiled)
node apps/api/dist/agentx-server.js

# With mock providers — no API keys needed, instant responses
ENABLE_MOCK_PROVIDER=true PORT=4000 node apps/api/dist/agentx-server.js
```

Verify: `curl http://localhost:4000/health` → 3 mock providers `healthy`.

## Run the Web Dashboard

```bash
pnpm --filter @agent-xai/web dev    # development
pnpm --filter @agent-xai/web build  # production build
```

## Generate Prisma Client

Only needed for persistence features (packages that use the database):

```bash
pnpm prisma generate
```

## Troubleshooting

### Prisma Client Error

If you see `@prisma/client did not initialize yet`:

```bash
pnpm prisma generate
```

### Module Not Found Errors

```bash
pnpm install
pnpm build
```

Internal workspace packages must be built before they can be resolved — always run
`pnpm build` at the root after a fresh clone.

### Port Already in Use

```bash
PORT=4001 node apps/api/dist/agentx-server.js
```

## Packages

The workspace contains **49 packages** under the `@agent-xai` scope, e.g.:

- Core: `@agent-xai/core-runtime`, `@agent-xai/shared`, `@agent-xai/observability`
- Agent: `@agent-xai/agent-platform`, `@agent-xai/multi-agent-collaboration`
- Provider: `@agent-xai/llm-router`, `@agent-xai/provider-sdk`
- Workflow: `@agent-xai/workflow-engine`, `@agent-xai/workflow-orchestration`
- Apps: `@agent-xai/api`, `@agent-xai/cli`, `@agent-xai/web`

> Status: not yet published to npm. When published, installation becomes
> `npm install -g @agent-xai/cli`.

## Support

- GitHub Issues: https://github.com/arpayidcloud-byte/Agent-X/issues
- Getting Started: [`docs/getting-started.md`](./docs/getting-started.md)
