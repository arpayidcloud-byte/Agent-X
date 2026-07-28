# AGENTX AUDIT REMEDIATION PLAN

**Document Version:** 1.0  
**Created:** July 24, 2026  
**Project:** Agentx v1.0.1  
**Total Issues:** 20 Critical Findings  
**Timeline:** 4 Weeks

---

## 📊 ISSUE ANALYSIS

### By Severity

| Severity | Count | Week     | Status |
| -------- | ----- | -------- | ------ |
| CRITICAL | 6     | Week 1   | P0     |
| HIGH     | 7     | Week 1-2 | P1     |
| MEDIUM   | 4     | Week 2-3 | P2     |
| LOW      | 3     | Week 3-4 | P3     |

### By Category

| Category      | Count | Issues                                     |
| ------------- | ----- | ------------------------------------------ |
| Security      | 6     | Auth, CORS, Webhooks, Headers, Secrets     |
| Code Quality  | 4     | Typecheck, JSDoc, `any` types, console.log |
| Dependencies  | 3     | Vulnerabilities, License, Repository       |
| Test Coverage | 3     | api-server, workflow-engine, cognitive     |
| Documentation | 4     | READMEs, API docs, JSDoc, CHANGELOG        |

### Effort Estimation

| Phase     | Issues | Effort (hours) | Dependencies               |
| --------- | ------ | -------------- | -------------------------- |
| 1         | 6      | 24-32          | None (blocking all phases) |
| 2         | 4      | 16-20          | Phase 1 complete           |
| 3         | 3      | 20-24          | Phase 1 complete           |
| 4         | 4      | 16-20          | Phase 2 complete           |
| 5         | 3      | 8-12           | None (parallel)            |
| **Total** | **20** | **84-108**     |                            |

---

## 🗓️ PHASE 1 - SECURITY CRITICAL (WEEK 1)

**Goal:** Fix all 6 critical security vulnerabilities  
**Sub-Agents:** 6 (Security-1 through Security-6)  
**MCP Tools:** search_graph, trace_path, get_code_snippet  
**Success Criteria:** 0 CRITICAL security issues, all API keys rotated

---

### Batch 1.1 - API Key Rotation & .env Hardening

#### Tasks

1. Rotate all API keys in `.env` (Anthropic, OpenAI, Google)
2. Fix `.env` file permissions to `chmod 600`
3. Add `.env.example` with placeholder values
4. Create secrets rotation documentation

#### Sub-Agent Assignments

| Agent      | Task                                 | Time  |
| ---------- | ------------------------------------ | ----- |
| Security-1 | Rotate API keys, update .env         | 2 hrs |
| Security-2 | Fix permissions, create .env.example | 1 hr  |

#### MCP Tools Required

```bash
search_graph(name_pattern=".*api.*key.*")
search_graph(name_pattern=".*secret.*")
trace_path(function_name="loadSecrets", direction="outbound")
```

#### Testing

- [ ] Verify `.env` permissions: `ls -la .env` shows `-rw-------`
- [ ] Verify `.env.example` exists with placeholder values
- [ ] Verify no API keys committed to git
- [ ] Test all integrations with new keys

#### Success Criteria

- ✅ `.env` permissions set to 600
- ✅ `.env.example` created with placeholders
- ✅ All API keys rotated and functional
- ✅ Secrets rotation doc created in `docs/security/`

---

### Batch 1.2 - GitHub Webhook Signature Verification

#### Tasks

1. Add HMAC-SHA256 signature verification for GitHub webhooks
2. Validate `X-Hub-Signature-256` header
3. Add secret configuration for webhook secret
4. Add tests for signature verification

#### Sub-Agent Assignments

| Agent      | Task                                   | Time  |
| ---------- | -------------------------------------- | ----- |
| Security-3 | Implement signature verification logic | 3 hrs |
| Security-4 | Add configuration and tests            | 2 hrs |

#### MCP Tools Required

