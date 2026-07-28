# Agent Orchestration

Multi-agent collaboration system with Coder, Reviewer, and Tester agents.

## Architecture

```
┌─────────────────┐
│  Orchestrator   │
│  - Delegation   │
│  - Aggregation  │
│  - Error Handle │
└────────┬────────┘
         │
    ┌────┼────┐
    │    │    │
    ↓    ↓    ↓
┌─────┐ ┌───┐ ┌──────┐
│Coder│ │Rev│ │Tester│
└─────┘ └───┘ └──────┘
```

## Core Agents

### CoderAgent

**Role:** Write code based on requirements

**Capabilities:**

- Generate code from specifications
- Implement features
- Fix bugs
- Refactor code

**Example:**

```typescript
import { CoderAgent } from '@agentx/agent-platform';

const coder = new CoderAgent();
const result = await coder.execute({
  task: 'Implement user authentication',
  context: { language: 'typescript', framework: 'fastify' },
});
```

### ReviewerAgent

**Role:** Review code for quality and security

**Capabilities:**

- Code review
- Security analysis
- Best practices check
- Performance optimization suggestions

**Example:**

```typescript
import { ReviewerAgent } from '@agentx/agent-platform';

const reviewer = new ReviewerAgent();
const review = await reviewer.execute({
  task: 'Review authentication implementation',
  context: { code: '...', criteria: ['security', 'performance'] },
});
```

### TesterAgent

**Role:** Write and execute tests

**Capabilities:**

- Unit test generation
- Integration test creation
- Test execution
- Coverage analysis

**Example:**

```typescript
import { TesterAgent } from '@agentx/agent-platform';

const tester = new TesterAgent();
const tests = await tester.execute({
  task: 'Write tests for auth module',
  context: { code: '...', framework: 'vitest' },
});
```

## Orchestration Flow

1. **Task Delegation**
   - Orchestrator receives high-level goal
   - Breaks into subtasks
   - Assigns to appropriate agents

2. **Parallel Execution**
   - Agents work concurrently
   - Share context via event bus
   - Report progress

3. **Result Aggregation**
   - Collect outputs from all agents
   - Resolve conflicts
   - Generate final result

4. **Error Handling**
   - Catch agent failures
   - Retry with backoff
   - Escalate if needed

## Configuration

```bash
# Agent Configuration
AGENT_TIMEOUT_MS=300000          # 5 minutes per agent
AGENT_MAX_RETRIES=3              # Retry failed agents
AGENT_CONCURRENCY=3              # Parallel agents
AGENT_TEMPERATURE=0.7            # LLM creativity
```

## Usage Example

```typescript
import { Orchestrator } from '@agentx/agent-platform';

const orchestrator = new Orchestrator({
  agents: ['coder', 'reviewer', 'tester'],
  timeout: 300000,
  maxRetries: 3,
});

const result = await orchestrator.execute({
  goal: 'Implement user login feature',
  constraints: ['use JWT', 'add tests', 'follow security best practices'],
});

console.log(result);
// {
//   code: '...',
//   review: { score: 9.5, issues: [] },
//   tests: { passed: 15, failed: 0, coverage: 95 }
// }
```

## Error Recovery

```typescript
orchestrator.on('agent:error', async (error) => {
  if (error.recoverable) {
    await orchestrator.retry(error.agentId);
  } else {
    await orchestrator.escalate(error);
  }
});
```

## Monitoring

```typescript
orchestrator.on('task:start', (task) => {
  console.log(`Task ${task.id} started on ${task.agentId}`);
});

orchestrator.on('task:complete', (result) => {
  console.log(`Task ${result.taskId} completed in ${result.duration}ms`);
});
```

## Security Notes

- ⚠️ Agents run with sandboxed permissions
- ✅ All file operations are logged
- ✅ Code execution requires approval
- ✅ Secrets are redacted from logs
