// packages/agent/agent-platform/src/agent.ts
import type { TaskModel, TaskContext } from '@agentx-fast/core-runtime';
import type { CompletionRequest } from '@agentx-fast/provider-sdk';
import { ProviderRegistry } from '@agentx-fast/provider-sdk';

export type AgentRole = 'coding' | 'review' | 'test' | 'security';

export interface AgentDefinition {
  role: AgentRole;
  allowedToolCategories: string[];
  systemPromptTemplateId: string;
}

export interface AgentResult {
  success: boolean;
  output: string;
  toolCalls?: Array<{ tool: string; args: Record<string, unknown> }>;
  usage?: { inputTokens: number; outputTokens: number; costUsd: number };
}

export interface Agent {
  readonly role: AgentRole;
  run(task: TaskModel, context: TaskContext): Promise<AgentResult>;
}

// Helper function to call LLM provider
export async function callLLM(prompt: string, modelId?: string): Promise<string> {
  const registry = new ProviderRegistry();
  const providers = registry.list();
  const provider = providers[0];
  if (!provider) {
    throw new Error('No provider configured');
  }

  const request: CompletionRequest = {
    systemPrompt: '',
    userPrompt: prompt,
    modelId: modelId || 'claude-sonnet-4-20250514',
  };

  const response = await registry.complete(provider.id, request);
  return response.text;
}

// Specialized agent implementations
export class CodingAgent implements Agent {
  readonly role: AgentRole = 'coding';

  async run(task: TaskModel, _context: TaskContext): Promise<AgentResult> {
    try {
      const prompt = `You are an expert software engineer. Implement the following task:

Task: ${task.goal}

Provide clean, production-ready code with proper error handling.`;

      const output = await callLLM(prompt);

      return {
        success: true,
        output,
      };
    } catch (error) {
      return {
        success: false,
        output: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

export class ReviewAgent implements Agent {
  readonly role: AgentRole = 'review';

  async run(task: TaskModel, _context: TaskContext): Promise<AgentResult> {
    try {
      const prompt = `You are a senior code reviewer. Review the following code:

${task.goal}

Check for:
- Code quality and best practices
- Potential bugs
- Security issues
- Performance concerns
- Maintainability

Provide specific, actionable feedback.`;

      const output = await callLLM(prompt);

      return {
        success: true,
        output,
      };
    } catch (error) {
      return {
        success: false,
        output: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

export class TestAgent implements Agent {
  readonly role: AgentRole = 'test';

  async run(task: TaskModel, _context: TaskContext): Promise<AgentResult> {
    try {
      const prompt = `You are an expert test engineer. Generate comprehensive tests for:

${task.goal}

Include:
- Unit tests
- Edge cases
- Error handling
- Integration tests where appropriate

Use appropriate testing frameworks and best practices.`;

      const output = await callLLM(prompt);

      return {
        success: true,
        output,
      };
    } catch (error) {
      return {
        success: false,
        output: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

export class SecurityAgent implements Agent {
  readonly role: AgentRole = 'security';

  async run(task: TaskModel, _context: TaskContext): Promise<AgentResult> {
    try {
      const prompt = `You are a security expert. Analyze the following code for vulnerabilities:

${task.goal}

Check for:
- Injection attacks (SQL, XSS, command injection)
- Authentication/authorization issues
- Data exposure and privacy concerns
- Insecure dependencies
- Security misconfigurations

List vulnerabilities by severity (Critical, High, Medium, Low).`;

      const output = await callLLM(prompt);

      return {
        success: true,
        output,
      };
    } catch (error) {
      return {
        success: false,
        output: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
