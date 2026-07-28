import type {
  IToolRegistry,
  ToolExecutionRequest,
  ToolExecutionContext,
} from '../interfaces/index.js';
import type { ToolExecutionPipeline } from '../interfaces/index.js';
import type {
  NormalizedToolSpec,
  NormalizedToolCall,
  ToolResult as ProviderToolResult,
  CompletionResponse,
} from '@agentx-fast/provider-sdk';
import { Metrics, Tracer } from '@agentx-fast/observability';

export interface ToolOrchestratorConfig {
  maxIterations: number;
  timeoutMs: number;
  workingDirectory: string;
}

export interface OrchestrationResult {
  finalText: string;
  toolCalls: NormalizedToolCall[];
  toolResults: ProviderToolResult[];
  totalIterations: number;
  success: boolean;
  error?: string;
}

export class ToolOrchestrator {
  private registry: IToolRegistry;
  private pipeline: ToolExecutionPipeline;
  private config: ToolOrchestratorConfig;
  private metrics: Metrics;
  private tracer: Tracer;

  constructor(
    registry: IToolRegistry,
    pipeline: ToolExecutionPipeline,
    config?: Partial<ToolOrchestratorConfig>,
  ) {
    this.registry = registry;
    this.pipeline = pipeline;
    this.config = {
      maxIterations: config?.maxIterations ?? 10,
      timeoutMs: config?.timeoutMs ?? 60000,
      workingDirectory: config?.workingDirectory ?? process.cwd(),
    };
    this.metrics = new Metrics();
    this.tracer = new Tracer('tool-orchestrator');
  }

  public async executeToolCalls(
    toolCalls: NormalizedToolCall[],
    context: ToolExecutionContext,
  ): Promise<ProviderToolResult[]> {
    const results: ProviderToolResult[] = [];

    for (const toolCall of toolCalls) {
      const span = this.tracer.startSpan('tool-orchestrator-execute');
      span.setAttribute('tool.call_id', toolCall.callId);
      span.setAttribute('tool.name', toolCall.toolName);

      const startTime = Date.now();

      const tool = this.registry.find(toolCall.toolName);
      if (!tool) {
        this.metrics.counter('tool_orchestrator_tool_not_found', 1, {
          tool: toolCall.toolName,
        });
        results.push({
          callId: toolCall.callId,
          output: '',
          success: false,
          error: `Tool '${toolCall.toolName}' not found`,
        });
        span.end();
        continue;
      }

      try {
        const request: ToolExecutionRequest = {
          toolName: toolCall.toolName,
          category: tool.definition.category,
          arguments: toolCall.arguments,
          context,
        };

        this.metrics.counter('tool_orchestrator_tool_executed', 1, {
          tool: toolCall.toolName,
          category: tool.definition.category,
        });

        const response = await this.pipeline.execute(request, tool);

        const durationMs = Date.now() - startTime;
        this.metrics.histogram('tool_orchestrator_execution_latency', durationMs, {
          tool: toolCall.toolName,
          success: String(response.result.success),
        });

        if (!response.result.success) {
          this.metrics.counter('tool_orchestrator_tool_failed', 1, {
            tool: toolCall.toolName,
          });
        }

        results.push({
          callId: toolCall.callId,
          output: response.result.output,
          success: response.result.success,
          error: response.result.error,
        });

        span.setAttribute('tool.success', response.result.success);
        span.end();
      } catch (error) {
        const durationMs = Date.now() - startTime;
        this.metrics.counter('tool_orchestrator_tool_error', 1, {
          tool: toolCall.toolName,
        });
        this.metrics.histogram('tool_orchestrator_execution_latency', durationMs, {
          tool: toolCall.toolName,
          error: 'true',
        });

        results.push({
          callId: toolCall.callId,
          output: '',
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });

        span.setStatus({
          code: 1,
          message: error instanceof Error ? error.message : String(error),
        });
        span.end();
      }
    }

    return results;
  }

  public async runWithToolLoop(
    initialResponse: CompletionResponse,
    context: ToolExecutionContext,
  ): Promise<OrchestrationResult> {
    const span = this.tracer.startSpan('tool-orchestrator-loop');
    span.setAttribute('orchestrator.max_iterations', this.config.maxIterations);

    const allToolCalls: NormalizedToolCall[] = [];
    const allToolResults: ProviderToolResult[] = [];
    let iterations = 0;
    const response = initialResponse;

    this.metrics.counter('tool_orchestrator_loop_started', 1, {
      task_id: context.taskId,
    });

    while (response.toolCalls.length > 0 && iterations < this.config.maxIterations) {
      iterations++;

      span.setAttribute(
        `orchestrator.iteration_${iterations}_tool_count`,
        response.toolCalls.length,
      );

      allToolCalls.push(...response.toolCalls);

      const toolResults = await this.executeToolCalls(response.toolCalls, context);
      allToolResults.push(...toolResults);

      if (toolResults.some((r) => !r.success)) {
        const failedTools = toolResults.filter((r) => !r.success);
        this.metrics.counter('tool_orchestrator_loop_failed', 1, {
          task_id: context.taskId,
          iteration: String(iterations),
        });
        span.setStatus({ code: 1, message: 'Tool execution failed' });
        span.end();
        return {
          finalText: response.text,
          toolCalls: allToolCalls,
          toolResults: allToolResults,
          totalIterations: iterations,
          success: false,
          error: `Tool execution failed: ${failedTools.map((f) => f.error).join(', ')}`,
        };
      }

      break;
    }

    if (iterations >= this.config.maxIterations) {
      this.metrics.counter('tool_orchestrator_loop_max_iterations', 1, {
        task_id: context.taskId,
      });
      span.setStatus({ code: 1, message: 'Max iterations reached' });
      span.end();
      return {
        finalText: response.text,
        toolCalls: allToolCalls,
        toolResults: allToolResults,
        totalIterations: iterations,
        success: false,
        error: `Max iterations (${this.config.maxIterations}) reached`,
      };
    }

    this.metrics.counter('tool_orchestrator_loop_completed', 1, {
      task_id: context.taskId,
      iterations: String(iterations),
    });
    span.setAttribute('orchestrator.total_iterations', iterations);
    span.end();

    return {
      finalText: response.text,
      toolCalls: allToolCalls,
      toolResults: allToolResults,
      totalIterations: iterations,
      success: true,
    };
  }

  public static toolSpecsFromRegistry(registry: IToolRegistry): NormalizedToolSpec[] {
    const tools = registry.list();
    return tools.map((tool) => ({
      name: tool.definition.name,
      description: tool.definition.description,
      parameters: tool.definition.parametersSchema,
    }));
  }
}
