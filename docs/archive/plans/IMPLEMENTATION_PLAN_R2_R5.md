# Agentx — Implementation Plan R2-R5

**Tanggal:** 19 Juli 2026
**Baseline:** Audit Phase 1-4 complete (25/25 steps ✅)
**Target:** Code quality & completeness untuk production readiness

---

## Workflow Per Step

Setiap step mengikuti workflow ini:

```
1. Kerjakan step → commit ke branch baru
2. Push → auto-trigger CI
3. Cek CI: gh run list --limit 1
4. CI hijau? → gh pr create → review → gh pr merge --squash
5. CI merah? → fix → re-push → tunggu hijau
6. Merge → update tracker di file ini → commit → push main
```

### Checklist per step

Setiap step harus melewati:

- [ ] Source code berubah
- [ ] `pnpm typecheck` pass
- [ ] `pnpm build` pass
- [ ] `pnpm test` pass
- [ ] `pnpm lint` pass (jika ESLint step)
- [ ] `pnpm test:coverage` pass
- [ ] `pnpm lint:deps` pass
- [ ] `pnpm lint:handbook` pass (jika handbook step)
- [ ] CI GitHub Actions hijau
- [ ] PR created & merged
- [ ] Tracker di file ini di-update

### Branch naming convention

```
r2/step-<N>-<short-description>
r3/step-<N>-<short-description>
r4/step-<N>-<short-description>
r5/step-<N>-<short-description>
```

### PR template

```
## What
<1 line description of what this step does>

## Why
<Link to plan step and explain why>

## Verification
- [ ] pnpm typecheck ✅
- [ ] pnpm build ✅
- [ ] pnpm test ✅
- [ ] pnpm lint ✅
- [ ] pnpm test:coverage ✅
- [ ] pnpm lint:deps ✅
- [ ] CI green ✅
```

---

## Progress Tracker

| Phase                    | Steps  | Done  | PR Merged | CI Green | Remaining |
| ------------------------ | ------ | ----- | --------- | -------- | --------- |
| R2 — ESLint Upgrade      | 5      | 2     | 2         | 2        | 3         |
| R3 — Test Coverage       | 6      | 0     | 0         | 0        | 6         |
| R4 — Stub Implementation | 6      | 0     | 0         | 0        | 6         |
| R5 — Vol 11/12           | 2      | 0     | 0         | 0        | 2         |
| **TOTAL**                | **19** | **2** | **2**     | **2**    | **17**    |

### Status Icons

- `[ ]` Not started
- `[~]` In progress
- `[x]` Done & merged
- `[-]` Deferred

### Legend

- `[ ]` — Belum dikerjakan
- `[~]` — Sedang dikerjakan
- `[x]` — Selesai
- `[-]` — Dibatalkan/ditunda

---

## Phase R2: ESLint warn → error Upgrade

**Goal:** Upgrade 19 ESLint rules dari `warn` ke `error` level agar violations gagalkan CI.

**Current state:** `.eslintrc.cjs` punya 19 rules di-set ke `warn` (sebelumnya `error`) karena banyak violations di source code. CI tidak fail pada warnings.

### Step R2.1: Count & prioritize violations per rule

- [ ] Jalankan `pnpm lint 2>&1 | grep "warning" | grep -oP '@typescript-eslint/\S+|no-control-regex|prefer-const|no-async-promise-executor' | sort | uniq -c | sort -rn`
- [ ] Identifikasi top 5 rules dengan violations terbanyak
- [ ] Urutkan rules dari violations paling sedikit ke paling banyak

**CI & Merge:**

- [ ] `pnpm typecheck && pnpm build && pnpm test && pnpm test:coverage && pnpm lint:deps` pass
- [ ] `git checkout -b r<N>/step-<M>-<desc>` → commit → push
- [ ] `gh pr create --title 'fix(plan): R<N>.<M> <description>' --body '...'`
- [ ] CI green → `gh pr merge --squash`
- [ ] Update tracker: `[ ]` → `[x]` in this file → commit → push to main

