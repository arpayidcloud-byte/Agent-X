# TASK BREAKDOWN — agentx Platform

**Version:** 1.0-draft  
**Date:** 2026-07-14  
**Authority:** Engineering Execution Program v1.0  
**Status:** Awaiting Project Owner approval

> Complexity Legend: **XS** = <0.5d | **S** = 0.5–1d | **M** = 1–2d | **L** = 2–4d | **XL** = 4–7d | **XXL** = >7d  
> Prefix: `P0-` Phase 0, `P1-` Phase 1, etc. | Prefix `B` = Blocker ID from IMPLEMENTATION_PLAN.md

---

## PHASE 0 — Foundation Validation

### Milestone M0.1: CI Infrastructure

#### Epic E0.1.1: Monorepo Scaffold

| ID     | Task                                                                                                    | Complexity | Depends On     | Blocker? | ADR/RFC          |
| ------ | ------------------------------------------------------------------------------------------------------- | ---------- | -------------- | -------- | ---------------- |
| T-0001 | Initialize pnpm workspace with `packages/` and `apps/` layout per Vol 1 Ch.4                            | S          | —              | —        | Vol 1            |
| T-0002 | Configure TypeScript `strict: true` for all packages, no `any` in public interfaces                     | S          | T-0001         | —        | RFC-0042         |
| T-0003 | Configure ESLint + Prettier base rules across all packages                                              | S          | T-0001         | —        | RFC-0042         |
| T-0004 | Configure `jest` (or `vitest`) as test runner across all packages                                       | S          | T-0001         | —        | Vol 14           |
| T-0005 | Configure `tsconfig.json` path aliases for cross-package imports                                        | S          | T-0002         | —        | Vol 1            |
| T-0006 | Add `docker-compose.yml` with PostgreSQL 16 + Redis 7 (self-hosted baseline)                            | M          | T-0001         | —        | ADR-0007, Vol 11 |
| T-0007 | Configure Prisma with initial empty schema targeting PostgreSQL                                         | S          | T-0001, T-0006 | —        | Vol 6            |
| T-0008 | Add `agentx.config.yaml` schema (defaultProvider, maxParallelAgents, retryCapPerNode, workingDirectory) | S          | T-0001         | —        | Vol 9 Ch.5       |

#### Epic E0.1.2: Handbook Lint Tooling (RFC-0040)

| ID     | Task                                                                                                                                                  | Complexity | Depends On             | Blocker? | ADR/RFC                      |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------- | -------- | ---------------------------- |
| T-0009 | Create `tooling/handbook-lint/` package scaffold                                                                                                      | S          | T-0001                 | **B-03** | RFC-0040                     |
| T-0010 | Implement `schema-lint-handbook`: validates `04-Schemas/*.json` compile + all Volume-referenced interfaces exist                                      | L          | T-0009                 | **B-03** | RFC-0040                     |
| T-0011 | Implement `xref-lint-handbook`: validates RFC/ADR/Volume cross-references, orphan detection                                                           | L          | T-0009                 | **B-03** | RFC-0040                     |
| T-0012 | Implement `template-lint-handbook`: validates required sections, minimum line counts (RFC-0031), alternatives count, observability section (RFC-0033) | L          | T-0009                 | **B-03** | RFC-0040, RFC-0031, RFC-0033 |
| T-0013 | Wire all three linters into GitHub Actions workflow `handbook-lint.yml`                                                                               | M          | T-0010, T-0011, T-0012 | **B-03** | RFC-0040                     |

#### Epic E0.1.3: ESLint Custom Rules

| ID     | Task                                                                                                  | Complexity | Depends On             | Blocker? | ADR/RFC                  |
| ------ | ----------------------------------------------------------------------------------------------------- | ---------- | ---------------------- | -------- | ------------------------ |
| T-0014 | Implement ESLint rule: flag any log statement containing variable from `CredentialResolver.resolve()` | M          | T-0003                 | **B-02** | ADR-0012, RFC-0023       |
| T-0015 | Implement ESLint rule: flag string literals matching `AGENTX_SECRET_` prefix in log calls             | M          | T-0003                 | **B-02** | ADR-0012                 |
| T-0016 | Implement ESLint rule: flag any import of vendor SDK outside `packages/provider-sdk/providers/*`      | M          | T-0003                 | —        | Constitution Principle 3 |
| T-0017 | Wire custom ESLint rules into CI pipeline                                                             | S          | T-0014, T-0015, T-0016 | —        | ADR-0012                 |

#### Epic E0.1.4: JSON Schema Validation CI

| ID     | Task                                                                                         | Complexity | Depends On | Blocker? | ADR/RFC         |
| ------ | -------------------------------------------------------------------------------------------- | ---------- | ---------- | -------- | --------------- |
| T-0018 | Add CI step: validate `04-Schemas/volume-02.schema.json` against Vol 2 TypeScript interfaces | M          | T-0013     | —        | Vol 2, ADR-0009 |
| T-0019 | Add CI step: validate `04-Schemas/volume-04.schema.json` against Vol 4 TypeScript interfaces | M          | T-0013     | —        | Vol 4, ADR-0009 |
| T-0020 | Add CI step: validate `04-Schemas/volume-07.schema.json` against Vol 7 TypeScript interfaces | M          | T-0013     | —        | Vol 7, ADR-0009 |

### Milestone M0.2: Governance Gaps Resolution

#### Epic E0.2.1: Performance Targets Ratification

| ID     | Task                                                                                   | Complexity | Depends On | Blocker? | ADR/RFC                |
| ------ | -------------------------------------------------------------------------------------- | ---------- | ---------- | -------- | ---------------------- |
| T-0021 | Author RFC to ratify performance targets (p95 latencies from `PERFORMANCE_TARGETS.md`) | M          | —          | **B-01** | PERFORMANCE_TARGETS.md |
| T-0022 | After RFC accepted: author ADR recording final performance targets                     | S          | T-0021     | **B-01** | PERFORMANCE_TARGETS.md |

#### Epic E0.2.2: Diagrams

| ID     | Task                                                                                                         | Complexity | Depends On | Blocker? | ADR/RFC             |
| ------ | ------------------------------------------------------------------------------------------------------------ | ---------- | ---------- | -------- | ------------------- |
| T-0023 | Produce/verify interaction-matrix diagram in Mermaid (source: Vol 2 Ch.2 event table + Vol 1 Ch.3 dep table) | M          | —          | —        | ADR-0015            |
| T-0024 | Produce/verify task lifecycle sequence diagram (Operator → Orchestrator → Agent → Tool → Approval Gate)      | M          | —          | —        | Vol 2, 07-Diagrams/ |
| T-0025 | Produce/verify provider failover sequence diagram                                                            | S          | —          | —        | Vol 4, 07-Diagrams/ |

#### Epic E0.2.3: Contract Test Templates

