import type { AuthService, JWTPayload } from '@agent-xai/auth';

export interface AuthMiddlewareOptions {
  authService: AuthService;
  publicPaths?: string[];
}

export function createAuthMiddleware(options: AuthMiddlewareOptions) {
  const { authService, publicPaths = ['/api/v1/auth/login', '/api/v1/auth/register', '/health'] } =
    options;

  return async function authMiddleware(req: {
    url?: string;
    headers: Record<string, string | undefined>;
  }): Promise<JWTPayload | null> {
    const path = req.url || '/';

    // Skip auth for public paths
    if (publicPaths.some((p) => path.startsWith(p))) {
      return null;
    }

    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Missing or invalid Authorization header');
    }

    const token = authHeader.slice(7);
    return authService.validateToken(token);
  };
}
