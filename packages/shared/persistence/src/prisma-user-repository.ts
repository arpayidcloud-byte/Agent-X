import type { PrismaClient } from '@prisma/client';

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  roles: string[];
  createdAt: string;
}

function toRecord(row: {
  id: string;
  email: string;
  passwordHash: string;
  roles: string[];
  createdAt: Date;
}): UserRecord {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.passwordHash,
    roles: row.roles,
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
}
