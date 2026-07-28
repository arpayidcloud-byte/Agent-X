# AgentX E2E Demo Guide

**Version:** 1.0  
**Created:** July 26, 2026  
**Status:** Active

---

## Overview

This guide demonstrates the complete AgentX end-to-end flow:

```
CLI → Runtime → Agent → LLM → Response
```

## Prerequisites

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Create `.env` file from example:

```bash
cp .env.example .env
```

Add your LLM API keys:

```bash
# Anthropic (recommended)
ANTHROPIC_API_KEY=sk-ant-...

# OR OpenAI
OPENAI_API_KEY=sk-...
```

### 3. Build Project

```bash
pnpm build
```

### 4. Start Infrastructure (if using Docker)

```bash
docker compose up -d
```

---

## Running the E2E Demo

### Basic Demo

```bash
pnpm demo "Explain what is AgentX"
```

**Expected Output:**

```
🚀 AgentX E2E Demo

Goal: Explain what is AgentX

📦 Step 1: Initializing Runtime...
✅ Runtime initialized

📝 Step 2: Creating Task...
   Task ID: 550e8400-e29b-41d4-a716-446655440000
   Graph ID: graph-abc12345
   Status: created

⏳ Step 3: Enqueueing Task...
✅ Task enqueued

🤖 Step 4: Calling LLM Provider...
✅ LLM Response received

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AgentX is a provider-agnostic, multi-agent AI software-engineering
platform. It enables developers to build, deploy, and manage
AI-powered agents that can collaborate on complex tasks...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Step 5: Checking Task Status...
   Task ID: 550e8400-e29b-41d4-a716-446655440000
   Status: created
   Goal: Explain what is AgentX

✅ E2E Demo Complete!

Next steps:
  - Run `agentx submit "<goal>"` to submit a real task
  - Run `agentx status` to check task status
  - Run `agentx approve <task-id>` to approve pending tasks
```

### Custom Goal Demo

```bash
pnpm demo "Write a Python function to calculate fibonacci sequence"
```

### Demo Without API Keys

If no API keys are configured, the demo will still run but show a warning:

```
❌ LLM call failed (this is expected if API keys are not configured)
   Error: No provider configured

💡 Set ANTHROPIC_API_KEY or OPENAI_API_KEY in your .env file
```

---

## What Happens During the Demo

### Step 1: Runtime Initialization

```typescript
const { scheduler } = getRuntime();
```

- Creates `ProductionRuntime` instance
- Initializes `ProviderRegistry` with available LLM providers
- Creates `AgentRegistry` with coder, reviewer, tester, security agents
- Sets up `InMemoryEventBus` for event-driven communication
- Initializes `InMemoryTaskRepository` for task storage

### Step 2: Task Creation

```typescript
const task = {
  id: taskId,
  goal: 'Your goal here',
  status: TaskStatus.CREATED,
  priority: TaskPriority.NORMAL,
  assignedAgentRole: 'coder',
  // ... metadata
};
```

- Generates unique task ID and graph ID
- Sets initial status to `CREATED`
- Assigns default agent role (coder)
- Initializes task context and metadata

### Step 3: Task Enqueue

```typescript
await scheduler.enqueue(task);
```

- Adds task to scheduler queue
- Triggers `TASK_ENQUEUED` event
- Scheduler processes task based on priority and dependencies

### Step 4: LLM Provider Call

```typescript
const response = await callLLM(prompt);
```

- `ProviderRegistry` selects first available provider
- Creates `CompletionRequest` with system/user prompts
- Provider executes request with retry + circuit breaker
- Returns `CompletionResponse` with text and usage metrics

**Provider Flow:**

```
ProviderRegistry
  ↓
ProviderFactory (creates provider instance)
  ↓
CredentialResolver (resolves API keys from env)
  ↓
BaseProvider (handles retry, circuit breaker, metrics)
  ↓
AnthropicProvider / OpenAIProvider (native implementation)
  ↓
LLM API (Claude / GPT)
```

