import { createHash } from 'crypto';

export interface AuthToken {
  readonly tokenId: string;
  readonly subject: string;
  readonly roles: readonly string[];
  readonly expiresAt: Date;
  readonly checksum: string;
}

export class AuthenticationManager {
  private tokens = new Map<string, AuthToken>();

  issue(subject: string, roles: string[], ttlMs: number = 3600000): AuthToken {
    const tokenId = `auth-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const expiresAt = new Date(Date.now() + ttlMs);
    const checksum = createHash('sha256')
      .update(JSON.stringify({ tokenId, subject, roles, expiresAt }))
      .digest('hex');
    const token: AuthToken = Object.freeze({
      tokenId,
      subject,
      roles: [...roles],
      expiresAt,
      checksum,
    });
    this.tokens.set(tokenId, token);
    return token;
  }

  validate(tokenId: string): boolean {
    const token = this.tokens.get(tokenId);
    if (!token) return false;
    return new Date() <= token.expiresAt;
  }

  revoke(tokenId: string): boolean {
    return this.tokens.delete(tokenId);
  }

  get(tokenId: string): AuthToken | undefined {
    return this.tokens.get(tokenId);
  }

  getAll(): AuthToken[] {
    return Array.from(this.tokens.values());
  }
}

export interface Permission {
  readonly permissionId: string;
  readonly role: string;
  readonly resource: string;
  readonly action: string;
  readonly checksum: string;
}

export class AuthorizationManager {
  private permissions = new Map<string, Permission>();

  grant(role: string, resource: string, action: string): Permission {
    const permissionId = `perm-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ permissionId, role, resource, action }))
      .digest('hex');
    const perm: Permission = Object.freeze({ permissionId, role, resource, action, checksum });
    this.permissions.set(permissionId, perm);
    return perm;
  }

  check(role: string, resource: string, action: string): boolean {
    for (const perm of this.permissions.values()) {
      if (perm.role === role && perm.resource === resource && perm.action === action) return true;
    }
    return false;
  }

  revoke(permissionId: string): boolean {
    return this.permissions.delete(permissionId);
  }

  getAll(): Permission[] {
    return Array.from(this.permissions.values());
  }
}

export interface RBACRule {
  readonly ruleId: string;
  readonly role: string;
  readonly permissions: readonly string[];
  readonly checksum: string;
}

export class RBACEngine {
  private rules = new Map<string, RBACRule>();

  addRole(role: string, permissions: string[]): RBACRule {
    const ruleId = `rbac-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ ruleId, role, permissions }))
      .digest('hex');
    const rule: RBACRule = Object.freeze({ ruleId, role, permissions: [...permissions], checksum });
    this.rules.set(ruleId, rule);
    return rule;
  }

  hasPermission(role: string, permission: string): boolean {
    for (const rule of this.rules.values()) {
      if (rule.role === role && rule.permissions.includes(permission)) return true;
    }
    return false;
  }

  getRoles(): string[] {
    return [...new Set(Array.from(this.rules.values()).map((r) => r.role))];
  }

  getAll(): RBACRule[] {
    return Array.from(this.rules.values());
  }
}

export interface APIKey {
  readonly keyId: string;
  readonly key: string;
  readonly tenantId: string;
  readonly createdAt: Date;
  readonly expiresAt: Date;
  readonly checksum: string;
}

export class APIKeyManager {
  private keys = new Map<string, APIKey>();

  create(tenantId: string, ttlMs: number = 86400000): APIKey {
    const keyId = `ak-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const key = `key-${Date.now()}-${Math.random().toString(36).substring(2, 14)}`;
    const expiresAt = new Date(Date.now() + ttlMs);
    const checksum = createHash('sha256')
      .update(JSON.stringify({ keyId, key, tenantId, expiresAt }))
      .digest('hex');
    const apiKey: APIKey = Object.freeze({
      keyId,
      key,
      tenantId,
      createdAt: new Date(),
      expiresAt,
      checksum,
    });
    this.keys.set(keyId, apiKey);
    return apiKey;
  }

  validate(keyId: string): boolean {
    const apiKey = this.keys.get(keyId);
    if (!apiKey) return false;
    return new Date() <= apiKey.expiresAt;
  }

  revoke(keyId: string): boolean {
    return this.keys.delete(keyId);
  }

  getByTenant(tenantId: string): APIKey[] {
    return Array.from(this.keys.values()).filter((k) => k.tenantId === tenantId);
  }

  getAll(): APIKey[] {
    return Array.from(this.keys.values());
  }
}

export interface TokenEntry {
  readonly tokenId: string;
  readonly type: string;
  readonly subject: string;
  readonly issuedAt: Date;
  readonly expiresAt: Date;
  readonly checksum: string;
}

export class TokenManager {
  private tokens = new Map<string, TokenEntry>();

  issue(type: string, subject: string, ttlMs: number = 3600000): TokenEntry {
    const tokenId = `tok-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlMs);
    const checksum = createHash('sha256')
      .update(JSON.stringify({ tokenId, type, subject, expiresAt }))
      .digest('hex');
    const token: TokenEntry = Object.freeze({
      tokenId,
      type,
      subject,
      issuedAt: now,
      expiresAt,
      checksum,
    });
    this.tokens.set(tokenId, token);
    return token;
  }

  validate(tokenId: string): boolean {
    const token = this.tokens.get(tokenId);
    if (!token) return false;
    return new Date() <= token.expiresAt;
  }

  revoke(tokenId: string): boolean {
    return this.tokens.delete(tokenId);
  }

  getAll(): TokenEntry[] {
    return Array.from(this.tokens.values());
  }
}

export interface RotationEntry {
  readonly rotationId: string;
  readonly secretKey: string;
  readonly rotatedAt: Date;
  readonly checksum: string;
}

export class SecretRotation {
  private rotations: RotationEntry[] = [];

  rotate(secretKey: string): RotationEntry {
    const rotationId = `rot-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ rotationId, secretKey }))
      .digest('hex');
    const entry: RotationEntry = Object.freeze({
      rotationId,
      secretKey,
      rotatedAt: new Date(),
      checksum,
    });
    this.rotations.push(entry);
    return entry;
  }

  getRotations(secretKey: string): RotationEntry[] {
    return this.rotations.filter((r) => r.secretKey === secretKey);
  }

  getAll(): RotationEntry[] {
    return [...this.rotations];
  }
}

export interface AuditLogEntry {
  readonly logId: string;
  readonly actor: string;
  readonly action: string;
  readonly resource: string;
  readonly timestamp: Date;
  readonly checksum: string;
}

export class AuditLogging {
  private entries: AuditLogEntry[] = [];

  log(actor: string, action: string, resource: string): AuditLogEntry {
    const logId = `alog-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ logId, actor, action, resource }))
      .digest('hex');
    const entry: AuditLogEntry = Object.freeze({
      logId,
      actor,
      action,
      resource,
      timestamp: new Date(),
      checksum,
    });
    this.entries.push(entry);
    return entry;
  }

  query(actor?: string, action?: string): AuditLogEntry[] {
    return this.entries.filter(
      (e) => (!actor || e.actor === actor) && (!action || e.action === action),
    );
  }

  getAll(): AuditLogEntry[] {
    return [...this.entries];
  }
}