**Exit Criteria:** Daftar urutan 19 rules berdasarkan jumlah violations.

### Step R2.2: Fix rules dengan violations < 10 `[x]`

- [ ] Untuk setiap rule dengan < 10 violations:
  - Baca file yang violation
  - Fix source code (remove unused imports, fix type assertions, dll)
  - Upgrade rule ke `error` di `.eslintrc.cjs`
  - Verify `pnpm lint` pass

**Expected rules:** `prefer-const`, `no-control-regex`, `no-async-promise-executor`, `@typescript-eslint/await-thenable`, `@typescript-eslint/no-unnecessary-type-assertion`, `@typescript-eslint/no-redundant-type-constituents`, `@typescript-eslint/ban-types`

**CI & Merge:**

- [ ] `pnpm typecheck && pnpm build && pnpm test && pnpm test:coverage && pnpm lint:deps` pass
- [ ] `git checkout -b r<N>/step-<M>-<desc>` → commit → push
- [ ] `gh pr create --title 'fix(plan): R<N>.<M> <description>' --body '...'`
- [ ] CI green → `gh pr merge --squash`
- [ ] Update tracker: `[ ]` → `[x]` in this file → commit → push to main

**Exit Criteria:** 7+ rules upgraded ke error, `pnpm lint` pass.

### Step R2.3: Fix `no-explicit-any` violations `[x]`

- [ ] Jalankan `pnpm lint 2>&1 | grep "no-explicit-any"` untuk list semua files
- [ ] Replace `any` dengan proper types:
  - `Record<string, unknown>` untuk generic objects
  - `unknown` + type guard untuk unknown data
  - Specific interfaces untuk known shapes
- [ ] Upgrade rule ke `error`

**CI & Merge:**

- [ ] `pnpm typecheck && pnpm build && pnpm test && pnpm test:coverage && pnpm lint:deps` pass
- [ ] `git checkout -b r<N>/step-<M>-<desc>` → commit → push
- [ ] `gh pr create --title 'fix(plan): R<N>.<M> <description>' --body '...'`
- [ ] CI green → `gh pr merge --squash`
- [ ] Update tracker: `[ ]` → `[x]` in this file → commit → push to main

**Exit Criteria:** Zero `no-explicit-any` violations, `pnpm lint` pass.

### Step R2.4: Fix `no-unsafe-*` family violations `[x]`

- [ ] Rules: `no-unsafe-member-access`, `no-unsafe-assignment`, `no-unsafe-argument`, `no-unsafe-call`, `no-unsafe-return`
- [ ] Fix pattern:
  - Add type annotations ke function parameters
  - Use type guards sebelum access properties
  - Use `as` assertions dengan proper types
  - Fix Map.get() / array[index] returns dengan `!` atau guard
- [ ] Upgrade rules ke `error` satu per satu

**CI & Merge:**

- [ ] `pnpm typecheck && pnpm build && pnpm test && pnpm test:coverage && pnpm lint:deps` pass
- [ ] `git checkout -b r<N>/step-<M>-<desc>` → commit → push
- [ ] `gh pr create --title 'fix(plan): R<N>.<M> <description>' --body '...'`
- [ ] CI green → `gh pr merge --squash`
- [ ] Update tracker: `[ ]` → `[x]` in this file → commit → push to main

**Exit Criteria:** Zero `no-unsafe-*` violations, `pnpm lint` pass.

### Step R2.5: Fix remaining rules + final verification

- [ ] Fix `@typescript-eslint/no-misused-promises` violations
- [ ] Fix `@typescript-eslint/restrict-template-expressions` violations
- [ ] Final verification: semua 19 rules di `error`, `pnpm lint` zero warnings
- [ ] Commit dan verify CI green

**CI & Merge:**

