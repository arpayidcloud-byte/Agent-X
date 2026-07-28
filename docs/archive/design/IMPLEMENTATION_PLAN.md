# IMPLEMENTATION PLAN — agentx Platform

**Version:** 1.0-draft  
**Date:** 2026-07-14  
**Authority:** Engineering Execution Program v1.0 (09-Reviews/Engineering_Execution_Program_v1_0.md)  
**Status:** Awaiting Project Owner approval before any production code is written

> **RULE:** This plan does not redesign the architecture. Every decision traces to a Volume, RFC, or ADR. If a conflict is found, implementation stops and the conflict is reported before proceeding.

---

## 1. SCOPE AND AUTHORITY

### 1.1 Governing Documents (in precedence order)

1. `00-Governance/PROJECT_CONSTITUTION.md` — 10 Principles, supreme governing artifact
2. `00-Governance/SECURITY_STANDARDS.md` — Security enforcement standards
3. `00-Governance/THREAT_MODEL.md` — 15 threat catalog (T-001 through T-015)
4. `00-Governance/API_STANDARDS.md` — REST conventions, error envelopes, pagination
5. `01-Volumes/Volume-01.md` through `Volume-16-*.md` — Architecture specifications
6. `02-RFC/RFC-0001.md` through `RFC-0042.md` — Accepted design decisions
7. `03-ADR/ADR-0001.md` through `ADR-0016.md` — Final architecture decisions

### 1.2 Technology Stack (from Volume 1 Ch. 4, not changeable without RFC)

| Layer           | Technology                                                                      |
| --------------- | ------------------------------------------------------------------------------- |
| Runtime         | Node.js / TypeScript (`strict: true`, no `any` in public interfaces — RFC-0042) |
| Framework       | NestJS (backend), Next.js 14+ (dashboard — RFC-0039)                            |
| ORM             | Prisma (PostgreSQL)                                                             |
| Message Queue   | BullMQ backed by Redis                                                          |
| Package Manager | pnpm workspace (monorepo)                                                       |
| Database        | PostgreSQL (with RLS for Vol 10 — ADR-0006)                                     |
| Cache           | Redis (shared instance with BullMQ)                                             |

### 1.3 Monorepo Layout (from Volume 1 Ch. 4 — mandatory target for all codegen)

```
agentx/
├── apps/
│   ├── cli/                    # Vol 9 — primary v0.1 product surface
│   └── dashboard/              # RFC-0039 — separate app, NOT a Volume
├── packages/
│   ├── core-runtime/           # Vol 2
│   ├── agent-platform/         # Vol 3
│   ├── provider-sdk/           # Vol 4
│   │   └── providers/
│   │       ├── anthropic/      # ADR-0003 adapter 1
│   │       └── google/         # ADR-0003 adapter 2
│   ├── workflow-engine/        # Vol 5
│   ├── memory-engine/          # Vol 6
│   ├── tool-sdk/               # Vol 7
│   ├── plugin-sdk/             # Vol 8
│   ├── auth/                   # Vol 15
│   ├── secrets/                # Vol 16
│   └── shared/                 # Cross-cutting types, utilities
├── prisma/                     # Shared schema for all packages
├── tooling/
│   └── handbook-lint/          # RFC-0040 — @agentx/handbook-lint
└── agentx.config.yaml          # Vol 9 Ch. 5 — project-local config
```

---

## 2. IMPLEMENTATION DEPENDENCY GRAPH

### 2.1 Volume Dependency Matrix (verified against all 16 Volume texts)

```
DEPENDENCY DIRECTION: Row depends on Column(s)

         V1  V2  V3  V4  V5  V6  V7  V8  V9  V10 V11 V12 V13 V14 V15 V16
Vol 1     -
Vol 2     ✓   -
Vol 3     ✓   ✓   -
Vol 4     ✓   ✓           -
Vol 5     ✓   ✓   ✓           -       ✓
Vol 6     ✓   ✓               -
Vol 7     ✓   ✓   ✓               -
Vol 8     ✓   ✓   ✓   ✓           ✓   -
Vol 9     ✓   ✓   ✓   ✓   ✓   ✓   ✓   ✓   -
Vol 10    ✓   ✓   ✓           ✓           ✓   -           ✓
Vol 11    ✓   ✓                               ✓   ✓   -
Vol 12    ✓   ✓   ✓       ✓   ✓               ✓   ✓   ✓   -
Vol 13    ✓   ✓       ✓       ✓                               -
Vol 14    ✓                                                       -
Vol 15    ✓               ✓(sess)                 ✓               -
Vol 16    ✓   ✓               ✓(audit)                        ✓   ✓   -
```

