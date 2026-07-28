# AgentX Implementation Plan 2026

## Roadmap to 100% Handbook Alignment

**Document Version:** 1.0  
**Created:** July 2026  
**Target:** Production-Ready v1.0

---

## 📊 Current State Summary

| Metric                    | Status      |
| ------------------------- | ----------- |
| Handbook Alignment        | ~55-60%     |
| Production-Ready Packages | 8/42 (19%)  |
| Stub/Theater Packages     | 18/42 (43%) |
| Partial Implementation    | 16/42 (38%) |
| End-to-End Flow           | ❌ None     |
| Real Persistence          | ❌ None     |
| LLM Integration           | ❌ None     |

---

## 🎯 Phase 0: Foundation Cleanup (Week 1-2)

### Objective: Remove duplications, fix critical bugs, establish canonical components

#### 0.1 Resolve Architectural Duplications

| Task                                           | Files                                                                                        | Priority |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------- | -------- |
| **0.1.1** Choose canonical provider layer      | Keep `packages/provider/provider-sdk`, deprecate `packages/provider/native-providers`        | P0       |
| **0.1.2** Choose canonical RBAC implementation | Merge `rbac-roles.ts` enum with `RBACEngine`, create unified `packages/security/rbac`        | P0       |
| **0.1.3** Choose canonical state machine       | Keep `core-runtime` state machine, remove duplicates in `runtime-state`, `coordinator-state` | P0       |
| **0.1.4** Remove duplicate error classes       | Create `packages/shared/errors` base classes, extend in specific packages                    | P1       |

**Deliverables:**

- [ ] `packages/provider/native-providers` marked as deprecated in package.json
- [ ] `packages/security/rbac` created with unified implementation
- [ ] Documentation of canonical components in `ARCHITECTURE.md`

#### 0.2 Fix Critical Security Issues

| Task                                            | Files                                                                          | Priority |
| ----------------------------------------------- | ------------------------------------------------------------------------------ | -------- |
| **0.2.1** Remove backdoor from cognitive-kernel | `packages/cognitive/cognitive-kernel/src/kernel.ts` line with `metadata.fail`  | P0       |
| **0.2.2** Fix git executor audit categorization | `packages/shared/tool-sdk/src/git/executor.ts` - fix read/write classification | P0       |
| **0.2.3** Remove hardcoded secrets from tests   | Search for `AKIAIOSFODNN7EXAMPLE`, `ghp_` patterns                             | P1       |
| **0.2.4** Add rate limiting to tool execution   | `packages/shared/tool-sdk/src/executor.ts`                                     | P1       |

**Deliverables:**

- [ ] Security audit report with all issues resolved
- [ ] Git operations correctly categorized in audit trail
- [ ] Rate limiting middleware implemented

#### 0.3 Fix CI/CD Pipeline

| Task                                                    | Files                                        | Priority |
| ------------------------------------------------------- | -------------------------------------------- | -------- |
| **0.3.1** Remove `continue-on-error` from handbook lint | `.github/workflows/ci.yml`                   | P0       |
| **0.3.2** Add coverage threshold enforcement            | `.github/workflows/ci.yml` - fail if < 80%   | P0       |
| **0.3.3** Add integration test job                      | New job in CI that runs e2e tests            | P1       |
| **0.3.4** Add security scan job                         | Run `npm audit`, check for hardcoded secrets | P1       |

**Deliverables:**

- [ ] CI fails on handbook contract violations
- [ ] Coverage gate enforced at 80%
- [ ] Security scan in pipeline

---

## 🔌 Phase 1: Wire Components Together (Week 3-5)

### Objective: Connect orphaned packages, establish component communication

#### 1.1 Connect CLI to Runtime

**Current State:**

```typescript
// apps/cli/src/commands/submit.ts
fs.writeFileSync('.agentx/tasks.json', ...) // Direct file I/O
```

**Target State:**

```typescript
import { createScheduler, InMemoryEventBus } from '@agentx/core-runtime';
import { LocalTaskRepository } from '@agentx/runtime-adapters';

const bus = new InMemoryEventBus();
const repo = new LocalTaskRepository();
const scheduler = createScheduler(repo, bus);
await scheduler.enqueue(task);
```