- [ ] `pnpm typecheck && pnpm build && pnpm test && pnpm test:coverage && pnpm lint:deps` pass
- [ ] `git checkout -b r<N>/step-<M>-<desc>` → commit → push
- [ ] `gh pr create --title 'fix(plan): R<N>.<M> <description>' --body '...'`
- [ ] CI green → `gh pr merge --squash`
- [ ] Update tracker: `[ ]` → `[x]` in this file → commit → push to main

**Exit Criteria:** `.eslintrc.cjs` punya zero `warn` rules. CI green.

---

## Phase R3: Test Coverage

**Goal:** Tambah test files ke packages yang belum punya test. Target: semua packages punya minimal 1 test file.

**Current state:** ~30 dari ~40 packages tidak punya test files.

### Step R3.1: Test untuk shared packages (priority: foundation)

- [ ] `packages/shared/shared/` — test identity, logger, metrics, telemetry
- [ ] `packages/shared/core-runtime/` — sudah ada tests, verify coverage > 80%
- [ ] `packages/shared/secrets/` — test audit-trail, resolver, store
- [ ] `packages/shared/tool-sdk/` — test shell-sandbox, classification, registry
- [ ] `packages/shared/memory-engine/` — test prisma-store, engine
- [ ] `packages/shared/context-engine/` — test context building
- [ ] `packages/shared/knowledge-engine/` — test knowledge queries

**CI & Merge:**

- [ ] `pnpm typecheck && pnpm build && pnpm test && pnpm test:coverage && pnpm lint:deps` pass
- [ ] `git checkout -b r<N>/step-<M>-<desc>` → commit → push
- [ ] `gh pr create --title 'fix(plan): R<N>.<M> <description>' --body '...'`
- [ ] CI green → `gh pr merge --squash`
- [ ] Update tracker: `[ ]` → `[x]` in this file → commit → push to main

**Exit Criteria:** 7 shared packages punya tests, `pnpm test` pass.

### Step R3.2: Test untuk agent & workflow packages

- [ ] `packages/agent/agent-platform/` — test sub-agents, orchestrator, consensus
- [ ] `packages/agent/multi-agent-collaboration/` — test collaboration patterns
- [ ] `packages/agent/multi-agent-reasoning/` — test reasoning registry
- [ ] `packages/workflow/workflow-engine/` — sudah ada tests, verify
- [ ] `packages/workflow/workflow-orchestration/` — test orchestration
- [ ] `packages/workflow/workflow-hardening/` — test hardening rules

**CI & Merge:**

- [ ] `pnpm typecheck && pnpm build && pnpm test && pnpm test:coverage && pnpm lint:deps` pass
- [ ] `git checkout -b r<N>/step-<M>-<desc>` → commit → push
- [ ] `gh pr create --title 'fix(plan): R<N>.<M> <description>' --body '...'`
- [ ] CI green → `gh pr merge --squash`
- [ ] Update tracker: `[ ]` → `[x]` in this file → commit → push to main

**Exit Criteria:** 6 packages punya tests, `pnpm test` pass.

### Step R3.3: Test untuk provider & plugin packages

- [ ] `packages/provider/provider-sdk/` — test registry, resilience, providers
- [ ] `packages/provider/provider-qualification/` — test qualification
- [ ] `packages/provider/native-providers/` — test provider implementations
- [ ] `packages/provider/provider-release/` — test release flow
- [ ] `packages/provider/vendor-certification/` — test certification
- [ ] `packages/plugin-sdk/` — test manifest validation, registry, loader

**CI & Merge:**

- [ ] `pnpm typecheck && pnpm build && pnpm test && pnpm test:coverage && pnpm lint:deps` pass
- [ ] `git checkout -b r<N>/step-<M>-<desc>` → commit → push
- [ ] `gh pr create --title 'fix(plan): R<N>.<M> <description>' --body '...'`
- [ ] CI green → `gh pr merge --squash`
- [ ] Update tracker: `[ ]` → `[x]` in this file → commit → push to main

**Exit Criteria:** 6 packages punya tests, `pnpm test` pass.

### Step R3.4: Test untuk cognitive & reasoning packages

