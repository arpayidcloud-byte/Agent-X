import { describe, it, expect, beforeEach } from 'vitest';
import { ToolOrchestrator } from './index.js';
import { ToolRegistry } from '../registry/index.js';
import { ToolExecutionPipelineImpl } from '../pipeline/index.js';
import type {
  ITool,
  ToolDefinition,
  ToolMetadata,
  ToolExecutionRequest,
  ToolExecutionResponse,
} from '../interfaces/index.js';
import type { CompletionResponse } from '@agentx-fast/provider-sdk';
import type { ToolExecutionContext } from '../interfaces/index.js';

class MockTool implements ITool {
  public definition: ToolDefinition;
  public metadata: ToolMetadata;
  public executeCalls: ToolExecutionRequest[] = [];

  constructor(name: string, category: string) {
    this.definition = {
      name,
      description: `Mock ${name} tool`,
      category,
      capabilities: {
        supportsStreaming: false,
        supportsCancellation: false,
        requiresNetwork: false,
        requiresFilesystem: false,
      },
      permissions: [],
      parametersSchema: {
        type: 'object',
        properties: { input: { type: 'string' } },
      },
    };
    this.metadata = {
      version: '1.0.0',
      author: 'test',
      classification: 'Safe',
      riskScore: 10,
    };
  }

  async execute(req: ToolExecutionRequest): Promise<ToolExecutionResponse> {
    this.executeCalls.push(req);
    return {
      result: {
        success: true,
        output: `Executed ${this.definition.name} with ${JSON.stringify(req.arguments)}`,
      },
      executedAt: new Date(),
    };
  }
}

describe('ToolOrchestrator', () => {
  let registry: ToolRegistry;
  let pipeline: ToolExecutionPipelineImpl;
  let orchestrator: ToolOrchestrator;

  beforeEach(() => {
    registry = new ToolRegistry();
    pipeline = new ToolExecutionPipelineImpl(300000, 60000);
    orchestrator = new ToolOrchestrator(registry, pipeline);
  });

  describe('toolSpecsFromRegistry', () => {
    it('should convert registry tools to tool specs', () => {
      const tool = new MockTool('test_tool', 'test.read');
      registry.register(tool);

      const specs = ToolOrchestrator.toolSpecsFromRegistry(registry);
      expect(specs).toHaveLength(1);
      expect(specs[0].name).toBe('test_tool');
      expect(specs[0].description).toBe('Mock test_tool tool');
      expect(specs[0].parameters).toBeDefined();
    });

    it('should return empty array for empty registry', () => {
      const specs = ToolOrchestrator.toolSpecsFromRegistry(registry);
      expect(specs).toHaveLength(0);
    });
  });

  describe('executeToolCalls', () => {
    it('should execute a single tool call', async () => {
      const tool = new MockTool('test_tool', 'test.read');
      registry.register(tool);

      const context: ToolExecutionContext = {
        taskId: 'task-1',
        traceId: 'trace-1',
        agentRole: 'coder',
        workingDirectory: '/tmp',
      };

      const toolCalls = [
        {
          toolName: 'test_tool',
          arguments: { input: 'test' },
          callId: 'call-1',
        },
      ];

      const results = await orchestrator.executeToolCalls(toolCalls, context);

      expect(results).toHaveLength(1);
      expect(results[0].callId).toBe('call-1');
      expect(results[0].success).toBe(true);
      expect(results[0].output).toContain('Executed test_tool');
      expect(tool.executeCalls).toHaveLength(1);
    });

    it('should return error for unknown tool', async () => {
      const context: ToolExecutionContext = {
        taskId: 'task-1',
        traceId: 'trace-1',
        agentRole: 'coder',
        workingDirectory: '/tmp',
      };

      const toolCalls = [
        {
          toolName: 'unknown_tool',
          arguments: {},
          callId: 'call-1',
        },
      ];

      const results = await orchestrator.executeToolCalls(toolCalls, context);

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(false);
      expect(results[0].error).toContain('not found');
    });

    it('should execute multiple tool calls', async () => {
      const tool1 = new MockTool('tool1', 'test.read');
      const tool2 = new MockTool('tool2', 'test.read');
      registry.register(tool1);
      registry.register(tool2);

      const context: ToolExecutionContext = {
        taskId: 'task-1',
        traceId: 'trace-1',
        agentRole: 'coder',
        workingDirectory: '/tmp',
      };

      const toolCalls = [
        { toolName: 'tool1', arguments: {}, callId: 'call-1' },
        { toolName: 'tool2', arguments: {}, callId: 'call-2' },
      ];

      const results = await orchestrator.executeToolCalls(toolCalls, context);

      expect(results).toHaveLength(2);
      expect(results.every((r) => r.success)).toBe(true);
    });
  });

  describe('runWithToolLoop', () => {
    it('should return success when no tool calls', async () => {
      const context: ToolExecutionContext = {
        taskId: 'task-1',
        traceId: 'trace-1',
        agentRole: 'coder',
        workingDirectory: '/tmp',
      };

      const response: CompletionResponse = {
        text: 'Final answer',
        toolCalls: [],
        usage: { inputTokens: 10, outputTokens: 5 },
        providerId: 'anthropic',
        modelId: 'claude-sonnet-4-20250514',
        latencyMs: 100,
      };

      const result = await orchestrator.runWithToolLoop(response, context);

      expect(result.success).toBe(true);
      expect(result.finalText).toBe('Final answer');
      expect(result.totalIterations).toBe(0);
    });

    it('should execute tool calls and return results', async () => {
      const tool = new MockTool('test_tool', 'test.read');
      registry.register(tool);

      const context: ToolExecutionContext = {
        taskId: 'task-1',
        traceId: 'trace-1',
        agentRole: 'coder',
        workingDirectory: '/tmp',
      };

      const response: CompletionResponse = {
        text: 'Let me use a tool',
        toolCalls: [
          {
            toolName: 'test_tool',
            arguments: { input: 'test' },
            callId: 'call-1',
          },
        ],
        usage: { inputTokens: 10, outputTokens: 5 },
        providerId: 'anthropic',
        modelId: 'claude-sonnet-4-20250514',
        latencyMs: 100,
      };

      const result = await orchestrator.runWithToolLoop(response, context);

      expect(result.success).toBe(true);
      expect(result.toolCalls).toHaveLength(1);
      expect(result.toolResults).toHaveLength(1);
      expect(result.toolResults[0].success).toBe(true);
    });

    it('should handle tool execution failure', async () => {
      const tool = new MockTool('test_tool', 'test.read');
      registry.register(tool);

      const context: ToolExecutionContext = {
        taskId: 'task-1',
        traceId: 'trace-1',
        agentRole: 'coder',
        workingDirectory: '/tmp',
      };

      const response: CompletionResponse = {
        text: 'Looping',
        toolCalls: [
          {
            toolName: 'test_tool',
            arguments: {},
            callId: 'call-1',
          },
        ],
        usage: { inputTokens: 10, outputTokens: 5 },
        providerId: 'anthropic',
        modelId: 'claude-sonnet-4-20250514',
        latencyMs: 100,
      };

      const result = await orchestrator.runWithToolLoop(response, context);

      expect(result.success).toBe(true);
      expect(result.totalIterations).toBe(1);
    });
  });
});
