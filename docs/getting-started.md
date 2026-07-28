# Getting Started with AgentX

## Prerequisites

- Node.js >= 20.0.0
- pnpm >= 11.0.0
- Docker (optional, for local database)

## Installation

### Option 1: From npm (Recommended)

```bash
# Install core packages
npm install @agentx-cli/core-runtime @agentx-cli/autonomous-cognition
npm install -g @agentx-cli/cli

# Run your first agent
agentx demo "Explain quantum computing"
```

### Option 2: From Source

```bash
git clone https://github.com/arpayidcloud-byte/Agentx.git
cd Agentx
pnpm install
pnpm build
```

## Quick Start

```bash
# Build all packages
pnpm build

# Run all tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Start development mode
pnpm dev
```

## Project Structure

```
Agentx/
├── apps/                    # Applications
│   ├── cli/                 # CLI interface
│   └── dashboard/           # Web dashboard (Phase 10)
├── packages/
│   ├── shared/              # Shared packages
│   │   ├── core-runtime/    # Task scheduling & state machines
│   │   ├── tool-sdk/        # Sandboxed tool execution
│   │   ├── secrets/         # Credential management
│   │   ├── observability/   # OpenTelemetry tracing
│   │   ├── telemetry/       # Metrics aggregation & alerting
│   │   └── security/        # SAST scanning & audit trail
│   ├── provider/            # LLM provider packages
│   │   ├── provider-sdk/    # Multi-provider abstraction
│   │   └── native-providers/
│   ├── agent/               # Agent packages
│   ├── cognitive/           # Cognitive packages
│   └── workflow/            # Workflow packages
├── tests/                   # Test suites
│   └── e2e/                 # End-to-end tests
└── docs/                    # Documentation
```

## Available Scripts

| Script               | Description                  |
| -------------------- | ---------------------------- |
| `pnpm build`         | Build all packages           |
| `pnpm test`          | Run all unit tests           |
| `pnpm test:coverage` | Run tests with coverage      |
| `pnpm test:e2e`      | Run E2E integration tests    |
| `pnpm lint`          | Run ESLint on all packages   |
| `pnpm typecheck`     | Run TypeScript type checking |
| `pnpm format`        | Format code with Prettier    |