```bash
search_graph(name_pattern=".*github.*webhook.*")
get_code_snippet(qualified_name="packages/api-server/src/integrations/github.ts")
trace_path(function_name="handleWebhook", direction="inbound")
```

#### Testing

- [ ] Unit tests for valid signature
- [ ] Unit tests for invalid signature
- [ ] Unit tests for missing signature
- [ ] Integration test with GitHub test webhook

#### Success Criteria

- ✅ `X-Hub-Signature-256` validation implemented
- ✅ Webhook secret configurable via env
- ✅ All tests pass (100% coverage for webhook handler)
- ✅ Rejection of unsigned webhooks logged

---

### Batch 1.3 - CORS Configuration Fix

#### Tasks

1. Replace `origin: true` with explicit allowed origins
2. Add environment variable for CORS origins
3. Add origin validation middleware
4. Document CORS configuration

#### Sub-Agent Assignments

| Agent      | Task                    | Time  |
| ---------- | ----------------------- | ----- |
| Security-5 | Fix CORS configuration  | 2 hrs |
| Security-6 | Add validation and docs | 1 hr  |

#### MCP Tools Required

```bash
search_graph(name_pattern=".*cors.*")
get_code_snippet(qualified_name="packages/api-server/src/index.ts")
```

#### Testing

- [ ] Test with allowed origin (should pass)
- [ ] Test with disallowed origin (should block)
- [ ] Test with no origin header
- [ ] Verify preflight requests handled correctly

#### Success Criteria

- ✅ CORS `origin` set to explicit allowlist
- ✅ Configurable via `CORS_ALLOWED_ORIGINS` env
- ✅ Blocked origins return 403
- ✅ Documentation updated

---

### Batch 1.4 - Authentication Hardening

#### Tasks

1. Replace simple string comparison with `timingSafeEqual`
2. Make authentication mandatory (remove optional guard)
3. Add auth failure logging
4. Add rate limiting for auth failures

#### Sub-Agent Assignments

| Agent      | Task                             | Time  |
| ---------- | -------------------------------- | ----- |
| Security-1 | Implement timing-safe comparison | 2 hrs |
| Security-2 | Make auth mandatory              | 2 hrs |

#### MCP Tools Required

```bash
search_graph(name_pattern=".*auth.*middleware.*")
get_code_snippet(qualified_name="packages/api-server/src/middleware/auth.ts")
trace_path(function_name="authenticate", direction="inbound")
```

#### Testing

- [ ] Test timing-safe comparison
- [ ] Test requests without auth are rejected
- [ ] Test rate limiting triggers
- [ ] Test valid auth still works

#### Success Criteria

- ✅ `crypto.timingSafeEqual` used for token comparison
- ✅ Auth is mandatory (no bypass)
- ✅ Failed auth attempts logged
- ✅ Rate limiting active on auth endpoint

---

### Batch 1.5 - Security Headers Implementation

#### Tasks

1. Install `@fastify/helmet`
2. Configure security headers (CSP, HSTS, X-Frame-Options, etc.)
3. Add CSP nonce support for inline scripts
4. Document security headers

#### Sub-Agent Assignments

| Agent      | Task                         | Time  |
| ---------- | ---------------------------- | ----- |
| Security-3 | Install and configure helmet | 2 hrs |
| Security-4 | Test and document            | 1 hr  |

#### MCP Tools Required

```bash
search_graph(name_pattern=".*fastify.*plugin.*")
get_code_snippet(qualified_name="packages/api-server/src/index.ts")
```

#### Testing

- [ ] Verify all security headers present
- [ ] Test CSP doesn't break functionality
- [ ] Verify HSTS header set
- [ ] Security scan with headers

#### Success Criteria

- ✅ `@fastify/helmet` installed and configured
- ✅ Headers present: X-Frame-Options, X-Content-Type-Options, HSTS, CSP
- ✅ CSP allows required resources
- ✅ No security header warnings in scan

---

