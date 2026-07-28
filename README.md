# 🚀 AgentX Platform

**Enterprise AI Agent Platform** - Build, deploy, and manage intelligent agents at scale.

[![npm version](https://img.shields.io/npm/v/@agentx-fast/cli.svg)](https://www.npmjs.com/package/@agentx-fast/cli)
[![npm downloads](https://img.shields.io/npm/dm/@agentx-fast/cli.svg)](https://www.npmjs.com/package/@agentx-fast/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 Quick Start

### Install CLI

```bash
npm install -g @agentx-fast/cli@2.0.2
```

### Verify Installation

```bash
agentx --version
agentx --help
```

### Run Your First Agent

```bash
agentx demo "Build a REST API with Node.js"
```

---

## 📦 Available Commands

| Command | Description |
|---------|-------------|
| `agentx submit <goal>` | Submit a new task |
| `agentx approve <task-id>` | Approve a pending task |
| `agentx reject <task-id>` | Reject a pending task |
| `agentx status [task-id]` | Check task status |
| `agentx demo [goal...]` | Run E2E demo |
| `agentx config` | Manage configuration |
| `agentx cost` | Show cost analysis |
| `agentx audit` | Run security audit |
| `agentx plugin` | Manage plugins |
| `agentx watch` | Watch for changes |
| `agentx dlq [action]` | Manage Dead Letter Queue |
| `agentx shutdown [reason...]` | Trigger graceful shutdown |

---

## 🏗️ Architecture

AgentX consists of **49 npm packages** under the `@agentx-fast` scope:

### Core Packages
- `@agentx-fast/core-runtime` - Core runtime utilities
- `@agentx-fast/shared` - Shared utilities and types
- `@agentx-fast/observability` - Logging, metrics, tracing

### Agent & Workflow
- `@agentx-fast/agent-platform` - Agent orchestration
- `@agentx-fast/workflow-engine` - Workflow management
- `@agentx-fast/multi-agent-collaboration` - Multi-agent systems

### Provider SDK
- `@agentx-fast/provider-sdk` - Provider framework
- `@agentx-fast/native-providers` - Built-in providers

### Developer Tools
- `@agentx-fast/cli` - Command-line interface
- `@agentx-fast/plugin-sdk` - Plugin development
- `@agentx-fast/developer-platform` - Dev tools

[See all 49 packages →](https://www.npmjs.com/org/agentx-fast)

---

## 📖 Documentation

- [Installation Guide](./INSTALLATION.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Contributing](./CONTRIBUTING.md)

---

## 🚀 For Developers

### Clone & Setup

```bash
git clone https://github.com/arpayidcloud-byte/AgentX.git
cd AgentX
pnpm install
```

### Build All Packages

```bash
pnpm build
```

### Generate Prisma Client

```bash
pnpm prisma generate
```

### Run Tests

```bash
pnpm test
pnpm test:e2e
```

---

## 🎉 v2.0.0 Release

**Latest:** v2.0.0 (Released 2026-07-28)

### What's New
- ✅ All 49 packages updated to v2.0.0
- ✅ Clean dependencies (no workspace:*)
- ✅ All imports migrated to @agentx-fast/*
- ✅ CLI version now reads from package.json
- ✅ Improved build process

### Migration from v1.x

```bash
# Update CLI
npm install -g @agentx-fast/cli@2.0.2

# Update local packages
pnpm install
pnpm build
```

---

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](./CONTRIBUTING.md) for details.

### Quick Start

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `pnpm test`
5. Submit a PR

---

## 📄 License

MIT © [AgentX Platform](https://github.com/arpayidcloud-byte)

---

## 🔗 Links

- **Website:** Coming soon
- **npm Organization:** https://www.npmjs.com/org/agentx-fast
- **GitHub:** https://github.com/arpayidcloud-byte/AgentX
- **Documentation:** https://github.com/arpayidcloud-byte/agentx-platform

---

**Built with ❤️ by the AgentX Team**