- [ ] `packages/cognitive/cognitive-contracts/` — test interfaces
- [ ] `packages/cognitive/cognitive-kernel/` — test kernel lifecycle
- [ ] `packages/cognitive/cognitive-learning/` — test learning engine
- [ ] `packages/cognitive/autonomous-cognition/` — test autonomous execution
- [ ] `packages/reasoning/reasoning-algorithms/` — sudah ada tests, verify
- [ ] `packages/reasoning/reasoning-framework/` — test framework

**CI & Merge:**

- [ ] `pnpm typecheck && pnpm build && pnpm test && pnpm test:coverage && pnpm lint:deps` pass
- [ ] `git checkout -b r<N>/step-<M>-<desc>` → commit → push
- [ ] `gh pr create --title 'fix(plan): R<N>.<M> <description>' --body '...'`
- [ ] CI green → `gh pr merge --squash`
- [ ] Update tracker: `[ ]` → `[x]` in this file → commit → push to main

**Exit Criteria:** 6 packages punya tests, `pnpm test` pass.

### Step R3.5: Test untuk remaining packages

- [ ] `packages/runtime/runtime/` — sudah ada tests, verify
- [ ] `packages/runtime/runtime-adapters/` — test adapters
- [ ] `packages/runtime/runtime-production/` — sudah ada tests, verify
- [ ] `packages/runtime/enterprise-runtime/` — test RBAC, multi-tenant
- [ ] `packages/distributed/distributed-cognition/` — test distribution
- [ ] `packages/planning/planning-engine/` — test planning
- [ ] `packages/planning/goal-intelligence/` — test goal management
- [ ] `packages/quality/architecture-sdk/` — test architecture validation
- [ ] `packages/quality/production-quality/` — test quality gates
- [ ] `packages/platform/developer-platform/` — sudah ada tests, verify

**CI & Merge:**

- [ ] `pnpm typecheck && pnpm build && pnpm test && pnpm test:coverage && pnpm lint:deps` pass
- [ ] `git checkout -b r<N>/step-<M>-<desc>` → commit → push
- [ ] `gh pr create --title 'fix(plan): R<N>.<M> <description>' --body '...'`
- [ ] CI green → `gh pr merge --squash`
- [ ] Update tracker: `[ ]` → `[x]` in this file → commit → push to main

**Exit Criteria:** 10 packages punya tests, `pnpm test` pass.

### Step R3.6: Coverage threshold enforcement

- [ ] Set minimum 70% line coverage untuk semua packages
- [ ] Set minimum 60% function coverage untuk semua packages
- [ ] Verify `pnpm test:coverage` pass dengan thresholds
- [ ] Commit dan verify CI green

**CI & Merge:**

- [ ] `pnpm typecheck && pnpm build && pnpm test && pnpm test:coverage && pnpm lint:deps` pass
- [ ] `git checkout -b r<N>/step-<M>-<desc>` → commit → push
- [ ] `gh pr create --title 'fix(plan): R<N>.<M> <description>' --body '...'`
- [ ] CI green → `gh pr merge --squash`
- [ ] Update tracker: `[ ]` → `[x]` in this file → commit → push to main

**Exit Criteria:** All packages meet minimum coverage thresholds. CI green.

---

## Phase R4: Stub Implementation

**Goal:** Replace stub/placeholder implementations dengan real logic.

**Current state:** ~279 files < 30 lines. Banyak yang legitimate (interfaces, error classes, barrel exports), tapi ~100+ files punya empty method bodies atau `throw new Error('not implemented')`.

### Step R4.1: Identify real stubs vs legitimate small files

- [ ] Scan semua files < 30 lines
- [ ] Kategorisasi:
  - **Legitimate:** interface-only files, error classes, barrel exports, type definitions
  - **Real stubs:** files dengan class yang punya empty methods, `throw 'not implemented'`, atau `return undefined`
- [ ] List files yang perlu diisi implementasi

**CI & Merge:**