### Batch 1.6 - Secret Audit Trail Logging Fix

#### Tasks

1. Remove console.log from audit-trail.ts
2. Replace with logger abstraction
3. Ensure no secrets logged
4. Add audit log redaction tests

#### Sub-Agent Assignments

| Agent      | Task                       | Time  |
| ---------- | -------------------------- | ----- |
| Security-5 | Fix logging in audit-trail | 2 hrs |
| Security-6 | Add tests for redaction    | 1 hr  |

#### MCP Tools Required

```bash
search_graph(name_pattern=".*audit.*trail.*")
get_code_snippet(qualified_name="packages/shared/secrets/src/audit-trail.ts")
```

#### Testing

- [ ] Verify no secrets in logs
- [ ] Test redaction of sensitive fields
- [ ] Verify logger abstraction used
- [ ] Check no console.log in file

#### Success Criteria

- ✅ No console.log in audit-trail.ts
- ✅ Logger abstraction used
- ✅ Secrets redacted from logs
- ✅ Tests verify redaction

---

## 🗓️ PHASE 2 - CODE QUALITY (WEEK 1-2)

**Goal:** Fix 4 critical code quality issues  
**Sub-Agents:** 4 (Quality-1 through Quality-4)  
**MCP Tools:** search_graph, query_graph  
**Success Criteria:** 100% typecheck compliance, JSDoc coverage > 50%

---

### Batch 2.1 - Enable Typecheck for 11 Packages

#### Tasks

1. Identify type errors in each package
2. Fix type errors or remove `skipLibCheck`
3. Update tsconfig for each package
4. Add typecheck to CI for all packages

**Packages:**

- @agentx/multi-agent-reasoning
- @agentx/multi-agent-collaboration
- @agentx/vendor-certification
- @agentx/provider-release
- @agentx/reasoning-framework
- @agentx/workflow-hardening
- @agentx/workflow-orchestration
- @agentx/cognitive-contracts
- @agentx/cognitive-learning
- @agentx/goal-intelligence
- @agentx/production-quality

#### Sub-Agent Assignments

| Agent     | Packages                                    | Time  |
| --------- | ------------------------------------------- | ----- |
| Quality-1 | multi-agent-reasoning, multi-agent-collab   | 3 hrs |
| Quality-2 | vendor-certification, provider-release      | 2 hrs |
| Quality-3 | reasoning-framework, workflow-hardening     | 3 hrs |
| Quality-4 | workflow-orchestration, cognitive-contracts | 3 hrs |

#### MCP Tools Required

```bash
search_graph(name_pattern=".*tsconfig.*")
query_graph(query="MATCH (p:Package) WHERE p.skipLibCheck = true RETURN p.name")
```

#### Testing

- [ ] Run `pnpm typecheck` - all packages pass
- [ ] No `skipLibCheck` in any tsconfig
- [ ] CI typecheck step passes

#### Success Criteria

- ✅ All 11 packages pass typecheck
- ✅ No `skipLibCheck` in tsconfig
- ✅ Type errors fixed or properly typed
- ✅ CI typecheck green

---

### Batch 2.2 - JSDoc Coverage Improvement

#### Tasks

1. Add JSDoc to all public APIs in provider-sdk
2. Add JSDoc to core-runtime exports
3. Add JSDoc to workflow-engine exports
4. Add @param, @returns, @example tags

#### Sub-Agent Assignments

| Agent     | Package                 | Time  |
| --------- | ----------------------- | ----- |
| Quality-1 | provider-sdk (priority) | 4 hrs |
| Quality-2 | core-runtime            | 3 hrs |
| Quality-3 | workflow-engine         | 3 hrs |
| Quality-4 | agent-platform, shared  | 3 hrs |

#### MCP Tools Required

```bash
search_graph(name_pattern=".*export.*function.*")
search_graph(name_pattern=".*export.*class.*")
query_graph(query="MATCH (e:Export) WHERE e.hasJSDoc = false RETURN e LIMIT 100")
```