| Task                                         | Files                                                           | Priority |
| -------------------------------------------- | --------------------------------------------------------------- | -------- |
| **1.1.1** Create CLI runtime bootstrap       | `apps/cli/src/lib/runtime.ts` - initialize scheduler, bus, repo | P0       |
| **1.1.2** Refactor submit command            | Use runtime instead of direct file I/O                          | P0       |
| **1.1.3** Refactor status command            | Query scheduler/repository instead of reading JSON              | P0       |
| **1.1.4** Refactor approve/reject commands   | Use approval engine from runtime                                | P0       |
| **1.1.5** Add CLI config for runtime options | `apps/cli/src/commands/config.ts` - persistence type, log level | P1       |

**Deliverables:**

- [ ] CLI creates tasks via scheduler
- [ ] CLI queries task status via repository
- [ ] Approval flow goes through approval engine

#### 1.2 Connect Runtime to Agents

**Current State:**

```typescript
// packages/runtime/core-runtime/src/scheduler/scheduler.ts
async dispatch(task: TaskModel): Promise<void> {
  // Just emits event, no actual agent invocation
  await this.bus.publish('task.dispatched', task);
}
```

**Target State:**

```typescript
async dispatch(task: TaskModel): Promise<void> {
  const agent = this.agentRegistry.get(task.agentType);
  if (!agent) throw new AgentNotFoundError(task.agentType);

  const result = await agent.execute(task.input, task.context);
  await this.completeTask(task.id, result);
}
```

| Task                                      | Files                                                          | Priority |
| ----------------------------------------- | -------------------------------------------------------------- | -------- |
| **1.2.1** Create agent registry           | `packages/runtime/core-runtime/src/registry/agent-registry.ts` | P0       |
| **1.2.2** Add agent registry to scheduler | Inject registry into scheduler constructor                     | P0       |
| **1.2.3** Implement dispatch logic        | Call agent.execute() in scheduler.dispatch()                   | P0       |
| **1.2.4** Add agent lifecycle hooks       | Before/after execute hooks for logging, metrics                | P1       |
| **1.2.5** Add agent timeout handling      | Wrap agent execution with timeout from task config             | P1       |

**Deliverables:**

- [ ] Scheduler invokes actual agents
- [ ] Agent results captured and stored
- [ ] Timeout handling for long-running agents

#### 1.3 Connect Agents to Providers

**Current State:**

```typescript
// packages/agent/agent-platform/src/agents/coder.ts
async execute(input: string): Promise<string> {
  return `Code generated for: ${input}`; // No LLM call
}
```

**Target State:**

```typescript
import { ProviderRegistry } from '@agentx/provider-sdk';

async execute(input: string): Promise<string> {
  const provider = this.registry.getDefault();
  const response = await provider.complete({
    model: 'claude-sonnet-4-20250514',
    messages: [{ role: 'user', content: input }],
    tools: this.getAvailableTools()
  });
  return response.content;
}
```

| Task                                                        | Files                                             | Priority |
| ----------------------------------------------------------- | ------------------------------------------------- | -------- |
| **1.3.1** Add provider-sdk dependency to agent-platform     | `packages/agent/agent-platform/package.json`      | P0       |
| **1.3.2** Create agent base class with provider integration | `packages/agent/agent-platform/src/base-agent.ts` | P0       |
| **1.3.3** Refactor Coder agent to use provider              | Extend base class, implement prompt template      | P0       |
| **1.3.4** Refactor Reviewer agent to use provider           | With code review prompt template                  | P0       |
| **1.3.5** Refactor Tester agent to use provider             | With test generation prompt template              | P0       |
| **1.3.6** Refactor Security agent to use provider           | With security scan prompt template                | P0       |
| **1.3.7** Create prompt templates for each agent            | `packages/agent/agent-platform/src/prompts/`      | P1       |
| **1.3.8** Add tool calling support to agents                | Pass tool specs to provider, handle tool calls    | P1       |

**Deliverables:**

- [ ] All 4 core agents call LLM via provider
- [ ] Prompt templates for each agent type
- [ ] Tool calling integration working

#### 1.4 Wire Approval Engine

**Current State:**

```typescript
// Approval exists but never called
if (task.requiresApproval) {
  // Just sets status, doesn't enforce
  task.status = TaskStatus.WAITING_APPROVAL;
}
```

**Target State:**