- [ ] `pnpm typecheck && pnpm build && pnpm test && pnpm test:coverage && pnpm lint:deps` pass
- [ ] `git checkout -b r<N>/step-<M>-<desc>` → commit → push
- [ ] `gh pr create --title 'fix(plan): R<N>.<M> <description>' --body '...'`
- [ ] CI green → `gh pr merge --squash`
- [ ] Update tracker: `[ ]` → `[x]` in this file → commit → push to main

**Exit Criteria:** Daftar files yang benar-benar perlu diimplementasi.

### Step R4.2: Implement stubs di core packages

- [ ] `packages/shared/core-runtime/` — scheduler, retry, cancellation
- [ ] `packages/shared/shared/` — logger implementations, metrics collector
- [ ] `packages/shared/secrets/` — vault backend, file backend
- [ ] `packages/shared/tool-sdk/` — filesystem operations, git operations

**CI & Merge:**

- [ ] `pnpm typecheck && pnpm build && pnpm test && pnpm test:coverage && pnpm lint:deps` pass
- [ ] `git checkout -b r<N>/step-<M>-<desc>` → commit → push
- [ ] `gh pr create --title 'fix(plan): R<N>.<M> <description>' --body '...'`
- [ ] CI green → `gh pr merge --squash`
- [ ] Update tracker: `[ ]` → `[x]` in this file → commit → push to main

**Exit Criteria:** Core packages punya real implementations, `pnpm build` pass.

### Step R4.3: Implement stubs di agent & workflow

- [ ] `packages/agent/agent-platform/` — agent lifecycle, task delegation
- [ ] `packages/workflow/workflow-engine/` — graph execution, approval gates
- [ ] `packages/workflow/workflow-orchestration/` — multi-workflow coordination
- [ ] `packages/workflow/workflow-hardening/` — retry policies, circuit breakers

**CI & Merge:**

- [ ] `pnpm typecheck && pnpm build && pnpm test && pnpm test:coverage && pnpm lint:deps` pass
- [ ] `git checkout -b r<N>/step-<M>-<desc>` → commit → push
- [ ] `gh pr create --title 'fix(plan): R<N>.<M> <description>' --body '...'`
- [ ] CI green → `gh pr merge --squash`
- [ ] Update tracker: `[ ]` → `[x]` in this file → commit → push to main

**Exit Criteria:** Agent & workflow packages punya real implementations.

### Step R4.4: Implement stubs di provider & cognitive

- [ ] `packages/provider/provider-sdk/` — cost tracking, rate limiting
- [ ] `packages/cognitive/cognitive-kernel/` — session management, checkpoint
- [ ] `packages/cognitive/cognitive-learning/` — strategy adjustment
- [ ] `packages/reasoning/reasoning-framework/` — pipeline stages

**CI & Merge:**

- [ ] `pnpm typecheck && pnpm build && pnpm test && pnpm test:coverage && pnpm lint:deps` pass
- [ ] `git checkout -b r<N>/step-<M>-<desc>` → commit → push
- [ ] `gh pr create --title 'fix(plan): R<N>.<M> <description>' --body '...'`
- [ ] CI green → `gh pr merge --squash`
- [ ] Update tracker: `[ ]` → `[x]` in this file → commit → push to main

**Exit Criteria:** Provider & cognitive packages punya real implementations.

### Step R4.5: Implement stubs di remaining packages

- [ ] `packages/runtime/runtime-production/` — queue adapters, lock providers
- [ ] `packages/runtime/enterprise-runtime/` — tenant manager, session manager
- [ ] `packages/distributed/distributed-cognition/` — cluster coordination
- [ ] `packages/planning/goal-intelligence/` — goal lifecycle
- [ ] `packages/quality/production-quality/` — quality gates

**CI & Merge:**

- [ ] `pnpm typecheck && pnpm build && pnpm test && pnpm test:coverage && pnpm lint:deps` pass
- [ ] `git checkout -b r<N>/step-<M>-<desc>` → commit → push
- [ ] `gh pr create --title 'fix(plan): R<N>.<M> <description>' --body '...'`
- [ ] CI green → `gh pr merge --squash`
- [ ] Update tracker: `[ ]` → `[x]` in this file → commit → push to main