#### Testing

- [ ] JSDoc coverage > 50% for @param
- [ ] JSDoc coverage > 50% for @returns
- [ ] Examples provided for public APIs
- [ ] TypeDoc generation succeeds

#### Success Criteria

- ✅ @param coverage > 50%
- ✅ @returns coverage > 50%
- ✅ @example tags for main functions
- ✅ TypeDoc generates without errors

---

### Batch 2.3 - Fix `any` Types in Persistence Layer

#### Tasks

1. Find all `any` type usage with eslint-disable
2. Replace with proper types
3. Add type definitions if missing
4. Remove eslint-disable comments

#### Sub-Agent Assignments

| Agent     | Task                     | Time  |
| --------- | ------------------------ | ----- |
| Quality-1 | Find and fix `any` types | 2 hrs |
| Quality-2 | Add type definitions     | 1 hr  |

#### MCP Tools Required

```bash
search_graph(name_pattern=".*persistence.*")
grep(pattern=":\\s*any", include="*.ts")
grep(pattern="eslint-disable.*@typescript-eslint/no-explicit-any")
```

#### Testing

- [ ] No `any` types in persistence layer
- [ ] No eslint-disable for no-explicit-any
- [ ] Typecheck passes
- [ ] Runtime behavior unchanged

#### Success Criteria

- ✅ Zero `any` types in persistence
- ✅ Proper types defined
- ✅ eslint-disable removed
- ✅ Tests pass

---

### Batch 2.4 - Replace console.log with Logger

#### Tasks

1. Find all console.log statements (90 total)
2. Replace with logger abstraction in shared packages
3. Keep console.log in CLI (acceptable)
4. Add logger configuration

#### Sub-Agent Assignments

| Agent     | Scope                        | Time  |
| --------- | ---------------------------- | ----- |
| Quality-3 | shared packages (priority)   | 3 hrs |
| Quality-4 | api-server, runtime packages | 3 hrs |

#### MCP Tools Required

```bash
grep(pattern="console\\.log", include="*.ts")
search_graph(name_pattern=".*logger.*")
```

#### Testing

- [ ] No console.log in shared packages
- [ ] Logger abstraction used consistently
- [ ] Log levels appropriate (info/warn/error)
- ✅ CLI console.log preserved

#### Success Criteria

- ✅ < 20 console.log in non-CLI code
- ✅ Logger abstraction used
- ✅ Proper log levels
- ✅ No sensitive data in logs

---

## 🗓️ PHASE 3 - TEST COVERAGE (WEEK 2-3)

**Goal:** Fix 3 test coverage gaps  
**Sub-Agents:** 4 (Test-1 through Test-4)  
**MCP Tools:** search_graph, trace_path  
**Success Criteria:** All packages > threshold, 100% packages with tests

---

### Batch 3.1 - api-server Test Suite (CRITICAL)

#### Tasks

1. Create test structure for api-server
2. Add route tests (all endpoints)
3. Add middleware tests (auth, rate-limit)
4. Add integration tests (GitHub webhook)
5. Add vitest.config.ts

#### Sub-Agent Assignments

| Agent  | Scope                        | Time  |
| ------ | ---------------------------- | ----- |
| Test-1 | Route tests (REST endpoints) | 4 hrs |
| Test-2 | Middleware tests             | 3 hrs |
| Test-3 | Integration tests            | 4 hrs |
| Test-4 | Config and utilities         | 2 hrs |

#### MCP Tools Required

```bash
search_graph(name_pattern=".*api-server.*route.*")
get_code_snippet(qualified_name="packages/api-server/src/index.ts")
trace_path(function_name="registerRoutes", direction="outbound")
```

#### Testing

- [ ] All routes tested
- [ ] Auth middleware tested
- [ ] Rate limiting tested
- [ ] Webhook integration tested
- [ ] Coverage > 80%

#### Success Criteria

