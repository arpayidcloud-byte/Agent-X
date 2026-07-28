/**
 * @module knowledge-engine/interfaces
 * @description Interfaces for Knowledge Engine
 */

export interface IKnowledgeEngine {
  ingest(document: Partial<KnowledgeDocument>): Promise<KnowledgeDocument>;
  retrieve(query: KnowledgeQuery): Promise<KnowledgeNode[]>;
  update(documentId: string, updates: Partial<KnowledgeDocument>): Promise<KnowledgeDocument>;
  delete(documentId: string): Promise<void>;
  createRelationship(
    sourceId: string,
    targetId: string,
    type: string,
    metadata?: Record<string, unknown>,
  ): Promise<KnowledgeRelation>;
  traverse(startNodeId: string, maxDepth?: number): Promise<KnowledgeGraph>;
  getMetrics(): KnowledgeMetrics;
}

export interface KnowledgeDocument {
  id: string;
  content: string;
  metadata: Record<string, unknown>;
  tags: string[];
  version: number;
  sourceUri?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface KnowledgeNode {
  id: string;
  documentId: string;
  content: string;
  embedding?: number[];
  metadata: Record<string, unknown>;
  confidenceScore: number; // 0 to 1
  createdAt: Date;
}

export interface KnowledgeRelation {
  id: string;
  sourceId: string;
  targetId: string;
  type: string;
  weight: number; // 0 to 1
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  relations: KnowledgeRelation[];
}

export interface KnowledgeQuery {
  text: string;
  tags?: string[];
  limit?: number;
  minConfidence?: number;
}

export interface IKnowledgeStore {
  saveDocument(doc: KnowledgeDocument): Promise<void>;
  getDocument(id: string): Promise<KnowledgeDocument | undefined>;
  deleteDocument(id: string): Promise<void>;
  listDocuments(): Promise<KnowledgeDocument[]>;

  saveNode(node: KnowledgeNode): Promise<void>;
  getNode(id: string): Promise<KnowledgeNode | undefined>;
  searchNodes(query: string, limit?: number): Promise<KnowledgeNode[]>;

  saveRelation(relation: KnowledgeRelation): Promise<void>;
  getRelations(nodeId: string): Promise<KnowledgeRelation[]>;
}

export interface KnowledgeMetrics {
  totalDocuments: number;
  totalNodes: number;
  totalRelations: number;
  averageConfidence: number;
}