| ID     | Task                                                                                                       | Complexity | Depends On | Blocker? | ADR/RFC            |
| ------ | ---------------------------------------------------------------------------------------------------------- | ---------- | ---------- | -------- | ------------------ |
| T-0026 | Verify `08-Examples/volume-02-core-runtime/contract.test.ts` covers all FR from Vol 2                      | S          | —          | —        | ADR-0009, RFC-0018 |
| T-0027 | Verify `08-Examples/volume-04-provider-platform/contract.test.ts` covers ADR-0003 two-adapter requirement  | S          | —          | —        | ADR-0009           |
| T-0028 | Verify `08-Examples/volume-07-tool-sdk/contract.test.ts` covers ADR-0004 fail-closed and ADR-0005 fs.write | S          | —          | —        | ADR-0009           |

---

## PHASE 1 — Core Runtime

### Milestone M1.1: Secrets Package (must be first — see B-01 critical path)

#### Epic E1.1.1: SecretStore Interface & Env Var Backend

| ID     | Task                                                                                                                                                         | Complexity | Depends On     | Blocker? | ADR/RFC            |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | -------------- | -------- | ------------------ |
| T-0101 | Create `packages/secrets/` package scaffold with TypeScript interfaces                                                                                       | S          | T-0001         | —        | Vol 16             |
| T-0102 | Define `SecretStore`, `SecretEntry`, `SecretMetadata` interfaces                                                                                             | S          | T-0101         | —        | Vol 16 Ch.1        |
| T-0103 | Define error types: `OperationNotSupportedError`, `SecretAccessError`, `SecretNotFoundError`                                                                 | S          | T-0101         | —        | RFC-0022, RFC-0023 |
| T-0104 | Implement `EnvVarSecretStore`: `get()` reads `process.env[AGENTX_SECRET_{PROVIDER}_{KEY}]`, `set()`/`delete()`/`rotate()` throw `OperationNotSupportedError` | M          | T-0102, T-0103 | —        | RFC-0022, ADR-0012 |
| T-0105 | Implement negative cache (5s TTL) for missing secrets                                                                                                        | S          | T-0104         | —        | RFC-0023           |
| T-0106 | Contract test: `EnvVarSecretStore.get()` returns value; `set()` throws; missing key throws with correct message format                                       | M          | T-0104         | —        | ADR-0009, RFC-0022 |

#### Epic E1.1.2: Credential Resolver

| ID     | Task                                                                                                                      | Complexity | Depends On     | Blocker? | ADR/RFC            |
| ------ | ------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------- | -------- | ------------------ |
| T-0107 | Define `CredentialResolver` interface: `resolve`, `resolveMetadata`, `invalidate`, `invalidateAll`                        | S          | T-0102         | —        | Vol 16 Ch.2        |
| T-0108 | Implement `CachedCredentialResolver`: LRU in-memory cache, default 5-min TTL, configurable via `AGENTX_CREDENTIAL_TTL_MS` | L          | T-0107, T-0104 | —        | RFC-0023           |
| T-0109 | Implement `RedactedString` proxy: `toString()`/`JSON.stringify()` return `"[REDACTED]"`                                   | M          | T-0108         | —        | RFC-0023           |
| T-0110 | Contract test: `resolve()` returns `RedactedString`; monkey-patch `console.log` and assert no output contains raw value   | M          | T-0108, T-0109 | —        | RFC-0023, ADR-0009 |
| T-0111 | Contract test: cache hit returns same value; TTL expiry forces re-fetch from backend                                      | M          | T-0108         | —        | RFC-0023           |
| T-0112 | Contract test: `invalidate()` evicts key; next `resolve()` fetches fresh                                                  | S          | T-0108         | —        | RFC-0023           |

### Milestone M1.2: Core Runtime Package

#### Epic E1.2.1: Event Bus

| ID     | Task                                                                                                   | Complexity | Depends On     | Blocker? | ADR/RFC            |
| ------ | ------------------------------------------------------------------------------------------------------ | ---------- | -------------- | -------- | ------------------ |
| T-0113 | Create `packages/core-runtime/` package scaffold                                                       | S          | T-0001         | —        | Vol 2              |
| T-0114 | Define `EventEnvelope<T>` interface: `id`, `topic`, `traceId`, `occurredAt`, `payload`, `sourceModule` | S          | T-0113         | —        | Vol 2 Ch.2         |
| T-0115 | Define `EventBus` interface: `publish<T>`, `subscribe<T>`                                              | S          | T-0113         | —        | Vol 2 Ch.2         |
| T-0116 | Define `EventTopic` enum with all 9 canonical topics (from Vol 2 Ch.2 + Vol 16)                        | S          | T-0113         | **B-09** | Vol 2 Ch.2         |
| T-0117 | Implement `BullMQEventBus`: at-least-once delivery, dedup on `event.id` per consumer                   | L          | T-0115, T-0116 | —        | ADR-0001, RFC-0002 |
| T-0118 | Contract test: duplicate publish with same `event.id` → handler called exactly once                    | M          | T-0117         | —        | ADR-0001           |
| T-0119 | Contract test: handler failure → message re-queued (at-least-once)                                     | M          | T-0117         | —        | ADR-0001           |

#### Epic E1.2.2: Task State Machine

| ID     | Task                                                                                                                      | Complexity | Depends On     | Blocker? | ADR/RFC              |
| ------ | ------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------- | -------- | -------------------- |
| T-0120 | Define `Task` interface: `id`, `goal`, `state`, `parentTaskId?`, `assignedAgentRole`, `traceId`, `createdAt`, `updatedAt` | S          | T-0113         | —        | Vol 2 Ch.1           |
| T-0121 | Define `TaskState` enum: `Queued`, `Planning`, `AwaitingApproval`, `Running`, `Completed`, `Failed`, `Cancelled`          | XS         | T-0113         | —        | Vol 2 Ch.1           |
| T-0122 | Implement state machine transition validator: allows only valid transitions, throws on invalid                            | M          | T-0120, T-0121 | —        | RFC-0003, Vol 2 Ch.1 |
| T-0123 | Implement optimistic locking via `updatedAt` to prevent race conditions on concurrent writes (mitigates T-015)            | M          | T-0122         | —        | THREAT_MODEL T-015   |
| T-0124 | Contract test: all 8 valid transitions succeed; all invalid transitions throw                                             | M          | T-0122         | —        | ADR-0009, RFC-0003   |
| T-0125 | Contract test: concurrent writers on same task — only one transition wins                                                 | M          | T-0123         | —        | Vol 2 NFR-1          |

#### Epic E1.2.3: Scheduler

| ID     | Task                                                                                                                 | Complexity | Depends On     | Blocker? | ADR/RFC              |
| ------ | -------------------------------------------------------------------------------------------------------------------- | ---------- | -------------- | -------- | -------------------- |
| T-0126 | Define `Scheduler` interface: `enqueue`, `pause`, `resume`                                                           | S          | T-0113         | —        | Vol 2 Ch.3           |
| T-0127 | Implement `BullMQScheduler`: enqueue task to BullMQ; `pause(taskId)` halts job processing; `resume(taskId)` restores | L          | T-0126, T-0117 | —        | Vol 2 Ch.3           |
| T-0128 | Implement concurrency control: `maxParallelAgents` config enforcement (default 2 per graph)                          | M          | T-0127         | —        | Vol 2 Ch.3           |
| T-0129 | Implement exponential backoff retry policy: max 3 attempts, configurable, `RetryPolicy` interface                    | M          | T-0127         | —        | Vol 2 Ch.5           |
| T-0130 | Contract test: `pause()` prevents new jobs from starting; `resume()` allows processing                               | M          | T-0127         | —        | ADR-0009, Vol 2 FR-3 |
| T-0131 | Contract test: task exceeding max retries → transitions to `Failed` state                                            | M          | T-0129         | —        | Vol 2 Ch.5           |

