# R0 — Repository Architecture Refactoring Plan

**Status:** Draft — Pending Architecture Review  
**Date:** 2026-07-17  
**Scope:** Pre-release repository restructuring (no feature changes)  
**Principle:** Preserve all APIs, tests, coverage, and deterministic guarantees

---

## A. Current Repository Problems

### A1. Circular Dependency Chain

The most critical issue is a **3-node circular dependency cycle**:

```
agent-platform → provider-sdk → provider-qualification → agent-platform
```

Additionally, `runtime-adapters` depends on `runtime` and `runtime-production`, while `runtime-production` depends on `runtime`, creating an inverted dependency where lower-level infrastructure depends on the top-level orchestrator.

### A2. Flattened Package Namespace

All 38 packages sit in a single flat `packages/` directory. This makes it impossible to:

- Identify bounded contexts at a glance
- Enforce layer boundaries via directory conventions
- Understand ownership by inspection
- Scale to 100+ packages

### A3. Massive Duplication

| Duplicated Concept | Count | Packages                                                                                                                                                                                                                           |
| ------------------ | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CheckpointManager  | 15    | cognitive-learning, cognitive-kernel, reasoning-algorithms, reasoning-framework, goal-intelligence, multi-agent-collaboration, distributed-cognition, workflow-engine, workflow-orchestration, runtime, autonomous-cognition, etc. |
| EventBus           | 10    | core-runtime, cognitive-kernel, cognitive-learning, reasoning-algorithms, goal-intelligence, multi-agent-collaboration, multi-agent-reasoning, workflow-orchestration, distributed-cognition, autonomous-cognition                 |
| HookManager        | 11    | cognitive-learning, goal-intelligence, reasoning-algorithms, reasoning-framework, multi-agent-collaboration, multi-agent-reasoning, workflow-orchestration, workflow-engine, cognitive-kernel, runtime                             |
| RecoveryManager    | 9     | cognitive-learning, cognitive-kernel, reasoning-algorithms, reasoning-framework, goal-intelligence, multi-agent-collaboration, multi-agent-reasoning, workflow-orchestration, distributed-cognition                                |
| Error hierarchy    | 35    | Every non-stub package                                                                                                                                                                                                             |

### A4. Near-Identical Packages

**`multi-agent-collaboration` vs `multi-agent-reasoning`** — These share 90%+ of the same components (AgentRegistry, AgentDirectory, TaskDelegationEngine, ConsensusEngine, SharedContextManager, CollaborationEventBus, CollaborationHookManager, CollaborationScheduler). The interfaces are nearly character-for-character identical. `multi-agent-reasoning` wraps everything in DDD folders while `multi-agent-collaboration` is flat.

**`provider-qualification` vs `vendor-certification`** — Both do provider certification, scoring, validation, and auditing with different naming conventions for the same concepts.

**`planning-engine` vs `goal-intelligence/planning-engine`** — `planning-engine` is a 3-file minimal implementation. `goal-intelligence` contains a full PlanningEngine with checkpoint/recovery/validator/score. The standalone package is redundant.

### A5. Stub/Placeholder Packages

| Package         | Content                                            | Recommendation |
| --------------- | -------------------------------------------------- | -------------- |
| `auth`          | `export const dummy = true;`                       | REMOVE         |
| `plugin-sdk`    | `export const dummy = true;`                       | REMOVE         |
| `shared-config` | `export const dummy = true;` (re-exports tsconfig) | REMOVE         |

### A6. Inconsistent Naming

Three different names for consensus:

- `ConsensusEngine` (multi-agent-collaboration)
- `ConsensusManager` (multi-agent-reasoning)
- `DistributedConsensusEngine` (distributed-cognition)

Seven different names for recovery managers:
`RecoveryManager`, `CollaborationRecoveryManager`, `PlanningRecoveryManager`, `KernelRecoveryManager`, `ReasoningRecoveryManager`, `LearningRecoveryManager`, `DistributedRecoveryManager`

Runtime naming is confusing:

- `core-runtime` — low-level task model + state machine
- `runtime` — top-level orchestrator
- `runtime-production` — production infrastructure primitives
- `runtime-adapters` — adapter interfaces
- `enterprise-runtime` — enterprise features

