import type { PrismaClient } from '@prisma/client';

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  roles: string[];
  emailVerified: boolean;
  orgId: string | null;
  createdAt: string;
}

function toRecord(row: {
  id: string;
  email: string;
  passwordHash: string;
  roles: string[];
  emailVerified: boolean;
  orgId: string | null;
  createdAt: Date;
}): UserRecord {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.passwordHash,
    roles: row.roles,
    emailVerified: row.emailVerified,
    orgId: row.orgId,
    createdAt: row.createdAt.toISOString(),
  };
}

export class PrismaUserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(record: {
    id: string;
    email: string;
    passwordHash: string;
    roles: string[];
    orgId?: string | null;
  }): Promise<UserRecord> {
    const row = await this.prisma.user.create({ data: record });
    return toRecord(row);
  }

  async findByEmail(email: string): Promise<UserRecord | undefined> {
    const row = await this.prisma.user.findUnique({ where: { email } });
    return row ? toRecord(row) : undefined;
  }

  async findById(id: string): Promise<UserRecord | undefined> {
    const row = await this.prisma.user.findUnique({ where: { id } });
    return row ? toRecord(row) : undefined;
  }

  async findAll(orgId: string): Promise<UserRecord[]> {
    const rows = await this.prisma.user.findMany({
      where: { members: { some: { orgId } } },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(toRecord);
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await this.prisma.user.update({ where: { id }, data: { passwordHash } });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async update(id: string, data: { roles?: string[] }): Promise<UserRecord> {
    const row = await this.prisma.user.update({ where: { id }, data });
    return toRecord(row);
  }

  async updateEmailVerified(id: string, emailVerified: boolean): Promise<void> {
    await this.prisma.user.update({ where: { id }, data: { emailVerified } });
  }
}