#### Epic E1.2.4: Orchestrator & Decomposer Interface

| ID     | Task                                                                                                   | Complexity | Depends On             | Blocker? | ADR/RFC             |
| ------ | ------------------------------------------------------------------------------------------------------ | ---------- | ---------------------- | -------- | ------------------- |
| T-0132 | Define `Decomposer` interface: `decompose(req): Promise<DecompositionResult>`                          | S          | T-0113                 | —        | Vol 2 Ch.4          |
| T-0133 | Define `DecompositionRequest`, `DecomposedTask`, `DecompositionResult` types                           | S          | T-0113                 | —        | Vol 2 Ch.4          |
| T-0134 | Implement `Orchestrator`: accepts goal, creates Task, invokes `Decomposer`, dispatches to Scheduler    | L          | T-0122, T-0127, T-0132 | —        | Vol 2 Ch.4          |
| T-0135 | Implement `traceId` generation and propagation: every Task and EventEnvelope carries same root traceId | M          | T-0114, T-0134         | —        | Vol 2 NFR-2, Vol 13 |

### Milestone M1.3: Provider Platform

#### Epic E1.3.1: Provider Interface & Adapters

| ID     | Task                                                                                                                                                                           | Complexity | Depends On             | Blocker? | ADR/RFC                   |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ---------------------- | -------- | ------------------------- |
| T-0136 | Create `packages/provider-sdk/` package scaffold                                                                                                                               | S          | T-0001                 | —        | Vol 4                     |
| T-0137 | Define `Provider` interface: `id`, `complete(req): Promise<CompletionResponse>`                                                                                                | S          | T-0136                 | —        | Vol 4 Ch.1                |
| T-0138 | Define `CompletionRequest`, `CompletionResponse`, `NormalizedToolSpec`, `NormalizedToolCall`, `TokenUsage` types                                                               | M          | T-0136                 | —        | Vol 4 Ch.1                |
| T-0139 | Implement `AnthropicProvider` adapter in `packages/provider-sdk/providers/anthropic/`                                                                                          | XL         | T-0137, T-0138, T-0108 | —        | ADR-0003                  |
| T-0140 | Implement `GoogleProvider` adapter in `packages/provider-sdk/providers/google/`                                                                                                | XL         | T-0137, T-0138, T-0108 | —        | ADR-0003                  |
| T-0141 | Contract test suite (IDENTICAL for both adapters): `complete()` returns normalized response; tool calls normalized; `providerId` set correctly; `latencyMs` > 0; `costUsd` ≥ 0 | L          | T-0139, T-0140         | —        | ADR-0003, ADR-0009        |
| T-0142 | Contract test: switching `DEFAULT_PROVIDER_ID` requires zero code changes outside `provider-sdk`                                                                               | M          | T-0141                 | —        | ADR-0003 NFR-1            |
| T-0143 | Implement provider cost table: per-provider, per-model pricing loaded from config (not hardcoded)                                                                              | M          | T-0139, T-0140         | —        | Vol 4 FR-3                |
| T-0144 | Implement provider failover: HTTP 429/500 → exponential backoff → secondary provider → task Failed (mitigates T-004)                                                           | L          | T-0139, T-0140         | —        | Vol 4, THREAT_MODEL T-004 |
| T-0145 | Contract test: provider failover — primary 503 → secondary responds → `CompletionResponse` returned                                                                            | M          | T-0144                 | —        | ADR-0009                  |

### Milestone M1.4: Structured Logging (Vol 13 bootstrap)

#### Epic E1.4.1: Logging Infrastructure

| ID     | Task                                                                                                                  | Complexity | Depends On | Blocker? | ADR/RFC               |
| ------ | --------------------------------------------------------------------------------------------------------------------- | ---------- | ---------- | -------- | --------------------- |
| T-0146 | Implement structured JSON logger in `packages/shared/`: mandatory fields `timestamp`, `level`, `traceId`, `component` | M          | T-0113     | —        | Vol 13 Ch.3           |
| T-0147 | Enforce `debug` level off by default; enabled via `AGENTX_LOG_LEVEL=debug`                                            | S          | T-0146     | —        | Vol 13 Ch.3, RFC-0042 |
| T-0148 | Contract test: no credential appears in any log at any level — monkey-patch and assert                                | M          | T-0146     | —        | Vol 13 Ch.3, RFC-0023 |

---

## PHASE 2 — SDK Layer

### Milestone M2.1: Tool SDK

#### Epic E2.1.1: Tool Permission System

| ID     | Task                                                                                                       | Complexity | Depends On     | Blocker? | ADR/RFC            |
| ------ | ---------------------------------------------------------------------------------------------------------- | ---------- | -------------- | -------- | ------------------ |
| T-0201 | Create `packages/tool-sdk/` package scaffold                                                               | S          | T-0001         | —        | Vol 7              |
| T-0202 | Define `ToolCategory` enum: `fs.read`, `fs.write`, `shell.build`, `shell.exec`, `git.read`, `git.write`    | XS         | T-0201         | —        | Vol 7 Ch.2         |
| T-0203 | Define `Tool` interface: `name`, `category`, `isDestructive`, `execute(args, ctx): Promise<ToolResult>`    | S          | T-0201         | —        | Vol 7 Ch.1         |
| T-0204 | Define `ToolCallContext`: `agentRole`, `taskId`, `workingDirectory`                                        | S          | T-0201         | —        | Vol 7 Ch.1         |
| T-0205 | Define `ToolResult`: `success`, `output`, `error?`, `exitCode?`, `durationMs?`                             | S          | T-0201         | —        | Vol 7 Ch.1         |
| T-0206 | Define error types: `PermissionDeniedError` (thrown BEFORE I/O), `SandboxViolationError`                   | S          | T-0201         | **M-08** | ADR-0004           |
| T-0207 | Implement `PermissionChecker.isAllowed(agentRole, category): boolean` — fail-closed                        | M          | T-0202, T-0206 | —        | ADR-0004           |
| T-0208 | Contract test: `PermissionChecker` throws `PermissionDeniedError` before any I/O for unauthorized category | M          | T-0207         | —        | ADR-0004, ADR-0009 |
| T-0209 | Contract test: every `fs.write` call classified as `isDestructive = true` regardless of new vs overwrite   | S          | T-0207         | —        | ADR-0005           |

#### Epic E2.1.2: Tool Sandbox