### A7. Mixed Abstraction Levels

`runtime-adapters` depends on `runtime` (the orchestrator), but adapters should be at a lower abstraction level. This inverts the expected dependency direction.

### A8. Documentation Fragmentation

65 markdown files at the root level. No consistent documentation hierarchy. Milestone docs, architecture docs, implementation reports, and design docs all mixed together.

### A9. No Clear Ownership Boundaries

Without directory-based bounded contexts, package ownership is ambiguous. The flat structure makes it impossible to assign teams to domains.

### A10. Future Scalability Problems

At 38 packages, the flat structure is already hard to navigate. At 100+ packages, it becomes unmanageable. The current structure provides no mechanism for:

- Independent team ownership
- Per-domain CI pipelines
- Selective builds
- Version domain boundaries

---

## B. Recommended Repository Structure

```
agentx/
├── packages/
│   ├── shared/                          # Layer 0: Cross-cutting utilities
│   │   ├── @agentx/shared              # Logger, redactor, trace, metrics
│   │   ├── @agentx/cognitive-infra     # [NEW] Extracted: CheckpointManager, EventBus, HookManager, RecoveryManager, ErrorBase
│   │   └── @agentx/tool-core          # [RENAME] tool-sdk core (interfaces, registry, validation, classification, permissions)
│   │
│   ├── runtime/                         # Layer 1: Core runtime primitives
│   │   ├── @agentx/core-runtime       # Task model, state machine, event bus, scheduler
│   │   ├── @agentx/secrets             # Secret management
│   │   ├── @agentx/memory-engine       # Working/short/long-term memory
│   │   ├── @agentx/context-engine      # Token window management
│   │   └── @agentx/knowledge-engine    # Knowledge graph
│   │
│   ├── cognitive/                       # Layer 2: Cognitive intelligence
│   │   ├── @agentx/cognitive-contracts # State types, thinking sessions, budgets
│   │   ├── @agentx/cognitive-kernel    # Cognitive OS orchestrator
│   │   ├── @agentx/cognitive-learning  # Adaptive learning, patterns, reflection
│   │   └── @agentx/autonomous-cognition # Goal engine, self-improvement
│   │
│   ├── reasoning/                       # Layer 3: Reasoning
│   │   ├── @agentx/reasoning-framework # Pipeline, graph execution
│   │   └── @agentx/reasoning-algorithms # Forward/backward chaining, decision trees
│   │
│   ├── workflow/                        # Layer 4: Workflow
│   │   ├── @agentx/workflow-engine     # DAG compilation, execution, replay
│   │   ├── @agentx/workflow-orchestration # Multi-goal, scheduling, replanning
│   │   └── @agentx/workflow-hardening  # Integrity, compensation, certification
│   │
│   ├── agent/                           # Layer 5: Agent systems
│   │   ├── @agentx/agent-platform      # Sub-agent orchestration, pool, parallel
│   │   └── @agentx/multi-agent         # [MERGED] Collaboration + Reasoning + Consensus
│   │
│   ├── planning/                        # Layer 6: Planning & Goal Intelligence
│   │   └── @agentx/goal-intelligence   # Goal decomposition, planning, decision engine
│   │
│   ├── distributed/                     # Layer 7: Distributed systems
│   │   └── @agentx/distributed-cognition # Cluster, consensus, knowledge sync
│   │
│   ├── provider/                        # Layer 8: Provider ecosystem
│   │   ├── @agentx/provider-sdk        # Base provider, factory, registry, resilience
│   │   ├── @agentx/provider-qualification # [MERGED] Qualification + Certification + Vendor
│   │   ├── @agentx/native-providers    # Anthropic, OpenAI, Gemini, Ollama
│   │   └── @agentx/provider-release    # Semantic versioning, compatibility
│   │
│   ├── tool/                            # Layer 9: Tools
│   │   ├── @agentx/tool-filesystem     # [SPLIT] Filesystem tools
│   │   ├── @agentx/tool-git           # [SPLIT] Git tools
│   │   ├── @agentx/tool-shell          # [SPLIT] Shell execution
│   │   └── @agentx/tool-approval       # [SPLIT] Approval workflows
│   │
│   ├── runtime/                         # Layer 10: Runtime systems
│   │   ├── @agentx/runtime-orchestrator # [RENAME] Top-level runtime
│   │   ├── @agentx/runtime-adapters    # Adapter interfaces + in-memory
│   │   ├── @agentx/runtime-production  # Production infrastructure
│   │   └── @agentx/enterprise-runtime  # Multi-tenancy, security, deployment
│   │
│   ├── quality/                         # Layer 11: Quality & Governance
│   │   ├── @agentx/production-quality  # Quality gates, validators
│   │   └── @agentx/architecture-sdk    # Architecture freeze, migration
│   │
│   └── platform/                        # Layer 12: Developer platform
│       └── @agentx/developer-platform  # Dev portal, SDK, control plane
│
├── apps/
│   ├── cli/                            # CLI application
│   ├── dashboard/                      # [FUTURE] Web dashboard
│   └── playground/                     # [FUTURE] Interactive playground
│
├── tooling/
│   ├── eslint-plugin/                  # Custom ESLint rules
│   └── handbook-lint/                  # Handbook linter
│
├── docs/
│   ├── architecture/                   # Architecture decisions
│   ├── design/                         # Design documents
│   ├── api/                            # API documentation
│   ├── guides/                         # Developer guides
│   ├── deployment/                     # Deployment docs
│   ├── operations/                     # Operations runbooks
│   └── milestones/                     # Milestone records
│
├── prompts/                            # Agent prompt templates
├── prisma/                             # Database schema
└── scripts/                            # Build/release/maintenance scripts
```

