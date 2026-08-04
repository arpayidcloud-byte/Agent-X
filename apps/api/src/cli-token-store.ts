// CLI sync tokens — used by `agentx config pull` to fetch provider config.
//
// Only the SHA-256 hash of the token is persisted (Prisma/Postgres when
// DATABASE_URL is set, in-memory otherwise). The plaintext token is returned
// exactly once at creation time, so the panel can show it for copy/paste.

import { createHash, randomBytes } from 'node:crypto';
import { getPrisma } from '@agent-xai/persistence';

export interface CliTokenView {
  id: string;
  name: string;
  createdAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
}

interface CliTokenRow {
  id: string;
  name: string;
  createdAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
}

function db(): ReturnType<typeof getPrisma> {
  return getPrisma();
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function generateCliTokenRaw(): string {
  // 32 random bytes → 43-char base64url; prefix makes it greppable in logs.
  return `agxt_${randomBytes(32).toString('base64url')}`;
}

function mapRow(r: {
  id: string;
  name: string;
  createdAt: Date | string;
  lastUsedAt: Date | string | null;
  revokedAt: Date | string | null;
}): CliTokenRow {
  return {
    id: r.id,
    name: r.name,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
    lastUsedAt: r.lastUsedAt
      ? r.lastUsedAt instanceof Date
        ? r.lastUsedAt.toISOString()
        : String(r.lastUsedAt)
      : null,
    revokedAt: r.revokedAt
      ? r.revokedAt instanceof Date
        ? r.revokedAt.toISOString()
        : String(r.revokedAt)
      : null,
  };
}

// ─── In-memory fallback (tests / no DATABASE_URL) ────
const memoryTokens = new Map<string, CliTokenRow>(); // id → row
const memoryHashIndex = new Map<string, string>(); // tokenHash → id
let memorySeq = 0;

// ─── API ────

/** Active (non-revoked) token, if any. */
export async function activeCliToken(): Promise<CliTokenRow | null> {
  const prisma = db();
  if (prisma) {
    const r = await prisma.cliToken.findFirst({
      where: { revokedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    return r ? mapRow(r) : null;
  }
  const active = [...memoryTokens.values()]
    .filter((t) => !t.revokedAt)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return active[0] ?? null;
}

/** Create a token; returns the plaintext once. */
export async function createCliToken(
  name = 'default',
): Promise<{ token: string; view: CliTokenView }> {
  const token = generateCliTokenRaw();
  const hash = hashToken(token);
  const prisma = db();
  if (prisma) {
    // Revoke any existing active token first (single active token policy).
    await prisma.cliToken.updateMany({
      where: { revokedAt: null },
      data: { revokedAt: new Date() },
    });
    const r = await prisma.cliToken.create({
      data: { tokenHash: hash, name },
    });
    return { token, view: mapRow(r) };
  }
  const id = `cli-${++memorySeq}`;
  const now = new Date().toISOString();
  for (const t of memoryTokens.values()) if (!t.revokedAt) t.revokedAt = now;
  const row: CliTokenRow = { id, name, createdAt: now, lastUsedAt: null, revokedAt: null };
  memoryTokens.set(id, row);
  memoryHashIndex.set(hash, id);
  return { token, view: row };
}

/** Revoke the active token (idempotent). */
export async function revokeCliToken(): Promise<void> {
  const prisma = db();
  if (prisma) {
    await prisma.cliToken.updateMany({
      where: { revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return;
  }
  for (const t of memoryTokens.values()) if (!t.revokedAt) t.revokedAt = new Date().toISOString();
}

/** Validate a bearer token; bumps lastUsedAt on success. Returns the row. */
export async function validateCliToken(token: string): Promise<CliTokenRow | null> {
  const hash = hashToken(token);
  const prisma = db();
  if (prisma) {
    const r = await prisma.cliToken.findUnique({ where: { tokenHash: hash } });
    if (!r || r.revokedAt) return null;
    await prisma.cliToken.update({
      where: { id: r.id },
      data: { lastUsedAt: new Date() },
    });
    return mapRow({ ...r, lastUsedAt: new Date() });
  }
  const row = memoryHashIndex.has(hash)
    ? (memoryTokens.get(memoryHashIndex.get(hash)!) ?? null)
    : null;
  if (!row || row.revokedAt) return null;
  row.lastUsedAt = new Date().toISOString();
  return row;
}
