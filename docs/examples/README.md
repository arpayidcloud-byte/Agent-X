# AgentX Code Examples

## 1. Basic Usage

### Submit Task

```typescript
import { createScheduler, InMemoryEventBus, InMemoryTaskRepository } from '@agentx/core-runtime';

const bus = new InMemoryEventBus();
const repo = new InMemoryTaskRepository();
const scheduler = createScheduler(repo, bus);

const task = {
  type: 'code-generation',
  input: 'Create a function to sort array',
  agentType: 'coder',
  priority: 1,
};

await scheduler.enqueue(task);
```

### Check Status

```typescript
const task = await repo.getById(taskId);
console.log(`Status: ${task.status}`);
console.log(`Output: ${task.output}`);
```

## 2. Custom Agent

```typescript
import { BaseAgent } from '@agentx/agent-platform';
import { ProviderRegistry } from '@agentx/provider-sdk';

class CustomAgent extends BaseAgent {
  async execute(input: string, context: any): Promise<string> {
    const provider = this.registry.getDefault();
    const response = await provider.complete({
      model: 'claude-sonnet-4-20250514',
      messages: [{ role: 'user', content: input }],
    });
    return response.content;
  }
}
```

## 3. Custom Tool

```typescript
import { BaseTool } from '@agentx/tool-sdk';

class DatabaseTool extends BaseTool {
  name = 'database';
  description = 'Execute SQL queries';

  async execute(query: string): Promise<any> {
    const result = await this.db.query(query);
    return result.rows;
  }
}
```

## 4. Provider Integration

```typescript
import { AnthropicProvider } from '@agentx/provider-sdk';

const provider = new AnthropicProvider(process.env.ANTHROPIC_API_KEY!);

const response = await provider.complete({
  model: 'claude-sonnet-4-20250514',
  messages: [{ role: 'user', content: 'Hello!' }],
  maxTokens: 1000,
});

console.log(response.content);
console.log(response.usage); // tokens used
```

## 5. Workflow Orchestration

```typescript
import { WorkflowEngine } from '@agentx/workflow-engine';

const engine = new WorkflowEngine();

const workflow = {
  id: 'code-review-flow',
  nodes: [
    { id: 'code', agent: 'coder' },
    { id: 'review', agent: 'reviewer', dependsOn: ['code'] },
    { id: 'test', agent: 'tester', dependsOn: ['review'] },
  ],
};

await engine.executeWorkflow(workflow, { input: 'Fix bug #123' });
```

## 6. Monitoring & Observability

```typescript
import { PrometheusExporter } from '@agentx/observability';

const exporter = new PrometheusExporter();

// Record task
exporter.recordTask('success', 1.5, 'coder-agent');

// Record tool call
exporter.recordToolCall('fs.write', true);

// Get metrics
const metrics = await exporter.getMetrics();
console.log(metrics); // Prometheus format
```

## 7. Health Checks

```typescript
import { RuntimeHealthService } from '@agentx/runtime';

const health = new RuntimeHealthService();

// Register checks
health.registerCheck('database', async () => {
  const ok = await db.ping();
  return { component: 'database', healthy: ok, latencyMs: 10 };
});

// Check all
const report = await health.checkAll();
console.log(`Overall: ${report.overall ? 'OK' : 'FAIL'}`);
```

## 8. Error Handling

```typescript
import { RuntimeError, RuntimeRecoverableError } from '@agentx/runtime';

try {
  await scheduler.dispatch(task);
} catch (error) {
  if (error instanceof RuntimeRecoverableError) {
    // Retry logic
    await retry(task);
  } else if (error instanceof RuntimeError) {
    // Log and alert
    logger.error('Task failed', { error, task });
  }
}
```