| ID     | Task                                                                                                                                          | Complexity | Depends On | Blocker? | ADR/RFC                        |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------- | -------- | ------------------------------ |
| T-0210 | Implement filesystem jail: resolve `workingDirectory` + requested path via `fs.realpath()`, reject any path escaping (mitigates T-002, T-005) | L          | T-0204     | —        | Vol 7 Ch.5, THREAT_MODEL T-002 |
| T-0211 | Contract test: path traversal attempt (`../../../etc/passwd`) → `SandboxViolationError` thrown BEFORE any I/O                                 | M          | T-0210     | —        | ADR-0009, THREAT_MODEL T-005   |
| T-0212 | Contract test: symlink to path outside `workingDirectory` → `SandboxViolationError` (resolves T-005)                                          | M          | T-0210     | —        | THREAT_MODEL T-005             |
| T-0213 | Implement shell allowlist: `shell.build` executes ONLY commands matching `tools.shell.allowlist[]` in config                                  | M          | T-0204     | **B-04** | Vol 7 Ch.5                     |
| T-0214 | Contract test: shell command not in allowlist → treated as `shell.exec` (destructive, requires approval)                                      | M          | T-0213     | —        | Vol 7 Ch.5                     |
| T-0215 | Implement file size limit: `fs.read` rejects files >10MB by default (mitigates T-014)                                                         | S          | T-0203     | —        | THREAT_MODEL T-014             |

#### Epic E2.1.3: Built-in Tools v0.1

| ID     | Task                                                                                                                  | Complexity | Depends On            | Blocker? | ADR/RFC            |
| ------ | --------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------- | -------- | ------------------ |
| T-0216 | Implement `ReadFileTool` (`fs.read`, not destructive): reads file content, respects sandbox, size limit               | M          | T-0210, T-0215        | —        | Vol 7              |
| T-0217 | Implement `WriteFileTool` (`fs.write`, destructive): writes file, respects sandbox, triggers approval gate            | M          | T-0210                | —        | Vol 7, ADR-0005    |
| T-0218 | Implement `ListDirTool` (`fs.read`, not destructive): lists directory contents within sandbox                         | S          | T-0210                | —        | Vol 7              |
| T-0219 | Implement `ShellBuildTool` (`shell.build`, not destructive): runs allowlisted command, returns stdout/stderr/exitCode | M          | T-0213                | —        | Vol 7              |
| T-0220 | Implement `ShellExecTool` (`shell.exec`, destructive): runs arbitrary shell command, triggers approval gate           | M          | T-0210                | —        | Vol 7              |
| T-0221 | Implement `GitReadTool` (`git.read`, not destructive): `git diff`, `git log`, `git status` within sandbox             | M          | T-0210                | —        | Vol 7              |
| T-0222 | Implement `GitWriteTool` (`git.write`, destructive): `git commit`, `git push`, triggers approval gate                 | M          | T-0210                | —        | Vol 7              |
| T-0223 | Implement `ToolRegistry`: `register(tool)`, `resolve(name, category)` → returns `Tool                                 | undefined` | S                     | T-0203   | —                  | Vol 7 Ch.3 |
| T-0224 | Add STRIDE checklist to each tool implementation file (per RFC-0021, ADR-0011)                                        | M          | T-0216–T-0222         | —        | RFC-0021, ADR-0011 |
| T-0225 | Contract test: every tool — `PermissionChecker.isAllowed()` called before execute (verified via spy)                  | M          | T-0207, T-0216–T-0222 | —        | ADR-0004           |
| T-0226 | Contract test: every destructive tool — publishes `tool.invoked` event to Event Bus (for audit)                       | M          | T-0216–T-0222, T-0117 | —        | Vol 7 NFR-2        |

### Milestone M2.2: Agent Platform

#### Epic E2.2.1: Agent Registry & Roster

| ID     | Task                                                                                                                                                                | Complexity | Depends On     | Blocker? | ADR/RFC              |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------- | -------- | -------------------- |
| T-0227 | Create `packages/agent-platform/` package scaffold                                                                                                                  | S          | T-0001         | —        | Vol 3                |
| T-0228 | Define `AgentRole` enum: `coding`, `review`, `test`, `security` (exactly 4 — ADR-0002)                                                                              | XS         | T-0227         | —        | ADR-0002             |
| T-0229 | Define `Agent` interface: `role`, `run(task, context): Promise<AgentResult>`                                                                                        | S          | T-0227         | —        | Vol 3                |
| T-0230 | Define `AgentResult`: `taskId`, `role`, `output`, `toolCallsMade`, `requiresApproval`                                                                               | S          | T-0227         | —        | Vol 3                |
| T-0231 | Define `AgentDefinition`: `role`, `allowedToolCategories[]`, `systemPromptTemplateId`                                                                               | S          | T-0227         | —        | Vol 3                |
| T-0232 | Implement `AgentRegistry`: `register(def)`, `resolve(role)`, `list()` — populated from static config at boot                                                        | M          | T-0228, T-0231 | —        | Vol 3 Ch.3, ADR-0002 |
| T-0233 | Register 4 v0.1 agents with correct `allowedToolCategories` (coding: read+write+build+lint; review: read+git.read; test: read+write+shell; security: read+git.read) | M          | T-0232         | —        | Vol 3 Ch.2, ADR-0002 |

#### Epic E2.2.2: LLM Decomposer

| ID     | Task                                                                                                                                   | Complexity | Depends On             | Blocker? | ADR/RFC              |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------- | -------- | -------------------- |
| T-0234 | Implement `LlmDecomposer implements Decomposer`: calls `Provider.complete()` with DECOMPOSITION_SYSTEM_PROMPT, schema-validates output | L          | T-0137, T-0132, T-0233 | —        | Vol 3 Ch.4, RFC-0004 |
| T-0235 | Implement `validateDecomposition()`: JSON Schema validation, throws on schema violation (retryable)                                    | M          | T-0234                 | —        | RFC-0004             |
| T-0236 | Wire `LlmDecomposer` into `Orchestrator` via `Decomposer` interface (Vol 2 dependency inversion)                                       | S          | T-0134, T-0234         | —        | Vol 2 Ch.4, Vol 3    |
| T-0237 | Contract test: invalid LLM output → `validateDecomposition()` throws → Orchestrator retries (max 3)                                    | M          | T-0235                 | —        | RFC-0004, ADR-0009   |
| T-0238 | Contract test: cyclic decomposition output → rejected by `buildGraph()` before scheduling                                              | M          | T-0235                 | —        | RFC-0004             |

#### Epic E2.2.3: Specialist Agents

| ID     | Task                                                                                                                              | Complexity | Depends On             | Blocker? | ADR/RFC              |
| ------ | --------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------- | -------- | -------------------- |
| T-0239 | Implement prompt construction pipeline: (1) Role prompt, (2) Constitution excerpt, (3) Task context — always in this order        | M          | T-0231                 | —        | Vol 3 Ch.5           |
| T-0240 | Implement `CodingAgent`: stateless, calls Provider, invokes tools within `allowedToolCategories`                                  | L          | T-0229, T-0239, T-0207 | —        | Vol 3                |
| T-0241 | Implement `ReviewAgent`: read-only tools only (`fs.read`, `git.read`)                                                             | M          | T-0229, T-0239         | —        | Vol 3                |
| T-0242 | Implement `TestAgent`: can write test files, run shell test runner                                                                | M          | T-0229, T-0239         | —        | Vol 3                |
| T-0243 | Implement `SecurityAgent`: read-only advisory output, no blocking in v0.1                                                         | M          | T-0229, T-0239         | —        | Vol 3                |
| T-0244 | Contract test: each agent — tool call outside `allowedToolCategories` → `PermissionDeniedError` (enforced by ToolSDK, not prompt) | M          | T-0240–T-0243, T-0207  | —        | Vol 3 FR-1, ADR-0004 |
| T-0245 | Contract test: `ReviewAgent` and `SecurityAgent` have NO write-capable tools in registry                                          | S          | T-0241, T-0243         | —        | Vol 3 FR-3           |