- ✅ api-server has test suite
- ✅ Coverage > 80% (from 0%)
- ✅ All critical paths tested
- ✅ vitest.config.ts created

---

### Batch 3.2 - workflow-engine Coverage Fix

#### Tasks

1. Add tests for validator.ts (52% → 90%)
2. Add tests for hooks.ts (62% → 90%)
3. Ensure overall coverage > 90%
4. Add edge case tests

#### Sub-Agent Assignments

| Agent  | Scope              | Time  |
| ------ | ------------------ | ----- |
| Test-1 | validator.ts tests | 3 hrs |
| Test-2 | hooks.ts tests     | 3 hrs |

#### MCP Tools Required

```bash
search_graph(name_pattern=".*workflow.*engine.*validator.*")
get_code_snippet(qualified_name="packages/workflow-engine/src/validator.ts")
get_code_snippet(qualified_name="packages/workflow-engine/src/hooks.ts")
```

#### Testing

- [ ] validator.ts coverage > 90%
- [ ] hooks.ts coverage > 90%
- [ ] Overall coverage > 90%
- [ ] All edge cases covered

#### Success Criteria

- ✅ workflow-engine coverage > 90%
- ✅ validator.ts fully tested
- ✅ hooks.ts fully tested
- ✅ Threshold passes in CI

---

### Batch 3.3 - cognitive-learning Coverage Fix

#### Tasks

1. Add tests for strategy-selector.ts (68% → 99%)
2. Ensure overall coverage > 99%
3. Add property-based tests for strategies

#### Sub-Agent Assignments

| Agent  | Scope                      | Time  |
| ------ | -------------------------- | ----- |
| Test-3 | strategy-selector.ts tests | 3 hrs |
| Test-4 | Property-based tests       | 2 hrs |

#### MCP Tools Required

```bash
search_graph(name_pattern=".*cognitive.*learning.*strategy.*")
get_code_snippet(qualified_name="packages/cognitive-learning/src/strategy-selector.ts")
```

#### Testing

- [ ] strategy-selector.ts coverage > 99%
- [ ] Overall coverage > 99%
- [ ] All strategies tested
- [ ] Edge cases covered

#### Success Criteria

- ✅ cognitive-learning coverage > 99%
- ✅ strategy-selector.ts fully tested
- ✅ Threshold passes in CI

---

## 🗓️ PHASE 4 - DOCUMENTATION (WEEK 3-4)

**Goal:** Fix 4 documentation gaps  
**Sub-Agents:** 4 (Docs-1 through Docs-4)  
**MCP Tools:** search_graph, get_architecture  
**Success Criteria:** Package README > 80%, API docs generated

---

### Batch 4.1 - Package README Templates

#### Tasks

1. Create README template
2. Generate READMEs for all 46 packages
3. Include: description, installation, usage, API reference
4. Add badge for test coverage

#### Sub-Agent Assignments

| Agent  | Packages                      | Time  |
| ------ | ----------------------------- | ----- |
| Docs-1 | Entry + Runtime (7 pkgs)      | 3 hrs |
| Docs-2 | Agent + SDK (10 pkgs)         | 3 hrs |
| Docs-3 | Cognitive + Workflow (7 pkgs) | 3 hrs |
| Docs-4 | Shared + Tooling (16 pkgs)    | 4 hrs |

#### MCP Tools Required

```bash
get_architecture()
search_graph(name_pattern=".*package.*json.*")
query_graph(query="MATCH (p:Package) RETURN p.name, p.description LIMIT 46")
```

#### Testing

- [ ] All 46 packages have README.md
- [ ] Template consistently applied
- [ ] Installation instructions valid
- [ ] Usage examples work

#### Success Criteria

- ✅ 100% packages have README.md
- ✅ Template includes all sections
- ✅ Examples are valid
- ✅ Coverage badges added

---

### Batch 4.2 - API Reference Documentation

#### Tasks

