import type { PrismaClient } from '@prisma/client';

export interface EmailVerificationTokenRecord {
  id: string;
  email: string;
  token: string;
  orgId?: string;
  expiresAt: Date;
}

export class PrismaEmailVerificationTokenRepository {
  constructor(private prisma: PrismaClient) {}

  async create(record: {
    email: string;
    token: string;
    expiresAt: Date;
    orgId?: string;
  }): Promise<EmailVerificationTokenRecord> {
    const row = await this.prisma.emailVerificationToken.create({
      data: { ...record, orgId: record.orgId ?? null },
    });
    return {
      id: row.id,
      email: row.email,
      token: row.token,
      orgId: row.orgId ?? undefined,
      expiresAt: row.expiresAt,
    };
  }

  async findByToken(
    token: string,
    orgId?: string,
  ): Promise<EmailVerificationTokenRecord | undefined> {
    const row = await this.prisma.emailVerificationToken.findFirst({
      where: { token, ...(orgId ? { orgId } : {}) },
    });
    return row
      ? {
          id: row.id,
          email: row.email,
          token: row.token,
          orgId: row.orgId ?? undefined,
          expiresAt: row.expiresAt,
        }
      : undefined;
  }

  async deleteByToken(token: string, orgId?: string): Promise<void> {
    await this.prisma.emailVerificationToken.deleteMany({
      where: { token, ...(orgId ? { orgId } : {}) },
    });
  }

  async deleteByEmail(email: string, orgId?: string): Promise<void> {
    await this.prisma.emailVerificationToken.deleteMany({
      where: { email: email.toLowerCase(), ...(orgId ? { orgId } : {}) },
    });
  }

  async deleteExpired(orgId?: string): Promise<void> {
    await this.prisma.emailVerificationToken.deleteMany({
      where: { expiresAt: { lt: new Date() }, ...(orgId ? { orgId } : {}) },
    });
  }
}
