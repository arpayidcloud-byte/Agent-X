/**
 * Workflow repository — visual workflow builder persistence.
 *
 * Every operation is explicitly organization-scoped. The API must provide the
 * authenticated tenant context; callers cannot read or mutate another org's
 * workflow by guessing its ID.
 */
import type { Prisma, PrismaClient } from '@prisma/client';
import { getPrisma } from './client.js';

export interface WorkflowRecord {
  id: string;
  name: string;
  description: string | null;
  nodes: Prisma.JsonValue;
  edges: Prisma.JsonValue;
  isPublished: boolean;
  ownerId: string | null;
  orgId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowInput {
  name: string;
  description?: string;
  nodes?: Prisma.JsonValue;
  edges?: Prisma.JsonValue;
  isPublished?: boolean;
  ownerId?: string;
}

export interface WorkflowRepository {
  create(orgId: string, input: WorkflowInput): Promise<WorkflowRecord>;
  list(orgId: string, limit?: number, offset?: number): Promise<WorkflowRecord[]>;
  getById(orgId: string, id: string): Promise<WorkflowRecord | null>;
  update(orgId: string, id: string, input: Partial<WorkflowInput>): Promise<WorkflowRecord | null>;
  remove(orgId: string, id: string): Promise<boolean>;
  count(orgId: string): Promise<number>;
}

export class PrismaWorkflowRepository implements WorkflowRepository {
  private readonly prisma: PrismaClient | null;

  constructor(prisma: PrismaClient | null = getPrisma()) {
    this.prisma = prisma;
  }

  private db(): PrismaClient {
    if (!this.prisma) throw new Error('DATABASE_URL not configured');
    return this.prisma;
  }

  async create(orgId: string, input: WorkflowInput): Promise<WorkflowRecord> {
    return this.db().workflow.create({
      data: {
        orgId,
        name: input.name,
        description: input.description ?? null,
        nodes: input.nodes ?? [],
        edges: input.edges ?? [],
        isPublished: input.isPublished ?? false,
        ownerId: input.ownerId ?? null,
      },
    });
  }

  async list(orgId: string, limit = 50, offset = 0): Promise<WorkflowRecord[]> {
    return this.db().workflow.findMany({
      where: { orgId },
      take: Math.min(limit, 200),
      skip: offset,
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getById(orgId: string, id: string): Promise<WorkflowRecord | null> {
    return this.db().workflow.findFirst({ where: { id, orgId } });
  }

  async update(
    orgId: string,
    id: string,
    input: Partial<WorkflowInput>,
  ): Promise<WorkflowRecord | null> {
    const data: Prisma.WorkflowUpdateManyMutationInput = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.description !== undefined) data.description = input.description;
    if (input.nodes !== undefined) data.nodes = input.nodes as Prisma.InputJsonValue;
    if (input.edges !== undefined) data.edges = input.edges as Prisma.InputJsonValue;
    if (input.isPublished !== undefined) data.isPublished = input.isPublished;
    if (input.ownerId !== undefined) data.ownerId = input.ownerId;

    const result = await this.db().workflow.updateMany({
      where: { id, orgId },
      data,
    });
    return result.count === 0 ? null : this.getById(orgId, id);
  }

  async remove(orgId: string, id: string): Promise<boolean> {
    const result = await this.db().workflow.deleteMany({ where: { id, orgId } });
    return result.count > 0;
  }

  async count(orgId: string): Promise<number> {
    return this.db().workflow.count({ where: { orgId } });
  }
}

let workflowRepo: WorkflowRepository | null = null;

export function getWorkflowRepository(): WorkflowRepository {
  if (!workflowRepo) {
    workflowRepo = new PrismaWorkflowRepository();
  }
  return workflowRepo;
}

export function resetWorkflowRepository(): void {
  workflowRepo = null;
}
