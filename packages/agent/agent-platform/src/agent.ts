// packages/agent/agent-platform/src/agent.ts
import type { TaskModel, TaskContext } from '@agent-xai/core-runtime';
import type { RouteRequest } from '@agent-xai/llm-router';
import { LLMRouter, DeepSeekMock, OpenAIMock, AnthropicMock } from '@agent-xai/llm-router';

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

// Instantiate global router and register mock providers for early beta testing
const router = new LLMRouter();
router.registerProvider(DeepSeekMock);
router.registerProvider(OpenAIMock);
router.registerProvider(AnthropicMock);

// Helper function to call LLM via Smart Router
export async function callLLM(
  prompt: string,
  taskId: string = 'default',
  modelId?: string,
): Promise<string> {
  // Translate to routing request
  const request: RouteRequest = {
    taskId,
    description: prompt.substring(0, 100),
    complexity: 'medium', // dynamically computed based on prompt length or heuristics in production
    type: 'reasoning',
    budget: 'medium',
    context: modelId ? { overrideModel: modelId } : undefined,
  };

  try {
    const result = await router.execute(request, prompt);
    return result.message;
  } catch (error) {
    console.warn('LLM Router failed, returning mock string:', error);
    return `[Fallback] LLM encountered an error: ${String(error)}`;
  }
}

// Specialized agent implementations
export class CodingAgent implements Agent {
  readonly role: AgentRole = 'coding';

  async run(task: TaskModel, _context: TaskContext): Promise<AgentResult> {
    try {
      const prompt = `You are an expert software engineer. Implement the following task:\n\nTask: ${task.goal}\n\nProvide clean, production-ready code with proper error handling.`;
      const output = await callLLM(prompt, task.id);
      return { success: true, output };
    } catch (error) {
      return { success: false, output: error instanceof Error ? error.message : String(error) };
    }
  }
}

export class ReviewAgent implements Agent {
  readonly role: AgentRole = 'review';

  async run(task: TaskModel, _context: TaskContext): Promise<AgentResult> {
    try {
      const prompt = `You are a senior code reviewer. Review the following code:\n\n${task.goal}\n\nCheck for:\n- Code quality and best practices\n- Potential bugs\n- Security issues\n- Performance concerns\n- Maintainability\n\nProvide specific, actionable feedback.`;
      const output = await callLLM(prompt, task.id);
      return { success: true, output };
    } catch (error) {
      return { success: false, output: error instanceof Error ? error.message : String(error) };
    }
  }
}

export class TestAgent implements Agent {
  readonly role: AgentRole = 'test';

  async run(task: TaskModel, _context: TaskContext): Promise<AgentResult> {
    try {
      const prompt = `You are an expert test engineer. Generate comprehensive tests for:\n\n${task.goal}\n\nInclude:\n- Unit tests\n- Edge cases\n- Error handling\n- Integration tests where appropriate\n\nUse appropriate testing frameworks and best practices.`;
      const output = await callLLM(prompt, task.id);
      return { success: true, output };
    } catch (error) {
      return { success: false, output: error instanceof Error ? error.message : String(error) };
    }
  }
}

export class SecurityAgent implements Agent {
  readonly role: AgentRole = 'security';

  async run(task: TaskModel, _context: TaskContext): Promise<AgentResult> {
    try {
      const prompt = `You are a security expert. Analyze the following code for vulnerabilities:\n\n${task.goal}\n\nCheck for:\n- Injection attacks (SQL, XSS, command injection)\n- Authentication/authorization issues\n- Data exposure and privacy concerns\n- Insecure dependencies\n- Security misconfigurations\n\nList vulnerabilities by severity (Critical, High, Medium, Low).`;
      const output = await callLLM(prompt, task.id);
      return { success: true, output };
    } catch (error) {
      return { success: false, output: error instanceof Error ? error.message : String(error) };
    }
  }
}