---

## PHASE 3 — Workflow Layer

### Milestone M3.1: Memory Engine

#### Epic E3.1.1: Database Schema & Migrations

| ID     | Task                                                                                                   | Complexity | Depends On     | Blocker? | ADR/RFC            |
| ------ | ------------------------------------------------------------------------------------------------------ | ---------- | -------------- | -------- | ------------------ |
| T-0301 | Create `packages/memory-engine/` package scaffold                                                      | S          | T-0001         | —        | Vol 6              |
| T-0302 | Define Prisma schema: `Task`, `TaskGraph`, `AgentResult`, `AuditEvent` (append-only), `CostRecord`     | L          | T-0301, T-0007 | —        | Vol 6 Ch.1         |
| T-0303 | Add `record_hash TEXT NOT NULL` and `previous_hash TEXT NOT NULL` columns to `AuditEvent` table        | M          | T-0302         | —        | RFC-0024           |
| T-0304 | Add `prompt_version` table: PK `(agent_id, version)` (RFC-0032)                                        | S          | T-0302         | —        | RFC-0032           |
| T-0305 | Add `role_assignment` table: `(identityId, roleId, scope, scopeId)` (RFC-0026)                         | S          | T-0302         | —        | RFC-0026           |
| T-0306 | Add `org_config` table: PK `(organization_id, key)` (RFC-0037)                                         | S          | T-0302         | —        | RFC-0037           |
| T-0307 | Create `agentx_app` PostgreSQL role with `INSERT, SELECT` only on `audit_log`; REVOKE `UPDATE, DELETE` | M          | T-0302         | **M-12** | ADR-0014           |
| T-0308 | Create PostgreSQL `BEFORE UPDATE OR DELETE` trigger on `audit_log` that raises SQLSTATE 42501          | M          | T-0307         | —        | ADR-0014, RFC-0024 |
| T-0309 | Contract test: attempt UPDATE on `audit_log` → exception thrown (database-level, not application)      | M          | T-0308         | —        | ADR-0014, ADR-0009 |
| T-0310 | Contract test: attempt DELETE on `audit_log` → exception thrown                                        | M          | T-0308         | —        | ADR-0014           |

#### Epic E3.1.2: Audit Service (Chained Hashes)

| ID     | Task                                                                                                                          | Complexity | Depends On     | Blocker? | ADR/RFC            |
| ------ | ----------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------- | -------- | ------------------ |
| T-0311 | Implement `AuditService.append(event)`: computes `SHA-256(previous_hash + serialized_content + timestamp)`, inserts with hash | L          | T-0308         | —        | RFC-0024           |
| T-0312 | Implement genesis record handling: first record uses `"GENESIS"` as `previous_hash`                                           | S          | T-0311         | —        | RFC-0024           |
| T-0313 | Implement `AuditService.verifyChain()`: traverses all records in order, verifies each hash                                    | L          | T-0311         | —        | RFC-0024           |
| T-0314 | Implement `INSERT ... RETURNING id` within same DB transaction as originating state transition                                | M          | T-0311, T-0122 | —        | ADR-0014           |
| T-0315 | Contract test: verify chain passes on unmodified log                                                                          | M          | T-0313         | —        | RFC-0024, ADR-0009 |
| T-0316 | Contract test: manually corrupt a record hash → `verifyChain()` fails at that record                                          | M          | T-0313         | —        | RFC-0024           |

#### Epic E3.1.3: Persistence Interface Implementation

| ID     | Task                                                                                                      | Complexity | Depends On     | Blocker?       | ADR/RFC              |
| ------ | --------------------------------------------------------------------------------------------------------- | ---------- | -------------- | -------------- | -------------------- |
| T-0317 | Implement `Persistence` interface (Vol 2) on Prisma: `saveTask`, `loadTaskContext`, `appendAuditEvent`    | L          | T-0302, T-0311 | —              | Vol 6 FR-1, Vol 2    |
| T-0318 | Implement `TaskContext` retrieval: last-N results (default 10) + rolling summary                          | L          | T-0317         | **B-05, B-06** | RFC-0008, Vol 6 Ch.2 |
| T-0319 | Implement rolling summary via Provider call (same default provider): bounded context window, configurable | M          | T-0318, T-0137 | **B-05**       | Vol 6 Ch.2           |
| T-0320 | Contract test: `TaskContext` result is always bounded — never full history regardless of task count       | M          | T-0318         | —              | Vol 6 FR-2, RFC-0008 |
| T-0321 | Contract test: `appendAuditEvent` is append-only — verify no update/delete code path exists               | S          | T-0317         | —              | Vol 6 FR-3           |

### Milestone M3.2: Workflow Engine

#### Epic E3.2.1: Task Graph

| ID     | Task                                                                                                                      | Complexity | Depends On     | Blocker? | ADR/RFC              |
| ------ | ------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------- | -------- | -------------------- |
| T-0322 | Create `packages/workflow-engine/` package scaffold                                                                       | S          | T-0001         | —        | Vol 5                |
| T-0323 | Define `TaskGraph`: `id`, `nodes: DecomposedTask[]`, `edges: {from, to}[]`                                                | S          | T-0322         | —        | Vol 5 Ch.1           |
| T-0324 | Implement `buildGraph(decomposition)`: topological validation, reject cycles (RFC-0004), reject dangling `dependsOn` refs | L          | T-0323, T-0133 | —        | Vol 5 Ch.1, RFC-0004 |
| T-0325 | Contract test: cyclic graph → `buildGraph()` throws before Scheduler receives anything                                    | M          | T-0324         | —        | RFC-0004, ADR-0009   |
| T-0326 | Contract test: valid DAG → deterministic topological sort (same input → same node execution order)                        | M          | T-0324         | —        | Vol 2 NFR-1          |
| T-0327 | Implement graph execution: eligible nodes (no unresolved deps) dispatched to Scheduler                                    | L          | T-0324, T-0127 | —        | Vol 5 Ch.1           |
| T-0328 | Implement retry-with-feedback: Test Agent failure → route back to Coding Agent (new dependent task)                       | L          | T-0327         | —        | Vol 5 Ch.3           |
| T-0329 | Implement retry cap: max `retryCapPerNode` loops (default 2), escalate to operator at cap                                 | M          | T-0328         | —        | Vol 5 FR-2           |
| T-0330 | Contract test: retry cap exceeded → operator notification, NOT silent fail                                                | M          | T-0329         | —        | Vol 5 FR-2           |

