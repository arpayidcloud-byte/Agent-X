// packages/shared/tool-sdk/src/interfaces.ts
import type { AgentRole } from '@agentx-fast/agent-platform';

export type { AgentRole };
export type ToolCategory =
  'fs.read' | 'fs.write' | 'shell.build' | 'shell.exec' | 'git.read' | 'git.write';

export interface ToolCallContext {
  agentRole: AgentRole;
  taskId: string;
  workingDirectory: string;
}

export interface ToolResult {
  success: boolean;
  output: string;
  error?: string;
}

export interface Tool {
  name: string;
  category: ToolCategory;
  isDestructive: boolean;
  execute(args: Record<string, unknown>, ctx: ToolCallContext): Promise<ToolResult>;
}

export interface PermissionChecker {
  isAllowed(agentRole: AgentRole, category: ToolCategory): boolean;
}

export interface ToolRegistry {
  register(tool: Tool): void;
  resolve(name: string, category: ToolCategory): Tool | undefined;
}
