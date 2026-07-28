# IMPLEMENTATION CHECKLIST — agentx Platform

**Version:** 1.0-draft  
**Date:** 2026-07-14

This checklist is used by the Implementation Team to track progress and unblock downstream phases. It maps directly to the exit criteria defined in the EEP.

---

## [ ] PHASE 0: Foundation Validation

### Governance Gates

- [ ] `PERFORMANCE_TARGETS.md` ratified via RFC + ADR (Blocker B-01)
- [ ] Interaction-matrix diagram complete (ADR-0015)
- [ ] Task lifecycle sequence diagram complete
- [ ] Threat model document (RFC-0021) accepted
- [ ] All 16 Volume statuses ≥ "Approved — Architecture"

### Tooling Gates

- [ ] Monorepo layout scaffolded (Vol 1 Ch.4)
- [ ] TypeScript `strict: true` across all packages (RFC-0042)
- [ ] `handbook-lint` package built and running in CI (RFC-0040)
- [ ] JSON Schema validation running in CI (`04-Schemas/`)
- [ ] Custom ESLint rules running in CI (`AGENTX_SECRET_*`, vendor imports)

---

## [ ] PHASE 1: Core Runtime

### Secrets Package

- [ ] `SecretStore` interfaces defined
- [ ] `EnvVarSecretStore` reads from `process.env`; throws on `set()`
- [ ] `CachedCredentialResolver` implemented (LRU cache, 5-min TTL, 5s negative TTL)
- [ ] **Contract Test Pass:** `CredentialResolver.resolve()` never logs credential value

### Event Bus & Scheduler

- [ ] `EventTopic` enum canonical list defined
- [ ] `EventBus` implemented with at-least-once delivery (ADR-0001)
- [ ] **Contract Test Pass:** Duplicate publish with same `event.id` → handler called exactly once
- [ ] `Scheduler` implements `enqueue`, `pause`, `resume` with `maxParallelAgents` config

### Orchestrator & Logging

- [ ] `Decomposer` interface defined
- [ ] State machine enforces Queued → Planning → AwaitingApproval/Running → Completed/Failed
- [ ] **Contract Test Pass:** All 8 valid transitions succeed, invalid throw
- [ ] Structured JSON logging operational with mandatory `traceId` (Vol 13)

---

## [ ] PHASE 2: SDK Layer

### Tool SDK

- [ ] Sandbox filesystem jail enforces `workingDirectory` via `fs.realpath()`
- [ ] Shell allowlist restricts `shell.build`
- [ ] All `fs.write` classified as destructive (ADR-0005)
- [ ] **Contract Test Pass:** `PermissionChecker.isAllowed()` throws `PermissionDeniedError` BEFORE any I/O
- [ ] STRIDE threat-model checklist on every tool PR (RFC-0021)

### Provider SDK

- [ ] `AnthropicProvider` adapter complete
- [ ] `GoogleProvider` adapter complete
- [ ] **Contract Test Pass:** Two different provider adapters pass identical contract tests (ADR-0003)

### Agent SDK

- [ ] 4 fixed agents registered (coding, review, test, security)
- [ ] `LlmDecomposer` output schema-validated (RFC-0004)
- [ ] **Contract Test Pass:** Agent tool call outside `allowedToolCategories` throws `PermissionDeniedError`

---

## [ ] PHASE 3: Workflow Layer

### Memory Engine (Database)

- [ ] Prisma schema defined (`Task`, `TaskGraph`, `AgentResult`, `AuditEvent`, `CostRecord`)
- [ ] PostgreSQL trigger blocks UPDATE/DELETE on `audit_log` (ADR-0014)
- [ ] `agentx_app` role REVOKE UPDATE, DELETE ON `audit_log` applied
- [ ] `AuditService` computes chained hashes (RFC-0024)
- [ ] **Contract Test Pass:** Attempt UPDATE/DELETE on `audit_log` throws database exception

### Context Engine & Workflow