```typescript
import { ApprovalEngine } from '@agentx/tool-sdk';

async dispatch(task: TaskModel): Promise<void> {
  if (this.approvalEngine.requiresApproval(task)) {
    task.status = TaskStatus.WAITING_APPROVAL;
    await this.repo.save(task);
    await this.bus.publish('task.approval.required', task);
    return; // Don't dispatch until approved
  }
  // ... proceed with dispatch
}
```

| Task                                               | Files                                         | Priority |
| -------------------------------------------------- | --------------------------------------------- | -------- |
| **1.4.1** Add approval engine to scheduler         | Inject `ApprovalEngine` into scheduler        | P0       |
| **1.4.2** Implement approval check in dispatch     | Call `requiresApproval()` before dispatch     | P0       |
| **1.4.3** Create approval CLI command              | `agentx approve <task-id> --reason "..."`     | P0       |
| **1.4.4** Add approval webhook support             | POST to configured URL when approval needed   | P1       |
| **1.4.5** Add approval timeout/auto-approve policy | Configurable timeout with auto-approve/reject | P1       |

**Deliverables:**

- [ ] Approval enforced before dispatch
- [ ] CLI approve/reject commands work
- [ ] Webhook notifications for approvals

---

## 💾 Phase 2: Real Persistence Layer (Week 6-8)

### Objective: Replace in-memory stores with PostgreSQL + Prisma

#### 2.1 Setup Prisma Infrastructure

| Task                                            | Files                                                    | Priority |
| ----------------------------------------------- | -------------------------------------------------------- | -------- |
| **2.1.1** Add Prisma to workspace dependencies  | Root `package.json`, `pnpm -w add prisma @prisma/client` | P0       |
| **2.1.2** Create Prisma schema                  | `packages/shared/persistence/prisma/schema.prisma`       | P0       |
| **2.1.3** Define Task model                     | Match `TaskModel` from core-runtime                      | P0       |
| **2.1.4** Define Event model                    | For event sourcing/audit trail                           | P0       |
| **2.1.5** Define AgentState model               | For agent memory/context                                 | P0       |
| **2.1.6** Define Approval model                 | For approval tracking                                    | P0       |
| **2.1.7** Create migration script               | `pnpm prisma migrate dev`                                | P0       |
| **2.1.8** Add Docker Compose PostgreSQL service | `docker-compose.yml` - PostgreSQL 16                     | P0       |

**Schema Draft:**

```prisma
model Task {
  id          String   @id @default(cuid())
  rootId      String?
  parentId    String?
  type        String
  status      String
  input       Json
  output      Json?
  agentType   String
  priority    Int      @default(0)
  dependsOn   String[]
  metadata    Json
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  completedAt DateTime?

  children    Task[]   @relation("TaskHierarchy")
  parent      Task?    @relation("TaskHierarchy", fields: [parentId], references: [id])
  events      Event[]
  approvals   Approval[]

  @@index([rootId, status])
  @@index([agentType, status])
}

model Event {
  id        String   @id @default(cuid())
  topic     String
  payload   Json
  taskId    String?
  createdAt DateTime @default(now())

  task      Task?    @relation(fields: [taskId], references: [id])

  @@index([topic, createdAt])
  @@index([taskId])
}

model Approval {
  id        String   @id @default(cuid())
  taskId    String
  status    String   @default("PENDING")
  reason    String?
  approvedBy String?
  createdAt DateTime @default(now())
  decidedAt DateTime?

  task      Task     @relation(fields: [taskId], references: [id])

  @@unique([taskId])
}
```

**Deliverables:**

- [ ] Prisma schema matching domain models
- [ ] Docker Compose with PostgreSQL
- [ ] Migration scripts

#### 2.2 Create Prisma Repositories

| Task                                      | Files                                                           | Priority   |
| ----------------------------------------- | --------------------------------------------------------------- | ---------- |
| **2.2.1** Create PrismaTaskRepository     | `packages/shared/persistence/src/prisma-task-repository.ts`     | P0         |
| **2.2.2** Create PrismaEventRepository    | `packages/shared/persistence/src/prisma-event-repository.ts`    | P0         |
| **2.2.3** Create PrismaApprovalRepository | `packages/shared/persistence/src/prisma-approval-repository.ts` | P0         |
| **2.2.4** Add connection pooling config   | Max connections, timeout, retry logic                           | P1         |
| **2.2.5** Add transaction support         | For operations that span multiple tables                        | P1         |
| **2.2.6** Create repository factory       | `createRepository(type: 'memory'                                | 'prisma')` | P0  |