### 2.2 Interface Implementation Map (cross-volume contracts)

| Interface            | Defined In        | Implemented In                       | Notes                                           |
| -------------------- | ----------------- | ------------------------------------ | ----------------------------------------------- |
| `Decomposer`         | Vol 2 Ch.4        | Vol 3 `LlmDecomposer`                | Core Runtime calls; Agent Platform implements   |
| `Persistence`        | Vol 2             | Vol 6 Memory Engine                  | PostgreSQL/Prisma backing                       |
| `Provider`           | Vol 4 Ch.1        | Vol 4 adapters + Vol 8 plugins       | At least 2 adapters required at v0.1 (ADR-0003) |
| `Agent`              | Vol 3             | Vol 3 (4 built-in) + Vol 8 plugins   | Roster fixed at v0.1 (ADR-0002)                 |
| `Tool`               | Vol 7 Ch.1        | Vol 7 built-in tools + Vol 8 plugins | PermissionChecker enforced per call (ADR-0004)  |
| `IdentityProvider`   | Vol 15 Ch.3       | Vol 15 (Local/Token/SSO)             | Local only for v0.1                             |
| `RBACBridge`         | Vol 15 Ch.4       | Vol 15 + Vol 10 role model           | Wired to Vol 10 org role assignments            |
| `SecretStore`        | Vol 16 Ch.1       | Vol 16 backends                      | Env-var backend for v0.1 (ADR-0012)             |
| `CredentialResolver` | Vol 4/Vol 16 Ch.2 | Vol 16 CachedCredentialResolver      | Formalized by Vol 16; consumed by Vol 4         |
| `KeyProvider`        | Vol 16 Ch.6       | Vol 16                               | Used by Vol 15 for JWT signing keys             |
| `WorkflowPolicy`     | Vol 5 Ch.2        | Vol 5 default policy                 | Two-layer gating (RFC-0007)                     |
| `PermissionChecker`  | Vol 7 Ch.3        | Vol 7 (tools) / Vol 10 (RBAC)        | Fail-closed (ADR-0004)                          |
| `OrgPolicy`          | Vol 10 Ch.3       | Vol 10                               | Advisory-to-enforced promotion                  |

### 2.3 Event Bus Wiring Map (all topics from Vol 2 Ch. 2)

| Topic                      | Published By            | Consumed By                      |
| -------------------------- | ----------------------- | -------------------------------- |
| `task.created`             | Vol 2 Orchestrator      | Vol 2 Scheduler, Vol 6 audit     |
| `task.state_changed`       | Vol 2 Scheduler         | Vol 6 audit, Vol 9 CLI watch     |
| `task.approval_required`   | Vol 2 Scheduler         | Vol 5 Workflow Engine, Vol 9 CLI |
| `task.approval_resolved`   | Vol 5 Workflow Engine   | Vol 2 Scheduler (`resume()`)     |
| `tool.invoked`             | Vol 3 Agent Platform    | Vol 6 audit log                  |
| `provider.call_completed`  | Vol 4 Provider Platform | Vol 6 cost log                   |
| `secrets.rotation_warning` | Vol 16 Rotation Engine  | Vol 9 CLI warning                |
| `secrets.rotated`          | Vol 16 Rotation Engine  | Vol 16 cache invalidation        |
| `secrets.break_glass_used` | Vol 16 Access Control   | Vol 2 Scheduler (creates task)   |

---

## 3. IMPLEMENTATION PHASES

The phases below follow the Engineering Execution Program (EEP) exactly. Phase numbers map to EEP milestone labels.

---

### PHASE 0 — Foundation Validation

**EEP Milestone:** M0  
**Prerequisite to:** Every subsequent phase  
**Target:** All governance gates cleared; CI infrastructure operational

#### Exit Criteria (ALL must be true before Phase 1 begins)

