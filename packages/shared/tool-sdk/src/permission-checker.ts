// packages/shared/tool-sdk/src/permission-checker.ts
import type { AgentRole, ToolCategory } from './interfaces.js';

// Allowed tool categories per agent role (Volume 3, Ch. 2)
const ROLE_PERMISSIONS: Record<AgentRole, ToolCategory[]> = {
  coding: ['fs.read', 'fs.write', 'shell.build'],
  review: ['fs.read', 'git.read'],
  test: ['fs.read', 'fs.write', 'shell.build'],
  security: ['fs.read', 'git.read'],
};

export class PermissionCheckerImpl {
  isAllowed(agentRole: AgentRole, category: ToolCategory): boolean {
    const allowed = ROLE_PERMISSIONS[agentRole] || [];
    return allowed.includes(category);
  }
}