**Deliverables:**

- [ ] All repositories implemented with Prisma
- [ ] Repository factory for switching implementations
- [ ] Transaction support for complex operations

#### 2.3 Create BullMQ + Redis Integration

| Task                                       | Files                                                            | Priority   |
| ------------------------------------------ | ---------------------------------------------------------------- | ---------- |
| **2.3.1** Add BullMQ to dependencies       | `pnpm add bullmq ioredis`                                        | P0         |
| **2.3.2** Implement real BullMQAdapter     | `packages/runtime/runtime-adapters/src/bullmq/bullmq-adapter.ts` | P0         |
| **2.3.3** Implement real RedisLockProvider | `packages/runtime/runtime-adapters/src/redis/redis-lock.ts`      | P0         |
| **2.3.4** Add Redis to Docker Compose      | `docker-compose.yml` - Redis 7                                   | P0         |
| **2.3.5** Create queue factory             | `createQueue(type: 'memory'                                      | 'bullmq')` | P0  |
| **2.3.6** Add job persistence config       | RemoveOnComplete, removeOnFail settings                          | P1         |
| **2.3.7** Add rate limiter to queues       | Per-task-type rate limiting                                      | P1         |
| **2.3.8** Add dead letter queue handling   | Failed jobs after max retries                                    | P1         |

**Deliverables:**

- [ ] Real BullMQ queue adapter
- [ ] Real Redis lock provider
- [ ] Docker Compose with Redis

#### 2.4 Update Runtime to Use Persistence

| Task                                                | Files                                        | Priority |
| --------------------------------------------------- | -------------------------------------------- | -------- |
| **2.4.1** Update scheduler to use Prisma repository | Inject `PrismaTaskRepository`                | P0       |
| **2.4.2** Update event bus to persist events        | `BullMQEventBus` writes to Event table       | P0       |
| **2.4.3** Add event replay capability               | Load events from DB, replay to rebuild state | P1       |
| **2.4.4** Add task history endpoint                 | Query events by taskId                       | P1       |
| **2.4.5** Add database health check                 | `/health/db` endpoint                        | P1       |

**Deliverables:**

- [ ] Runtime uses PostgreSQL for all persistence
- [ ] Events persisted and queryable
- [ ] Event replay working

---

## 🤖 Phase 3: Full Agent Implementation (Week 9-12)

### Objective: Implement all 8 agents with real LLM integration

#### 3.1 Agent Base Infrastructure

| Task                                     | Files                                             | Priority |
| ---------------------------------------- | ------------------------------------------------- | -------- |
| **3.1.1** Create agent base class        | `packages/agent/agent-platform/src/base-agent.ts` | P0       |
| **3.1.2** Add provider injection to base | Constructor injection of ProviderRegistry         | P0       |
| **3.1.3** Add tool registry to base      | Available tools for agent type                    | P0       |
| **3.1.4** Add context management to base | Load/save context to memory store                 | P0       |
| **3.1.5** Add metrics collection to base | Track latency, tokens, cost                       | P1       |
| **3.1.6** Add retry logic to base        | Exponential backoff for provider failures         | P1       |

**Deliverables:**

- [ ] Base agent class with all common functionality
- [ ] Provider, tools, context injection working

#### 3.2 Core Agents Implementation

| Task                                     | Files                                                | Priority |
| ---------------------------------------- | ---------------------------------------------------- | -------- |
| **3.2.1** Coder agent prompt template    | `packages/agent/agent-platform/src/prompts/coder.ts` | P0       |
| **3.2.2** Coder agent implementation     | Full implementation with tool calling                | P0       |
| **3.2.3** Reviewer agent prompt template | Code review checklist, security focus                | P0       |
| **3.2.4** Reviewer agent implementation  | With inline comment generation                       | P0       |
| **3.2.5** Tester agent prompt template   | Test generation based on code analysis               | P0       |
| **3.2.6** Tester agent implementation    | Generate unit, integration tests                     | P0       |
| **3.2.7** Security agent prompt template | SAST, secret detection, vulnerability scan           | P0       |
| **3.2.8** Security agent implementation  | Integrate with tool-sdk SAST scanner                 | P0       |

**Coder Prompt Example:**

```typescript
export const CODER_PROMPT = `You are an expert software engineer.
Given a task description, generate clean, production-ready code.