1. Install TypeDoc
2. Configure TypeDoc for monorepo
3. Generate API docs to docs/api/
4. Fix broken link in docs

#### Sub-Agent Assignments

| Agent  | Task                            | Time  |
| ------ | ------------------------------- | ----- |
| Docs-1 | TypeDoc setup and configuration | 2 hrs |
| Docs-2 | Generate docs, fix links        | 2 hrs |

#### MCP Tools Required

```bash
search_graph(name_pattern=".*typedoc.*")
get_code_snippet(qualified_name="docs/README.md")
```

#### Testing

- [ ] TypeDoc generates without errors
- [ ] docs/api/ populated
- [ ] Links working
- [ ] Navigation functional

#### Success Criteria

- ✅ TypeDoc configured
- ✅ API docs generated
- ✅ All links working
- ✅ docs/api/README.md exists

---

### Batch 4.3 - CHANGELOG Creation

#### Tasks

1. Create CHANGELOG.md with Keep a Changelog format
2. Add v1.0.1 release notes
3. Add v0.1.0 initial release notes
4. Configure changesets for auto-generation

#### Sub-Agent Assignments

| Agent  | Task                 | Time  |
| ------ | -------------------- | ----- |
| Docs-3 | Create CHANGELOG.md  | 2 hrs |
| Docs-4 | Configure changesets | 1 hr  |

#### MCP Tools Required

```bash
search_graph(name_pattern=".*changeset.*")
get_code_snippet(qualified_name=".changeset/config.json")
```

#### Testing

- [ ] CHANGELOG.md follows format
- [ ] v1.0.1 changes documented
- [ ] changesets configured
- [ ] Version workflow works

#### Success Criteria

- ✅ CHANGELOG.md created
- ✅ Keep a Changelog format
- ✅ changesets configured
- ✅ Auto-generation works

---

### Batch 4.4 - Migration Guide

#### Tasks

1. Document native-providers → provider-sdk migration
2. Add code examples
3. Add breaking changes section
4. Add deprecation timeline

#### Sub-Agent Assignments

| Agent  | Task                      | Time  |
| ------ | ------------------------- | ----- |
| Docs-1 | Write migration guide     | 2 hrs |
| Docs-2 | Add examples and timeline | 1 hr  |

#### MCP Tools Required

```bash
search_graph(name_pattern=".*native.*provider.*")
search_graph(name_pattern=".*provider.*sdk.*")
trace_path(function_name="migrate", direction="outbound")
```

#### Testing

- [ ] Migration steps clear
- [ ] Code examples work
- [ ] Breaking changes documented
- [ ] Timeline realistic

#### Success Criteria

- ✅ Migration guide complete
- ✅ Examples functional
- ✅ Breaking changes listed
- ✅ Deprecation timeline set

---

## 🗓️ PHASE 5 - DEPENDENCIES (WEEK 3-4, PARALLEL)

**Goal:** Fix 3 dependency issues  
**Sub-Agents:** 2 (Deps-1, Deps-2)  
**Success Criteria:** 0 vulnerabilities, 100% license/repo

---

### Batch 5.1 - Vulnerability Updates

#### Tasks

1. Update @opentelemetry/sdk-node → ≥0.217.0
2. Update fast-uri → ≥3.1.4
3. Update uuid → ≥11.1.1
4. Update esbuild → ≥0.24.3
5. Test all updates

#### Sub-Agent Assignments

| Agent  | Task                            | Time  |
| ------ | ------------------------------- | ----- |
| Deps-1 | Update and test vulnerabilities | 3 hrs |

#### Testing

- [ ] Run `pnpm audit` - 0 vulnerabilities
- [ ] All packages build
- [ ] All tests pass
- [ ] Integration tests pass

#### Success Criteria

- ✅ 0 HIGH vulnerabilities
- ✅ 0 MODERATE vulnerabilities
- ✅ All tests pass
- ✅ No breaking changes

---

### Batch 5.2 - License & Repository Fields

#### Tasks