---

## C. Package Analysis (KEEP/MOVE/MERGE/SPLIT/RENAME/REMOVE)

| #   | Current Package             | Action     | Target                                                                | Rationale                                                 |
| --- | --------------------------- | ---------- | --------------------------------------------------------------------- | --------------------------------------------------------- |
| 1   | `shared`                    | KEEP       | `packages/shared/@agentx/shared`                                      | Foundation layer, no changes needed                       |
| 2   | `core-runtime`              | KEEP       | `packages/runtime/@agentx/core-runtime`                               | Core primitives, stable                                   |
| 3   | `secrets`                   | KEEP       | `packages/runtime/@agentx/secrets`                                    | Foundation, no changes                                    |
| 4   | `memory-engine`             | KEEP       | `packages/runtime/@agentx/memory-engine`                              | Foundation, no changes                                    |
| 5   | `context-engine`            | KEEP       | `packages/runtime/@agentx/context-engine`                             | Foundation, no changes                                    |
| 6   | `knowledge-engine`          | KEEP       | `packages/runtime/@agentx/knowledge-engine`                           | Foundation, no changes                                    |
| 7   | `cognitive-contracts`       | KEEP       | `packages/cognitive/@agentx/cognitive-contracts`                      | Core cognitive types                                      |
| 8   | `cognitive-kernel`          | KEEP       | `packages/cognitive/@agentx/cognitive-kernel`                         | Core cognitive OS                                         |
| 9   | `cognitive-learning`        | KEEP       | `packages/cognitive/@agentx/cognitive-learning`                       | Core learning system                                      |
| 10  | `autonomous-cognition`      | KEEP       | `packages/cognitive/@agentx/autonomous-cognition`                     | Core self-improvement                                     |
| 11  | `reasoning-framework`       | KEEP       | `packages/reasoning/@agentx/reasoning-framework`                      | Core reasoning pipeline                                   |
| 12  | `reasoning-algorithms`      | KEEP       | `packages/reasoning/@agentx/reasoning-algorithms`                     | Core algorithms                                           |
| 13  | `workflow-engine`           | KEEP       | `packages/workflow/@agentx/workflow-engine`                           | Core workflow execution                                   |
| 14  | `workflow-orchestration`    | KEEP       | `packages/workflow/@agentx/workflow-orchestration`                    | Workflow scheduling                                       |
| 15  | `workflow-hardening`        | KEEP       | `packages/workflow/@agentx/workflow-hardening`                        | Workflow integrity                                        |
| 16  | `agent-platform`            | KEEP       | `packages/agent/@agentx/agent-platform`                               | Core agent orchestration                                  |
| 17  | `goal-intelligence`         | KEEP       | `packages/planning/@agentx/goal-intelligence`                         | Goal decomposition                                        |
| 18  | `distributed-cognition`     | KEEP       | `packages/distributed/@agentx/distributed-cognition`                  | Distributed systems                                       |
| 19  | `provider-sdk`              | KEEP       | `packages/provider/@agentx/provider-sdk`                              | Provider foundation                                       |
| 20  | `native-providers`          | KEEP       | `packages/provider/@agentx/native-providers`                          | Vendor integrations                                       |
| 21  | `provider-release`          | KEEP       | `packages/provider/@agentx/provider-release`                          | Versioning                                                |
| 22  | `production-quality`        | KEEP       | `packages/quality/@agentx/production-quality`                         | Quality gates                                             |
| 23  | `architecture-sdk`          | KEEP       | `packages/quality/@agentx/architecture-sdk`                           | Architecture management                                   |
| 24  | `developer-platform`        | KEEP       | `packages/platform/@agentx/developer-platform`                        | Dev platform                                              |
| 25  | `multi-agent-collaboration` | **MERGE**  | → `packages/agent/@agentx/multi-agent`                                | 90%+ overlap with multi-agent-reasoning                   |
| 26  | `multi-agent-reasoning`     | **MERGE**  | → `packages/agent/@agentx/multi-agent`                                | DDD structure becomes canonical                           |
| 27  | `provider-qualification`    | **MERGE**  | → `packages/provider/@agentx/provider-qualification`                  | Merge vendor-certification into this                      |
| 28  | `vendor-certification`      | **MERGE**  | → `packages/provider/@agentx/provider-qualification`                  | Merge into provider-qualification                         |
| 29  | `planning-engine`           | **REMOVE** | (absorbed by goal-intelligence)                                       | Redundant — goal-intelligence has complete PlanningEngine |
| 30  | `tool-sdk`                  | **SPLIT**  | → tool-core + tool-filesystem + tool-git + tool-shell + tool-approval | 73 files, 4 unrelated domains                             |
| 31  | `auth`                      | **REMOVE** | (stub, no implementation)                                             | Placeholder with `export const dummy = true`              |
| 32  | `plugin-sdk`                | **REMOVE** | (stub, no implementation)                                             | Placeholder with `export const dummy = true`              |
| 33  | `shared-config`             | **REMOVE** | (stub, only re-exports tsconfig)                                      | tsconfig should live in root config                       |
| 34  | `handbook-lint`             | MOVE       | `tooling/handbook-lint/`                                              | Tooling, not a package                                    |
| 35  | `runtime`                   | **RENAME** | → `runtime-orchestrator`                                              | Clarify role as top-level orchestrator                    |
| 36  | `runtime-adapters`          | KEEP       | `packages/runtime/@agentx/runtime-adapters`                           | Move to correct layer                                     |
| 37  | `runtime-production`        | KEEP       | `packages/runtime/@agentx/runtime-production`                         | Move to correct layer                                     |
| 38  | `enterprise-runtime`        | KEEP       | `packages/runtime/@agentx/enterprise-runtime`                         | Move to correct layer                                     |

