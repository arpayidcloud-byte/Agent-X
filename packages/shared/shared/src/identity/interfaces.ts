export type AuthMode = 'local' | 'token' | 'sso';

export type IdentityStatus = 'active' | 'expired' | 'revoked';

export interface Identity {
  readonly id: string;
  readonly displayName: string;
  readonly email?: string;
  readonly roles: string[];
  readonly authMode: AuthMode;
  readonly status: IdentityStatus;
  readonly createdAt: Date;
  readonly expiresAt?: Date;
  readonly metadata: Record<string, unknown>;
}

export interface Session {
  readonly sessionId: string;
  readonly identityId: string;
  readonly token: string;
  readonly createdAt: Date;
  readonly expiresAt: Date;
  readonly metadata: Record<string, unknown>;
}

export interface IdentityProvider {
  readonly authMode: AuthMode;
  authenticate(credentials: Record<string, unknown>): Promise<Identity>;
  validateToken(token: string): Promise<Identity | null>;
  revoke(identityId: string): Promise<void>;
  refresh(identityId: string): Promise<Session>;
}

export interface IdentityToRBACBridge {
  getPermissions(identity: Identity): Promise<string[]>;
  hasRole(identity: Identity, role: string): Promise<boolean>;
}

export {
  RBACProvider,
  RBACIdentity,
  RBACContext,
  RBACDecision,
  createRBACMiddleware,
} from './rbac-provider.js';
export {
  RateLimiter,
  RateLimitConfig,
  RateLimitInfo,
  RateLimitResult,
} from '../security/rate-limiter.js';
