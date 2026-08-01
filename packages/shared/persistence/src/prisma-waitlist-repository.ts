import type { PrismaClient } from '@prisma/client';

export interface WaitlistEntryRecord {
  id: string;
  email: string;
  name?: string;
  source?: string;
  status: string;
  createdAt: string;
}

export interface WaitlistStats {
  total: number;
  byStatus: Record<string, number>;
  bySource: Record<string, number>;
}

function toRecord(row: {
  id: string;
  email: string;
  name: string | null;
  source: string | null;
  status: string;
  createdAt: Date;
}): WaitlistEntryRecord {
  return {
    id: row.id,
    email: row.email,
    name: row.name ?? undefined,
    source: row.source ?? undefined,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  };
}

export class PrismaWaitlistRepository {
  constructor(private prisma: PrismaClient) {}

  async create(entry: WaitlistEntryRecord): Promise<WaitlistEntryRecord> {
    const row = await this.prisma.waitlistEntry.create({
      data: {
        id: entry.id,
        email: entry.email,
        name: entry.name ?? null,
        source: entry.source ?? null,
        status: entry.status,
      },
    });
    return toRecord(row);
  }

  async findByEmail(email: string): Promise<WaitlistEntryRecord | undefined> {
    const row = await this.prisma.waitlistEntry.findUnique({ where: { email } });
    return row ? toRecord(row) : undefined;
  }

  async findAll(limit: number): Promise<WaitlistEntryRecord[]> {
    const rows = await this.prisma.waitlistEntry.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return rows.map(toRecord);
  }

  async updateStatus(id: string, status: string): Promise<WaitlistEntryRecord | undefined> {
    try {
      const row = await this.prisma.waitlistEntry.update({
        where: { id },
        data: { status },
      });
      return toRecord(row);
    } catch {
      return undefined;
    }
  }

  async stats(): Promise<WaitlistStats> {
    const [byStatusRows, bySourceRows, total] = await Promise.all([
      this.prisma.waitlistEntry.groupBy({ by: ['status'], _count: { _all: true } }),
      this.prisma.waitlistEntry.groupBy({ by: ['source'], _count: { _all: true } }),
      this.prisma.waitlistEntry.count(),
    ]);

    const byStatus: Record<string, number> = {};
    for (const r of byStatusRows) byStatus[r.status] = r._count._all;

    const bySource: Record<string, number> = {};
    for (const r of bySourceRows) {
      const key = r.source ?? 'direct';
      bySource[key] = (bySource[key] ?? 0) + r._count._all;
    }

    return { total, byStatus, bySource };
  }
}