---

## D. Migration Plan

### Phase 1: Foundation (No Breaking Changes)

1. Create `packages/shared/@agentx/cognitive-infra` — extract shared CheckpointManager, EventBus, HookManager, RecoveryManager patterns from existing packages into a reusable shared package. This is additive — existing packages can gradually adopt it.

2. Move `handbook-lint` from `packages/` to `tooling/handbook-lint/`.

3. Remove stub packages: `auth`, `plugin-sdk`, `shared-config`.

### Phase 2: Package Restructuring

4. Create domain directories: `packages/shared/`, `packages/runtime/`, `packages/cognitive/`, `packages/reasoning/`, `packages/workflow/`, `packages/agent/`, `packages/planning/`, `packages/distributed/`, `packages/provider/`, `packages/quality/`, `packages/platform/`.

5. Move packages into their domain directories.

6. Rename `runtime` → `runtime-orchestrator`.

### Phase 3: Package Mergers

7. Merge `multi-agent-collaboration` + `multi-agent-reasoning` → `@agentx/multi-agent` using DDD structure from `multi-agent-reasoning`.

8. Merge `vendor-certification` + `provider-qualification` → `@agentx/provider-qualification`.

9. Remove `planning-engine` (redundant with `goal-intelligence`).

### Phase 4: Tool SDK Split

