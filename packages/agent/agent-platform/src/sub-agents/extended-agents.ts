/**
 * @module extended-agents
 * @description Extended agent roster beyond the v0.1 core.
 *
 * Volume 3 Ch. 2 specifies only 4 agents for the v0.1 core roster:
 *   - CoderAgent, ReviewerAgent, TesterAgent, SecurityAgent
 *
 * The following agents are extensions beyond v0.1, defined per RFC-0043
 * (cognitive domain). They are exported from this module rather than the
 * main index to keep the core roster clean.
 */

import type { TaskModel } from '@agentx-fast/core-runtime';
import type { CompletionRequest, CompletionResponse } from '@agentx-fast/provider-sdk';
import { ProviderRegistry } from '@agentx-fast/provider-sdk';
import type { AgentRole, AgentConfig } from './interfaces.js';

export abstract class BaseExtendedAgent {
  public readonly id: string;
  public readonly role: AgentRole;
  protected readonly providerId?: string;
  protected readonly promptTemplate?: string;
  protected readonly providerRegistry: ProviderRegistry;

  constructor(
    id: string,
    role: AgentRole,
    config?: AgentConfig,
    providerRegistry?: ProviderRegistry,
  ) {
    this.id = id;
    this.role = role;
    this.providerId = config?.providerId;
    this.promptTemplate = config?.promptTemplate;
    this.providerRegistry = providerRegistry || new ProviderRegistry();
  }

  protected async callLLM(
    prompt: string,
    systemPrompt?: string,
    modelId?: string,
  ): Promise<CompletionResponse> {
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

  public abstract execute(task: TaskModel, _context: unknown): Promise<unknown>;
}

export class DocumentationAgent extends BaseExtendedAgent {
  constructor(id: string, config?: AgentConfig, providerRegistry?: ProviderRegistry) {
    super(id, 'documentation', config, providerRegistry);
  }

  public async execute(task: TaskModel, _context: unknown): Promise<unknown> {
    const prompt = `You are an expert technical writer and documentation engineer. Create comprehensive documentation for:

Goal: ${task.goal}

Provide:
1. Clear, concise documentation with proper structure
2. API reference documentation (if applicable)
3. Usage examples and code snippets
4. Installation and setup instructions
5. Troubleshooting guide
6. FAQ section

Follow best practices for technical writing:
- Use active voice
- Write for the target audience
- Include diagrams where helpful (text-based)
- Ensure consistency in terminology`;

    try {
      const response = await this.callLLM(prompt);
      return {
        agentId: this.id,
        role: this.role,
        taskId: task.id,
        providerId: this.providerId,
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

export class QAAgent extends BaseExtendedAgent {
  constructor(id: string, config?: AgentConfig, providerRegistry?: ProviderRegistry) {
    super(id, 'qa', config, providerRegistry);
  }

  public async execute(task: TaskModel, _context: unknown): Promise<unknown> {
    const prompt = `You are an expert quality assurance engineer. Perform comprehensive QA analysis for:

Goal: ${task.goal}

Provide:
1. Test plan with test scenarios
2. Functional testing checklist
3. Non-functional testing requirements (performance, security, usability)
4. Edge cases and boundary conditions
5. Regression testing strategy
6. Acceptance criteria validation
7. Defect reports with severity ratings

QA Best Practices:
- Test from user perspective
- Consider all user roles and permissions
- Validate against requirements
- Document reproducible steps for any issues
- Prioritize findings by impact`;

    try {
      const response = await this.callLLM(prompt);
      return {
        agentId: this.id,
        role: this.role,
        taskId: task.id,
        providerId: this.providerId,
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
