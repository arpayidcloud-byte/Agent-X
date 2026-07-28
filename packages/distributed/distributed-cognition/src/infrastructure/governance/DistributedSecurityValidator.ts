import { createHash } from 'crypto';

export interface SecurityToken {
  readonly tokenId: string;
  readonly nodeId: string;
  readonly permissions: readonly string[];
  readonly issuedAt: Date;
  readonly expiresAt: Date;
  readonly checksum: string;
}

export class DistributedSecurityValidator {
  private tokens = new Map<string, SecurityToken>();

  issueToken(nodeId: string, permissions: string[], ttlMs: number = 3600000): SecurityToken {
    const tokenId = `st-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlMs);
    const checksum = createHash('sha256')
      .update(JSON.stringify({ tokenId, nodeId, permissions, expiresAt }))
      .digest('hex');
    const token: SecurityToken = Object.freeze({
      tokenId,
      nodeId,
      permissions: [...permissions],
      issuedAt: now,
      expiresAt,
      checksum,
    });
    this.tokens.set(tokenId, token);
    return token;
  }

  validateToken(tokenId: string): boolean {
    const token = this.tokens.get(tokenId);
    if (!token) return false;
    if (new Date() > token.expiresAt) return false;
    const computed = createHash('sha256')
      .update(
        JSON.stringify({
          tokenId: token.tokenId,
          nodeId: token.nodeId,
          permissions: token.permissions,
          expiresAt: token.expiresAt,
        }),
      )
      .digest('hex');
    return computed === token.checksum;
  }

  hasPermission(tokenId: string, permission: string): boolean {
    const token = this.tokens.get(tokenId);
    if (!token || !this.validateToken(tokenId)) return false;
    return token.permissions.includes(permission);
  }

  revokeToken(tokenId: string): boolean {
    return this.tokens.delete(tokenId);
  }

  getToken(tokenId: string): SecurityToken | undefined {
    return this.tokens.get(tokenId);
  }

  getTokensByNode(nodeId: string): SecurityToken[] {
    return Array.from(this.tokens.values()).filter((t) => t.nodeId === nodeId);
  }
}