10. Split `tool-sdk` (73 files) into:
    - `@agentx/tool-core` — interfaces, registry, validation, classification, permissions
    - `@agentx/tool-filesystem` — filesystem read/write/sandbox (11 files)
    - `@agentx/tool-git` — git operations (18 files)
    - `@agentx/tool-shell` — shell execution (17 files)
    - `@agentx/tool-approval` — approval workflows (18 files)

### Phase 5: Documentation Restructuring

11. Move 65 root-level markdown files into `docs/` hierarchy:
    - `ARCHITECTURE.md`, `AGENTX_ARCHITECTURE_ANALYSIS.md`, `ARCHITECTURE_READINESS_REVIEW.md` → `docs/architecture/`
    - `DOCUMENTATION_M*.md` → `docs/milestones/`
    - `IMPLEMENTATION_REPORT_*.md` → `docs/milestones/`
    - `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_CHECKLIST.md`, `TASK_BREAKDOWN.md`, `PROJECT_TIMELINE.md` → `docs/design/`
    - `DEVELOPMENT.md`, `CONTRIBUTING.md` → `docs/guides/`
    - `README.md` stays at root

### Phase 6: Configuration Cleanup

12. Consolidate configuration files:
    - `tsconfig.base.json`, `tsconfig.eslint.json` stay at root
    - `shared-config` package removed (tsconfig re-export unnecessary)
    - `agentx.config.yaml` stays at root

---

## E. Risk Assessment

| Risk                                 | Likelihood | Impact | Mitigation                                     |
| ------------------------------------ | ---------- | ------ | ---------------------------------------------- |
| Breaking workspace:* references      | High       | Medium | Update all package.json imports in single pass |
| Breaking tsconfig paths              | High       | Medium | Update `tsconfig.json` project references      |
| Breaking import statements in source | Medium     | Low    | TypeScript compiler catches all breakages      |
| Breaking test imports                | Medium     | Low    | Run full test suite after each phase           |
| Losing commit history on moves       | Low        | Low    | Use `git mv` for all moves                     |
| Breaking CI pipeline                 | Medium     | Low    | CI runs after each phase                       |

**Key Principle:** Each phase is independently committable. The repository must remain buildable and testable after each phase.

---

## F. Dependency Graph (New Structure)

```
Layer 0: shared
    @agentx/shared
    @agentx/cognitive-infra (NEW - shared infra patterns)
    @agentx/tool-core (extracted from tool-sdk)

Layer 1: runtime
    @agentx/core-runtime
    @agentx/secrets
    @agentx/memory-engine
    @agentx/context-engine
    @agentx/knowledge-engine

Layer 2: cognitive
    @agentx/cognitive-contracts
    @agentx/cognitive-kernel
    @agentx/cognitive-learning
    @agentx/autonomous-cognition

Layer 3: reasoning
    @agentx/reasoning-framework
    @agentx/reasoning-algorithms

Layer 4: workflow
    @agentx/workflow-engine
    @agentx/workflow-orchestration
    @agentx/workflow-hardening

Layer 5: agent
    @agentx/agent-platform
    @agentx/multi-agent (MERGED)

Layer 6: planning
    @agentx/goal-intelligence

Layer 7: distributed
    @agentx/distributed-cognition

Layer 8: provider
    @agentx/provider-sdk
    @agentx/provider-qualification (MERGED)
    @agentx/native-providers
    @agentx/provider-release

Layer 9: tool
    @agentx/tool-filesystem (SPLIT)
    @agentx/tool-git (SPLIT)
    @agentx/tool-shell (SPLIT)
    @agentx/tool-approval (SPLIT)

Layer 10: runtime (orchestration)
    @agentx/runtime-orchestrator (RENAMED)
    @agentx/runtime-adapters
    @agentx/runtime-production
    @agentx/enterprise-runtime

Layer 11: quality
    @agentx/production-quality
    @agentx/architecture-sdk

Layer 12: platform
    @agentx/developer-platform

Applications:
    apps/cli
    apps/dashboard (FUTURE)
    apps/playground (FUTURE)
```