- [ ] All 16 Volume statuses are at minimum "Approved — Architecture"
- [ ] Contract-test templates exist at `08-Examples/<slug>/contract.test.ts` for Volumes 2, 4, 7 (minimum for Phase 1 unblocking)
- [ ] RFC-0021 (Threat Model) status: Accepted
- [ ] RFC-0022 (Secrets Storage) status: Accepted
- [ ] RFC-0023 (Credential Runtime Contract) status: Accepted
- [ ] RFC-0027 (Plugin Sandboxing) status: Accepted
- [ ] ADR-0011 (Threat Model requirement) status: Final
- [ ] ADR-0012 (Secrets v0.1 mechanism) status: Final
- [ ] ADR-0013 (RFC/ADR minimum content) status: Final
- [ ] `04-Schemas/volume-02.schema.json`, `volume-04.schema.json`, `volume-07.schema.json` validated
- [ ] Interaction-matrix diagram exists (ADR-0015)
- [ ] Task lifecycle sequence diagram exists (07-Diagrams/)
- [ ] CI pipeline operational: lint, type-check, schema-validation, handbook-lint

#### Missing Details Identified

1. **BLOCKER:** `PERFORMANCE_TARGETS.md` is still Draft (not an ADR). The Performance Review Gate (EEP §8) cannot be passed. An RFC must ratify these targets before Phase 1 can exit. **Action: Author RFC → ADR before M0 closes.**
2. **MISSING:** Handbook lint tooling (`@agentx/handbook-lint` — RFC-0040) has not been implemented. Must be built in Phase 0.
3. **MISSING:** ESLint custom rule for `AGENTX_SECRET_*` pattern (ADR-0012) has not been defined.

---

### PHASE 1 — Core Runtime

**EEP Milestone:** M1 (partial)  
**Prerequisite to:** All subsequent phases  
**Volumes:** Vol 2 (Core Runtime), Vol 16 (Secrets), Vol 4 (Provider Platform), Vol 13 (Observability — structured logging only)

**Critical note:** Vol 16 must be implemented FIRST despite its high Volume number. It is the structural root of credential resolution, which is required by Vol 4, which is required by Vol 3. Volume number order ≠ implementation order.

#### Exit Criteria

- [ ] Task state machine transitions all pass contract tests (8 valid transitions, 0 invalid)
- [ ] Event Bus publishes and consumers deduplicate on `event.id` (ADR-0001)
- [ ] Two provider adapters (Anthropic + Google) pass identical contract test suite (ADR-0003)
- [ ] `CredentialResolver.resolve()` never logs credential value (RFC-0023)
- [ ] ESLint rule blocks `AGENTX_SECRET_*` in logs (ADR-0012)
- [ ] Structured JSON logging with mandatory `traceId` field operational (Vol 13 Ch. 3)
- [ ] Scheduler `enqueue()`, `pause()`, `resume()` pass contract tests

#### Missing Details Identified

1. **MISSING:** No concrete performance target values are ratified (P95 latency targets in `PERFORMANCE_TARGETS.md` are still Draft). Need RFC + ADR before Phase 1 can be marked complete.
2. **ASSUMPTION:** `EnvVarSecretStore.set()` throws `OperationNotSupportedError` (RFC-0022). This type must be defined in `packages/secrets/`.
3. **ASSUMPTION:** BullMQ queue names must be defined. No canonical list exists in the handbook. **Action: Create enum in `packages/core-runtime/src/topics.ts`.**

---

### PHASE 2 — SDK Layer

**EEP Milestone:** M1 (completion)  
**Prerequisite to:** Phases 3, 4, 5  
**Volumes:** Vol 7 (Tool SDK), Vol 3 (Agent Platform), Vol 4 adapters finalized

**Parallelization:** Vol 3 and Vol 4 (adapter finalization) can run concurrently. Vol 7 requires RFC-0021 accepted (already Phase 0 exit criterion) and Vol 3 complete.

#### Exit Criteria

- [ ] `PermissionChecker.isAllowed()` called before every tool execution — verified by contract test (ADR-0004)
- [ ] Permission denial throws `PermissionDeniedError` BEFORE any I/O (ADR-0004)
- [ ] All `fs.write` classified as destructive unconditionally (ADR-0005)
- [ ] Filesystem sandbox rejects path traversal via `fs.realpath()` — not string matching (Vol 7)
- [ ] `shell.build` only runs commands matching configured allowlist (Vol 7)
- [ ] STRIDE checklist present on every tool implementation PR (RFC-0021)
- [ ] Four specialist agents (coding, review, test, security) registered with correct `allowedToolCategories` (ADR-0002)
- [ ] `LlmDecomposer` output schema-validated before returning (RFC-0004)
- [ ] Threat model verified against real Tool SDK behavior (not just specified) (EEP Phase 2)

