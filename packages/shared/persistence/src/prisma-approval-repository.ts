import type { PrismaClient } from '@prisma/client';

export interface ApprovalModel {
  id: string;
  taskId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason?: string;
  approvedBy?: string;
  decidedAt?: Date;
  createdAt: Date;
}

export interface IApprovalRepository {
  save(orgId: string, approval: ApprovalModel): Promise<void>;
  findByTaskId(orgId: string, taskId: string): Promise<ApprovalModel | undefined>;
  approve(orgId: string, taskId: string, approvedBy: string, reason?: string): Promise<void>;
  reject(orgId: string, taskId: string, approvedBy: string, reason: string): Promise<void>;
}

export class PrismaApprovalRepository implements IApprovalRepository {
  constructor(private prisma: PrismaClient) {}

  private requireOrg(orgId: string): void {
    if (!orgId || !orgId.trim()) {
      throw new Error('Organization context required');
    }
  }

  private async verifyTaskOwnership(orgId: string, taskId: string): Promise<void> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      select: { orgId: true },
    });
    if (!task || !task.orgId?.trim()) {
      throw new Error('Task ownership could not be verified');
    }
    if (task.orgId !== orgId) {
      throw new Error('Task organization mismatch');
    }
  }

  async save(orgId: string, approval: ApprovalModel): Promise<void> {
    this.requireOrg(orgId);
    await this.verifyTaskOwnership(orgId, approval.taskId);

    await this.prisma.approval.upsert({
      where: { taskId: approval.taskId },
      update: {
        status: approval.status,
        reason: approval.reason,
        approvedBy: approval.approvedBy,
        decidedAt: approval.decidedAt,
      },
      create: {
        id: approval.id,
        taskId: approval.taskId,
        status: approval.status,
        reason: approval.reason,
        approvedBy: approval.approvedBy,
        decidedAt: approval.decidedAt,
        createdAt: approval.createdAt,
      },
    });
  }

  async findByTaskId(orgId: string, taskId: string): Promise<ApprovalModel | undefined> {
    this.requireOrg(orgId);
    await this.verifyTaskOwnership(orgId, taskId);

    const approval = await this.prisma.approval.findUnique({
      where: { taskId },
    });
    return approval ? this.toApprovalModel(approval) : undefined;
  }

  async approve(orgId: string, taskId: string, approvedBy: string, reason?: string): Promise<void> {
    this.requireOrg(orgId);
    await this.verifyTaskOwnership(orgId, taskId);

    await this.prisma.approval.update({
      where: { taskId },
      data: {
        status: 'APPROVED',
        approvedBy,
        reason,
        decidedAt: new Date(),
      },
    });
  }

  async reject(orgId: string, taskId: string, approvedBy: string, reason: string): Promise<void> {
    this.requireOrg(orgId);
    await this.verifyTaskOwnership(orgId, taskId);

    await this.prisma.approval.update({
      where: { taskId },
      data: {
        status: 'REJECTED',
        approvedBy,
        reason,
        decidedAt: new Date(),
      },
    });
  }

  private toApprovalModel(prismaApproval: Record<string, unknown>): ApprovalModel {
    return {
      id: prismaApproval.id as string,
      taskId: prismaApproval.taskId as string,
      status: prismaApproval.status as 'PENDING' | 'APPROVED' | 'REJECTED',
      reason: prismaApproval.reason as string | undefined,
      approvedBy: prismaApproval.approvedBy as string | undefined,
      decidedAt: prismaApproval.decidedAt as Date | undefined,
      createdAt: prismaApproval.createdAt as Date,
    };
  }
}
