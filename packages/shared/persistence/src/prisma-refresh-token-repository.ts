import type { PrismaClient } from '@prisma/client';

export interface RefreshTokenRecord {
  token: string;
  userId: string;
  expiresAt: Date;
}

export class PrismaRefreshTokenRepository {
  constructor(private prisma: PrismaClient) {}

  async create(record: { token: string; userId: string; expiresAt: Date }): Promise<void> {
    await this.prisma.refreshToken.create({ data: record });
  }

  async findByToken(token: string): Promise<RefreshTokenRecord | undefined> {
    const row = await this.prisma.refreshToken.findUnique({ where: { token } });
    return row ? { token: row.token, userId: row.userId, expiresAt: row.expiresAt } : undefined;
  }

  async delete(token: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { token } });
  }
}
