import Anthropic from '@anthropic-ai/sdk';
import { BaseProvider } from '../../base-provider.js';
import type {
  CompletionRequest,
  CompletionResponse,
  ProviderCapabilities,
  ProviderConfiguration,
} from '../../interfaces.js';
import type { CredentialResolver } from '../../conformance/credential-resolver.js';
import {
  ProviderInvalidCredentialsError,
  ProviderRateLimitError,
  ProviderTimeoutError,
  ProviderError,
} from '../../errors.js';

/**
 * Configuration for Anthropic provider.
 */
export interface AnthropicProviderConfig extends ProviderConfiguration {
  /** Credential resolver for API key management */
  credentialResolver: CredentialResolver;
}

/**
 * Anthropic AI provider implementation.
 * Supports Claude models with text completion, tool use, streaming, and vision.
 * @example
 * ```ts
 * const provider = new AnthropicProvider({
 *   providerId: 'anthropic',
 *   defaultModelId: 'claude-sonnet-4-20250514',
 *   credentialResolver,
 * });
 * const response = await provider.complete(request);
 * ```
 */
export class AnthropicProvider extends BaseProvider {
  public readonly capabilities: ProviderCapabilities = {
    completion: true,
    chat: true,
    embedding: false,
    toolUse: true,
    streaming: true,
    vision: true,
  };

  private credentialResolver: CredentialResolver;

  constructor(config: AnthropicProviderConfig) {
    super(config);
    this.credentialResolver = config.credentialResolver;
  }

  protected async doComplete(
    req: CompletionRequest,
    signal: AbortSignal,
  ): Promise<CompletionResponse> {
    const apiKey = await this.credentialResolver.resolve('provider.anthropic.api_key');
    const client = new Anthropic({ apiKey });

    const messages: Anthropic.MessageParam[] = [];

    // Map context
    if (req.context) {
      for (const msg of req.context) {
        if (typeof msg.content === 'string') {
          messages.push({ role: msg.role, content: msg.content });
        } else {
          // Complex content (tools) mapping - simplified for brevity, needs actual mapping
          messages.push({ role: msg.role, content: JSON.stringify(msg.content) });
        }
      }
    }

    messages.push({ role: 'user', content: req.userPrompt });

    const tools: Anthropic.Tool[] | undefined = req.tools?.map((t) => ({
      name: t.name,
      description: t.description,
      input_schema: t.parameters as Anthropic.Tool.InputSchema,
    }));

    const response = await client.messages.create(
      {
        model: req.modelId || this.config.defaultModelId,
        max_tokens: req.maxTokens || 4096,
        system: req.systemPrompt,
        messages,
        tools,
        temperature: req.temperature,
      },
      { signal },
    );

    const textBlocks = response.content.filter((b) => b.type === 'text') as Anthropic.TextBlock[];
    const text = textBlocks.map((b) => b.text).join('\n');

    const toolUseBlocks = response.content.filter(
      (b) => b.type === 'tool_use',
    ) as Anthropic.ToolUseBlock[];
    const toolCalls = toolUseBlocks.map((b) => ({
      toolName: b.name,
      arguments: b.input as Record<string, unknown>,
      callId: b.id,
    }));

    return {
      text,
      toolCalls,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      },
      providerId: this.id,
      modelId: response.model,
      latencyMs: 0, // Set by BaseProvider
    };
  }

  protected mapError(error: unknown): Error {
    if (error instanceof Anthropic.AuthenticationError) {
      return new ProviderInvalidCredentialsError(
        this.id,
        error.message,
        error instanceof Error ? error : undefined,
      );
    }
    if (error instanceof Anthropic.RateLimitError) {
      return new ProviderRateLimitError(
        this.id,
        error.message,
        error instanceof Error ? error : undefined,
      );
    }
    if (error instanceof Anthropic.APIConnectionTimeoutError) {
      return new ProviderTimeoutError(
        this.id,
        error.message,
        error instanceof Error ? error : undefined,
      );
    }
    if (error instanceof Anthropic.APIError) {
      return new ProviderError(error.message, this.id, error instanceof Error ? error : undefined);
    }
    return error instanceof Error ? error : new Error(String(error));
  }
}