**Dependency Rule:** Layer N may only depend on layers 0 through N-1. No upward dependencies.

---

## G. Final Repository Tree

```
agentx/
├── .changeset/
├── .github/
│   ├── workflows/ci.yml
│   ├── ISSUE_TEMPLATE/
│   ├── PULL_REQUEST_TEMPLATE/
│   └── CODEOWNERS
├── .husky/
├── apps/
│   ├── cli/
│   ├── dashboard/                    # [FUTURE]
│   └── playground/                   # [FUTURE]
├── docs/
│   ├── architecture/
│   ├── design/
│   ├── api/
│   ├── guides/
│   ├── deployment/
│   ├── operations/
│   └── milestones/
├── packages/
│   ├── shared/
│   │   ├── @agentx/shared
│   │   ├── @agentx/cognitive-infra
│   │   └── @agentx/tool-core
│   ├── runtime/
│   │   ├── @agentx/core-runtime
│   │   ├── @agentx/secrets
│   │   ├── @agentx/memory-engine
│   │   ├── @agentx/context-engine
│   │   └── @agentx/knowledge-engine
│   ├── cognitive/
│   │   ├── @agentx/cognitive-contracts
│   │   ├── @agentx/cognitive-kernel
│   │   ├── @agentx/cognitive-learning
│   │   └── @agentx/autonomous-cognition
│   ├── reasoning/
│   │   ├── @agentx/reasoning-framework
│   │   └── @agentx/reasoning-algorithms
│   ├── workflow/
│   │   ├── @agentx/workflow-engine
│   │   ├── @agentx/workflow-orchestration
│   │   └── @agentx/workflow-hardening
│   ├── agent/
│   │   ├── @agentx/agent-platform
│   │   └── @agentx/multi-agent
│   ├── planning/
│   │   └── @agentx/goal-intelligence
│   ├── distributed/
│   │   └── @agentx/distributed-cognition
│   ├── provider/
│   │   ├── @agentx/provider-sdk
│   │   ├── @agentx/provider-qualification
│   │   ├── @agentx/native-providers
│   │   └── @agentx/provider-release
│   ├── tool/
│   │   ├── @agentx/tool-filesystem
│   │   ├── @agentx/tool-git
│   │   ├── @agentx/tool-shell
│   │   └── @agentx/tool-approval
│   ├── runtime/
│   │   ├── @agentx/runtime-orchestrator
│   │   ├── @agentx/runtime-adapters
│   │   ├── @agentx/runtime-production
│   │   └── @agentx/enterprise-runtime
│   ├── quality/
│   │   ├── @agentx/production-quality
│   │   └── @agentx/architecture-sdk
│   └── platform/
│       └── @agentx/developer-platform
├── prisma/
├── prompts/
├── scripts/
│   ├── build/
│   ├── release/
│   ├── maintenance/
│   └── dev/
├── tooling/
│   ├── eslint-plugin/
│   └── handbook-lint/
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── tsconfig.base.json
├── tsconfig.json
├── turbo.json
├── agentx.config.yaml
├── docker-compose.yml
├── README.md
└── R0_REPOSITORY_REFACTORING_PLAN.md
```

---

## H. Implementation Order