Guidelines:
- Follow existing code style in the repository
- Add appropriate error handling
- Include type definitions
- Write self-documenting code with minimal comments
- Consider security implications

Task: {input}

Context:
{context}

Available Tools:
{tools}

Generate the code and explain your approach.`;
```

**Deliverables:**

- [ ] All 4 core agents fully functional
- [ ] Prompt templates for each agent
- [ ] Tool calling integrated

#### 3.3 Extended Agents Implementation

| Task                                         | Files                                     | Priority |
| -------------------------------------------- | ----------------------------------------- | -------- |
| **3.3.1** Planner agent implementation       | Task decomposition, dependency analysis   | P1       |
| **3.3.2** Architect agent implementation     | System design, pattern recommendations    | P1       |
| **3.3.3** Documentation agent implementation | Docstring generation, README updates      | P1       |
| **3.3.4** QA agent implementation            | Quality checks, best practices validation | P1       |

**Deliverables:**

- [ ] All 8 agents implemented
- [ ] Each agent has specialized prompt and tools

#### 3.4 Multi-Agent Collaboration

| Task                                                | Files                                                      | Priority |
| --------------------------------------------------- | ---------------------------------------------------------- | -------- |
| **3.4.1** Implement agent communication protocol    | `packages/agent/multi-agent-collaboration/src/protocol.ts` | P1       |
| **3.4.2** Add consensus mechanism for disagreements | Voting/weighting system                                    | P1       |
| **3.4.3** Implement handoff between agents          | Coder → Tester → Reviewer flow                             | P1       |
| **3.4.4** Add conflict resolution                   | When agents disagree on approach                           | P2       |
| **3.4.5** Create collaboration orchestrator         | Manage multi-agent workflows                               | P1       |

**Deliverables:**

- [ ] Agents can communicate and collaborate
- [ ] Consensus mechanism for decisions
- [ ] Handoff protocol working

---

## 🔧 Phase 4: Tool Integration (Week 13-14)

### Objective: Full tool execution with sandboxing and audit

#### 4.1 Tool SDK Enhancements

| Task                                    | Files                                     | Priority |
| --------------------------------------- | ----------------------------------------- | -------- |
| **4.1.1** Add tool result caching       | Cache read operations (fs.read, git.read) | P1       |
| **4.1.2** Add tool execution sandboxing | Restrict file paths, commands             | P0       |
| **4.1.3** Add tool timeout enforcement  | Per-tool configurable timeouts            | P0       |
| **4.1.4** Add tool execution metrics    | Track latency, success rate per tool      | P1       |
| **4.1.5** Fix git audit categorization  | Properly categorize read vs write         | P0       |

**Deliverables:**

- [ ] Tool execution properly sandboxed
- [ ] Timeouts enforced
- [ ] Git operations correctly categorized

#### 4.2 Tool-Provider Integration

| Task                                           | Files                                      | Priority |
| ---------------------------------------------- | ------------------------------------------ | -------- |
| **4.2.1** Add tool specs to provider requests  | Pass tool definitions for function calling | P0       |
| **4.2.2** Handle provider tool call responses  | Parse tool_call from provider response     | P0       |
| **4.2.3** Execute tools and return results     | Run tool, format result for provider       | P0       |
| **4.2.4** Handle multi-turn tool conversations | Continue until no more tool calls          | P0       |
| **4.2.5** Add tool call audit logging          | Log every tool invocation                  | P0       |

**Deliverables:**

- [ ] Provider function calling working
- [ ] Tool execution results returned to LLM
- [ ] Full audit trail for tool calls

---

## 🧠 Phase 5: Cognitive Layer (Week 15-18)

### Objective: Implement cognitive capabilities for learning and adaptation

#### 5.1 Cognitive Kernel

| Task                                            | Files                             | Priority |
| ----------------------------------------------- | --------------------------------- | -------- |
| **5.1.1** Remove backdoor from kernel           | Remove `metadata.fail` hook       | P0       |
| **5.1.2** Implement thinking session management | Track reasoning state             | P1       |
| **5.1.3** Add reflection capability             | Agent can reflect on past actions | P1       |
| **5.1.4** Add goal tracking                     | Track progress toward objectives  | P1       |
| **5.1.5** Implement decision logging            | Record why decisions were made    | P1       |

**Deliverables:**

