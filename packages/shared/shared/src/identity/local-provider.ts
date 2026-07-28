import type { Identity, IdentityProvider, Session } from './interfaces.js';
import { createHash, randomUUID } from 'crypto';

interface LocalUser {
  id: string;
  displayName: string;
  email?: string;
  passwordHash: string;
  roles: string[];
  status: 'active' | 'expired' | 'revoked';
  createdAt: Date;
  metadata: Record<string, unknown>;
}

export class LocalIdentityProvider implements IdentityProvider {
  readonly authMode = 'local' as const;

  private users = new Map<string, LocalUser>();
  private sessions = new Map<string, { identityId: string; expiresAt: Date }>();
  private sessionTtlMs: number;

  constructor(opts?: { sessionTtlMs?: number }) {
    this.sessionTtlMs = opts?.sessionTtlMs ?? 3600_000; // 1 hour default
  }

  async authenticate(credentials: Record<string, unknown>): Promise<Identity> {
    const email = credentials.email as string | undefined;
    const password = credentials.password as string | undefined;

    if (!email || !password) {
      throw new Error('LocalIdentityProvider requires email and password');
    }

    const user = Array.from(this.users.values()).find((u) => u.email === email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const hash = createHash('sha256').update(password).digest('hex');
    if (hash !== user.passwordHash) {
      throw new Error('Invalid credentials');
    }

    if (user.status !== 'active') {
      throw new Error(`Identity ${user.id} is ${user.status}`);
    }

    return this.toIdentity(user);
  }

  async validateToken(token: string): Promise<Identity | null> {
    const session = this.sessions.get(token);
    if (!session) return null;

    if (session.expiresAt < new Date()) {
      this.sessions.delete(token);
      return null;
    }

    const user = this.users.get(session.identityId);
    if (!user || user.status !== 'active') return null;

    return this.toIdentity(user);
  }

  async revoke(identityId: string): Promise<void> {
    const user = this.users.get(identityId);
    if (user) {
      user.status = 'revoked';
    }

    for (const [token, session] of this.sessions.entries() as IterableIterator<
      [string, { identityId: string; expiresAt: Date }]
    >) {
      if (session.identityId === identityId) {
        this.sessions.delete(token as string);
      }
    }
  }

  async refresh(identityId: string): Promise<Session> {
    const user = this.users.get(identityId);
    if (!user) throw new Error(`Identity not found: ${identityId}`);
    if (user.status !== 'active') throw new Error(`Identity ${identityId} is ${user.status}`);

    const token = randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.sessionTtlMs);

    this.sessions.set(token, { identityId, expiresAt });

    return {
      sessionId: randomUUID(),
      identityId,
      token,
      createdAt: now,
      expiresAt,
      metadata: {},
    };
  }

  registerUser(
    email: string,
    password: string,
    displayName: string,
    roles: string[] = ['developer'],
  ): Identity {
    const id = randomUUID();
    const passwordHash = createHash('sha256').update(password).digest('hex');
    const now = new Date();

    const user: LocalUser = {
      id,
      displayName,
      email,
      passwordHash,
      roles,
      status: 'active',
      createdAt: now,
      metadata: {},
    };

    this.users.set(id, user);
    return this.toIdentity(user);
  }

  private toIdentity(user: LocalUser): Identity {
    return {
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      roles: [...user.roles],
      authMode: 'local',
      status: user.status,
      createdAt: user.createdAt,
      metadata: { ...user.metadata },
    };
  }
}