#### Missing Details Identified

1. **MISSING:** Shell allowlist configuration location not specified in handbook. **Assumption: `agentx.config.yaml` under `tools.shell.allowlist[]`.**
2. **MISSING:** `PermissionDeniedError` type not defined. Must be defined in `packages/tool-sdk/`.
3. **MISSING:** `LlmDecomposer` retry policy on schema validation failure — how many retries before the task fails? **Vol 2 default is 3 retries (configurable). Assumption: decomposer follows same policy.**
4. **CONFLICT CHECK:** Vol 3 says Review and Security agents are "advisory-only" in v0.1 — no auto-blocking. Vol 10 allows policy-engine blocking. This is intentional by design (Vol 10 is post-v0.1). No conflict.

---

### PHASE 3 — Workflow Layer

**EEP Milestone:** M2  
**Prerequisite to:** Phases 4, 5  
**Volumes:** Vol 6 (Memory Engine), Vol 5 (Workflow Engine), Vol 13 (Observability — metrics)

#### Exit Criteria

- [ ] PostgreSQL append-only trigger blocks UPDATE/DELETE on `audit_log` table — verified by test (ADR-0014, RFC-0024)
- [ ] `REVOKE UPDATE, DELETE ON audit_log FROM agentx_app` applied in migration (ADR-0014)
- [ ] Chained hash columns (`record_hash`, `previous_hash`) on `audit_log` — migration exists (RFC-0024)
- [ ] `AuditService.verifyChain()` method passes test
- [ ] `TaskContext` retrieval is bounded (last-N + rolling summary), never full history (RFC-0008)
- [ ] Two-layer approval gate works: Vol 7 tool-level gate + Vol 5 policy-level gate (RFC-0007)
- [ ] Retry-with-feedback loop is capped at `retryCapPerNode` — escalates to operator at cap, never silently fails (Vol 5)
- [ ] Cycle detection in `buildGraph()` rejects cyclic decomposition results (RFC-0004)
- [ ] `task_graph.started`, `task_node.completed`, `task_node.failed`, `task_graph.failed`, `task_graph.compensated` events all emitted (RFC-0038)
- [ ] All metrics derivable from `AuditEvent`/`CostRecord` data — no dedicated metrics store (RFC-0017)

#### Missing Details Identified

1. **MISSING:** Rolling summary LLM call — which provider/model is used? Same provider as main workflow or a separate lighter model? **Handbook does not specify. Assumption: same default provider. Must be documented via RFC or config before implementation.**
2. **MISSING:** `last-N` value for TaskContext is described as "configurable" — default value not stated. **Assumption: default N=10. Must be documented in `agentx.config.yaml` schema.**
3. **ASSUMPTION:** `AuditWriter` runs `INSERT ... RETURNING id` in the same DB transaction as the originating state transition (ADR-0014). This must be enforced at the architecture level in `packages/core-runtime/`.

---

### PHASE 4 — Extensibility (Plugin Platform)

**EEP Milestone:** M2 (completion)  
**Prerequisite to:** Phase 5 (CLI must support plugin commands)  
**Volumes:** Vol 8 (Plugin Platform)

**Hard gate:** Cannot start before Vol 3 (Phase 2) AND Vol 4 (Phase 1/2) AND RFC-0027 Accepted (Phase 0 exit criterion).

#### Exit Criteria

- [ ] Plugin manifest validated before entry point is imported (Vol 8 FR-1)
- [ ] Agent-kind plugin cannot register a role colliding with v0.1 fixed roster (Vol 8 FR-2)
- [ ] Tool-kind plugin declared categories go through same permission review as built-in tools (Vol 8 FR-3)
- [ ] Plugin sandbox via `child_process.fork()` with memory (128MB) and CPU (30s) limits (RFC-0027)
- [ ] Custom `require` hook blocks sensitive modules in plugin processes (RFC-0027)
- [ ] Plugin lifecycle state machine (Installed → PendingReview → Enabled/Disabled/Rejected → Uninstalled) implemented
- [ ] Marketplace, billing, licensing: NOT implemented (ADR-0016 hard constraint)

#### Missing Details Identified

1. **MISSING:** Plugin signing key management for v0.1. Handbook says platform team holds private key (RFC-0027) but where the public key lives for verification is not specified. **Assumption: embedded in `packages/plugin-sdk/keys/marketplace.pub.pem`.**
2. **MISSING:** IPC message schema between host process and plugin process not defined in handbook. Must be defined before implementation.

