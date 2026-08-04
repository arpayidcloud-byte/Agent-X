// Combo provider groups — named sets of member providers resolved at request
// time by combo-router.ts (priority fallback or round-robin).
//
// Persisted in Postgres via Prisma when DATABASE_URL is set (prod), with an
// in-memory fallback for unit tests / local dev without a DB (same pattern as
// llm-provider-store.ts).

import { getPrisma } from '@agent-xai/persistence';

export type GroupStrategy = 'priority' | 'round-robin';

export interface ProviderGroupMember {
  provider: string;
}

export interface ProviderGroupRow {
  id: string;
  name: string;
  description: string | null;
  strategy: GroupStrategy;
  members: ProviderGroupMember[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── In-memory fallback ────
const memoryGroups = new Map<string, ProviderGroupRow>();
let memorySeq = 0;

function db(): ReturnType<typeof getPrisma> {
  return getPrisma();
}

function mapRow(r: {
  id: string;
  name: string;
  description: string | null;
  strategy: string;
  members: unknown;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}): ProviderGroupRow {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    strategy: (r.strategy as GroupStrategy) ?? 'priority',
    members: Array.isArray(r.members) ? (r.members as ProviderGroupMember[]) : [],
    enabled: r.enabled,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

export async function listGroups(): Promise<ProviderGroupRow[]> {
  const prisma = db();
  if (prisma) {
    const rows = await prisma.providerGroup.findMany({ orderBy: { name: 'asc' } });
    return rows.map(mapRow);
  }
  return [...memoryGroups.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export async function getGroup(name: string): Promise<ProviderGroupRow | null> {
  const prisma = db();
  if (prisma) {
    const r = await prisma.providerGroup.findUnique({ where: { name } });
    if (!r) return null;
    return mapRow(r);
  }
  return memoryGroups.get(name) ?? null;
}

export interface CreateGroupInput {
  name: string;
  description?: string | null;
  strategy?: GroupStrategy;
  members: ProviderGroupMember[];
  enabled?: boolean;
}

export async function createGroup(input: CreateGroupInput): Promise<ProviderGroupRow> {
  const prisma = db();
  if (prisma) {
    const r = await prisma.providerGroup.create({
      data: {
        name: input.name,
        description: input.description ?? null,
        strategy: input.strategy ?? 'priority',
        members: input.members as unknown as object,
        enabled: input.enabled ?? true,
      },
    });
    return mapRow(r);
  }
  const id = `grp-${++memorySeq}`;
  const now = new Date().toISOString();
  const row: ProviderGroupRow = {
    id,
    name: input.name,
    description: input.description ?? null,
    strategy: input.strategy ?? 'priority',
    members: input.members,
    enabled: input.enabled ?? true,
    createdAt: now,
    updatedAt: now,
  };
  memoryGroups.set(input.name, row);
  return row;
}

export interface UpdateGroupInput {
  description?: string | null;
  strategy?: GroupStrategy;
  members?: ProviderGroupMember[];
  enabled?: boolean;
}

export async function updateGroup(
  name: string,
  input: UpdateGroupInput,
): Promise<ProviderGroupRow | null> {
  const prisma = db();
  if (prisma) {
    const existing = await prisma.providerGroup.findUnique({ where: { name } });
    if (!existing) return null;
    const r = await prisma.providerGroup.update({
      where: { name },
      data: {
        ...(input.description !== undefined && { description: input.description }),
        ...(input.strategy !== undefined && { strategy: input.strategy }),
        ...(input.members !== undefined && { members: input.members as unknown as object }),
        ...(input.enabled !== undefined && { enabled: input.enabled }),
      },
    });
    return mapRow(r);
  }
  const row = memoryGroups.get(name);
  if (!row) return null;
  const updated: ProviderGroupRow = {
    ...row,
    description: input.description !== undefined ? input.description : row.description,
    strategy: input.strategy ?? row.strategy,
    members: input.members ?? row.members,
    enabled: input.enabled ?? row.enabled,
    updatedAt: new Date().toISOString(),
  };
  memoryGroups.set(name, updated);
  return updated;
}

export async function deleteGroup(name: string): Promise<boolean> {
  const prisma = db();
  if (prisma) {
    const existing = await prisma.providerGroup.findUnique({ where: { name } });
    if (!existing) return false;
    await prisma.providerGroup.delete({ where: { name } });
    return true;
  }
  return memoryGroups.delete(name);
}