### Step 5: Task Status Check

```typescript
const updatedTask = await taskRepo.findById(taskId);
```

- Retrieves task from repository
- Shows current status and goal
- Demonstrates data persistence

---

## Architecture Components

### CLI Layer

```
apps/cli/
├── src/
│   ├── index.ts          # Command registration
│   ├── commands/
│   │   └── demo.ts       # E2E demo command
│   └── lib/
│       ├── runtime.ts    # Runtime initialization
│       └── agent-registry.ts
```

### Runtime Layer

```
packages/runtime/
├── runtime-production/
│   └── src/
│       └── runtime.ts    # ProductionRuntime
```

### Agent Layer

```
packages/agent/
└── agent-platform/
    └── src/
        ├── agent.ts      # Agent definitions
        └── base-agent.ts # Base agent implementation
```

### Provider Layer

```
packages/provider/
├── provider-sdk/
│   └── src/
│       ├── base-provider.ts    # BaseProvider class
│       ├── provider-registry.ts # ProviderRegistry
│       └── factory.ts          # ProviderFactory
└── native-providers/
    └── src/
        └── providers/
            ├── anthropic-provider.ts
            └── openai-provider.ts
```

---

## Troubleshooting

### No Provider Configured

**Error:** `Error: No provider configured`

**Solution:**

1. Check `.env` file exists
2. Verify API key is set:
   ```bash
   echo $ANTHROPIC_API_KEY
   ```
3. Restart demo after adding API key

### Task Not Found

**Error:** `Task <id> not found`

**Solution:**

- Task repository is in-memory (resets on restart)
- Run demo again to create new task
- For persistent tasks, configure database

### Build Errors

**Error:** TypeScript compilation fails

**Solution:**

```bash
# Clean and rebuild
pnpm clean
pnpm build

# Check for type errors
pnpm typecheck
```

---

## Next Steps

After running the demo:

### 1. Submit Real Tasks

```bash
pnpm agentx submit "Create a REST API with user authentication"
```

### 2. Monitor Task Status

```bash
pnpm agentx status
pnpm agentx status <task-id>
```

### 3. Approve Pending Tasks

```bash
pnpm agentx approve <task-id>
```

### 4. Review Costs

```bash
pnpm agentx cost
```

### 5. Run Security Audit

```bash
pnpm agentx audit
```

---

## Advanced Usage

### Custom Agent Roles

```bash
# Use reviewer agent
pnpm agentx submit "Review this code for security issues" --role reviewer

# Use tester agent
pnpm agentx submit "Write unit tests for user service" --role tester

# Use security agent
pnpm agentx submit "Analyze for SQL injection vulnerabilities" --role security
```

### Multiple Providers

Configure multiple providers in `.env`:

```bash
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...
```

ProviderRegistry will use the first available provider by default.

### Debug Mode

Enable verbose logging:

```bash
DEBUG=agentx:* pnpm demo "Your goal"
```

---

## Performance Metrics

During demo execution, the following metrics are collected:

| Metric             | Description                | Typical Value |
| ------------------ | -------------------------- | ------------- |
| Runtime Init Time  | Time to initialize runtime | <100ms        |
| Task Creation Time | Time to create task        | <10ms         |
| LLM Latency        | Time for LLM response      | 500ms-5s      |
| Total Demo Time    | End-to-end duration        | 1-10s         |

Metrics are exported via OpenTelemetry if configured.

---

## Related Documentation

- [ARCHITECTURE.md](../ARCHITECTURE.md) - System architecture
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contributing guide
- [WORKFLOW.md](../WORKFLOW.md) - Development workflow
- [MASTER_PLAN_PRODUCTION.md](../MASTER_PLAN_PRODUCTION.md) - Project roadmap

---

**Last Updated:** July 26, 2026  
**Author:** AgentX Team  
**Status:** Active