---

### PHASE 5 — Product Surface / v0.1 Release

**EEP Milestone:** M3 — v0.1  
**Prerequisite to:** v0.1 release gate  
**Volumes:** Vol 9 (CLI Platform), Vol 14 (Testing & QA)

#### Exit Criteria (ALL mandatory for v0.1 — from Vol 1 Ch.6)

- [ ] `agentx submit "<goal>"` → decompose → plan → execute → approve → result works end-to-end
- [ ] `agentx status`, `agentx watch`, `agentx approve`, `agentx reject` all functional
- [ ] `agentx cost`, `agentx audit` read-only — no write path from CLI (Vol 9 FR-3)
- [ ] Approval prompt shows concrete action (diff/command), no default, no timeout (RFC-0010)
- [ ] CLI never prints credentials in any mode — verified by test (Vol 9 Security)
- [ ] Config is project-local `agentx.config.yaml` — not global (Vol 9 Ch.5)
- [ ] `agentx plugin install/enable/disable/list` functional (Vol 9 Ch.4)
- [ ] Two provider adapters working (ADR-0003)
- [ ] `agentx audit verify` (chain verification) functional (RFC-0024)
- [ ] `04-Schemas/` populated for Volumes 2–9 (EEP v0.1 exit criteria)
- [ ] Self-hosted `docker-compose.yml` brings up full stack (ADR-0007, Vol 14 Ch.4)
- [ ] Threat model verified against real Tool SDK behavior (EEP v0.1 exit criteria)
- [ ] RFC-0038 rollback strategy (manual recovery) functional and tested

---

### PHASE 6 — Identity & Access

**EEP Milestone:** M4  
**Prerequisite to:** Phase 7 (Enterprise requires Identity)  
**Volumes:** Vol 15 (Identity & Access Foundation)

**Note:** Vol 15 is approved but Token and SSO modes are post-v0.1. Phase 6 completes v0.5 auth.

#### Exit Criteria

- [ ] `LocalIdentityProvider` operational (already required for v0.1 — integrates at Phase 5)
- [ ] `TokenIdentityProvider` with JWT (RS256, 15-min access token, 24-hr refresh) (v0.5)
- [ ] `agentx login` / `agentx auth revoke-session` CLI commands (v0.5)
- [ ] Account lockout after 5 consecutive failures (Vol 15 Ch.5)
- [ ] All auth events logged to `AuditEvent` (Vol 15 FR-5)
- [ ] `IRoleResolver` with `LocalRoleResolver` returning `['owner']` for v0.1 local mode (RFC-0026)
- [ ] `SSOIdentityProvider` OIDC/SAML (v1.0)
- [ ] Vol 16 `KeyProvider` wired for JWT signing key management

---

### PHASE 7 — Enterprise Platform

**EEP Milestone:** M5  
**Prerequisite to:** Phase 8 (Cloud needs tenant model)  
**Volumes:** Vol 10 (Enterprise Platform)

#### Exit Criteria

- [ ] `tenantId` column added to all Vol 6 models via Prisma migration
- [ ] Postgres RLS enabled on every tenant-scoped table (ADR-0006)
- [ ] Tenant-scoped Prisma client extension fails closed without tenant context (ADR-0006)
- [ ] Cross-tenant-read contract test passes (asserts empty result, not error) per model (ADR-0006)
- [ ] RBAC: Owner/Developer/Viewer roles with fail-closed checks (RFC-0012)
- [ ] `OrgPolicy` blocking configurable at `critical` default (Vol 10 Ch.3)
- [ ] Audit export to CSV/JSON by tenant + date range (Vol 10 Ch.4)
- [ ] Dashboard (`apps/dashboard/`) — Phase 7 minimum: health overview, task visualization (RFC-0039 v0.5 features)

---

### PHASE 8 — Cloud & Release Engineering

**EEP Milestone:** M5 (completion)  
**Volumes:** Vol 11 (Cloud Platform)  
**Parallel tracks:** Cloud Runtime + Release Engineering (independent, run concurrently)

#### Exit Criteria

