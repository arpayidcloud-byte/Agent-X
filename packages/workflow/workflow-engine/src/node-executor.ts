/**
 * @module workflow-engine/node-executor
 * @description NodeExecutor provides isolated execution logic for each node type.
 */

import type { WorkflowNode } from './interfaces.js';
import type { INodeExecutor } from './interfaces-v2.js';

export class NodeExecutor implements INodeExecutor {
  public async executeNode(
    node: WorkflowNode,
    _context: Record<string, unknown>,
  ): Promise<unknown> {
    switch (node.config.type) {
      case 'tool':
        return this.executeToolNode(node, _context);
      case 'agent':
        return this.executeAgentNode(node, _context);
      case 'approval':
        return this.executeApprovalNode(node, _context);
      case 'parallel':
        return this.executeParallelNode(node, _context);
      case 'loop':
        return this.executeLoopNode(node, _context);
      case 'conditional':
        return this.executeConditionalNode(node, _context);
      case 'task':
        return {
          status: 'completed',
          type: 'task',
          goal: (node.config as { type: 'task'; goal: string }).goal,
        };
      default:
        return { status: 'completed', type: node.config.type };
    }
  }

  public async executeToolNode(
    node: WorkflowNode,
    _context: Record<string, unknown>,
  ): Promise<unknown> {
    const config = node.config as {
      type: 'tool';
      toolName: string;
      category: string;
      arguments: Record<string, unknown>;
    };
    return {
      status: 'completed',
      type: 'tool',
      toolName: config.toolName,
      category: config.category,
      result: { success: true, output: `Tool ${config.toolName} executed successfully` },
    };
  }

  public async executeAgentNode(
    node: WorkflowNode,
    _context: Record<string, unknown>,
  ): Promise<unknown> {
    const config = node.config as {
      type: 'agent';
      role: string;
      goal: string;
      context?: Record<string, unknown>;
    };
    return {
      status: 'completed',
      type: 'agent',
      role: config.role,
      goal: config.goal,
      result: { output: `Agent ${config.role} completed goal: ${config.goal}` },
    };
  }

  public async executeApprovalNode(
    node: WorkflowNode,
    _context: Record<string, unknown>,
  ): Promise<unknown> {
    const config = node.config as { type: 'approval'; riskScore: number; approvers?: string[] };
    return {
      status: 'completed',
      type: 'approval',
      riskScore: config.riskScore,
      result: { approved: true, approver: 'system' },
    };
  }

  public async executeParallelNode(
    node: WorkflowNode,
    _context: Record<string, unknown>,
  ): Promise<unknown> {
    const config = node.config as { type: 'parallel'; branches: string[] };
    const results: unknown[] = [];
    for (const branchId of config.branches) {
      results.push({ branchId, status: 'completed' });
    }
    return { status: 'completed', type: 'parallel', branches: config.branches, results };
  }

  public async executeLoopNode(
    node: WorkflowNode,
    _context: Record<string, unknown>,
  ): Promise<unknown> {
    const config = node.config as {
      type: 'loop';
      iterator: string;
      maxIterations: number;
      body: string[];
    };
    const iterations: unknown[] = [];
    for (let i = 0; i < Math.min(config.maxIterations, 10); i++) {
      iterations.push({ iteration: i, status: 'completed' });
    }
    return { status: 'completed', type: 'loop', iterations: iterations.length };
  }

  public async executeConditionalNode(
    node: WorkflowNode,
    _context: Record<string, unknown>,
  ): Promise<unknown> {
    const config = node.config as {
      type: 'conditional';
      condition: string;
      trueBranch: string;
      falseBranch: string;
    };
    return {
      status: 'completed',
      type: 'conditional',
      condition: config.condition,
      selectedBranch: config.trueBranch,
    };
  }
}
