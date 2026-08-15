import type { PrismaClient } from '@prisma/client';

export interface RefreshTokenRecord {
  token: string;
  userId: string;
  orgId?: string;
  expiresAt: Date;
}

export class PrismaRefreshTokenRepository {
  constructor(private prisma: PrismaClient) {}

  async create(record: {
    token: string;
    userId: string;
    expiresAt: Date;
    orgId?: string;
  }): Promise<void> {
    await this.prisma.refreshToken.create({ data: { ...record, orgId: record.orgId ?? null } });
  }

  async findByToken(token: string, orgId?: string): Promise<RefreshTokenRecord | undefined> {
    const row = await this.prisma.refreshToken.findFirst({
      where: { token, ...(orgId ? { orgId } : {}) },
    });
    return row
      ? {
          token: row.token,
          userId: row.userId,
          orgId: row.orgId ?? undefined,
          expiresAt: row.expiresAt,
        }
      : undefined;
  }

  async deleteByUser(userId: string, orgId?: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { userId, ...(orgId ? { orgId } : {}) } });
  }

  async delete(token: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { token } });
  }
}