- [ ] Self-hosted fallback documented for every managed service in Vol 11 table (ADR-0007)
- [ ] `docker-compose.yml` verified by CI check (Vol 14 Ch.4)
- [ ] Three environments: `dev`, `staging`, `prod` with config overlays (Vol 11 Ch.4)
- [ ] Release pipeline: Conventional Commits → auto SemVer → CHANGELOG → publish (RFC-0041)
- [ ] Deprecation policy active: 2-minor-version warning before removal (RFC-0029)
- [ ] DR drill conducted (RFC-0030): PostgreSQL restore + hash chain verification + BullMQ job recovery
- [ ] Canary deployment for API/dashboard: 10% → 50% → 100% with auto-rollback

---

### PHASE 9 — Marketplace (Conditional)

**Status:** PARKED  
**Gate:** RFC-0036 must be Accepted with "proceed" outcome AND RFC-0027 verified with real third-party plugin.  
**Do not allocate engineering resources until gate opens.**

---

### PHASE 10 — Production Readiness / v1.0

**EEP Milestone:** M6 — v1.0  
**All items mandatory, none optional**

#### v1.0 Readiness Checklist

- [ ] All 9 Quality Gates have documented pass evidence (Architecture, Specification, Schema, Contract, Security, Performance, Testing, Documentation, Release)
- [ ] Performance targets ratified via RFC + ADR and load-tested
- [ ] RFC-0021 threat model verified against REAL Tool SDK behavior (not spec only)
- [ ] RFC-0027 plugin trust model verified through ≥1 real third-party plugin
- [ ] RFC-0024/ADR-0014 audit log immutability proven by automated test
- [ ] RFC-0030 DR — ≥1 actual restore drill completed
- [ ] ADR-0008 (no push alerting) explicitly re-reviewed for production context — new ADR required if decision changes
- [ ] SOC2 data classification document complete (RFC-0035)
- [ ] Dashboard status: built per RFC-0039 or officially cancelled (no "pending" at v1.0)
- [ ] Marketplace status: explicitly deferred per ADR-0016 (documented, not silent)

---

## 4. IDENTIFIED BLOCKERS

| #    | Blocker                                                         | Phase Blocked             | Source                                       | Resolution                                                    |
| ---- | --------------------------------------------------------------- | ------------------------- | -------------------------------------------- | ------------------------------------------------------------- |
| B-01 | Performance targets not ratified (still Draft)                  | Phase 1 exit gate, M3, M6 | `PERFORMANCE_TARGETS.md` Draft status        | Author RFC → ADR before M0 closes                             |
| B-02 | `AGENTX_SECRET_*` ESLint rule not built                         | Phase 1                   | ADR-0012                                     | Build in Phase 0 as part of tooling setup                     |
| B-03 | Handbook lint tooling (`@agentx/handbook-lint`) not implemented | Phase 0 gate              | RFC-0040                                     | Build in Phase 0 before any Volume work                       |
| B-04 | Shell allowlist config location undefined                       | Phase 2                   | Vol 7 (no config location specified)         | Document in `agentx.config.yaml` schema before Phase 2        |
| B-05 | Rolling summary LLM provider/model not specified                | Phase 3                   | Vol 6 (no model specified for summarization) | RFC or config addition required before Phase 3                |
| B-06 | Default last-N value for TaskContext not specified              | Phase 3                   | Vol 6 (stated "configurable" but no default) | Add to `agentx.config.yaml` schema with value N=10            |
| B-07 | Plugin IPC message schema not defined                           | Phase 4                   | RFC-0027 (process.send format not specified) | Define schema in `packages/plugin-sdk/` before Phase 4        |
| B-08 | Plugin signing public key location not specified                | Phase 4                   | RFC-0027                                     | Specify in Vol 8 or RFC addendum                              |
| B-09 | BullMQ queue name enum not defined                              | Phase 1                   | Vol 2 (no canonical list)                    | Create `packages/core-runtime/src/topics.ts`                  |
| B-10 | AuditWriter transaction boundary not enforced architecturally   | Phase 3                   | ADR-0014                                     | Must be enforced in `core-runtime/`, not left to implementers |

---

## 5. IDENTIFIED ASSUMPTIONS

