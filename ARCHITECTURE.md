# Architecture Documentation

## System Overview

```mermaid
graph TB
    CLI[CLI] --> Runtime[Runtime Core]
    API[API Server] --> Runtime
    Runtime --> Agents[Agent Platform]
    Runtime --> Workflow[Workflow Engine]
    Agents --> Providers[Provider SDK]
    Runtime --> Shared[Shared Utils]
    Runtime --> Observability[Observability]
```

## Package Dependencies

```mermaid
graph LR
    subgraph Core
        runtime
        shared
        workflow
    end
    subgraph Entry
        cli
        agent
        provider
        planning
    end
    subgraph Internal
        cognitive
        reasoning
        plugin-sdk
    end
```

## Layer Architecture

```mermaid
graph TB
    subgraph Entry Layer
        CLI[CLI]
        API[API Server]
    end
    subgraph Core Layer
        Runtime[Runtime]
        Shared[Shared]
        Workflow[Workflow]
    end
    subgraph Internal Layer
        Cognitive[Cognitive]
        Reasoning[Reasoning]
    end
```

## Data Flow (Task Lifecycle)

```mermaid
sequenceDiagram
    User->>CLI: Submit Task
    CLI->>Runtime: Enqueue
    Runtime->>Scheduler: Dispatch
    Scheduler->>Agent: Execute
    Agent->>Provider: LLM Call
    Provider-->>Agent: Response
    Agent-->>Runtime: Result
    Runtime-->>CLI: Status
```

## Agent Architecture

```mermaid
graph TB
    Orchestrator[Orchestrator] --> Coder[Coder Agent]
    Orchestrator --> Reviewer[Reviewer Agent]
    Orchestrator --> Tester[Tester Agent]
    Orchestrator --> Security[Security Agent]
    Coder --> Provider[Provider SDK]
    Reviewer --> Provider
    Tester --> Provider
```

## Canonical Components

This document identifies the canonical (authoritative) implementations of core architectural components in the Agentx codebase. When multiple implementations exist, the canonical version should be used for new development, and non-canonical versions should be considered for deprecation or migration.

---

### Provider Layer

| Component                  | Status         | Description                                                                                                                                        |
| -------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@agentx/provider-sdk`     | **CANONICAL**  | Real implementation with full provider adapters (Anthropic, Google). Includes credential resolution, validation, metrics, and resilience patterns. |
| `@agentx/native-providers` | **DEPRECATED** | Stub implementation. Superseded by `provider-sdk`.                                                                                                 |

**Canonical Location:** `/packages/provider/provider-sdk/`

**Key Features of Canonical Implementation:**

- Base provider abstraction with lifecycle management
- Credential resolver for secure API key management
- Provider registry and factory patterns
- Built-in validation, metrics, and error handling
- Real adapters: `AnthropicProvider`, `GoogleProvider`
- Conformance testing harness

**Migration Path:** All consumers of `native-providers` should migrate to `provider-sdk`.

---

### State Machine

| Component                        | Status          | Description                                                                                                  |
| -------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------ |
| `@agentx/core-runtime`           | **CANONICAL**   | Task state machine with 7+ states and full transition matrix. Used by scheduler and task execution pipeline. |
| `@agentx/reasoning-framework`    | Domain-specific | Pipeline state machine for reasoning workflows                                                               |
| `@agentx/goal-intelligence`      | Domain-specific | Goal state machine for goal lifecycle                                                                        |
| `@agentx/cognitive-kernel`       | Domain-specific | Kernel state machine for cognitive operations                                                                |
| `@agentx/cognitive-learning`     | Domain-specific | Learning state machine                                                                                       |
| `@agentx/runtime`                | Domain-specific | Runtime and Coordinator state machines                                                                       |
| `@agentx/workflow-orchestration` | Domain-specific | Workflow state machine                                                                                       |
| `@agentx/workflow-engine`        | Domain-specific | Alternative workflow state machine                                                                           |

**Canonical Location:** `/packages/shared/core-runtime/src/state-machine/`

**Key Features of Canonical Implementation:**

- 11 task states: `CREATED`, `QUEUED`, `DECOMPOSING`, `PLANNING`, `RUNNING`, `WAITING_APPROVAL`, `WAITING_PROVIDER`, `WAITING_TOOL`, `RETRYING`, `COMPLETED`, `FAILED`, `CANCELLED`
- Full transition matrix with validation
- Terminal states: `COMPLETED`, `CANCELLED`
- Retry support from `FAILED` state
- Integration with scheduler and task context

**Note:** Domain-specific state machines (reasoning, goal, workflow, etc.) are acceptable as they model different domains. However, for **task execution lifecycle**, `core-runtime` is the single source of truth.

---

### RBAC (Role-Based Access Control)

| Component                                    | Status                  | Description                                         |
| -------------------------------------------- | ----------------------- | --------------------------------------------------- |
| `@agentx/enterprise-runtime` (rbac-roles.ts) | **PENDING UNIFICATION** | Enum-based role definitions with permission mapping |
| `@agentx/enterprise-runtime` (Security.ts)   | **PENDING UNIFICATION** | RBACEngine class with dynamic rule management       |
| `@agentx/shared` (IdentityToRBACBridge)      | **PENDING UNIFICATION** | Bridge interface for identity integration           |

**Current Status:** ⚠️ **NEEDS UNIFICATION**

Two RBAC implementations exist in `enterprise-runtime`:

1. **Static role definitions** (`rbac-roles.ts`): Enum-based with hardcoded permissions for `OWNER`, `DEVELOPER`, `VIEWER`
2. **Dynamic RBAC engine** (`Security.ts`): Runtime rule registration and permission checking

**Decision Pending:** These need to be merged into a single canonical RBAC module. Recommended approach:

- Keep `RBACEngine` as the core implementation
- Integrate static role definitions as default presets
- Expose bridge interface for identity system integration

---

## Duplication Summary

| Component          | Canonical      | Duplicates                                   | Action Required                                               |
| ------------------ | -------------- | -------------------------------------------- | ------------------------------------------------------------- |
| Provider Layer     | `provider-sdk` | `native-providers`                           | Deprecate and migrate                                         |
| Task State Machine | `core-runtime` | Multiple domain-specific                     | Document boundaries; enforce task lifecycle uses core-runtime |
| RBAC               | TBD (unified)  | 2 implementations in enterprise-runtime      | Merge into single module                                      |
| Workflow Engine    | N/A            | `workflow-orchestration` + `workflow-engine` | Evaluate and consolidate                                      |

---

## Principles

1. **Single Source of Truth**: Each architectural concern has exactly one canonical implementation
2. **Domain Separation**: Domain-specific variants (e.g., state machines for different workflows) are acceptable when modeling different domains
3. **Explicit Deprecation**: Non-canonical components must be marked deprecated with migration guidance
4. **Documentation**: All canonical components are documented here and in code