**Exit Criteria:** Semua packages punya real implementations.

### Step R4.6: Verification & CI

- [ ] Run `pnpm typecheck && pnpm build && pnpm test && pnpm test:coverage`
- [ ] Verify zero `throw 'not implemented'` remaining
- [ ] Verify coverage thresholds masih pass
- [ ] Commit dan verify CI green

**CI & Merge:**

- [ ] `pnpm typecheck && pnpm build && pnpm test && pnpm test:coverage && pnpm lint:deps` pass
- [ ] `git checkout -b r<N>/step-<M>-<desc>` → commit → push
- [ ] `gh pr create --title 'fix(plan): R<N>.<M> <description>' --body '...'`
- [ ] CI green → `gh pr merge --squash`
- [ ] Update tracker: `[ ]` → `[x]` in this file → commit → push to main

**Exit Criteria:** Zero stubs remaining. All CI checks green.

---

## Phase R5: Vol 11 (Cloud) & Vol 12 (AI OS)

**Goal:** Implementasi Volume 11 dan 12 sesuai handbook specification.

**Note:** Ini post-v0.1 scope. Bisa ditunda kalau bukan prioritas.

### Step R5.1: Vol 11 — Cloud Platform

- [ ] Buat `packages/cloud/` atau gunakan `packages/distributed/` yang ada
- [ ] Implementasi deployment topology (scheduler workers, API servers)
- [ ] Implementasi auto-scaling logic
- [ ] Implementasi self-hosted fallback mechanism
- [ ] Tambah environment strategy (dev/staging/prod)
- [ ] Tambah tests

**CI & Merge:**

- [ ] `pnpm typecheck && pnpm build && pnpm test && pnpm test:coverage && pnpm lint:deps` pass
- [ ] `git checkout -b r<N>/step-<M>-<desc>` → commit → push
- [ ] `gh pr create --title 'fix(plan): R<N>.<M> <description>' --body '...'`
- [ ] CI green → `gh pr merge --squash`
- [ ] Update tracker: `[ ]` → `[x]` in this file → commit → push to main

**Exit Criteria:** Vol 11 specification terimplementasi. CI green.

### Step R5.2: Vol 12 — AI Company OS

- [ ] Buat `packages/ai-os/` package baru
- [ ] Implementasi cross-project coordination
- [ ] Implementasi org-level budget allocation
- [ ] Implementasi portfolio reporting
- [ ] Tambah tests

**CI & Merge:**

- [ ] `pnpm typecheck && pnpm build && pnpm test && pnpm test:coverage && pnpm lint:deps` pass
- [ ] `git checkout -b r<N>/step-<M>-<desc>` → commit → push
- [ ] `gh pr create --title 'fix(plan): R<N>.<M> <description>' --body '...'`
- [ ] CI green → `gh pr merge --squash`
- [ ] Update tracker: `[ ]` → `[x]` in this file → commit → push to main

**Exit Criteria:** Vol 12 specification terimplementasi. CI green.

---

## Execution Order

```
R2 (ESLint) → R3 (Tests) → R4 (Stubs) → R5 (Vol 11/12)
  ~1-2 jam     ~3-4 jam      ~4-6 jam      ~8-12 jam
```

**Total estimated effort:** ~16-24 jam

### Dependencies

- R2 harus duluan karena ESLint errors akan block CI setelah upgrade
- R3 bisa parallel dengan R4 (test files tidak overlap dengan source changes)
- R5 independent, bisa ditunda

### Risk Mitigation

- ESLint fixes bisa introduce bugs → verify dengan test suite setelah setiap batch
- Stub implementations bisa conflict → kerjakan per-domain, bukan per-file
- Test coverage thresholds terlalu ketat → mulai dari 60-70%, naikkan bertahap
