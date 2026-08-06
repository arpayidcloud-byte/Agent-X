import type { AuthenticatedRequest } from './auth.js';

/**
 * Role-Based Access Control (RBAC) middleware factory.
 *
 * Usage:
 *   app.get('/v1/admin/users', requireRole('admin'), handler);
 *   app.get('/v1/projects', requireRole('admin', 'viewer'), handler);
 */

export type NextFunction = (err?: Error) => void;
export type Response = { status: (code: number) => { json: (data: unknown) => void } };

/**
 * Create middleware that requires one of the specified roles.
 * If no roles are specified, requires 'admin'.
 */
export function requireRole(...requiredRoles: string[]) {
  const roles = requiredRoles.length > 0 ? requiredRoles : ['admin'];

  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const userRoles = req.auth?.roles || [];
    const hasRole = roles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      res.status(403).json({
        error: `Required role: ${roles.join(' or ')}`,
        currentRoles: userRoles,
      });
      return;
    }

    next();
  };
}

/**
 * Check if a user has a specific role.
 */
export function hasRole(userRoles: string[], role: string): boolean {
  return userRoles.includes(role);
}

/**
 * Check if a user has any of the specified roles.
 */
export function hasAnyRole(userRoles: string[], ...roles: string[]): boolean {
  return roles.some((role) => userRoles.includes(role));
}

/**
 * Role hierarchy — higher roles inherit lower permissions.
 */
const ROLE_HIERARCHY: Record<string, string[]> = {
  super_admin: ['admin', 'editor', 'viewer'],
  admin: ['editor', 'viewer'],
  editor: ['viewer'],
  viewer: [],
};

/**
 * Check if a role has permission (with hierarchy).
 */
export function roleHasPermission(role: string, requiredRole: string): boolean {
  if (role === requiredRole) return true;
  const inherited = ROLE_HIERARCHY[role] || [];
  return inherited.includes(requiredRole);
}

/**
 * Get all roles a user effectively has (including inherited).
 */
export function getEffectiveRoles(roles: string[]): string[] {
  const effective = new Set(roles);
  for (const role of roles) {
    const inherited = ROLE_HIERARCHY[role] || [];
    for (const r of inherited) effective.add(r);
  }
  return Array.from(effective);
}
