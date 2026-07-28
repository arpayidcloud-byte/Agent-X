# AgentX Project Structure

> Monorepo TypeScript dengan 38 packages, menggunakan pnpm workspaces + Turborepo.

## Root

```
agentx/
├── .changeset/config.json              # Changesets config
├── .env.example                        # Environment variables template
├── .eslintrc.cjs                       # ESLint config
├── .github/workflows/ci.yml            # CI pipeline
├── .husky/                             # Git hooks
│   ├── pre-commit                      # → lint-staged
│   └── commit-msg                      # → commitlint
├── .npmrc
├── .prettierrc.js                      # Prettier config
├── agentx.config.yaml                  # Runtime config (provider, agents, shell)
├── commitlint.config.js                # Conventional commits
├── docker-compose.yml                  # Postgres 16 + Redis 7
├── lint-staged.config.js               # Lint-staged rules
├── package.json                        # Root workspace (agentx-workspace)
├── pnpm-lock.yaml
├── pnpm-workspace.yaml                 # Workspaces: packages/*, apps/*, tooling/*
├── tsconfig.base.json                  # Shared TS base config
├── tsconfig.json                       # Root project references
├── turbo.json                          # Turborepo pipeline config
│
├── apps/                               # Aplikasi
├── packages/                           # Library packages
├── tooling/                            # Internal tooling
├── docs/                               # Design docs & RFCs
├── prisma/                             # Database schema
├── prompts/                            # Agent prompt templates
└── scripts/                            # Utility scripts
```

---

## apps/

```
apps/
└── cli/                                # @agentx/cli v0.1.0
    ├── package.json                    # binary: "agentx"
    ├── tsconfig.json
    ├── src/
    │   └── index.ts                    # CLI entry point
    └── dist/                           # Compiled output
```

---

## packages/ (38 packages)

### Cognitive Layer

```
packages/
├── cognitive-contracts/                # Budget, hooks, lifecycle, metrics, reasoning
├── cognitive-kernel/                   # Dispatching, scheduling, recovery, observability
├── cognitive-learning/                 # Learning sessions, pattern engine, feedback
├── context-engine/                     # Compression, windowing, token estimation
├── knowledge-engine/                   # Knowledge storage & retrieval
├── memory-engine/                      # Task/result persistence, audit events
├── goal-intelligence/                  # Goal decomposition, planning, decision engine
├── reasoning-algorithms/               # Forward/backward chaining, decision trees, hypothesis
├── reasoning-framework/                # Pipeline, graph engine, dispatching, recovery
└── planning-engine/                    # Planning engine
```

### Agent & Multi-Agent

```
├── agent-platform/                     # Sub-agent orchestration, parallel runners
├── multi-agent-collaboration/          # Agent directories, consensus, message routing
├── multi-agent-reasoning/              # Reasoning orchestration, collaboration, synthesis
└── autonomous-cognition/               # Goal engine, planning, self-improvement, checkpoint replay
```

### Runtime & Infrastructure

```
├── core-runtime/                       # Task scheduling, state machine, retry, cancellation
├── runtime/                            # Coordinator, dispatcher, scheduler, bootstrap, DI
├── runtime-adapters/                   # Provider adapters (lock, queue, secret, storage, telemetry)
├── runtime-production/                 # Circuit breaker, DLQ, lease manager, cluster
├── enterprise-runtime/                 # Multi-tenant, config, security, deployment, networking
└── distributed-cognition/              # Cluster coordination, consensus, knowledge sync
```

### Provider & SDK

```
├── provider-sdk/                       # Base provider, factory, registry, resilience
├── native-providers/                   # Anthropic, OpenAI, Gemini, Ollama adapters
├── provider-qualification/             # Benchmarks, chaos/stress/fault injection
├── provider-release/                   # API compat, breaking changes, semver
├── vendor-certification/               # Provider certs, grading, audits, signatures
├── developer-platform/                 # Dev manager, SDK, control plane, marketplace
└── plugin-sdk/                         # Plugin SDK
```

### Workflow

```
├── workflow-engine/                    # Compilation, execution, replay, retry, snapshots
├── workflow-hardening/                 # Integrity, compensation, replay, audit
└── workflow-orchestration/             # Scheduling, dispatching, replanning, monitoring
```

### Tooling & Quality

```
├── tool-sdk/                           # Shell exec, filesystem, git, approval workflows
├── production-quality/                 # Quality gates, validators (audit, branch, coverage...)
├── secrets/                            # Secret resolver, env backend, cache, scrubber
├── shared/                             # Logger, redactor, trace context, metrics/telemetry
├── shared-config/                      # Shared configuration
├── handbook-lint/                      # Handbook linting CLI tool
└── architecture-sdk/                   # Architecture diagrams, versioning, dependency maps
```

---

## tooling/

```
tooling/
└── eslint-plugin-internal/             # @agentx/eslint-plugin-internal
    ├── package.json
    ├── index.js                        # Custom rules:
    │                                   #   - no-secret-prefix-logging
    │                                   #   - no-credential-logging
    │                                   #   - no-vendor-sdk-import
    └── node_modules/
```

---

## docs/

```
docs/
├── MULTI_AGENT_ORCHESTRATION_DESIGN.md
├── PACKAGE_OWNERSHIP.md
├── PROVIDER_SDK_DESIGN.md
├── SECRETS_DESIGN.md
├── TOOL_SDK_DESIGN.md
├── .well-known/                       # (empty)
├── adr/                               # Architecture Decision Records (empty)
├── api/                               # API docs (empty)
└── rfc/                               # RFCs (empty)
```

---

## prisma/

```
prisma/
└── schema.prisma                      # 8 models:
                                       #   - Task
                                       #   - TaskGraph
                                       #   - AgentResult
                                       #   - AuditEvent
                                       #   - CostRecord
                                       #   - prompt_version
                                       #   - role_assignment
                                       #   - org_config
```

---

## prompts/

```
prompts/
├── coding-agent/v1.0.0.md
├── review-agent/v1.0.0.md
├── security-agent/v1.0.0.md
└── test-agent/v1.0.0.md
```

---

## scripts/

```
scripts/
└── create-packages.sh                 # Scaffolding script
```

---

## Statistik

| Komponen            | Jumlah                             |
| ------------------- | ---------------------------------- |
| Packages            | 38                                 |
| Apps                | 1 (cli)                            |
| Prompt Agents       | 4 (coding, review, security, test) |
| Prisma Models       | 8                                  |
| Docker Services     | 2 (Postgres, Redis)                |
| CI Workflows        | 1                                  |
| Design Docs         | 5                                  |
| Custom ESLint Rules | 3                                  |

---

## Tech Stack

| Komponen        | Teknologi                    |
| --------------- | ---------------------------- |
| Runtime         | Node.js >= 20                |
| Language        | TypeScript 5.4.5             |
| Package Manager | pnpm 11.13.0                 |
| Build System    | Turborepo                    |
| Testing         | Vitest + @vitest/coverage-v8 |
| Linting         | ESLint + Prettier            |
| Database        | PostgreSQL 16 (Prisma)       |
| Cache           | Redis 7                      |
| CI              | GitHub Actions               |
| Versioning      | Changesets                   |
