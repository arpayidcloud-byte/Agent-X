import type { PrismaClient } from '@prisma/client';

export interface FeedbackEntryRecord {
  id: string;
  email?: string;
  category: string;
  message: string;
  rating?: number;
  createdAt: string;
}

function toRecord(row: {
  id: string;
  email: string | null;
  category: string;
  message: string;
  rating: number | null;
  createdAt: Date;
}): FeedbackEntryRecord {
  return {
    id: row.id,
    email: row.email ?? undefined,
    category: row.category,
    message: row.message,
    rating: row.rating ?? undefined,
    createdAt: row.createdAt.toISOString(),
  };
}

export class PrismaFeedbackRepository {
  constructor(private prisma: PrismaClient) {}

  async create(entry: FeedbackEntryRecord): Promise<FeedbackEntryRecord> {
    const row = await this.prisma.feedbackEntry.create({
      data: {
        id: entry.id,
        email: entry.email ?? null,
        category: entry.category,
        message: entry.message,
        rating: entry.rating ?? null,
      },
    });
    return toRecord(row);
  }

  async findAll(limit: number): Promise<FeedbackEntryRecord[]> {
    const rows = await this.prisma.feedbackEntry.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return rows.map(toRecord);
  }

  async count(): Promise<number> {
    return this.prisma.feedbackEntry.count();
  }
}