#### Epic E3.2.2: Two-Layer Approval Gate

| ID     | Task                                                                                                                   | Complexity | Depends On             | Blocker? | ADR/RFC              |
| ------ | ---------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------- | -------- | -------------------- |
| T-0331 | Define `WorkflowPolicy` interface: `requiresApprovalBefore(node, graph): boolean`                                      | S          | T-0322                 | —        | Vol 5 Ch.2, RFC-0007 |
| T-0332 | Implement default v0.1 policy: gate before any coding node with "commit" in description                                | M          | T-0331                 | —        | Vol 5 Ch.2 example   |
| T-0333 | Implement policy gate flow: `Scheduler.pause()` → publish `task.approval_required` → wait for `task.approval_resolved` | L          | T-0332, T-0127, T-0117 | —        | Vol 5 Ch.2, RFC-0007 |
| T-0334 | Contract test: policy gate + tool-level gate are BOTH active on a qualifying node (additive, not redundant)            | M          | T-0333, T-0207         | —        | RFC-0007             |
| T-0335 | Contract test: workflow policy gate cannot bypass Vol 7 tool-level gate                                                | M          | T-0333, T-0207         | —        | RFC-0007             |

#### Epic E3.2.3: Task Graph Rollback (RFC-0038 Manual Recovery)

| ID     | Task                                                                                  | Complexity | Depends On    | Blocker? | ADR/RFC            |
| ------ | ------------------------------------------------------------------------------------- | ---------- | ------------- | -------- | ------------------ |
| T-0336 | Emit `task_graph.started` event on graph creation                                     | S          | T-0327        | —        | RFC-0038           |
| T-0337 | Emit `task_node.completed`, `task_node.failed` events per node                        | S          | T-0327        | —        | RFC-0038           |
| T-0338 | Emit `task_graph.failed` event when any node exhausts retries                         | S          | T-0327        | —        | RFC-0038           |
| T-0339 | Emit `task_graph.compensated` event (used in v1.0 saga; emit structure now, no logic) | S          | T-0327        | —        | RFC-0038           |
| T-0340 | Implement `agentx task retry <id>`: re-enqueue graph, skip `Completed` nodes          | M          | T-0327        | —        | RFC-0038           |
| T-0341 | Contract test: failed graph → audit trail contains all 5 required events              | M          | T-0336–T-0339 | —        | RFC-0038, ADR-0009 |

---

## PHASE 4 — Plugin Platform

### Milestone M4.1: Plugin SDK

#### Epic E4.1.1: Manifest & Registry

| ID     | Task                                                                                                                               | Complexity | Depends On     | Blocker? | ADR/RFC              |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------- | -------- | -------------------- |
| T-0401 | Create `packages/plugin-sdk/` package scaffold                                                                                     | S          | T-0001         | —        | Vol 8                |
| T-0402 | Define `PluginManifest` interface: `id`, `version` (semver), `kind`, `entryPoint`, `declaredToolCategories?`, `declaredAgentRole?` | S          | T-0401         | —        | Vol 8 Ch.1           |
| T-0403 | Implement manifest validator: validates before entry point import; rejects invalid manifest (Vol 8 FR-1)                           | M          | T-0402         | —        | Vol 8 FR-1           |
| T-0404 | Contract test: manifest with invalid semver → validation fails BEFORE any module load                                              | M          | T-0403         | —        | Vol 8 FR-1, ADR-0009 |
| T-0405 | Contract test: agent-kind plugin with role colliding with v0.1 roster → validation fails (Vol 8 FR-2)                              | M          | T-0403, T-0232 | —        | Vol 8 FR-2           |

#### Epic E4.1.2: Plugin Sandbox

| ID     | Task                                                                                                         | Complexity | Depends On | Blocker? | ADR/RFC            |
| ------ | ------------------------------------------------------------------------------------------------------------ | ---------- | ---------- | -------- | ------------------ |
| T-0406 | Implement plugin loader: `child_process.fork()` with IPC message port                                        | L          | T-0403     | **B-07** | RFC-0027           |
| T-0407 | Define IPC message envelope schema (typed): `{ type, correlationId, payload }`                               | M          | T-0406     | **B-07** | RFC-0027           |
| T-0408 | Implement custom `require` hook blocking: `child_process`, `fs`, `net`, `dns` (unless in manifest allowlist) | L          | T-0406     | —        | RFC-0027           |
| T-0409 | Implement resource limits: 128MB memory, 30s CPU per `PluginSandboxConfig`                                   | M          | T-0406     | —        | RFC-0027           |
| T-0410 | Contract test: plugin attempting to `require('child_process')` → terminated                                  | M          | T-0408     | —        | RFC-0027, ADR-0009 |
| T-0411 | Contract test: plugin exceeding memory limit → terminated with error in audit log                            | M          | T-0409     | —        | RFC-0027           |

#### Epic E4.1.3: Plugin Lifecycle

| ID     | Task                                                                                                              | Complexity | Depends On     | Blocker? | ADR/RFC     |
| ------ | ----------------------------------------------------------------------------------------------------------------- | ---------- | -------------- | -------- | ----------- |
| T-0412 | Implement plugin lifecycle state machine: Installed → PendingReview → Enabled ↔ Disabled → Uninstalled / Rejected | L          | T-0406         | —        | Vol 8 Ch.3  |
| T-0413 | Implement permission review screen: shows declared categories to operator before Enabled transition               | M          | T-0412         | —        | Vol 8 Ch.4  |
| T-0414 | Contract test: plugin cannot reach Enabled state without permission review step completing                        | M          | T-0412, T-0413 | —        | Vol 8 NFR-1 |
| T-0415 | Contract test: enabling plugin does NOT bypass Vol 7 per-call destructive gating                                  | M          | T-0412, T-0207 | —        | Vol 8       |

---

## PHASE 5 — CLI Platform / v0.1 Release

### Milestone M5.1: CLI Commands

#### Epic E5.1.1: Core Commands

| ID     | Task                                                                                    | Complexity                                      | Depends On     | Blocker?       | ADR/RFC          |
| ------ | --------------------------------------------------------------------------------------- | ----------------------------------------------- | -------------- | -------------- | ---------------- |
| T-0501 | Create `apps/cli/` scaffold with Commander.js or similar                                | M                                               | T-0001         | —              | Vol 9            |
| T-0502 | Implement `agentx submit "<goal>"`: creates Task, triggers Orchestrator, streams status | L                                               | T-0134, T-0501 | —              | Vol 9 Ch.1       |
| T-0503 | Implement `agentx status [taskId                                                        | graphId]`: queries Memory Engine, renders state | M              | T-0317, T-0501 | —                | Vol 9 Ch.3 |
| T-0504 | Implement `agentx watch [graphId]`: subscribes to Event Bus, streams state transitions  | L                                               | T-0117, T-0501 | —              | Vol 9 Ch.3       |
| T-0505 | Implement `agentx approve <taskId>` / `agentx reject <taskId>`: resolves approval gate  | L                                               | T-0333, T-0501 | —              | Vol 9 Ch.2       |
| T-0506 | Implement `agentx cost [graphId]`: read-only query of `CostRecord` aggregation          | M                                               | T-0317, T-0501 | —              | Vol 9 Ch.3, FR-3 |
| T-0507 | Implement `agentx audit [graphId]`: read-only query of `AuditEvent` trail               | M                                               | T-0317, T-0501 | —              | Vol 9 Ch.3, FR-3 |
| T-0508 | Implement `agentx audit verify`: calls `AuditService.verifyChain()`                     | M                                               | T-0313, T-0501 | —              | RFC-0024         |
| T-0509 | Implement `agentx config get/set`: reads/writes `agentx.config.yaml`                    | M                                               | T-0008, T-0501 | —              | Vol 9 Ch.5       |
| T-0510 | Implement `agentx task retry <id>`: re-enqueue graph, skipping completed nodes          | M                                               | T-0340, T-0501 | —              | RFC-0038         |