| #    | Assumption                                                                                    | Source Gap                                              | Risk if Wrong                                          |
| ---- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------ |
| A-01 | `LlmDecomposer` follows Vol 2 retry policy (3 attempts) on schema validation failure          | Vol 2 default; Vol 3 does not specify override          | Infinite retry loop / silent failure                   |
| A-02 | `EnvVarSecretStore.set()` throws `OperationNotSupportedError`                                 | RFC-0022 says "no-op"; implementation plan says "throw" | Silent misuse in test environments                     |
| A-03 | Rolling summary uses same default provider as main workflow                                   | Vol 6 does not specify                                  | Cost overrun if heavy summarization on expensive model |
| A-04 | Default TaskContext last-N = 10                                                               | Vol 6 says "configurable" without default               | Context quality issues or cost overrun                 |
| A-05 | Shell allowlist stored in `agentx.config.yaml` under `tools.shell.allowlist[]`                | Vol 7 does not specify config location                  | Config collision or misconfiguration                   |
| A-06 | Plugin signing public key embedded in `packages/plugin-sdk/keys/`                             | RFC-0027 does not specify location                      | Key distribution failure                               |
| A-07 | IPC messages between host and plugin use `process.send()` with JSON-serialized typed envelope | RFC-0027 says "message port" but no schema              | Protocol incompatibility                               |
| A-08 | Quarterly DR drill cadence starts after v0.1 ships, not during development                    | RFC-0030 does not specify when drills begin             | Compliance gap if drills expected from day 1           |

---

## 6. IDENTIFIED MISSING IMPLEMENTATION DETAILS

The following items are specified in the handbook but lack sufficient detail to begin implementation without further clarification:

| #    | Missing Detail                                                              | Volume/RFC                       | Blocking?                            | Action Required                               |
| ---- | --------------------------------------------------------------------------- | -------------------------------- | ------------------------------------ | --------------------------------------------- |
| M-01 | Performance target values (p95 latencies) not ratified as ADR               | PERFORMANCE_TARGETS.md           | YES — blocks Performance Review Gate | Author RFC then ADR                           |
| M-02 | Rolling summary model/provider configuration                                | Vol 6 Ch.2                       | Phase 3 blocker                      | Add to config schema + Vol 6 addendum         |
| M-03 | TaskContext `last-N` default value                                          | Vol 6 Ch.2                       | Phase 3 blocker                      | Add to config schema                          |
| M-04 | BullMQ queue names / topic enum                                             | Vol 2 Ch.2                       | Phase 1 blocker                      | Define in `core-runtime/src/topics.ts`        |
| M-05 | Shell tool allowlist config location                                        | Vol 7 Ch.5                       | Phase 2 blocker                      | Specify in config schema                      |
| M-06 | Plugin IPC message envelope schema                                          | RFC-0027                         | Phase 4 blocker                      | Define in `plugin-sdk/`                       |
| M-07 | Plugin signing public key distribution                                      | RFC-0027                         | Phase 4 blocker                      | Specify in Vol 8 or RFC addendum              |
| M-08 | `PermissionDeniedError` type definition                                     | Vol 7 (referenced but not typed) | Phase 2                              | Define in `packages/tool-sdk/src/errors.ts`   |
| M-09 | `OperationNotSupportedError` type for Secrets                               | RFC-0022                         | Phase 1                              | Define in `packages/secrets/src/errors.ts`    |
| M-10 | `CredentialResolutionError` message format                                  | RFC-0023                         | Phase 1                              | Fixed format: specified in RFC-0023           |
| M-11 | Audit log `record_hash` genesis value                                       | RFC-0024                         | Phase 3                              | Fixed: `"GENESIS"` (RFC-0024 specifies)       |
| M-12 | `agentx_app` PostgreSQL role creation in migrations                         | ADR-0014                         | Phase 3                              | Must be in Prisma seed/migration scripts      |
| M-13 | Dashboard stack specification (Next.js 14+, Tailwind, React Query, Zustand) | RFC-0039                         | Phase 7                              | Complete — RFC-0039 specifies fully           |
| M-14 | Structured debug logging config key                                         | Vol 13 Ch.3 / RFC-0042           | Phase 1                              | `AGENTX_LOG_LEVEL=debug` (RFC-0042 specifies) |

---

## 7. INTERFACES THAT MUST EXIST BEFORE CODING BEGINS

The following interfaces MUST be defined and contract-tested before any dependent implementation writes production code:

### Priority 1 — Phase 1 unblocking (define before any Phase 1 code)

