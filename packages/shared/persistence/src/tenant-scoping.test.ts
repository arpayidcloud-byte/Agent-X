import { describe, expect, it, vi } from 'vitest';
import type { PrismaClient } from '@prisma/client';
import { PrismaFeedbackRepository } from './prisma-feedback-repository.js';
import { PrismaWaitlistRepository } from './prisma-waitlist-repository.js';
import { PrismaRefreshTokenRepository } from './prisma-refresh-token-repository.js';
import { PrismaEmailVerificationTokenRepository } from './prisma-email-verification-token-repository.js';
import { PromptTemplateRepository } from './prompt-template-repository.js';

describe('Tenant boundary: orgId scoping', () => {
  describe('PrismaFeedbackRepository', () => {
    it('findAll scopes by orgId when provided', async () => {
      const feedbackEntry = {
        create: vi.fn(),
        findMany: vi.fn().mockResolvedValue([]),
        count: vi.fn().mockResolvedValue(0),
      };
      const prisma = { feedbackEntry } as unknown as PrismaClient;
      await new PrismaFeedbackRepository(prisma).findAll(10, 'org-a');
      expect(feedbackEntry.findMany).toHaveBeenCalledWith({
        where: { orgId: 'org-a' },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });
    });

    it('count scopes by orgId when provided', async () => {
      const feedbackEntry = {
        create: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn().mockResolvedValue(5),
      };
      const prisma = { feedbackEntry } as unknown as PrismaClient;
      await new PrismaFeedbackRepository(prisma).count('org-b');
      expect(feedbackEntry.count).toHaveBeenCalledWith({ where: { orgId: 'org-b' } });
    });

    it('findAll works without orgId (backward compat)', async () => {
      const feedbackEntry = {
        create: vi.fn(),
        findMany: vi.fn().mockResolvedValue([]),
        count: vi.fn(),
      };
      const prisma = { feedbackEntry } as unknown as PrismaClient;
      await new PrismaFeedbackRepository(prisma).findAll(10);
      expect(feedbackEntry.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: { createdAt: 'desc' },
        take: 10,
      });
    });
  });

  describe('PrismaWaitlistRepository', () => {
    it('findAll scopes by orgId', async () => {
      const waitlistEntry = {
        create: vi.fn(),
        findUnique: vi.fn(),
        findMany: vi.fn().mockResolvedValue([]),
        update: vi.fn(),
        count: vi.fn().mockResolvedValue(0),
        groupBy: vi.fn().mockResolvedValue([]),
      };
      const prisma = { waitlistEntry } as unknown as PrismaClient;
      await new PrismaWaitlistRepository(prisma).findAll(50, 'org-a');
      expect(waitlistEntry.findMany).toHaveBeenCalledWith({
        where: { orgId: 'org-a' },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
    });

    it('count scopes by orgId', async () => {
      const waitlistEntry = {
        create: vi.fn(),
        findUnique: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn(),
        count: vi.fn().mockResolvedValue(3),
        groupBy: vi.fn(),
      };
      const prisma = { waitlistEntry } as unknown as PrismaClient;
      const result = await new PrismaWaitlistRepository(prisma).count('org-c');
      expect(result).toBe(3);
      expect(waitlistEntry.count).toHaveBeenCalledWith({ where: { orgId: 'org-c' } });
    });

    it('stats scopes by orgId', async () => {
      const waitlistEntry = {
        create: vi.fn(),
        findUnique: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn(),
        count: vi.fn().mockResolvedValue(2),
        groupBy: vi.fn().mockResolvedValue([]),
      };
      const prisma = { waitlistEntry } as unknown as PrismaClient;
      await new PrismaWaitlistRepository(prisma).stats('org-d');
      expect(waitlistEntry.groupBy).toHaveBeenCalledWith(
        expect.objectContaining({ where: { orgId: 'org-d' } }),
      );
      expect(waitlistEntry.count).toHaveBeenCalledWith({ where: { orgId: 'org-d' } });
    });
  });

  describe('PrismaRefreshTokenRepository', () => {
    it('findByToken scopes by orgId using findFirst', async () => {
      const refreshToken = {
        create: vi.fn(),
        findFirst: vi.fn().mockResolvedValue(null),
        deleteMany: vi.fn(),
      };
      const prisma = { refreshToken } as unknown as PrismaClient;
      await new PrismaRefreshTokenRepository(prisma).findByToken('tok-1', 'org-a');
      expect(refreshToken.findFirst).toHaveBeenCalledWith({
        where: { token: 'tok-1', orgId: 'org-a' },
      });
    });

    it('create includes orgId', async () => {
      const refreshToken = {
        create: vi.fn().mockResolvedValue({}),
        findFirst: vi.fn(),
        deleteMany: vi.fn(),
      };
      const prisma = { refreshToken } as unknown as PrismaClient;
      await new PrismaRefreshTokenRepository(prisma).create({
        token: 'tok-2',
        userId: 'user-1',
        expiresAt: new Date(),
        orgId: 'org-a',
      });
      expect(refreshToken.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ orgId: 'org-a' }),
      });
    });
  });

  describe('PrismaEmailVerificationTokenRepository', () => {
    it('findByToken scopes by orgId using findFirst', async () => {
      const emailVerificationToken = {
        create: vi.fn(),
        findFirst: vi.fn().mockResolvedValue(null),
        deleteMany: vi.fn(),
      };
      const prisma = { emailVerificationToken } as unknown as PrismaClient;
      await new PrismaEmailVerificationTokenRepository(prisma).findByToken('tok-1', 'org-a');
      expect(emailVerificationToken.findFirst).toHaveBeenCalledWith({
        where: { token: 'tok-1', orgId: 'org-a' },
      });
    });

    it('create includes orgId', async () => {
      const emailVerificationToken = {
        create: vi.fn().mockResolvedValue({
          id: 'id-1',
          email: 'a@b.c',
          token: 'tok-2',
          orgId: 'org-a',
          expiresAt: new Date(),
        }),
        findFirst: vi.fn(),
        deleteMany: vi.fn(),
      };
      const prisma = { emailVerificationToken } as unknown as PrismaClient;
      await new PrismaEmailVerificationTokenRepository(prisma).create({
        email: 'a@b.c',
        token: 'tok-2',
        expiresAt: new Date(),
        orgId: 'org-a',
      });
      expect(emailVerificationToken.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ orgId: 'org-a' }),
      });
    });
  });

  describe('PromptTemplateRepository', () => {
    it('findAll scopes by orgId', async () => {
      const promptTemplate = {
        create: vi.fn(),
        findMany: vi.fn().mockResolvedValue([]),
        findFirst: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      };
      const prisma = { promptTemplate } as unknown as PrismaClient;
      await new PromptTemplateRepository(prisma).findAll('org-a');
      expect(promptTemplate.findMany).toHaveBeenCalledWith({
        where: { orgId: 'org-a' },
        orderBy: { updatedAt: 'desc' },
      });
    });

    it('findById scopes by orgId using findFirst (not findUnique)', async () => {
      const promptTemplate = {
        create: vi.fn(),
        findMany: vi.fn(),
        findFirst: vi.fn().mockResolvedValue(null),
        update: vi.fn(),
        delete: vi.fn(),
      };
      const prisma = { promptTemplate } as unknown as PrismaClient;
      await new PromptTemplateRepository(prisma).findById('tpl-1', 'org-a');
      expect(promptTemplate.findFirst).toHaveBeenCalledWith({
        where: { id: 'tpl-1', orgId: 'org-a' },
      });
    });

    it('delete returns false when org-scoped lookup misses', async () => {
      const promptTemplate = {
        create: vi.fn(),
        findMany: vi.fn(),
        findFirst: vi.fn().mockResolvedValue(null),
        update: vi.fn(),
        delete: vi.fn(),
      };
      const prisma = { promptTemplate } as unknown as PrismaClient;
      const result = await new PromptTemplateRepository(prisma).delete('tpl-1', 'org-a');
      expect(result).toBe(false);
      expect(promptTemplate.delete).not.toHaveBeenCalled();
    });
  });
});