#### Epic E5.1.2: Plugin Management Commands

| ID     | Task                                                                                      | Complexity | Depends On             | Blocker? | ADR/RFC           |
| ------ | ----------------------------------------------------------------------------------------- | ---------- | ---------------------- | -------- | ----------------- |
| T-0511 | Implement `agentx plugin install <package>`: validates manifest, permission review screen | L          | T-0412, T-0413, T-0501 | —        | Vol 9 Ch.4, Vol 8 |
| T-0512 | Implement `agentx plugin enable/disable <id>`: lifecycle transitions                      | M          | T-0412, T-0501         | —        | Vol 9 Ch.4        |
| T-0513 | Implement `agentx plugin list`: shows all plugins with lifecycle state                    | M          | T-0412, T-0501         | —        | Vol 9 Ch.4        |

#### Epic E5.1.3: Approval Gate UX

| ID     | Task                                                                                                                                                         | Complexity | Depends On     | Blocker? | ADR/RFC               |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | -------------- | -------- | --------------------- |
| T-0514 | Implement approval prompt: shows (1) which tool/node triggered gate, (2) exact action (diff/command), (3) `[a]pprove / [r]eject` with NO default, NO timeout | L          | T-0505, T-0333 | —        | Vol 9 Ch.2, RFC-0010  |
| T-0515 | Contract test: prompt has no default option — must receive explicit input                                                                                    | M          | T-0514         | —        | RFC-0010, Vol 9 NFR-1 |
| T-0516 | Contract test: CLI output at all verbosity levels — assert no credential substring appears                                                                   | M          | T-0514, T-0501 | —        | Vol 9 Security        |

#### Epic E5.1.4: v0.1 Exit Criteria Validation

| ID     | Task                                                                                                | Complexity | Depends On     | Blocker? | ADR/RFC                      |
| ------ | --------------------------------------------------------------------------------------------------- | ---------- | -------------- | -------- | ---------------------------- |
| T-0517 | End-to-end test: `agentx submit` → decompose → plan → execute → approve → result (no-approval goal) | XL         | T-0502–T-0510  | —        | Vol 1 Ch.6 exit criterion #3 |
| T-0518 | End-to-end test: destructive tool call → approval gate fires → approve → resumes                    | L          | T-0517         | —        | Vol 1 Ch.6                   |
| T-0519 | End-to-end test: provider failover — primary fails → secondary responds                             | M          | T-0144, T-0517 | —        | ADR-0003                     |
| T-0520 | Verify `docker-compose up` brings up working self-hosted stack (Postgres + Redis + app)             | M          | T-0006, T-0517 | —        | ADR-0007, Vol 14 Ch.4        |
| T-0521 | Verify `04-Schemas/` populated for Volumes 2–9 (schema CI validation passes)                        | M          | T-0018–T-0020  | —        | EEP v0.1 exit criteria       |

---

## PHASE 6 — Identity & Access

### Milestone M6.1: Identity Foundation (v0.1 local mode wired at Phase 5; v0.5 token here)

#### Epic E6.1.1: Identity Interfaces

| ID     | Task                                                                                                           | Complexity | Depends On | Blocker? | ADR/RFC               |
| ------ | -------------------------------------------------------------------------------------------------------------- | ---------- | ---------- | -------- | --------------------- |
| T-0601 | Create `packages/auth/` package scaffold                                                                       | S          | T-0001     | —        | Vol 15                |
| T-0602 | Define `Identity` interface: `id`, `externalId`, `authMode`, `roles`, `metadata`                               | S          | T-0601     | —        | Vol 15 Ch.3           |
| T-0603 | Define `IdentityProvider` interface: `mode`, `authenticate`, `validate`, `revoke`                              | S          | T-0601     | —        | Vol 15 Ch.3           |
| T-0604 | Define `AuthContext` discriminated union: local / token / sso                                                  | S          | T-0601     | —        | Vol 15 Ch.3           |
| T-0605 | Implement `LocalIdentityProvider`: derives `Identity` from `os.userInfo().username`                            | M          | T-0603     | —        | Vol 15 Ch.1           |
| T-0606 | Implement startup guard: reject `AUTH_MODE=local` when `AGENTX_NETWORK_ACCESS=true`                            | S          | T-0605     | —        | Vol 15 Ch.1           |
| T-0607 | Implement `IRoleResolver` with `LocalRoleResolver`: returns `['owner']` for local mode                         | M          | T-0605     | —        | RFC-0026, Vol 15 Ch.4 |
| T-0608 | Implement `RBACBridge.checkPermission()`: 4-tier resolution (explicit deny → role deny → role allow → default) | L          | T-0607     | —        | Vol 15 Ch.4           |
| T-0609 | Contract test: local mode derives Identity from OS username                                                    | S          | T-0605     | —        | ADR-0009, Vol 15 FR-1 |
| T-0610 | Contract test: unrecognized role → zero permissions (fail-closed)                                              | M          | T-0608     | —        | RFC-0012, Vol 15 Ch.4 |

#### Epic E6.1.2: Token Auth (v0.5)

| ID     | Task                                                                                                            | Complexity | Depends On     | Blocker? | ADR/RFC                  |
| ------ | --------------------------------------------------------------------------------------------------------------- | ---------- | -------------- | -------- | ------------------------ |
| T-0611 | Implement `TokenIdentityProvider`: validates JWT (RS256), checks expiry, maps `sub` to `Identity.id`            | L          | T-0603         | —        | Vol 15 Ch.1              |
| T-0612 | Implement JWT issuance: access token 15-min, refresh token 24-hr, signed via Vol 16 `KeyProvider`               | L          | T-0611, T-0107 | —        | Vol 15 Ch.1, Vol 16 Ch.6 |
| T-0613 | Implement `agentx login` command, `agentx auth revoke-session`                                                  | L          | T-0612, T-0501 | —        | Vol 15 roadmap           |
| T-0614 | Implement account lockout: 5 consecutive failures → 15-min cooldown (Vol 15 Ch.5)                               | M          | T-0611         | —        | Vol 15 FR-4              |
| T-0615 | Contract test: account lockout triggers after configured failures; lockout checked BEFORE credential validation | M          | T-0614         | —        | Vol 15 FR-4              |

