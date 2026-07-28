import type { FastifyRequest, FastifyReply } from 'fastify';

// Permission string literal type
export type Permission =
  | 'task.create'
  | 'task.read'
  | 'task.write'
  | 'task.delete'
  | 'task.execute'
  | 'task.approve'
  | 'task.reject'
  | 'graph.create'
  | 'graph.read'
  | 'graph.write'
  | 'graph.delete'
  | 'plugin.install'
  | 'plugin.enable'
  | 'plugin.disable'
  | 'plugin.list'
  | 'audit.read'
  | 'cost.read'
  | 'admin.users'
  | 'admin.settings'
  | 'admin.billing';

export const RBACRole = {
  OWNER: 'owner',
  DEVELOPER: 'developer',
  VIEWER: 'viewer',
} as const;

export type Role = (typeof RBACRole)[keyof typeof RBACRole];

const ROLE_PERMISSIONS: Record<string, Permission[]> = {
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

const MINIMUM_ROLE_LEVEL: Record<string, number> = {
  [RBACRole.VIEWER]: 0,
  [RBACRole.DEVELOPER]: 1,
  [RBACRole.OWNER]: 2,
};

const VALID_ROLES = new Set([RBACRole.OWNER, RBACRole.DEVELOPER, RBACRole.VIEWER]);

function hasPermission(role: Role, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role] ?? [];
  return permissions.includes(permission as Permission);
}

function getUserRole(userMetadata: Record<string, unknown> | undefined): Role {
  if (!userMetadata) {
    return RBACRole.VIEWER as Role;
  }

  const role = userMetadata.role as string | undefined;
  if (role && VALID_ROLES.has(role as Role)) {
    return role as Role;
  }

  return RBACRole.VIEWER as Role;
}

export const RATE_LIMITS: Record<Role, number> = {
  [RBACRole.OWNER]: 1000,
  [RBACRole.DEVELOPER]: 500,
  [RBACRole.VIEWER]: 200,
};

export const DEFAULT_RATE_LIMIT = 100;

export function getRoleLimit(role: Role): number {
  return RATE_LIMITS[role] ?? DEFAULT_RATE_LIMIT;
}

export function createRBACMiddleware() {
  const logger = {
    warn: (msg: string, meta?: Record<string, unknown>) => {
      // Intentionally no console.log — will be wired to fastify logger in index.ts
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn(`[RBAC] ${msg}`, meta ? meta : '');
      }
    },
  };

  return {
    check(requiredPermission: Permission) {
      return async (request: FastifyRequest, reply: FastifyReply) => {
        const userMetadata = request.userMetadata as Record<string, unknown> | undefined;
        const role = getUserRole(userMetadata);

        if (!hasPermission(role, requiredPermission)) {
          logger.warn('Permission denied', {
            path: request.url,
            role,
            requiredPermission,
            ip: request.ip,
          });
          void reply.code(403).send({
            error: 'Forbidden',
            message: `Insufficient permissions. Required: ${requiredPermission}`,
          });
          return;
        }
      };
    },

    checkMinRole(minimumRole: Role) {
      const minLevel = MINIMUM_ROLE_LEVEL[minimumRole] ?? 0;
      return async (request: FastifyRequest, reply: FastifyReply) => {
        const userMetadata = request.userMetadata as Record<string, unknown> | undefined;
        const role = getUserRole(userMetadata);
        const userLevel = MINIMUM_ROLE_LEVEL[role] ?? 0;

        if (userLevel < minLevel) {
          logger.warn('Role too low', {
            path: request.url,
            role,
            requiredRole: minimumRole,
            ip: request.ip,
          });
          void reply.code(403).send({
            error: 'Forbidden',
            message: `Minimum role required: ${minimumRole}`,
          });
          return;
        }
      };
    },
  };
}
