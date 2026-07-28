# AgentX Development Workflow

**Version:** 4.0 (Agent DevOps)  
**Created:** July 24, 2026  
**Last Updated:** July 26, 2026  
**Status:** Active

---

## 🎯 Quick Start (For Next AI Agent)

**Ketika kamu接手 project ini:**

1. **Baca "📍 Current Status"** → Tahu apa yang harus dikerjakan
2. **Ikuti "🚀 Development Workflow"** → Step-by-step lengkap
3. **Pakai MCP tools** → WAJIB sebelum coding
4. **Run CI lokal** → `./scripts/pre-pr-check.sh`
5. **Auto-merge jika CI green** → Agent DevOps decision

---

## 📍 Current Status

**Phase 3: Core Functionality** (Week 5-6)

| Batch                            | Task                 | Status          | PR      | Notes           |
| -------------------------------- | -------------------- | --------------- | ------- | --------------- |
| **Phase 2 - Security Hardening** |                      |                 |         |                 |
| 2.1                              | JWT Authentication   | ✅ Complete     | #54     | Merged          |
| 2.2                              | RBAC Authorization   | ✅ Complete     | #57     | Merged          |
| 2.3                              | Rate Limiting        | ✅ Complete     | #57     | Merged          |
| 2.4                              | Security Audit       | ✅ Complete     | #58     | Merged          |
| **Phase 3 - Core Functionality** |                      |                 |         |                 |
| 3.1                              | LLM Integration      | ✅ Complete     | #59     | Merged          |
| 3.2                              | Agent Implementation | ✅ Complete     | #60     | Merged (docs)   |
| 3.3                              | E2E Flow             | ✅ Complete     | #61     | Merged          |
| **Phase 4 - Reliability**        |                      |                 |         |                 |
| 4.1                              | Error Handling & DLQ | ✅ Complete     | #62     | Merged          |
| 4.2                              | Circuit Breakers     | ✅ Complete     | -       | Pre-implemented |
| 4.3                              | Retry Logic          | ✅ Complete     | -       | Pre-implemented |
| 4.4                              | Graceful Shutdown    | ✅ Complete     | #63     | Merged          |
| **Phase 5 - Testing**            |                      |                 |         |                 |
| **5.1**                          | **E2E Tests**        | **✅ Complete** | **#64** | **Merged**      |
| **5.2**                          | **Load Tests**       | **✅ Complete** | **#65** | **Merged**      |
| **5.3**                          | **Security Tests**   | **✅ Complete** | **#66** | **Merged**      |
| **Phase 6 - Monitoring**         |                      |                 |         |                 |
| **6.1**                          | **Logging**          | **✅ Complete** | **#68** | **Merged**      |
| **6.2**                          | **Metrics**          | **✅ Complete** | **#69** | **Merged**      |
| **6.3**                          | **Alerting**         | **✅ Complete** | **#70** | **Merged**      |
| **Phase 7-8 - Docs & Release**   |                      |                 |         |                 |
| **7-8**                          | **Docs & v1.0.0**    | **✅ Complete** | **#71** | **Merged**      |
|                                  | **v1.0.0 Release**   | **✅ Complete** | **#73** | **Merged**      |

### 🎉 ALL PHASES COMPLETE! AGENTX v1.0.0 RELEASED!

**Merged:** PR #70 (2026-07-26), PR #71 (2026-07-26), PR #73 (2026-07-27)

**Phase 6 Summary:**

**What was implemented:**

1. ✅ Structured logging documentation (JSON format)
2. ✅ Correlation ID propagation guide
3. ✅ Log levels specification (TRACE/DEBUG/INFO/WARN/ERROR/FATAL)
4. ✅ Secret redaction documentation
5. ✅ Log aggregation configs (ELK, Datadog, Splunk)
6. ✅ Log retention policy (90d/30d/14d/24h)
7. ✅ Best practices and troubleshooting guide
8. ✅ Monitoring & alerting examples