- [ ] Cognitive kernel functional
- [ ] Thinking sessions tracked
- [ ] Reflection working

#### 5.2 Learning Engine

| Task                                   | Files                                  | Priority |
| -------------------------------------- | -------------------------------------- | -------- |
| **5.2.1** Implement experience storage | Store successful patterns              | P1       |
| **5.2.2** Implement pattern extraction | Extract patterns from successful tasks | P2       |
| **5.2.3** Add feedback collection      | User feedback on agent output          | P1       |
| **5.2.4** Implement outcome evaluation | Measure task success/failure           | P1       |
| **5.2.5** Add strategy adaptation      | Adjust approach based on outcomes      | P2       |

**Deliverables:**

- [ ] Experience store working
- [ ] Pattern extraction functional
- [ ] Feedback loop implemented

#### 5.3 Memory Engine

| Task                                            | Files                         | Priority |
| ----------------------------------------------- | ----------------------------- | -------- |
| **5.3.1** Implement PrismaMemoryStore           | Replace Map with Prisma       | P0       |
| **5.3.2** Add short-term memory (LRU cache)     | Recent context caching        | P1       |
| **5.3.3** Add long-term memory (PostgreSQL)     | Persistent storage            | P0       |
| **5.3.4** Implement memory retrieval strategies | Recency, frequency, relevance | P1       |
| **5.3.5** Add memory compression                | Summarize old memories        | P2       |

**Deliverables:**

- [ ] Memory engine with real persistence
- [ ] Retrieval strategies working
- [ ] Memory compression implemented

---

## 📡 Phase 6: API & Integration (Week 19-20)

### Objective: REST API server and external integrations

#### 6.1 REST API Server

| Task                                   | Files                                      | Priority |
| -------------------------------------- | ------------------------------------------ | -------- |
| **6.1.1** Create API server package    | `packages/api-server` with Fastify/Express | P0       |
| **6.1.2** Implement task endpoints     | POST /tasks, GET /tasks/:id, etc.          | P0       |
| **6.1.3** Implement approval endpoints | POST /approvals/:id/decide                 | P0       |
| **6.1.4** Implement event streaming    | GET /events/stream (SSE)                   | P1       |
| **6.1.5** Add API authentication       | JWT or API key based auth                  | P0       |
| **6.1.6** Add rate limiting            | Per-client rate limits                     | P1       |
| **6.1.7** Add OpenAPI spec generation  | Auto-generated from routes                 | P1       |
| **6.1.8** Add health check endpoints   | /health, /health/ready, /health/live       | P0       |

**API Endpoints:**

```
POST   /api/v1/tasks           - Create task
GET    /api/v1/tasks           - List tasks
GET    /api/v1/tasks/:id       - Get task
POST   /api/v1/tasks/:id/cancel - Cancel task
POST   /api/v1/approvals/:id/decide - Approve/reject
GET    /api/v1/events          - Stream events
GET    /api/v1/health          - Health check
```

**Deliverables:**

- [ ] REST API server running
- [ ] All CRUD endpoints working
- [ ] Authentication implemented
- [ ] OpenAPI documentation

#### 6.2 External Integrations

| Task                                     | Files                     | Priority |
| ---------------------------------------- | ------------------------- | -------- |
| **6.2.1** GitHub webhook integration     | Receive push/PR events    | P1       |
| **6.2.2** Slack notification integration | Task status notifications | P1       |
| **6.2.3** VS Code extension scaffolding  | Basic extension structure | P2       |
| **6.2.4** CLI plugin system              | Allow custom CLI commands | P2       |

**Deliverables:**

- [ ] GitHub webhook working
- [ ] Slack notifications working

---

## 🚀 Phase 7: Production Hardening (Week 21-24)

### Objective: Production readiness, monitoring, scaling

#### 7.1 Observability Enhancement

| Task                                | Files                                | Priority |
| ----------------------------------- | ------------------------------------ | -------- |
| **7.1.1** Add distributed tracing   | OpenTelemetry traces across services | P0       |
| **7.1.2** Add metrics collection    | Prometheus metrics                   | P0       |
| **7.1.3** Create Grafana dashboards | Pre-built dashboards for monitoring  | P1       |
| **7.1.4** Add structured logging    | JSON logs with correlation IDs       | P0       |
| **7.1.5** Add log aggregation       | Ship logs to Loki/ELK                | P1       |

**Deliverables:**