---

## PHASE 7 — Enterprise Platform

### Milestone M7.1: Multi-Tenancy

#### Epic E7.1.1: Schema Extension & RLS

| ID     | Task                                                                                             | Complexity | Depends On | Blocker? | ADR/RFC               |
| ------ | ------------------------------------------------------------------------------------------------ | ---------- | ---------- | -------- | --------------------- |
| T-0701 | Add `tenantId String` to all Vol 6 Prisma models via migration                                   | M          | T-0302     | —        | Vol 10 Ch.1, ADR-0006 |
| T-0702 | Enable Postgres RLS on every tenant-scoped table                                                 | L          | T-0701     | —        | ADR-0006              |
| T-0703 | Create `tenant_isolation` policies: `USING (tenant_id = current_setting('app.current_tenant'))`  | M          | T-0702     | —        | ADR-0006              |
| T-0704 | Implement tenant-scoped Prisma client extension: fails closed if no tenant context set           | L          | T-0703     | —        | ADR-0006              |
| T-0705 | Contract test per model: cross-tenant read attempt → empty result (not error), DB layer enforces | M          | T-0704     | —        | ADR-0006, ADR-0009    |

#### Epic E7.1.2: RBAC & Policy Engine

| ID     | Task                                                                                  | Complexity | Depends On | Blocker? | ADR/RFC               |
| ------ | ------------------------------------------------------------------------------------- | ---------- | ---------- | -------- | --------------------- |
| T-0706 | Implement Owner/Developer/Viewer roles with explicit permission sets (RFC-0012)       | M          | T-0608     | —        | RFC-0012              |
| T-0707 | Implement RBAC middleware wrapping every CLI command and API endpoint                 | L          | T-0706     | —        | Vol 10 Ch.2           |
| T-0708 | Implement `OrgPolicy.blockOnSecurityFinding()`: configurable, default `critical` only | M          | T-0706     | —        | Vol 10 Ch.3           |
| T-0709 | Contract test: unrecognized role → zero permissions at request boundary               | M          | T-0707     | —        | Vol 10 FR-2, RFC-0012 |

---

## PHASE 8 — Cloud & Release Engineering

### Milestone M8.1: Cloud Platform

#### Epic E8.1.1: Deployment Configuration

| ID     | Task                                                                                                            | Complexity | Depends On | Blocker? | ADR/RFC               |
| ------ | --------------------------------------------------------------------------------------------------------------- | ---------- | ---------- | -------- | --------------------- |
| T-0801 | Document self-hosted fallback for every managed service in Vol 11 table                                         | M          | T-0006     | —        | ADR-0007              |
| T-0802 | Add CI check: `docker-compose up` → full stack operational (runs on every `docker-compose.yml` change + weekly) | M          | T-0006     | —        | ADR-0007, Vol 14 Ch.4 |
| T-0803 | Configure three environment overlays: `agentx.config.dev.yaml`, `staging.yaml`, `prod.yaml`                     | M          | T-0008     | —        | Vol 11 Ch.4           |

#### Epic E8.1.2: Disaster Recovery

| ID     | Task                                                                                     | Complexity | Depends On     | Blocker? | ADR/RFC  |
| ------ | ---------------------------------------------------------------------------------------- | ---------- | -------------- | -------- | -------- |
| T-0804 | Configure PostgreSQL WAL archiving: continuous archiving to local backup dir (RPO 5 min) | L          | T-0006         | —        | RFC-0030 |
| T-0805 | Configure daily `pg_basebackup` at 02:00 UTC; retention 30 daily + 12 weekly             | M          | T-0804         | —        | RFC-0030 |
| T-0806 | Configure Redis RDB snapshots every 15 min                                               | S          | T-0006         | —        | RFC-0030 |
| T-0807 | Document 10-step restore procedure (matches Runbook `disaster-recovery.md`)              | M          | T-0804         | —        | RFC-0030 |
| T-0808 | Conduct first DR drill: restore, verify audit hash chain, verify BullMQ job recovery     | L          | T-0807, T-0313 | —        | RFC-0030 |

### Milestone M8.2: Release Engineering

#### Epic E8.2.1: Release Pipeline

| ID     | Task                                                                                                    | Complexity | Depends On | Blocker? | ADR/RFC  |
| ------ | ------------------------------------------------------------------------------------------------------- | ---------- | ---------- | -------- | -------- |
| T-0809 | Enforce Conventional Commits on `main` branch via `commitlint`                                          | S          | T-0001     | —        | RFC-0041 |
| T-0810 | Implement `scripts/release.ts`: commit parsing → SemVer bump → build → test → CHANGELOG → tag → publish | XL         | T-0809     | —        | RFC-0041 |
| T-0811 | Configure `conventional-changelog` for CHANGELOG generation with RFC references                         | M          | T-0810     | —        | RFC-0041 |
| T-0812 | Implement deprecation policy: `@deprecated` JSDoc, runtime deduped warning log, CHANGELOG entry         | M          | T-0809     | —        | RFC-0029 |
| T-0813 | Implement canary deployment: 10% → health check (15min) → 50% → 100%; auto-rollback on failure          | XL         | T-0810     | —        | RFC-0041 |

---

## CONTINUOUS WORKSTREAMS

### Testing Platform (Vol 14 — runs from Phase 0)

| ID     | Task                                                                                    | Complexity | Phase   | RFC/ADR                  |
| ------ | --------------------------------------------------------------------------------------- | ---------- | ------- | ------------------------ |
| T-C001 | Golden set: define ≥5 representative goals with rubric criteria                         | M          | Phase 0 | RFC-0019                 |
| T-C002 | Golden set evaluation script: runs each goal 3 times, 2/3 majority vote, rubric scoring | L          | Phase 2 | RFC-0019, RFC-0032       |
| T-C003 | CI gate: dependency-direction violation lint (Vol 1 Ch.3 table)                         | M          | Phase 0 | Vol 14 Ch.3              |
| T-C004 | CI gate: vendor SDK import outside `provider-sdk/providers/*`                           | M          | Phase 0 | Constitution Principle 3 |
| T-C005 | CI gate: deployment portability check on `docker-compose.yml` changes                   | M          | Phase 0 | Vol 14 Ch.4              |

### Observability (Vol 13 — runs from Phase 1)

| ID     | Task                                                                                                        | Complexity | Phase   | RFC/ADR     |
| ------ | ----------------------------------------------------------------------------------------------------------- | ---------- | ------- | ----------- |
| T-O001 | Define metric taxonomy: `task.duration_ms`, `provider.cost_usd`, `provider.latency_ms`, `tool.failure_rate` | S          | Phase 1 | Vol 13 Ch.1 |
| T-O002 | Implement `MetricsQuery` service: derives all metrics from `AuditEvent`/`CostRecord`                        | L          | Phase 3 | RFC-0017    |
| T-O003 | Wire `approval.pending_count` gauge from `task.approval_required` events                                    | S          | Phase 5 | Vol 13 Ch.1 |

---

_Total tasks: ~170 across all phases. Each task maps to at least one Volume, RFC, or ADR._