| Phase        | Description                                                 | Estimated Effort | Risk     |
| ------------ | ----------------------------------------------------------- | ---------------- | -------- |
| **Phase 1**  | Remove stubs (auth, plugin-sdk, shared-config)              | 1 hour           | Very Low |
| **Phase 2**  | Move handbook-lint to tooling/                              | 30 min           | Very Low |
| **Phase 3**  | Create domain directories + move packages (no renames)      | 4 hours          | Low      |
| **Phase 4**  | Rename runtime → runtime-orchestrator                       | 2 hours          | Medium   |
| **Phase 5**  | Merge multi-agent-collaboration + multi-agent-reasoning     | 8 hours          | Medium   |
| **Phase 6**  | Merge vendor-certification + provider-qualification         | 6 hours          | Medium   |
| **Phase 7**  | Remove planning-engine (verify goal-intelligence covers it) | 2 hours          | Low      |
| **Phase 8**  | Split tool-sdk into 5 packages                              | 8 hours          | Medium   |
| **Phase 9**  | Create cognitive-infra shared package                       | 12 hours         | Medium   |
| **Phase 10** | Restructure docs/                                           | 4 hours          | Very Low |
| **Phase 11** | Update all workspace references + tsconfig                  | 4 hours          | Medium   |
| **Phase 12** | Fix circular dependency (agent-platform ↔ provider-sdk)     | 6 hours          | High     |
| **Phase 13** | Full regression test                                        | 4 hours          | Medium   |
| **Total**    |                                                             | **~56 hours**    |          |

---

## I. Estimated Migration Effort

| Category                              | Packages Affected | Hours         |
| ------------------------------------- | ----------------- | ------------- |
| Package moves (directory restructure) | 38                | 4             |
| Package mergers                       | 3 pairs           | 14            |
| Package splits                        | 1 (tool-sdk)      | 8             |
| Package renames                       | 1 (runtime)       | 2             |
| Package removals                      | 3 stubs           | 1             |
| Shared infra extraction               | 1 new package     | 12            |
| Import path updates                   | ~200 files        | 4             |
| tsconfig updates                      | 1                 | 1             |
| CI/CD updates                         | 1                 | 2             |
| Documentation restructuring           | 65 files          | 4             |
| Regression testing                    | 38 packages       | 4             |
| **Total**                             |                   | **~56 hours** |

---

## J. Architecture Review

### Dependency Rule Compliance

The proposed structure enforces strict layering:

```
Layer 0 (shared) ← Layer 1 (runtime) ← Layer 2 (cognitive) ← ... ← Layer 12 (platform)
```

No layer may depend on a layer above it. This eliminates circular dependencies by construction.

### Remaining Circular Dependency

The `agent-platform → provider-sdk → provider-qualification → agent-platform` cycle must be broken. Recommended fix:

- `agent-platform` should NOT depend on `provider-sdk`
- `provider-sdk` should depend on `agent-platform` (providers use agents)
- OR: Extract provider interfaces from `provider-sdk` into a separate `provider-interfaces` package in Layer 1, breaking the cycle

### Scalability Assessment

| Constraint      | Current                       | After R0                             | At 100+ packages                  |
| --------------- | ----------------------------- | ------------------------------------ | --------------------------------- |
| Flat namespace  | 38 packages, hard to navigate | 34 packages in 13 domain directories | Domain directories scale linearly |
| Ownership       | Ambiguous                     | One team per domain directory        | Clear CODEOWNERS per domain       |
| CI pipeline     | Single                        | Can add per-domain pipelines         | Domain-level CI/CD                |
| Version domain  | Global 0.1.0                  | Per-package versions possible        | Independent versioning            |
| Build selection | Full rebuild                  | Domain-level builds                  | Selective builds                  |

The proposed structure will scale to 100+ packages and 500+ contributors because:

1. Domain directories provide natural team boundaries
2. Layer rules prevent accidental coupling
3. Each domain can be owned by a separate team
4. CI/CD can be scoped to changed domains
5. Documentation hierarchy matches code hierarchy

### Zero Vendor Lock-in

No external vendor dependencies are introduced. All 8 external packages (`bullmq`, `ioredis`, `lru-cache`, `chalk`, `glob`, `yaml`, `@anthropic-ai/sdk`, `@google/generative-ai`) remain as-is.

---

## R0 Repository Refactoring Plan — COMPLETE

**Next Steps:**

1. Architecture Review Approval
2. Execute Phase 1 (stub removal) — 1 hour
3. Execute Phase 3 (directory restructure) — 4 hours
4. Full regression test
5. Continue through phases sequentially

**No feature implementation. No API changes. No test changes. Only repository organization.**