- [ ] Full distributed tracing
- [ ] Metrics dashboards
- [ ] Structured logging

#### 7.2 Scaling & Performance

| Task                                      | Files                            | Priority |
| ----------------------------------------- | -------------------------------- | -------- |
| **7.2.1** Add horizontal scaling support  | Multiple runtime instances       | P0       |
| **7.2.2** Add worker pool for agents      | Concurrent agent execution       | P0       |
| **7.2.3** Add database connection pooling | Optimize Prisma connection pool  | P0       |
| **7.2.4** Add Redis cluster support       | For high-availability locking    | P1       |
| **7.2.5** Add load balancing              | Round-robin or least-connections | P1       |
| **7.2.6** Performance benchmarking        | Establish baseline metrics       | P1       |
| **7.2.7** Add caching layer               | Redis cache for frequent queries | P1       |

**Deliverables:**

- [ ] Horizontal scaling working
- [ ] Performance benchmarks established
- [ ] Caching implemented

#### 7.3 Disaster Recovery

| Task                                            | Files                            | Priority |
| ----------------------------------------------- | -------------------------------- | -------- |
| **7.3.1** Add database backup scripts           | Automated daily backups          | P0       |
| **7.3.2** Add disaster recovery runbook         | Step-by-step recovery procedures | P0       |
| **7.3.3** Implement circuit breakers            | For external dependencies        | P0       |
| **7.3.4** Add graceful shutdown handling        | Drain queues before shutdown     | P0       |
| **7.3.5** Add health check for all dependencies | DB, Redis, providers             | P0       |

**Deliverables:**

- [ ] Backup/recovery procedures
- [ ] Circuit breakers implemented
- [ ] Graceful shutdown

---

## 📝 Phase 8: Documentation & Handbook Alignment (Week 25-26)

### Objective: Complete documentation, 100% handbook alignment

#### 8.1 Handbook Updates

| Task                                    | Files                                  | Priority |
| --------------------------------------- | -------------------------------------- | -------- |
| **8.1.1** Update handbook to match code | Fix provider path, ToolCategory claims | P0       |
| **8.1.2** Add implementation examples   | Real code examples in handbook         | P1       |
| **8.1.3** Add architecture diagrams     | Mermaid diagrams for each volume       | P1       |
| **8.1.4** Add API reference             | Auto-generated from OpenAPI            | P1       |

**Deliverables:**

- [x] Handbook 100% aligned with code
- [x] Architecture diagrams complete
- [x] API reference generated

#### 8.2 Developer Documentation

| Task                                   | Files                              | Priority |
| -------------------------------------- | ---------------------------------- | -------- |
| **8.2.1** Add JSDoc to all public APIs | Complete API documentation         | P0       |
| **8.2.2** Create contributing guide    | How to contribute to project       | P0       |
| **8.2.3** Create deployment guide      | Production deployment instructions | P0       |
| **8.2.4** Create troubleshooting guide | Common issues and solutions        | P1       |
| **8.2.5** Add code examples            | Example integrations               | P1       |

**Deliverables:**

- [x] JSDoc complete
- [x] Contributing guide
- [x] Deployment guide

---

## 🔍 Phase 9: Validation Sprint (Week 27)

### Objective: Validate production readiness before v1.0 release

#### 9.1 Manual E2E Testing (Day 1)

| Task                                   | Files                                                 | Priority |
| -------------------------------------- | ----------------------------------------------------- | -------- |
| **9.1.1** Basic task submission        | CLI → Runtime → Agents → LLM                          | P0       |
| **9.1.2** Agent selection verification | All 4 agent types (coder, reviewer, tester, security) | P0       |
| **9.1.3** Tool execution verification  | fs, git, shell tools                                  | P0       |
| **9.1.4** Persistence verification     | PostgreSQL, Redis                                     | P0       |
| **9.1.5** Observability verification   | Health checks, Prometheus, Grafana                    | P0       |

**Deliverables:**

- [ ] All 5 E2E scenarios pass
- [ ] No stub/theater responses
- [ ] Real LLM integration verified

#### 9.2 Performance & Security (Day 2)