1. Add license field to all 50 packages
2. Add repository field to all 50 packages
3. Standardize version references
4. Fix version inconsistencies

#### Sub-Agent Assignments

| Agent  | Task                       | Time  |
| ------ | -------------------------- | ----- |
| Deps-2 | Add license and repository | 3 hrs |

#### Testing

- [ ] All packages have license
- [ ] All packages have repository
- [ ] Versions consistent
- [ ] pnpm install works

#### Success Criteria

- ✅ 100% packages have license
- ✅ 100% packages have repository
- ✅ Version inconsistencies fixed
- ✅ Workspace builds

---

## 📋 PRE-PR TESTING CHECKLIST

**WAJIB dilakukan sebelum setiap PR** (per WORKFLOW.md Section 5)

### Environment Setup

```bash
# Install dependencies
pnpm install

# Start Redis
docker run -d -p 6379:6379 redis:7

# Start PostgreSQL
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16

# Generate Prisma
pnpm prisma generate
```

### Full CI Pipeline

```bash
# Typecheck - HARUS HIJAU
pnpm typecheck

# Lint - HARUS HIJAU (warnings OK, errors NO)
pnpm lint

# Build - HARUS HIJAU
pnpm build

# Tests - HARUS HIJAU
pnpm test

# Coverage - HARUS ≥ 80%
pnpm test:coverage
```

### Integration Tests (jika ada Redis/DB)

```bash
# Test dengan real Redis connection
# Test dengan real PostgreSQL connection
# Test dengan BullMQ queues
```

### Clean Up

```bash
# Stop containers
docker stop $(docker ps -q)

# Reset test data
```

---

## 🔄 CI/CD REQUIREMENTS

### GitHub Actions Workflow

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install
      - run: pnpm typecheck

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install
      - run: pnpm lint

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install
      - run: pnpm build

  test:
    runs-on: ubuntu-latest
    services:
      redis:
        image: redis:7
        ports:
          - 6379:6379
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install
      - run: pnpm prisma generate
      - run: pnpm test
      - run: pnpm test:coverage

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install
      - run: pnpm audit --audit-level=high
```

### PR Merge Rules (per WORKFLOW.md)

```
┌─────────────────────────────────────────────────────────┐
│  RULE: TIDAK LANJUT FASE/BATCH BARU JIKA PR BELUM HIJAU │
└─────────────────────────────────────────────────────────┘

1. PR hijau? → Lanjut ke batch berikutnya
2. PR merah? → FIX DULU, jangan lanjut
3. Docs-only changes? → Direct merge to main (no PR)
```

---

## 📊 SUCCESS METRICS

### End of Phase 1 (Week 1)

| Metric                   | Current     | Target    |
| ------------------------ | ----------- | --------- |
| Security Vulnerabilities | 9 (4 HIGH)  | 0         |
| Secret Exposure          | 🔴 Critical | ✅ None   |
| Auth Strength            | 🔴 Weak     | ✅ Strong |

### End of Phase 2 (Week 2)

| Metric               | Current | Target |
| -------------------- | ------- | ------ |
| Typecheck Compliance | 76%     | 100%   |
| JSDoc @param         | 7.5%    | 50%    |
| JSDoc @returns       | 4.9%    | 50%    |
| `any` types          | 4       | 0      |

### End of Phase 3 (Week 3)

| Metric              | Current | Target |
| ------------------- | ------- | ------ |
| Test Coverage       | 92%*    | 95%    |
| Packages with Tests | 91%     | 100%   |
| api-server coverage | 0%      | 80%    |

### End of Phase 4 (Week 4)

| Metric            | Current    | Target       |
| ----------------- | ---------- | ------------ |
| Package READMEs   | 2%         | 100%         |
| API Documentation | ❌ Empty   | ✅ Generated |
| CHANGELOG         | ❌ Missing | ✅ Created   |

### End of Phase 5 (Week 4)

| Metric                   | Current | Target |
| ------------------------ | ------- | ------ |
| Vulnerabilities          | 9       | 0      |
| Packages with License    | 0%      | 100%   |
| Packages with Repository | 0%      | 100%   |

---

## 🎯 MCP EXPLORATION STEP

**WAJIB dilakukan sebelum setiap batch** (per WORKFLOW.md Section 2)

```bash
# 1. Pahami architecture
get_architecture()

