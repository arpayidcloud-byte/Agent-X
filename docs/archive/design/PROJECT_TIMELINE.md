# PROJECT TIMELINE — agentx Platform

**Version:** 1.0-draft  
**Date:** 2026-07-14

This timeline targets the delivery of the v0.1 CLI release (M3) followed by the v1.0 Enterprise release (M6), structured strictly according to the Engineering Execution Program.

---

## 1. MILESTONE SCHEDULE

```
               M0: Foundation
               ├─── M1: Core Runtime & SDKs
               │    ├─── M2: Workflow & Memory
               │    │    ├─── M3: v0.1 CLI Release
               │    │    │    └─── M4: Identity (v0.5)
               │    │    │         └─── M5: Enterprise & Cloud
               │    │    │              └─── M6: v1.0 Production
               ▼    ▼    ▼    ▼    ▼    ▼    ▼
Timeline:    W0───W2───W6───W8───W10──W13──W16
```

| Milestone | Target Date | Scope                 | Exit Criteria                                                                                                                                     |
| --------- | ----------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **M0**    | Week 2      | Foundation Validation | All Volume schemas complete; RFC-0021 (Threat Model) accepted; performance targets ratified; handbook lint tools operational.                     |
| **M1**    | Week 6      | Core Contracts & SDKs | Event Bus + Scheduler implemented; Anthropic + Google provider adapters pass identical tests (ADR-0003); Tool SDK sandboxing verified.            |
| **M2**    | Week 8      | Workflow & Memory     | PostgreSQL trigger append-only audit log verified; two-layer approval gates operational; Plugin SDK process-level sandboxing verified.            |
| **M3**    | Week 10     | **v0.1 CLI Release**  | `agentx submit` works end-to-end; CLI approval prompts functional; docker-compose self-hosted stack verified; 04-Schemas/ populated for Vol 2–9.  |
| **M4**    | Week 13     | Identity Foundation   | Token-based auth (JWT) implemented; CLI login/revoke commands active; account lockout operational.                                                |
| **M5**    | Week 15     | Enterprise & Cloud    | Postgres Row-Level Security isolation verified; RBAC Owner/Developer/Viewer roles active; self-hosted fallback verified for all managed services. |
| **M6**    | Week 16     | **v1.0 Production**   | All 9 Quality Gates passed; performance targets load-tested; SOC2 mapping complete; disaster recovery restore drill completed successfully.       |

---

## 2. GANTT CHART (ESTIMATED)

```
Task Name                        Duration   W1  W2  W3  W4  W5  W6  W7  W8  W9 W10 W11 W12 W13 W14 W15 W16
---------------------------------------------------------------------------------------------------------
[Phase 0: Foundation Validation]   2w       [====]
  - scaffold & tooling             1w       [==]
  - ratify performance targets     0.5w        [=]
  - schemas & templates check      1w          [==]

[Phase 1: Core Runtime]            4w            [========]
  - Vol 16 Secrets (env)           1w            [==]
  - Vol 2 Event Bus & Scheduler    1.5w            [===]
  - Vol 4 Provider adapters        2w                [====]
  - Logging & Observability        0.5w                  [=]

[Phase 2: SDK Layer]               3w                [======]
  - Vol 7 Tool SDK sandboxing      2w                [====]
  - Vol 3 Agent platform           1.5w                [===]

[Phase 3: Workflow Layer]          2w                        [====]
  - Vol 6 DB schema & trigger      1w                        [==]
  - Vol 5 Workflow graph & gates   1w                          [==]

[Phase 4: Extensibility]           1w                              [==]
  - Vol 8 Plugin SDK & sandbox     1w                              [==]

[Phase 5: CLI & v0.1 Release]      2w                                  [====]
  - Vol 9 CLI commands             1w                                  [==]
  - v0.1 Exit verification         1w                                      [==]

[Phase 6: Identity & Access]       3w                                          [======]
  - Vol 15 Local/Token auth        2w                                          [====]
  - RBAC bridge resolution         1w                                              [==]

[Phase 7: Enterprise Platform]     2w                                                      [====]
  - Vol 10 Postgres RLS            1w                                                      [==]
  - Dashboard (v0.5 features)      1w                                                          [==]

[Phase 8: Cloud & Release]         2w                                                              [====]
  - Vol 11 Deploy config & DR      1w                                                              [==]
  - Release pipeline & deprecate   1w                                                                  [==]

[Phase 10: Production Readiness]   1w                                                                  [==]
  - Perf load test & audits        1w                                                                  [==]
---------------------------------------------------------------------------------------------------------
```

---

## 3. RESOURCE ALLOCATION (PROPOSED 3-ENGINEER TEAM)

To deliver within the 16-week window, the following allocation is recommended:

- **Engineer 1 (Security & Platform)**: Owns Secrets (Vol 16), Tool SDK sandboxing (Vol 7), Database schema & append-only triggers (Vol 6), Identity & Token auth (Vol 15), and Postgres RLS (Vol 10).
- **Engineer 2 (Runtime & Workflows)**: Owns Event Bus & Scheduler (Vol 2), Provider adapters (Vol 4), Workflow graph & approval gates (Vol 5), and Plugin sandboxing (Vol 8).
- **Engineer 3 (CLI & Observability)**: Owns Lint tooling & monorepo scaffold (Phase 0), CLI commands & UX prompts (Vol 9), Logging & Metrics (Vol 13), Release pipeline (Vol 11), and Golden Set testing (Vol 14).

---

## 4. CRITICAL PATH RISKS AND MITIGATIONS

1. **Risk:** Delay in ratifying performance targets (Blocker B-01).
   - **Mitigation:** Schedule the performance targets RFC review on Day 2 of Week 1. Do not defer to Week 2.
2. **Risk:** Integration complexity between BullMQ, Redis, and Prisma transactions on the Event Bus.
   - **Mitigation:** Dedicate Week 4 entirely to Event Bus duplicate delivery and optimistic locking testing before starting Provider adapters.
3. **Risk:** Plugin Sandboxing process execution overhead and CPU limit correctness (T-0409).
   - **Mitigation:** Scaffold a prototype plugin runner in Node.js in Week 3 to verify `child_process.fork()` CPU measurement viability before final Plugin SDK work in Week 7.
