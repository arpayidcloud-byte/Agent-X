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

function getPermissionsForRole(role: RBACRole): string[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export interface RBACIdentity {
  readonly id: string;
  readonly email: string;
  readonly roles: RBACRole[];
}

export interface RBACContext {
  readonly identity: RBACIdentity;
  readonly resource: string;
  readonly action: string;
}

export interface RBACDecision {
  readonly allowed: boolean;
  readonly reason: string;
  readonly permissions: string[];
}

export class RBACProvider {
  private rolePermissions: Map<RBACRole, string[]> = new Map();

  constructor() {
    this.initializeDefaultRoles();
  }

  private initializeDefaultRoles(): void {
    const roles = Object.values(RBACRole);
    for (const role of roles) {
      const permissions = getPermissionsForRole(role);
      this.rolePermissions.set(role, permissions);
    }
  }

  async checkPermission(
    identity: RBACIdentity,
    resource: string,
    action: string,
  ): Promise<RBACDecision> {
    const permission = `${resource}.${action}`;
    const allPermissions = this.getAllPermissions(identity);
    const allowed = allPermissions.includes(permission);

    return {
      allowed,
      reason: allowed
        ? `Permission granted via role`
        : `Permission '${permission}' not found in roles: ${identity.roles.join(', ')}`,
      permissions: allPermissions,
    };
  }

  async hasRole(identity: RBACIdentity, role: string): Promise<boolean> {
    const targetRole = role.toUpperCase() as RBACRole;
    return identity.roles.includes(targetRole);
  }

  async getPermissions(identity: RBACIdentity): Promise<string[]> {
    return this.getAllPermissions(identity);
  }

  private getAllPermissions(identity: RBACIdentity): string[] {
    const permissions = new Set<string>();

    for (const role of identity.roles) {
      const rolePerms = this.rolePermissions.get(role) || [];
      for (const perm of rolePerms) {
        permissions.add(perm);
      }
    }

    return Array.from(permissions);
  }

  async assignRole(identity: RBACIdentity, role: RBACRole): Promise<RBACIdentity> {
    if (!identity.roles.includes(role)) {
      return {
        ...identity,
        roles: [...identity.roles, role],
      };
    }
    return identity;
  }

  async revokeRole(identity: RBACIdentity, role: RBACRole): Promise<RBACIdentity> {
    return {
      ...identity,
      roles: identity.roles.filter((r) => r !== role),
    };
  }
}

export function createRBACMiddleware(rbacProvider: RBACProvider) {
  return async function rbacMiddleware(
    identity: RBACIdentity,
    resource: string,
    action: string,
  ): Promise<boolean> {
    const decision = await rbacProvider.checkPermission(identity, resource, action);
    return decision.allowed;
  };
}
