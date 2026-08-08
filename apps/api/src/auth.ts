import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { PrismaUserRepository, dbReady, getPrisma } from '@agent-xai/persistence';
import type { UserRecord } from '@agent-xai/persistence';
import { Logger } from '@agent-xai/observability';

const logger = new Logger('agentx-api:auth');

export interface AuthUser {
  id: string;
  email: string;
  roles: string[];
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JWTPayload {
  sub: string;
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

// ─── Config ────
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const ACCESS_TOKEN_TTL = 3600; // seconds (1 hour)
const REFRESH_TOKEN_TTL_MS = 86_400_000; // 24 hours
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

// AUTH_ENABLED gates the admin endpoints (GET waitlist, PATCH status, GET feedback).
// When off (default, and in tests) admin endpoints are open for backwards
// compatibility; when on, they require a Bearer token with role 'admin'.
export const AUTH_ENABLED = process.env.AUTH_ENABLED === 'true';

// ─── User storage (memory fallback, Prisma when DB reachable) ────
const userStore = new Map<string, UserRecord>();
const refreshTokens = new Map<string, { userId: string; expiresAt: Date }>();
// One-time password reset tokens (30 min TTL), like refreshTokens.
const passwordResetTokens = new Map<string, { userId: string; expiresAt: Date }>();
const PASSWORD_RESET_TTL_MS = 30 * 60 * 1000; // 30 minutes

interface UserBackend {
  create(record: {
    id: string;
    email: string;
    passwordHash: string;
    roles: string[];
  }): Promise<UserRecord>;
  findByEmail(email: string): Promise<UserRecord | undefined>;
  findById(id: string): Promise<UserRecord | undefined>;
  list(): Promise<UserRecord[]>;
  updatePassword(id: string, passwordHash: string): Promise<void>;
  deleteUser(id: string): Promise<boolean>;
  updateUserRoles(id: string, roles: string[]): Promise<UserRecord | undefined>;
}

const memoryUserBackend: UserBackend = {
  async create(record) {
    const user: UserRecord = { ...record, createdAt: new Date().toISOString() };
    userStore.set(user.id, user);
    return user;
  },
  async findByEmail(email) {
    return [...userStore.values()].find((u) => u.email === email);
  },
  async findById(id) {
    return userStore.get(id);
  },
  async list() {
    return [...userStore.values()];
  },
  async updatePassword(id, passwordHash) {
    const user = userStore.get(id);
    if (user) user.passwordHash = passwordHash;
  },
  async deleteUser(id) {
    return userStore.delete(id);
  },
  async updateUserRoles(id, roles) {
    const user = userStore.get(id);
    if (user) {
      user.roles = roles;
      return user;
    }
    return undefined;
  },
};

function prismaUserBackend(prisma: NonNullable<ReturnType<typeof getPrisma>>): UserBackend {
  const repo = new PrismaUserRepository(prisma);
  return {
    async create(record) {
      return repo.create(record);
    },
    async findByEmail(email) {
      return repo.findByEmail(email);
    },
    async findById(id) {
      return repo.findById(id);
    },
    async list() {
      return repo.findAll();
    },
    async updatePassword(id, passwordHash) {
      await repo.updatePassword(id, passwordHash);
    },
    async deleteUser(id) {
      try {
        await repo.delete(id);
        return true;
      } catch {
        return false;
      }
    },
    async updateUserRoles(id, roles) {
      try {
        return await repo.update(id, { roles });
      } catch {
        return undefined;
      }
    },
  };
}

let userBackendPromise: Promise<UserBackend> | null = null;

export function getUserBackend(): Promise<UserBackend> {
  if (userBackendPromise === null) {
    userBackendPromise = (async () => {
      if (await dbReady()) {
        const prisma = getPrisma();
        if (prisma) return prismaUserBackend(prisma);
      }
      return memoryUserBackend;
    })();
  }
  return userBackendPromise;
}

// ─── Core auth operations ────
export class AuthError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

function toAuthUser(user: UserRecord): AuthUser {
  const { passwordHash: _, ...rest } = user;
  return rest;
}

export function rolesFor(email: string): string[] {
  return ADMIN_EMAILS.includes(email.toLowerCase()) ? ['admin', 'user'] : ['user'];
}

export async function register(
  email: string,
  password: string,
): Promise<{ user: AuthUser; tokens: AuthTokens }> {
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AuthError('Missing or invalid field: email', 400);
  }
  if (!password || typeof password !== 'string' || password.length < 8) {
    throw new AuthError('Missing or invalid field: password (min 8 chars)', 400);
  }
  const normalized = email.trim().toLowerCase();
  const backend = await getUserBackend();
  const existing = await backend.findByEmail(normalized);
  if (existing) {
    throw new AuthError('Email already registered', 409);
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await backend.create({
    id: uuidv4(),
    email: normalized,
    passwordHash,
    roles: rolesFor(normalized),
  });
  logger.info('User registered', { email: normalized, roles: user.roles });
  return { user: toAuthUser(user), tokens: issueTokens(user) };
}

export async function login(
  email: string,
  password: string,
): Promise<{ user: AuthUser; tokens: AuthTokens }> {
  if (!email || !password) {
    throw new AuthError('Missing email or password', 400);
  }
  const backend = await getUserBackend();
  const user = await backend.findByEmail(email.trim().toLowerCase());
  if (!user) {
    throw new AuthError('Invalid credentials', 401);
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new AuthError('Invalid credentials', 401);
  }
  logger.info('User logged in', { email: user.email });
  return { user: toAuthUser(user), tokens: issueTokens(user) };
}

export async function refresh(refreshToken: string): Promise<AuthTokens> {
  const tokenData = refreshTokens.get(refreshToken);
  if (!tokenData || new Date() > tokenData.expiresAt) {
    throw new AuthError('Invalid or expired refresh token', 401);
  }
  const backend = await getUserBackend();
  const user = await backend.findById(tokenData.userId);
  if (!user) {
    throw new AuthError('User not found', 401);
  }
  refreshTokens.delete(refreshToken);
  const tokens = issueTokens(user);
  return tokens;
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  if (!currentPassword || typeof currentPassword !== 'string') {
    throw new AuthError('Missing field: currentPassword', 400);
  }
  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
    throw new AuthError('Missing or invalid field: newPassword (min 8 chars)', 400);
  }
  const backend = await getUserBackend();
  const user = await backend.findById(userId);
  if (!user) {
    throw new AuthError('User not found', 401);
  }
  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    throw new AuthError('Invalid current password', 401);
  }
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await backend.updatePassword(user.id, passwordHash);
  logger.info('Password changed', { email: user.email });
}