**Phase 6.2 - Metrics (PR #69):**

1. ✅ Metrics collection documentation
2. ✅ Prometheus/Grafana integration guide
3. ✅ Dashboard templates
4. ✅ Key metrics definition (RED/USE methods)

**Phase 6.3 - Alerting (PR #70):**

1. ✅ Alert rules specification
2. ✅ On-call rotation guide
3. ✅ Escalation policies
4. ✅ Incident response runbooks

**Phase 7-8 - Documentation & Release (PR #71):**

1. ✅ User guide & API reference
2. ✅ Operations runbooks
3. ✅ CHANGELOG
4. ✅ v1.0.0 release preparation

**Phase 8 - Production Release (PR #73):**

1. ✅ Production readiness review passed
2. ✅ All 45 packages updated to v1.0.0
3. ✅ Release branch created & merged
4. ✅ GitHub Release v1.0.0 published
5. ✅ npm packages ready for publish
6. ✅ Release announcement created

**Status: ALL PHASES 0-8 COMPLETE! 🎉🚀**

**AgentX v1.0.0 is now PRODUCTION READY!**

**Release Links:**

- GitHub Release: https://github.com/arpayidcloud-byte/Agentx/releases/tag/v1.0.0
- npm packages: @agentx/* @ v1.0.0
- Docker: arpayidcloud/agentx:v1.0.0

---

## 🤖 Agent DevOps Model

### Overview

```
┌─────────────────────────────────────────────────────────┐
│                    AI AGENT                              │
│  - Orchestrator: Planning, MCP exploration               │
│  - Developer: Implementation, testing                    │
│  - DevOps: CI/CD, quality gates, merge decisions         │
└─────────────────────────────────────────────────────────┘
```

### Agent Responsibilities

| Role             | Responsibility                                  | Decision Rules                                                                              |
| ---------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Orchestrator** | Plan tasks, MCP exploration, coordinate batches | - MCP before every task<br>- Break into small batches<br>- Track progress                   |
| **Developer**    | Implement features, write tests, fix bugs       | - Follow coding standards<br>- No console.log<br>- No hardcoded secrets<br>- Tests required |
| **DevOps**       | CI/CD, quality gates, merge decisions           | - **BLOCK if CI red**<br>- Auto-merge if CI green<br>- Run pre-PR checks                    |

### Agent DevOps Golden Rules

```
┌─────────────────────────────────────────────────────────┐
│  RULE 1: NO MERGE IF CI RED                             │
│  RULE 2: AUTO-MERGE IF CI GREEN                         │
│  RULE 3: DOCS-ONLY CHANGES → SKIP CI, AUTO-MERGE        │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Development Workflow (Step-by-Step)

### Step 1: Check Master Plan

Buka [MASTER_PLAN_PRODUCTION.md](./MASTER_PLAN_PRODUCTION.md), cari batch yang mau dikerjakan.

```bash
# Contoh: Phase 2.4 - Security Audit
# Read batch details, success criteria, files to modify
```

### Step 2: Create Branch

```bash
git checkout -b phase2-batch2.4-security-audit
```

**Naming convention:** `<phase>-<batch>-<description>`

### Step 3: MCP Exploration (REQUIRED)

**Sebelum coding, WAJIB pakai MCP tools:**

```bash
# 1. Understand architecture
get_architecture()

# 2. Find relevant code
search_graph(query="security audit SAST")

# 3. Trace dependencies
trace_path(function_name="SASTScanner", direction="both")

# 4. Read source code
get_code_snippet(qualified_name="root-Agentx.packages.shared.security.src.scanner.SASTScanner")

# 5. Complex queries (if needed)
query_graph(query="MATCH (n:Function) WHERE n.name CONTAINS 'security' RETURN n")
```

**Kapan pakai MCP:**

- ✅ Find function/class → `search_graph`
- ✅ Trace call graph → `trace_path`
- ✅ Read source → `get_code_snippet`
- ❌ Search string literal → Pakai `grep` (lebih cepat)
- ❌ Search config files → Pakai `grep` atau `glob`

### Step 4: Implement Changes

**Coding standards:**

```typescript
// ✅ DO: Use logger
import { logger } from '@agentx/shared';
logger.info('User authenticated', { userId });

// ❌ DON'T: console.log in production
console.log('User:', userId);

// ✅ DO: Environment variables
const API_URL = process.env.API_URL || 'http://localhost:3000';

// ❌ DON'T: Hardcoded values
const API_URL = 'http://localhost:3000';

// ✅ DO: Proper types
function processUser(user: User): Promise<Result> {}

// ❌ DON'T: any type
function processUser(user: any): any {}
```

### Step 5: Local Testing (MANDATORY)

**Sebelum commit/push, WAJIB run:**

```bash
./scripts/pre-pr-check.sh
```

Script ini akan run:

1. ✅ `pnpm typecheck` → Must pass
2. ✅ `pnpm lint` → Must pass (warnings OK)
3. ✅ `pnpm lint:deps` → No violations
4. ✅ `pnpm build` → Must pass
5. ✅ `pnpm test` → Must pass
6. ✅ `pnpm test:coverage` → Thresholds met
7. ✅ Check no console.log in production
8. ✅ Check no hardcoded secrets

**Jika ada yang fail → FIX DULU, jangan commit!**

### Step 6: Commit

```bash
git add .
git commit -m "feat(phase2-batch2.4): implement SAST scanner integration

- Add security scan step to CI workflow
- Use existing SASTScanner from @agentx/shared
- Run on every PR automatically

CI: ✅ All gates passed"
```

**Commit message format:** `<type>(<scope>): <description>`

### Step 7: Push

```bash
git push -u origin phase2-batch2.4-security-audit
```

### Step 8: Create PR

```bash
gh pr create --title "feat(phase2-batch2.4): Security Audit implementation" --body "
## Summary

Implement Phase 2.4 - Security Audit per MASTER_PLAN_PRODUCTION.md

## Changes

- SAST scanner integration to CI
- Secret detection pre-commit hook
- Security audit API endpoints
- Vulnerability scan & fix

## CI Status

- [ ] Typecheck ✅
- [ ] Lint ✅
- [ ] Build ✅
- [ ] Tests ✅
- [ ] Coverage ✅

## Checklist

- [ ] MCP exploration done
- [ ] Pre-PR check passed
- [ ] Documentation updated
"
```

### Step 9: Wait for CI

```bash
# Monitor CI status
gh pr checks <PR_NUMBER>

# Wait until all green:
# ✅ quality-gates PASS
```

**CI Jobs:**

1. typecheck
2. lint
3. lint:deps
4. build
5. test
6. coverage
7. security scan
8. handbook lint
9. contract tests

**Jika CI fail → FIX, push lagi, wait CI again**

### Step 10: Auto-Merge Decision (Agent DevOps)

**DevOps Logic:**

```
IF CI status == "GREEN" (all jobs pass):
  → MERGE immediately (auto-merge)

ELSE IF CI status == "RED" (any job fails):
  → BLOCK merge, fix failures first

ELSE IF CI status == "WARNINGS ONLY":
  → Can merge, create follow-up task to fix warnings

ELSE IF docs-only changes:
  → SKIP CI check, auto-merge
```

**Execute merge:**

```bash
gh pr merge <PR_NUMBER> --merge --auto
```

### Step 11: Update Documentation

Setelah merge, update progress:

```bash
# Edit WORKFLOW.md - mark batch complete
# Edit MASTER_PLAN_PRODUCTION.md - add PR link
git add WORKFLOW.md MASTER_PLAN_PRODUCTION.md
git commit -m "docs: mark Phase 2.4 complete (PR #XX)"
git push
```

### Step 12: Cleanup

```bash
# Delete branch
git branch -d phase2-batch2.4-security-audit
git push origin --delete phase2-batch2.4-security-audit

# Sync main
git checkout main
git pull origin main
```

---

## 📋 Core Principles

1. **Master Plan First** → Semua kerjaan refer ke MASTER_PLAN_PRODUCTION.md
2. **CI Gates** → No merge without green CI (auto-enforced by DevOps)
3. **Small Batches** → PR <400 lines, frequent merges
4. **Documentation** → Code changes = doc updates
5. **Testing** → No feature without tests
6. **MCP-First** → MCP tools sebelum implementation
7. **Agent DevOps** → CI green = auto-merge, CI red = block

---

## 🛠️ MCP Tools Reference

### Available Tools

| Tool                         | Purpose             | When to Use            |
| ---------------------------- | ------------------- | ---------------------- |
| `get_architecture()`         | High-level overview | Start of new task      |
| `search_graph(query)`        | Find by pattern     | Find functions/classes |
| `search_graph(name_pattern)` | Find by name        | Exact name match       |
| `trace_path(function)`       | Trace dependencies  | Understand call graph  |
| `get_code_snippet(qn)`       | Read source         | Read specific function |
| `query_graph(cypher)`        | Complex queries     | Multi-hop patterns     |

### MCP vs Shell Tools

**Pakai MCP:**

- Find function/class definition
- Trace who calls what
- Understand architecture
- Code review

**Pakai Shell (grep/glob):**

- Search string literals
- Search error messages
- Count files
- Check git status

**Hybrid approach saves 80-90% tokens!**

---

## 🚨 CI Gates Rules

### Pre-PR Checklist (local)

Run `./scripts/pre-pr-check.sh`:

```
✅ pnpm typecheck    → 0 errors
✅ pnpm lint         → 0 errors (warnings OK)
✅ pnpm lint:deps    → No violations
✅ pnpm build        → 0 failures
✅ pnpm test         → 0 failures
✅ pnpm test:coverage → Thresholds met
✅ No console.log    → 0 in production code
✅ No hardcoded secrets → 0 found
```

### CI Pipeline (GitHub Actions)

Jobs (must all pass):

1. ✅ typecheck
2. ✅ lint
3. ✅ lint:deps
4. ✅ build
5. ✅ test
6. ✅ coverage (continue-on-error for pre-existing)
7. ✅ security scan
8. ✅ handbook lint (continue-on-error)
9. ✅ contract tests (continue-on-error)

**Auto-Merge Decision Matrix:**

| CI Status        | DevOps Action                |
| ---------------- | ---------------------------- |
| ✅ All green     | **AUTO-MERGE** immediately   |
| ⚠️ Warnings only | Merge, create follow-up task |
| ❌ Any failure   | **BLOCK**, fix first         |
| 📄 Docs-only     | **SKIP CI**, auto-merge      |

---

## 📊 Progress Tracking

### Update After Merge

**In WORKFLOW.md:**

```markdown
| 2.4 - Security Audit | ✅ Complete | #XX | Merged date |
```

**In MASTER_PLAN_PRODUCTION.md:**

```markdown
### Status

**COMPLETE** - PR #XX merged to main (YYYY-MM-DD)
```

**Commit:**

```bash
git commit -m "docs: mark Phase 2.4 complete (PR #XX)"
```

### Auto-Continue to Next Batch

**After progress update:**

```
IF batch complete AND CI green AND docs updated:
  → READ next batch in MASTER_PLAN_PRODUCTION.md
  → CREATE feature branch for next batch
  → START MCP exploration
  → BEGIN implementation
```

**Example:**

```bash
# Batch 2.4 complete
→ Update docs
→ Push progress
→ Auto-continue to Phase 3 (Core Functionality)

git checkout -b phase3-batch3.1-llm-integration
# MCP exploration
# Implementation
```

---

## 📝 Agent DevOps Auto-Decisions

### When to Auto-Merge

```
✅ CI all green → Auto-merge
✅ Docs-only changes → Auto-merge (skip CI)
⚠️ Warnings only → Auto-merge + follow-up task
```

### When to Block

```
❌ CI red → Block, fix first
❌ Pre-PR check failed → Block, fix first
❌ Coverage threshold not met → Block, add tests
```

### When to Split PR

```
IF PR size > 400 lines:
  → SPLIT into smaller PRs by feature
  → Merge each separately
```

### Security-Critical Code

Untuk auth/RBAC/secrets:

- Extra careful dengan implementation
- Double-check CI green
- Test thoroughly locally
- Add security scan step
- Document security decisions

---

## 📎 Quick Reference

### Common Commands

```bash
# Start new task
git checkout main
git pull
git checkout -b phase2-batch2.4-description

# Before commit
./scripts/pre-pr-check.sh

# Commit & push
git add .
git commit -m "feat(scope): description"
git push -u origin <branch>

# Create PR
gh pr create --title "..." --body "..."

# Check CI
gh pr checks <PR_NUMBER>

# Auto-merge (if CI green)
gh pr merge <PR_NUMBER> --merge --auto

# Cleanup
git branch -d <branch>
git push origin --delete <branch>
```

### MCP Commands (REQUIRED before EVERY task)

```bash
# 1. Architecture
get_architecture()

# 2. Find code
search_graph(query="relevant pattern")

# 3. Trace dependencies
trace_path(function_name="TargetFunction", direction="both")

# 4. Read source
get_code_snippet(qualified_name="full.path.Function")

# 5. Complex queries
query_graph(query="MATCH (n:Function) RETURN n LIMIT 10")
```

### Branch Naming

```bash
phase0-batch0.1-remove-secrets
phase2-batch2.4-security-audit
phase3-batch3.1-llm-integration
```

### Commit Message Format

```bash
<type>(<scope>): <description>

# Types: feat, fix, docs, chore, refactor, test
# Scope: phase2-batch2.4, ci, docs, etc.

# Example:
feat(phase2-batch2.4): implement SAST scanner integration

- Add security scan step to CI
- Use existing SASTScanner class

CI: ✅ All gates passed
```

---

## 📚 References

- [Master Production Plan](./MASTER_PLAN_PRODUCTION.md) - Main reference
- [Architecture](./ARCHITECTURE.md) - System design
- [Pre-PR Script](./scripts/pre-pr-check.sh) - Local CI
- [CI Workflow](./.github/workflows/ci.yml) - GitHub Actions

---

**Last Updated:** July 26, 2026  
**Next Review:** After Phase 4 complete  
**DevOps Model:** Agent DevOps (Auto-merge on CI green)  
**Status:** Active

---

## Appendix: Phase Timeline

```
Week 0:   Phase 0 - Cleanup & Security ✅ COMPLETE
Week 1-2: Phase 1 - Code Quality ✅ COMPLETE
Week 3-4: Phase 2 - Security Hardening ✅ COMPLETE
Week 5-6: Phase 3 - Core Functionality ✅ COMPLETE
Week 7-8: Phase 4 - Reliability ✅ COMPLETE
Week 9-10: Phase 5 - Testing ✅ COMPLETE
Week 11-12: Phase 6 - Monitoring ⬅️ CURRENT (6.1 ✅, 6.2 NEXT)
Week 13-14: Phase 7 - Documentation ⬜ PENDING
Week 15-16: Phase 8 - Release ⬜ PENDING
```

See [MASTER_PLAN_PRODUCTION.md](./MASTER_PLAN_PRODUCTION.md) for detailed phase plans.
