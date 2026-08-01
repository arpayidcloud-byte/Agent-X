import { PrismaClient } from '@prisma/client';

let client: PrismaClient | null = null;
let unavailable = false;

/**
 * Lazily create the PrismaClient. Returns null when DATABASE_URL is unset
 * or the client could not be constructed (graceful degradation to in-memory).
 */
export function getPrisma(): PrismaClient | null {
  if (unavailable) return null;
  if (!process.env.DATABASE_URL) return null;
  if (!client) {
    try {
      client = new PrismaClient();
    } catch {
      unavailable = true;
      return null;
    }
  }
  return client;
}

/** Probe connectivity. Marks the client unavailable on failure. */
export async function dbReady(): Promise<boolean> {
  const db = getPrisma();
  if (!db) return false;
  try {
    await db.$queryRaw`SELECT 1`;
    return true;
  } catch {
    unavailable = true;
    client = null;
    return false;
  }
}

export async function disconnectDb(): Promise<void> {
  if (client) {
    await client.$disconnect().catch(() => undefined);
    client = null;
    unavailable = false;
  }
}
