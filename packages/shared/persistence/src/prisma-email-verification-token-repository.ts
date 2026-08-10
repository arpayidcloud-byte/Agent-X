import type { PrismaClient } from '@prisma/client';

export interface EmailVerificationTokenRecord {
  id: string;
  email: string;
  token: string;
  expiresAt: Date;
}

export class PrismaEmailVerificationTokenRepository {
  constructor(private prisma: PrismaClient) {}

  async create(record: {
    email: string;
    token: string;
    expiresAt: Date;
  }): Promise<EmailVerificationTokenRecord> {
    const row = await this.prisma.emailVerificationToken.create({ data: record });
    return { id: row.id, email: row.email, token: row.token, expiresAt: row.expiresAt };
  }

  async findByToken(token: string): Promise<EmailVerificationTokenRecord | undefined> {
    const row = await this.prisma.emailVerificationToken.findUnique({ where: { token } });
    return row
      ? { id: row.id, email: row.email, token: row.token, expiresAt: row.expiresAt }
      : undefined;
  }

  async deleteByToken(token: string): Promise<void> {
    await this.prisma.emailVerificationToken.deleteMany({ where: { token } });
  }

  async deleteByEmail(email: string): Promise<void> {
    await this.prisma.emailVerificationToken.deleteMany({
      where: { email: email.toLowerCase() },
    });
  }

  async deleteExpired(): Promise<void> {
    await this.prisma.emailVerificationToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}