| Task                                 | Files                              | Priority |
| ------------------------------------ | ---------------------------------- | -------- |
| **9.2.1** Concurrent tasks benchmark | 10 tasks/second, p95 < 2s          | P0       |
| **9.2.2** Memory stress test         | No memory leaks, stable heap       | P0       |
| **9.2.3** Database load test         | 1000 tasks, query < 100ms          | P0       |
| **9.2.4** Dependency scan            | No HIGH/CRITICAL vulnerabilities   | P0       |
| **9.2.5** Secrets scan               | No hardcoded secrets               | P0       |
| **9.2.6** Input validation           | SQL injection, XSS, path traversal | P0       |
| **9.2.7** Rate limiting              | DoS protection                     | P0       |

**Deliverables:**

- [ ] Performance metrics meet targets
- [ ] Security audit clean
- [ ] No critical issues found

#### 9.3 Analysis & Decision (Day 3)

| Task                            | Files                            | Priority |
| ------------------------------- | -------------------------------- | -------- |
| **9.3.1** Compile test results  | Score calculation (0-12 points)  | P0       |
| **9.3.2** Decision matrix       | v1.0, v1.0 with notes, or v1.1   | P0       |
| **9.3.3** Known issues document | docs/KNOWN_ISSUES.md (if needed) | P1       |
| **9.3.4** Release notes         | CHANGELOG.md                     | P0       |

**Deliverables:**

- [ ] Final score: __/12
- [ ] Release decision made
- [ ] Known issues documented (if any)
- [ ] Release notes prepared

---

## 📊 Success Metrics

| Metric                    | Current    | Target     | Phase   |
| ------------------------- | ---------- | ---------- | ------- |
| Handbook Alignment        | 55%        | 100%       | Phase 8 |
| End-to-End Flow           | 0          | 1 complete | Phase 1 |
| Real Persistence          | 0%         | 100%       | Phase 2 |
| LLM Integration           | 0%         | 100%       | Phase 3 |
| Test Coverage             | ~70%       | 85%+       | Ongoing |
| Production-Ready Packages | 8/42       | 35/42      | Phase 7 |
| Security Issues           | 4 critical | 0          | Phase 0 |
| Validation Score          | 0/12       | 11-12/12   | Phase 9 |

---

## 🗓️ Timeline Summary

| Phase   | Duration | Weeks | Focus                |
| ------- | -------- | ----- | -------------------- |
| Phase 0 | 2 weeks  | 1-2   | Foundation cleanup   |
| Phase 1 | 3 weeks  | 3-5   | Wire components      |
| Phase 2 | 3 weeks  | 6-8   | Persistence layer    |
| Phase 3 | 4 weeks  | 9-12  | Agent implementation |
| Phase 4 | 2 weeks  | 13-14 | Tool integration     |
| Phase 5 | 4 weeks  | 15-18 | Cognitive layer      |
| Phase 6 | 2 weeks  | 19-20 | API & integrations   |
| Phase 7 | 4 weeks  | 21-24 | Production hardening |
| Phase 8 | 2 weeks  | 25-26 | Documentation        |
| Phase 9 | 1 week   | 27    | Validation sprint    |

**Total: 27 weeks (~6.5 months)**

---

## 🎯 Immediate Next Steps (Week 1)

1. **Day 1-2:** Remove security backdoor, fix git audit bug
2. **Day 3-4:** Decide canonical components (provider, RBAC, state machine)
3. **Day 5-7:** Fix CI pipeline, add coverage enforcement

**First Milestone (End of Week 2):**

- [ ] All critical security issues resolved
- [ ] Canonical components documented
- [ ] CI failing on contract violations
- [ ] Deprecation notices for duplicate packages

---

## ⚠️ Risk Mitigation

| Risk                                  | Impact | Mitigation                                                                    |
| ------------------------------------- | ------ | ----------------------------------------------------------------------------- |
| Provider API costs during development | High   | Use mock providers for development, real providers only for integration tests |
| Database migration complexity         | Medium | Start with simple schema, iterate. Keep memory implementation as fallback     |
| Agent prompt tuning takes too long    | Medium | Start with basic prompts, optimize based on real usage                        |
| Multi-agent collaboration too complex | High   | Implement basic handoff first, advanced consensus later                       |
| Scope creep                           | High   | Stick to phases, defer nice-to-have features to v1.1                          |

---

## 📌 Notes

- This plan assumes a team of 3-5 developers
- Each phase should have a demo at the end
- Weekly sync to review progress and adjust priorities
- All phases must maintain backward compatibility with existing tests
- Handbook contract tests must pass before moving to next phase