/**
 * True when the account has a local password (vs. OAuth-only accounts that
 * were created with an empty hash).
 */
export function hasPassword(user: { passwordHash: string }): boolean {
  return user.passwordHash !== '';
}

/** Fetch a user by id with passwordHash included (auth internals only). */
export async function getUserById(userId: string): Promise<UserRecord | undefined> {
  const backend = await getUserBackend();
  return backend.findById(userId);
}

/**
 * Set a first password for an account that has none (OAuth-created users).
 * Refuses when a password already exists — those must use changePassword.
 */
export async function setPassword(userId: string, newPassword: string): Promise<void> {
  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
    throw new AuthError('Invalid field: newPassword (min 8 chars)', 400);
  }
  const backend = await getUserBackend();
  const user = await backend.findById(userId);
  if (!user) {
    throw new AuthError('User not found', 401);
  }
  if (hasPassword(user)) {
    throw new AuthError('Account already has a password — use change-password instead', 409);
  }
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await backend.updatePassword(user.id, passwordHash);
  logger.info('Password set (OAuth account)', { email: user.email });
}

/**
 * Issue a one-time password reset token for an account, or null when the
 * email is unknown — the endpoint always answers 200 to avoid enumeration.
 */
export async function createPasswordResetToken(email: string): Promise<string | null> {
  const backend = await getUserBackend();
  const user = await backend.findByEmail(email.trim().toLowerCase());
  if (!user) return null;
  const token = uuidv4();
  passwordResetTokens.set(token, {
    userId: user.id,
    expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_MS),
  });
  logger.info('Password reset token issued', { email: user.email });
  return token;
}

