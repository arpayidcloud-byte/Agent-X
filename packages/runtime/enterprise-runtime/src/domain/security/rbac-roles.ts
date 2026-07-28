export enum RBACRole {
  OWNER = 'owner',
  DEVELOPER = 'developer',
  VIEWER = 'viewer',
}

const ROLE_PERMISSIONS: Record<RBACRole, string[]> = {
  [RBACRole.OWNER]: [
    'task.create',
    'task.read',
    'task.write',
    'task.delete',
    'task.execute',
    'task.approve',
    'task.reject',
    'graph.create',
    'graph.read',
    'graph.write',
    'graph.delete',
    'plugin.install',
    'plugin.enable',
    'plugin.disable',
    'plugin.list',
    'audit.read',
    'cost.read',
    'admin.users',
    'admin.settings',
    'admin.billing',
  ],
  [RBACRole.DEVELOPER]: [
    'task.create',
    'task.read',
    'task.write',
    'task.execute',
    'graph.create',
    'graph.read',
    'graph.write',
    'plugin.list',
    'audit.read',
    'cost.read',
  ],
  [RBACRole.VIEWER]: ['task.read', 'graph.read', 'plugin.list', 'audit.read', 'cost.read'],
};

export function getPermissionsForRole(role: RBACRole): string[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function hasPermission(role: RBACRole, permission: string): boolean {
  return getPermissionsForRole(role).includes(permission);
}
