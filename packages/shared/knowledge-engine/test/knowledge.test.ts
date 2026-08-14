import { describe, it, expect, beforeEach } from 'vitest';
import { KnowledgeEngine, InMemoryKnowledgeStore } from '../src/index.js';
import { InMemoryEventBus } from '@agent-xai/core-runtime';

describe('Knowledge Engine', () => {
  let eventBus: InMemoryEventBus;
  let store: InMemoryKnowledgeStore;
  let engine: KnowledgeEngine;

  beforeEach(() => {
    eventBus = new InMemoryEventBus();
    store = new InMemoryKnowledgeStore();
    engine = new KnowledgeEngine(store, eventBus);
  });

  it('ingests document and creates node', async () => {
    const doc = await engine.ingest('org-test', { content: 'TypeScript is typed JS' });
    expect(doc.id).toBeDefined();
    expect(doc.content).toBe('TypeScript is typed JS');

    const nodes = await engine.retrieve({ text: 'typed' });
    expect(nodes).toHaveLength(1);
    expect(nodes[0].documentId).toBe(doc.id);
  });

  it('updates document and node', async () => {
    const doc = await engine.ingest('org-test', { content: 'Old content' });
    const updated = await engine.update('org-test', doc.id, { content: 'New content' });

    expect(updated.version).toBe(2);
    expect(updated.content).toBe('New content');

    const nodes = await engine.retrieve({ text: 'New' });
    expect(nodes).toHaveLength(1);
    expect(nodes[0].content).toBe('New content');
  });

  it('throws on updating nonexistent document', async () => {
    await expect(engine.update('org-test', 'missing', {})).rejects.toThrow();
  });

  it('deletes document', async () => {
    const doc = await engine.ingest('org-test', { content: 'delete me' });
    await engine.delete('org-test', doc.id);

    // Store delete implementation should remove doc
    const retrieved = await store.getDocument(doc.id);
    expect(retrieved).toBeUndefined();
  });

  it('creates relationships and traverses graph', async () => {
    const doc1 = await engine.ingest('org-test', { content: 'Node A' });
    const doc2 = await engine.ingest('org-test', { content: 'Node B' });

    const node1Id = `node_${doc1.id}`;
    const node2Id = `node_${doc2.id}`;

    await engine.createRelationship(node1Id, node2Id, 'depends_on');

    const graph = await engine.traverse(node1Id, 1);
    expect(graph.nodes).toHaveLength(2);
    expect(graph.relations).toHaveLength(1);
    expect(graph.relations[0].targetId).toBe(node2Id);
  });

  it('handles traversing missing nodes', async () => {
    const graph = await engine.traverse('missing', 1);
    expect(graph.nodes).toHaveLength(0);
  });

  it('filters retrieval by minimum confidence', async () => {
    await engine.ingest('org-test', { content: 'Good content' });
    // Default ingestion has confidence 1.0
    const results = await engine.retrieve({ text: 'Good', minConfidence: 0.9 });
    expect(results).toHaveLength(1);

    const noResults = await engine.retrieve({ text: 'Good', minConfidence: 1.1 });
    expect(noResults).toHaveLength(0);
  });

  it('provides metrics', async () => {
    await engine.ingest('org-test', { content: 'Doc 1' });
    await engine.ingest('org-test', { content: 'Doc 2' });

    const metrics = engine.getMetrics();
    expect(metrics.totalDocuments).toBe(2);
    expect(metrics.averageConfidence).toBe(1.0);
  });
});
