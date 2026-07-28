# Package Ownership

This document lists the package mappings and maintainer ownership for the monorepo packages.

| Package                   | Volume/RFC | Description                                         | Owner                     |
| ------------------------- | ---------- | --------------------------------------------------- | ------------------------- |
| `@agentx/core-runtime`    | Volume 2   | Task Lifecycle, Event Bus, Scheduler                | Core Team                 |
| `@agentx/agent-platform`  | Volume 3   | AI Decomposer, 4 agents, System prompts             | Agent Platform WG         |
| `@agentx/provider-sdk`    | Volume 4   | Abstraction, Anthropic/Google adapters              | Provider WG               |
| `@agentx/workflow-engine` | Volume 5   | Task Graph DAG, two-layer Approval Gates            | Workflow Engine WG        |
| `@agentx/memory-engine`   | Volume 6   | DB models, append-only logs, Context Engine         | Database/SRE WG           |
| `@agentx/tool-sdk`        | Volume 7   | Filesystem jail, allowlist shell, PermissionChecker | Security WG               |
| `@agentx/plugin-sdk`      | Volume 8   | Third-party plugin sandboxing                       | Extensibility WG          |
| `@agentx/cli`             | Volume 9   | CLI application, approval UX                        | Product/CLI Team          |
| `@agentx/auth`            | Volume 15  | Identity providers, Local/Token/SSO auth            | Security WG               |
| `@agentx/secrets`         | Volume 16  | Secrets cache, EnvVar/EncryptedFile/Vault stores    | Security WG               |
| `@agentx/shared`          | —          | Common utilities, structured logging                | Platform Team             |
| `@agentx/handbook-lint`   | RFC-0040   | Handbook validation tools                           | Architecture Review Board |
