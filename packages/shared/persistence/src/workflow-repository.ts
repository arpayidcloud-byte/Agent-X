/**
 * Workflow repository — visual workflow builder persistence.
 *
 * Stores React Flow workflow definitions (nodes + edges as JSON)
 * for the visual workflow builder.
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
  create(input: WorkflowInput): Promise<WorkflowRecord>;
  list(limit?: number, offset?: number): Promise<WorkflowRecord[]>;
  getById(id: string): Promise<WorkflowRecord | null>;
  update(id: string, input: Partial<WorkflowInput>): Promise<WorkflowRecord | null>;
  remove(id: string): Promise<boolean>;
  count(): Promise<number>;
}

export class PrismaWorkflowRepository implements WorkflowRepository {
  private prisma: PrismaClient | null;

  constructor() {
    this.prisma = getPrisma();
  }

  private db(): PrismaClient {
    if (!this.prisma) throw new Error('DATABASE_URL not configured');
    return this.prisma;
  }

  async create(input: WorkflowInput): Promise<WorkflowRecord> {
    const db = this.db();
    return db.workflow.create({
      data: {
        name: input.name,
        description: input.description ?? null,
        nodes: input.nodes ?? [],
        edges: input.edges ?? [],
        isPublished: input.isPublished ?? false,
        ownerId: input.ownerId ?? null,
      },
    });
  }

  async list(limit = 50, offset = 0): Promise<WorkflowRecord[]> {
    const db = this.db();
    return db.workflow.findMany({
      take: Math.min(limit, 200),
      skip: offset,
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getById(id: string): Promise<WorkflowRecord | null> {
    const db = this.db();
    return db.workflow.findUnique({ where: { id } });
  }

  async update(id: string, input: Partial<WorkflowInput>): Promise<WorkflowRecord | null> {
    const db = this.db();
    const data: Prisma.WorkflowUpdateInput = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.description !== undefined) data.description = input.description;
    if (input.nodes !== undefined) data.nodes = input.nodes as Prisma.InputJsonValue;
    if (input.edges !== undefined) data.edges = input.edges as Prisma.InputJsonValue;
    if (input.isPublished !== undefined) data.isPublished = input.isPublished;
    if (input.ownerId !== undefined) data.ownerId = input.ownerId;
    return db.workflow.update({ where: { id }, data });
  }

  async remove(id: string): Promise<boolean> {
    const db = this.db();
    try {
      await db.workflow.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async count(): Promise<number> {
    const db = this.db();
    return db.workflow.count();
  }
}

let workflowRepo: WorkflowRepository | null = null;

export function getWorkflowRepository(): WorkflowRepository {
  if (!workflowRepo) {
    workflowRepo = new PrismaWorkflowRepository();
  }
  return workflowRepo;
}