# 2. Cari relevant code
search_graph(name_pattern=".*TargetFunction.*")

# 3. Trace dependencies
trace_path(function_name="TargetFunction", direction="inbound")
trace_path(function_name="TargetFunction", direction="outbound")

# 4. Baca source code
get_code_snippet(qualified_name="pkg/file.Class")

# 5. Query untuk patterns kompleks
query_graph(query="MATCH (n:Node) WHERE n.property = 'value' RETURN n")
```

### When to Use MCP

| Use MCP ✅          | Jangan MCP ❌                           |
| ------------------- | --------------------------------------- |
| Cari function/class | Search string literals                  |
| Trace call graph    | Search error messages                   |
| Pahami architecture | Search config files                     |
| Code review         | MCP return insufficient → grep fallback |

---

## 📝 WORKFLOW COMPLIANCE

### Rules from WORKFLOW.md

1. ✅ **PR Hijau Rule:** Tidak lanjut fase/batch baru jika PR belum hijau
2. ✅ **MCP Exploration:** WAJIB 5 menit MCP exploration sebelum task
3. ✅ **Pre-PR Testing:** WAJIB local test sebelum create PR
4. ✅ **Docs-Only Fast Path:** Direct merge untuk perubahan .md saja
5. ✅ **Sub-Agent Scaling:** Dynamic scaling based on batch size

### Sub-Agent Scaling

| Scenario     | Sub-Agents | This Plan           |
| ------------ | ---------- | ------------------- |
| Small batch  | 2-3        | Batch 1.1, 1.3, 5.x |
| Medium batch | 4-6        | Batch 1.2, 1.4, 2.x |
| Large batch  | 8-10       | Batch 3.1, 4.1      |

---

## 📅 TIMELINE SUMMARY

```
Week 1: Security Critical (Phase 1)
├─ Batch 1.1: API Key Rotation      (Day 1)
├─ Batch 1.2: GitHub Webhook        (Day 1-2)
├─ Batch 1.3: CORS Fix              (Day 2)
├─ Batch 1.4: Auth Hardening        (Day 3)
├─ Batch 1.5: Security Headers      (Day 3-4)
└─ Batch 1.6: Secret Logging Fix    (Day 4)

Week 1-2: Code Quality (Phase 2)
├─ Batch 2.1: Typecheck 11 pkgs     (Day 5-7)
├─ Batch 2.2: JSDoc Coverage        (Day 7-9)
├─ Batch 2.3: Fix `any` types       (Day 9-10)
└─ Batch 2.4: Replace console.log   (Day 10-11)

Week 2-3: Test Coverage (Phase 3)
├─ Batch 3.1: api-server tests      (Day 12-15)
├─ Batch 3.2: workflow-engine       (Day 15-17)
└─ Batch 3.3: cognitive-learning    (Day 17-18)

Week 3-4: Documentation (Phase 4)
├─ Batch 4.1: Package READMEs       (Day 19-22)
├─ Batch 4.2: API Reference         (Day 22-23)
├─ Batch 4.3: CHANGELOG             (Day 23-24)
└─ Batch 4.4: Migration Guide       (Day 24-25)

Week 3-4: Dependencies (Phase 5, Parallel)
├─ Batch 5.1: Vulnerability updates (Day 19-20)
└─ Batch 5.2: License & Repository  (Day 20-21)
```

---

**Plan Approved:** July 24, 2026  
**Total Estimated Effort:** 84-108 hours  
**Timeline:** 4 Weeks  
**Sub-Agents Required:** 22 (rotating across phases)