/**
 * Consume a reset token and set a new password. One-time use: the token is
 * deleted regardless of whether the password update succeeds.
 */
export async function resetPasswordWithToken(token: string, newPassword: string): Promise<void> {
  if (!token || typeof token !== 'string') {
    throw new AuthError('Missing field: token', 400);
  }
  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
    throw new AuthError('Invalid field: newPassword (min 8 chars)', 400);
  }
  const entry = passwordResetTokens.get(token);
  if (!entry) {
    throw new AuthError('Invalid or expired reset token', 400);
  }
  passwordResetTokens.delete(token);
  if (Date.now() > entry.expiresAt.getTime()) {
    throw new AuthError('Invalid or expired reset token', 400);
  }
  const backend = await getUserBackend();
  const user = await backend.findById(entry.userId);
  if (!user) {
    throw new AuthError('User not found', 401);
  }
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await backend.updatePassword(user.id, passwordHash);
  logger.info('Password reset', { email: user.email });
}

/** Test hygiene: drop outstanding reset tokens. */
export function clearPasswordResetTokens(): void {
  passwordResetTokens.clear();
}

/** Delete a user by ID. Returns true if deleted. */
export async function deleteUser(userId: string): Promise<boolean> {
  const backend = await getUserBackend();
  return backend.deleteUser(userId);
}

/** Update a user's roles. Returns updated user (without password hash) or undefined. */
export async function updateUserRoles(
  userId: string,
  roles: string[],
): Promise<Omit<UserRecord, 'passwordHash'> | undefined> {
  const backend = await getUserBackend();
  const user = await backend.updateUserRoles(userId, roles);
  if (!user) return undefined;
  return { id: user.id, email: user.email, roles: user.roles, createdAt: user.createdAt };
}

/** All registered users (password hashes stripped) — for team management. */
export async function listUsers(): Promise<Array<Omit<UserRecord, 'passwordHash'>>> {
  const backend = await getUserBackend();
  const users = await backend.list();
  return users.map(({ passwordHash: _ph, ...rest }) => rest);
}

export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    throw new AuthError('Invalid or expired token', 401);
  }
}

export function issueTokens(user: UserRecord): AuthTokens {
  const accessToken = jwt.sign({ sub: user.id, email: user.email, roles: user.roles }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
  });
  const refreshToken = uuidv4();
  refreshTokens.set(refreshToken, {
    userId: user.id,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
  });
  return { accessToken, refreshToken, expiresIn: ACCESS_TOKEN_TTL };
}

// ─── Express middleware ────
import type { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  auth?: JWTPayload;
}

function bearerToken(req: Request): string | undefined {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return undefined;
  return header.slice(7);
}

/** Require a valid Bearer token. */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = bearerToken(req);
  if (!token) {
    res.status(401).json({ error: 'Missing Bearer token' });
    return;
  }
  try {
    req.auth = verifyToken(token);
    next();
  } catch (e) {
    res.status(401).json({ error: e instanceof AuthError ? e.message : 'Unauthorized' });
  }
}

/**
 * Admin guard for beta management endpoints. When AUTH_ENABLED is false
 * (default / tests) it passes through; when true it requires role 'admin'.
 */
export function maybeRequireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  if (!AUTH_ENABLED) {
    next();
    return;
  }
  const token = bearerToken(req);
  if (!token) {
    res.status(401).json({ error: 'Missing Bearer token' });
    return;
  }
  try {
    const payload = verifyToken(token);
    if (!payload.roles?.includes('admin')) {
      res.status(403).json({ error: 'Admin role required' });
      return;
    }
    req.auth = payload;
    next();
  } catch (e) {
    res.status(401).json({ error: e instanceof AuthError ? e.message : 'Unauthorized' });
  }
}