```typescript
// packages/secrets/src/backend.ts
interface SecretStore { get, set, delete, list, has }
interface SecretEntry { key, value, version, createdAt, updatedAt, metadata? }
interface SecretMetadata { category, classification, lastRotatedAt?, rotatedBy? }

// packages/secrets/src/errors.ts
class OperationNotSupportedError extends Error {}
class SecretAccessError extends Error {}

// packages/core-runtime/src/topics.ts
enum EventTopic { TASK_CREATED, TASK_STATE_CHANGED, TASK_APPROVAL_REQUIRED, ... }

// packages/core-runtime/src/interfaces.ts
interface EventEnvelope<T> { id, topic, traceId, occurredAt, payload }
interface EventBus { publish<T>, subscribe<T> }
interface Scheduler { enqueue, pause, resume }
interface Decomposer { decompose }
interface Persistence { saveTask, loadTaskContext, appendAuditEvent }
```

### Priority 2 — Phase 2 unblocking (define before any Phase 2 code)

```typescript
// packages/provider-sdk/src/interfaces.ts
interface Provider {
  id;
  complete;
}
interface CompletionRequest {
  systemPrompt;
  userPrompt;
  context?;
  tools?;
  maxTokens?;
}
interface CompletionResponse {
  text;
  toolCalls;
  usage;
  providerId;
  latencyMs;
}
interface CredentialResolver {
  resolve;
  resolveMetadata;
  invalidate;
  invalidateAll;
}

// packages/tool-sdk/src/interfaces.ts
interface Tool {
  name;
  category;
  isDestructive;
  execute;
}
interface ToolCallContext {
  agentRole;
  taskId;
  workingDirectory;
}
interface ToolResult {
  success;
  output;
  error?;
}
interface PermissionChecker {
  isAllowed;
}
class PermissionDeniedError extends Error {}

// packages/agent-platform/src/interfaces.ts
interface Agent {
  role;
  run;
}
interface AgentResult {
  taskId;
  role;
  output;
  toolCallsMade;
  requiresApproval;
}
interface AgentRegistry {
  register;
  resolve;
  list;
}
```

### Priority 3 — Phase 3 unblocking

```typescript
// packages/workflow-engine/src/interfaces.ts
interface TaskGraph {
  id;
  nodes;
  edges;
}
interface WorkflowPolicy {
  requiresApprovalBefore;
}

// packages/memory-engine/src/interfaces.ts
interface TaskContext {
  recentResults;
  relevantHistory;
}
```

### Priority 4 — Phase 6 unblocking

```typescript
// packages/auth/src/interfaces.ts
interface Identity {
  id;
  externalId;
  authMode;
  roles;
  metadata;
}
interface IdentityProvider {
  mode;
  authenticate;
  validate;
  revoke;
}
interface RBACBridge {
  resolveRoles;
  checkPermission;
}
interface IRoleResolver {
  resolve;
}
```

---

## 8. CONTINUOUS WORKSTREAMS

These run in parallel with all phases and are never "done":

| Workstream           | Key Activities                                         | RFC/ADR Basis                   |
| -------------------- | ------------------------------------------------------ | ------------------------------- |
| Testing Platform     | Contract tests, CI gating, golden-set eval             | Vol 14, ADR-0009, RFC-0018/0019 |
| Observability        | Structured logging, metrics derivation, `traceId`      | Vol 13, RFC-0017/0033           |
| Documentation        | Handbook lint, cross-reference checks, ADR-0015 matrix | RFC-0040, ADR-0013              |
| Developer Experience | DX checklist, JSDoc, `--help`, error messages          | RFC-0042                        |

---

## 9. DEFERRED ITEMS (do not schedule)

| Item                      | Condition to Re-evaluate                                        |
| ------------------------- | --------------------------------------------------------------- |
| Marketplace UI            | RFC-0036 "proceed" outcome + RFC-0027 verified with real plugin |
| Billing / Licensing       | After Marketplace and Enterprise stabilize                      |
| Multi-region DR           | After Vol 11 fully implemented (v3.0 horizon)                   |
| Vector/semantic retrieval | After context-window pressure observed in practice              |
| WebAuthn/passkey          | After v1.0 SSO proven stable                                    |
| Push alerting             | After Vol 10/11 persistent-process deployment exists            |
| OpenTelemetry exporter    | After multi-service Vol 11 topology exists                      |
| Feature flags             | No current requirement                                          |

---

_This document traces to: Vol 1 Ch.3/4/6, Vol 2–16, RFC-0001 through RFC-0042, ADR-0001 through ADR-0016, EEP v1.0, Engineering Backlog v1.0, Architecture Improvement Plan v1.0._