- [ ] `TaskContext` retrieval bounded to last-N + rolling summary (RFC-0008)
- [ ] `buildGraph()` rejects cyclic dependencies (RFC-0004)
- [ ] Default Workflow Policy: gate before any coding node with "commit" in description
- [ ] Two-layer approval gate functional (Tool-level + Policy-level)
- [ ] Task Graph Rollback (Manual Recovery) events emitted: `task_graph.started/failed/compensated`, `task_node.completed/failed` (RFC-0038)

---

## [ ] PHASE 4: Extensibility

### Plugin SDK

- [ ] **Gate:** Agent SDK + Provider SDK + RFC-0027 complete
- [ ] Plugin loader uses `child_process.fork()` with memory (128MB) / CPU (30s) limits
- [ ] Custom `require` hook blocks `fs`, `net`, `child_process`
- [ ] Manifest validator rejects colliding agent roles and invalid semver
- [ ] **Contract Test Pass:** Plugin attempting to `require('child_process')` is terminated

---

## [ ] PHASE 5: Product Surface / v0.1 Release

### CLI Commands

- [ ] `agentx submit`, `status`, `watch`, `approve`, `reject` functional
- [ ] `agentx cost`, `audit` read-only functional
- [ ] Approval prompt shows concrete action, NO default, NO timeout (RFC-0010)
- [ ] **Contract Test Pass:** CLI output at all verbosity levels contains NO credential substrings

### v0.1 Exit Criteria

- [ ] End-to-end test passes: `agentx submit` → decompose → plan → execute → approve → result
- [ ] Provider failover test passes (primary 503 → secondary responds)
- [ ] `docker-compose up` brings up working self-hosted stack (ADR-0007)
- [ ] `04-Schemas/` populated for Volumes 2–9

---

## [ ] PHASE 6: Identity & Access (v0.5 Auth)

- [ ] `LocalIdentityProvider` (derives from OS username)
- [ ] `TokenIdentityProvider` (JWT RS256 issuance/validation)
- [ ] `agentx login` and `agentx auth revoke-session` commands
- [ ] **Contract Test Pass:** Account lockout triggers after 5 failures (Vol 15 FR-4)
- [ ] **Contract Test Pass:** Unrecognized role → zero permissions (fail-closed)

---

## [ ] PHASE 7: Enterprise Platform

- [ ] `tenantId` column added to all Vol 6 models
- [ ] Postgres Row-Level Security (RLS) enabled on tenant-scoped tables (ADR-0006)
- [ ] Tenant-scoped Prisma client extension fails closed without tenant context
- [ ] **Contract Test Pass:** Cross-tenant read attempt → empty result (DB layer enforces)
- [ ] Audit export to CSV/JSON by tenant + date range
- [ ] Dashboard scope resolved (RFC-0039) and minimum v0.5 features implemented

---

## [ ] PHASE 8: Cloud & Release Engineering

- [ ] Self-hosted fallback documented for every managed service in Vol 11 table
- [ ] Release pipeline: Conventional Commits → auto SemVer → CHANGELOG → tag → publish (RFC-0041)
- [ ] Deprecation policy active: 2-minor-version warning (RFC-0029)
- [ ] DR drill conducted: PostgreSQL restore + hash chain verification + BullMQ recovery (RFC-0030)
- [ ] Canary deployment pipeline operational (10% → 50% → 100%)

---

## [ ] PHASE 10: v1.0 Production Readiness

- [ ] 9 Quality Gates passed (Architecture, Spec, Schema, Contract, Security, Perf, Test, Doc, Release)
- [ ] Performance targets ratified and load-tested
- [ ] RFC-0021 threat model verified against REAL Tool SDK behavior
- [ ] RFC-0027 plugin trust model verified through ≥1 real third-party plugin
- [ ] RFC-0024/ADR-0014 audit log immutability proven by automated test
- [ ] ≥1 actual DR restore drill completed
- [ ] ADR-0008 (no push alerting) explicitly re-reviewed for production context
- [ ] SOC2 data classification document complete
- [ ] Dashboard built per RFC-0039 or officially cancelled (no "pending" status)
- [ ] Marketplace explicitly deferred per ADR-0016
