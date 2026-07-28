# 🚀 AgentX CLI - Installation Guide

## Quick Install

```bash
# Install globally
npm install -g @agentx-fast/cli@1.0.3

# Verify installation
agentx --version
agentx --help
```

## Available Commands

```
agentx submit <goal>           Submit a new task
agentx approve <task-id>       Approve a pending task
agentx reject <task-id>        Reject a pending task
agentx status [task-id]        Check task status
agentx demo [goal...]          Run E2E demo
agentx config                  Manage configuration
agentx cost                    Show cost analysis
agentx audit                   Run security audit
agentx plugin                  Manage plugins
agentx watch                   Watch for changes
agentx dlq [action]            Manage Dead Letter Queue
agentx shutdown [reason...]    Trigger graceful shutdown
```

## For Developers (Local Development)

If you want to run AgentX from source:

```bash
# Clone repository
git clone https://github.com/arpayidcloud-byte/AgentX.git
cd AgentX

# Install dependencies
pnpm install

# Generate Prisma client (required!)
pnpm prisma generate

# Build all packages
pnpm build

# Run CLI locally
pnpm demo "Your goal here"
```

## Troubleshooting

### Prisma Client Error

If you see error like `@prisma/client did not initialize yet`:

```bash
cd /path/to/AgentX
pnpm prisma generate
```

### Module Not Found Errors

Clear npm cache and re-install:

```bash
npm cache clean --force
npm uninstall -g @agentx-fast/cli
npm install -g @agentx-fast/cli@1.0.3
```

## Published Packages

All 49 packages are published under `@agentx-fast` scope:

- Core: `@agentx-fast/core-runtime`, `@agentx-fast/shared`, `@agentx-fast/observability`
- Runtime: `@agentx-fast/runtime`, `@agentx-fast/runtime-adapters`, `@agentx-fast/runtime-production`
- Agent: `@agentx-fast/agent-platform`, `@agentx-fast/multi-agent-collaboration`
- Provider: `@agentx-fast/provider-sdk`, `@agentx-fast/native-providers`
- Workflow: `@agentx-fast/workflow-engine`, `@agentx-fast/planning-engine`
- CLI: `@agentx-fast/cli`

And 40+ more packages. See full list at: https://www.npmjs.com/org/agentx-fast

## Version Info

- **CLI Version:** 1.0.3
- **All Packages:** 1.0.0 - 1.0.4
- **Next Major:** 2.0.0 (planned - clean install without manual steps)

## Support

- GitHub Issues: https://github.com/arpayidcloud-byte/AgentX/issues
- Documentation: https://github.com/arpayidcloud-byte/agentx-platform
