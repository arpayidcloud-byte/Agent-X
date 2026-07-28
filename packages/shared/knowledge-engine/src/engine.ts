import type {
  IKnowledgeEngine,
  IKnowledgeStore,
  KnowledgeDocument,
  KnowledgeQuery,
  KnowledgeNode,
  KnowledgeRelation,
  KnowledgeGraph,
  KnowledgeMetrics,
} from './interfaces.js';
import type { IEventBus } from '@agentx-fast/core-runtime';

export class KnowledgeEngine implements IKnowledgeEngine {
  private metrics: KnowledgeMetrics = {
    totalDocuments: 0,
    totalNodes: 0,
    totalRelations: 0,
    averageConfidence: 0,
  };

  constructor(
    private store: IKnowledgeStore,
    private eventBus: IEventBus,
  ) {}

  public async ingest(data: Partial<KnowledgeDocument>): Promise<KnowledgeDocument> {
    const now = new Date();
    const doc: KnowledgeDocument = {
      id: `doc_${Math.random().toString(36).substring(2, 9)}`,
      content: data.content || '',
      metadata: data.metadata || {},
      tags: data.tags || [],
      version: 1,
      sourceUri: data.sourceUri,
      createdAt: now,
      updatedAt: now,
    };

    await this.store.saveDocument(doc);

    // Auto-create a node for the document (simple chunking logic: 1 doc = 1 node for foundation)
    const node: KnowledgeNode = {
      id: `node_${doc.id}`,
      documentId: doc.id,
      content: doc.content,
      metadata: doc.metadata,
      confidenceScore: 1.0,
      createdAt: now,
    };
    await this.store.saveNode(node);

    await this.updateMetrics();
    await this.eventBus.publish('knowledge.ingested', doc, `trace_${doc.id}`);

    return doc;
  }

  public async retrieve(query: KnowledgeQuery): Promise<KnowledgeNode[]> {
    let results = await this.store.searchNodes(query.text, query.limit);

    const minConf = query.minConfidence;
    if (minConf !== undefined) {
      results = results.filter((n) => n.confidenceScore >= minConf);
    }

    return results;
  }

  public async update(
    documentId: string,
    updates: Partial<KnowledgeDocument>,
  ): Promise<KnowledgeDocument> {
    const existing = await this.store.getDocument(documentId);
    if (!existing) throw new Error(`Document ${documentId} not found`);

    const doc: KnowledgeDocument = {
      ...existing,
      ...updates,
      version: existing.version + 1,
      updatedAt: new Date(),
    };

    await this.store.saveDocument(doc);

    // Update corresponding node
    const node = await this.store.getNode(`node_${doc.id}`);
    if (node) {
      await this.store.saveNode({
        ...node,
        content: doc.content,
        metadata: doc.metadata,
      });
    }

    await this.eventBus.publish('knowledge.updated', doc, `trace_${doc.id}`);
    return doc;
  }

  public async delete(documentId: string): Promise<void> {
    await this.store.deleteDocument(documentId);
    await this.updateMetrics();
    await this.eventBus.publish('knowledge.deleted', { id: documentId }, `trace_${documentId}`);
  }

  public async createRelationship(
    sourceId: string,
    targetId: string,
    type: string,
    metadata?: Record<string, unknown>,
  ): Promise<KnowledgeRelation> {
    const relation: KnowledgeRelation = {
      id: `rel_${Math.random().toString(36).substring(2, 9)}`,
      sourceId,
      targetId,
      type,
      weight: 1.0,
      metadata: metadata || {},
      createdAt: new Date(),
    };

    await this.store.saveRelation(relation);
    await this.updateMetrics();
    return relation;
  }

  public async traverse(startNodeId: string, maxDepth: number = 1): Promise<KnowledgeGraph> {
    const nodes = new Map<string, KnowledgeNode>();
    const relations: KnowledgeRelation[] = [];

    const startNode = await this.store.getNode(startNodeId);
    if (!startNode) return { nodes: [], relations: [] };

    nodes.set(startNode.id, startNode);

    // Simple 1-level traversal for foundation
    if (maxDepth >= 1) {
      const rels = await this.store.getRelations(startNodeId);
      for (const rel of rels) {
        relations.push(rel);
        const targetNode = await this.store.getNode(rel.targetId);
        if (targetNode && !nodes.has(targetNode.id)) {
          nodes.set(targetNode.id, targetNode);
        }
      }
    }

    return {
      nodes: Array.from(nodes.values()),
      relations,
    };
  }

  public getMetrics(): KnowledgeMetrics {
    return { ...this.metrics };
  }

  private async updateMetrics(): Promise<void> {
    const docs = await this.store.listDocuments();
    this.metrics.totalDocuments = docs.length;
    // Mock metric updates for nodes/relations based on docs length
    this.metrics.totalNodes = docs.length;
    this.metrics.totalRelations = docs.length > 1 ? docs.length - 1 : 0;
    this.metrics.averageConfidence = docs.length > 0 ? 1.0 : 0;
  }
}

export class InMemoryKnowledgeStore implements IKnowledgeStore {
  private documents = new Map<string, KnowledgeDocument>();
  private nodes = new Map<string, KnowledgeNode>();
  private relations = new Map<string, KnowledgeRelation[]>();

  async saveDocument(doc: KnowledgeDocument): Promise<void> {
    this.documents.set(doc.id, doc);
  }

  async getDocument(id: string): Promise<KnowledgeDocument | undefined> {
    return this.documents.get(id);
  }

  async deleteDocument(id: string): Promise<void> {
    this.documents.delete(id);
    this.nodes.delete(`node_${id}`);
  }

  async listDocuments(): Promise<KnowledgeDocument[]> {
    return Array.from(this.documents.values());
  }

  async saveNode(node: KnowledgeNode): Promise<void> {
    this.nodes.set(node.id, node);
  }

  async getNode(id: string): Promise<KnowledgeNode | undefined> {
    return this.nodes.get(id);
  }

  async searchNodes(query: string, limit?: number): Promise<KnowledgeNode[]> {
    let results = Array.from(this.nodes.values());
    if (query) {
      results = results.filter((n) => n.content.includes(query));
    }
    if (limit) {
      results = results.slice(0, limit);
    }
    return results;
  }

  async saveRelation(relation: KnowledgeRelation): Promise<void> {
    const existing = this.relations.get(relation.sourceId) || [];
    existing.push(relation);
    this.relations.set(relation.sourceId, existing);
  }

  async getRelations(nodeId: string): Promise<KnowledgeRelation[]> {
    return this.relations.get(nodeId) || [];
  }
}
