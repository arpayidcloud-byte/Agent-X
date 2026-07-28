import type { SubAgent, AgentRole, AgentConfig } from './interfaces.js';
import type { TaskModel } from '@agentx-fast/core-runtime';
import type { CompletionRequest, CompletionResponse } from '@agentx-fast/provider-sdk';
import { ProviderRegistry } from '@agentx-fast/provider-sdk';

export class BaseSubAgent implements SubAgent {
  public readonly id: string;
  public readonly role: AgentRole;
  protected readonly providerId?: string;
  protected readonly promptTemplate?: string;
  protected readonly providerRegistry: ProviderRegistry;

  constructor(id: string, role: AgentRole, config?: AgentConfig, providerRegistry?: ProviderRegistry) {
    this.id = id;
    this.role = role;
    this.providerId = config?.providerId;
    this.promptTemplate = config?.promptTemplate;
    this.providerRegistry = providerRegistry || new ProviderRegistry();
  }

  public buildPrompt(task: TaskModel): string {
    if (this.promptTemplate) {
      return this.promptTemplate
        .replace('{{goal}}', task.goal)
        .replace('{{taskId}}', task.id)
        .replace('{{role}}', this.role);
    }
    return `Execute task ${task.id}: ${task.goal} as ${this.role}`;
  }

  protected async callLLM(prompt: string, systemPrompt?: string, modelId?: string): Promise<CompletionResponse> {
    const providers = this.providerRegistry.list();
    const provider = providers[0];
    if (!provider) {
      throw new Error('No provider configured');
    }

    const request: CompletionRequest = {
      systemPrompt: systemPrompt || '',
      userPrompt: prompt,
      modelId: modelId || 'claude-sonnet-4-20250514',
    };

    return this.providerRegistry.complete(provider.id, request);
  }

  public async execute(task: TaskModel, _context: unknown): Promise<unknown> {
    const prompt = this.buildPrompt(task);
    
    try {
      const response = await this.callLLM(prompt);
      return {
        agentId: this.id,
        role: this.role,
        taskId: task.id,
        providerId: this.providerId,
        prompt,
        status: 'success',
        output: response.text,
        usage: response.usage,
        toolCalls: response.toolCalls,
      };
    } catch (error) {
      return {
        agentId: this.id,
        role: this.role,
        taskId: task.id,
        status: 'failure',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

export class PlannerAgent extends BaseSubAgent {
  constructor(id: string, config?: AgentConfig, providerRegistry?: ProviderRegistry) {
    super(id, 'planner', config, providerRegistry);
  }

  public buildPrompt(task: TaskModel): string {
    return `You are a planning expert. Decompose the following goal into actionable subtasks with clear dependencies.

Goal: ${task.goal}

Provide a structured plan with:
1. Task breakdown (numbered list)
2. Dependencies between tasks
3. Estimated complexity for each task
4. Recommended agent role for each task`;
  }
}

export class ArchitectAgent extends BaseSubAgent {
  constructor(id: string, config?: AgentConfig, providerRegistry?: ProviderRegistry) {
    super(id, 'architect', config, providerRegistry);
  }

  public buildPrompt(task: TaskModel): string {
    return `You are a senior software architect. Design the system architecture for:

Goal: ${task.goal}

Provide:
1. High-level architecture overview
2. Component breakdown
3. Data flow diagrams (text-based)
4. Technology recommendations
5. Potential scalability concerns`;
  }
}

export class CoderAgent extends BaseSubAgent {
  constructor(id: string, config?: AgentConfig, providerRegistry?: ProviderRegistry) {
    super(id, 'coder', config, providerRegistry);
  }

  public buildPrompt(task: TaskModel): string {
    return `You are an expert software engineer. Implement the following task:

Goal: ${task.goal}

Provide:
1. Clean, production-ready code
2. Proper error handling
3. Type definitions
4. Self-documenting code with minimal comments
5. Consider security implications`;
  }
}

export class ReviewerAgent extends BaseSubAgent {
  constructor(id: string, config?: AgentConfig, providerRegistry?: ProviderRegistry) {
    super(id, 'reviewer', config, providerRegistry);
  }

  public buildPrompt(task: TaskModel): string {
    return `You are a senior code reviewer. Review the following code:

Goal: ${task.goal}

Check for:
1. Code quality and best practices
2. Potential bugs
3. Security issues
4. Performance concerns
5. Maintainability

Provide specific, actionable feedback.`;
  }
}

export class TesterAgent extends BaseSubAgent {
  constructor(id: string, config?: AgentConfig, providerRegistry?: ProviderRegistry) {
    super(id, 'tester', config, providerRegistry);
  }

  public buildPrompt(task: TaskModel): string {
    return `You are an expert test engineer. Generate comprehensive tests for:

Goal: ${task.goal}

Include:
1. Unit tests
2. Edge cases
3. Error handling
4. Integration tests where appropriate

Use appropriate testing frameworks and best practices.`;
  }
}

export class SecurityAgent extends BaseSubAgent {
  constructor(id: string, config?: AgentConfig, providerRegistry?: ProviderRegistry) {
    super(id, 'security', config, providerRegistry);
  }

  public buildPrompt(task: TaskModel): string {
    return `You are a security expert. Analyze the following code for vulnerabilities:

Goal: ${task.goal}

Check for:
1. Injection attacks (SQL, XSS, command injection)
2. Authentication/authorization issues
3. Data exposure and privacy concerns
4. Insecure dependencies
5. OWASP Top 10 vulnerabilities

Provide severity ratings and remediation steps.`;
  }
}

// DocumentationAgent, PlannerAgent, ArchitectAgent, QAAgent have been moved
// to ./extended-agents.ts (beyond v0.1 core roster per RFC-0043).
