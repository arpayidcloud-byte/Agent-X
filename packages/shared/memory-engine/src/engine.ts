import type {
  IMemoryEngine,
  IMemoryStore,
  Memory,
  MemorySearchOptions,
  MemoryMetrics,
  MemoryType,
} from './interfaces.js';
import type { IEventBus } from '@agentx-fast/core-runtime';

interface LRUCacheNode {
  key: string;
  value: Memory;
  previous: LRUCacheNode | null;
  next: LRUCacheNode | null;
}

export class MemoryEngine implements IMemoryEngine {
  private metrics: MemoryMetrics = {
    totalMemories: 0,
    averageImportance: 0,
    compactCount: 0,
    expiredCount: 0,
  };

  private lruCache = new Map<string, LRUCacheNode>();
  private lruHead: LRUCacheNode | null = null;
  private lruTail: LRUCacheNode | null = null;
  private readonly maxCacheSize: number;

  constructor(
    private memoryStore: IMemoryStore,
    private eventBus: IEventBus,
    maxCacheSize: number = 100,
  ) {
    this.maxCacheSize = maxCacheSize;
  }

  public async store(data: Partial<Memory>): Promise<Memory> {
    const now = new Date();
    const memory: Memory = {
      id: `mem_${Math.random().toString(36).substring(2, 9)}`,
      type: data.type || 'working',
      content: data.content || '',
      importance: data.importance || 1,
      ttl: data.ttl,
      createdAt: now,
      metadata: data.metadata || {},
    };

    if (memory.ttl) {
      memory.expiresAt = new Date(now.getTime() + memory.ttl * 1000);
    }

    await this.memoryStore.save(memory);
    this.addToLRUCache(memory);
    void this.updateMetrics();

    await this.eventBus.publish('memory.created', memory, `trace_${memory.id}`);
    return memory;
  }

  public async retrieve(query: string, options?: MemorySearchOptions): Promise<Memory[]> {
    await this.cleanupExpired();

    if (query && options?.type) {
      const cached = Array.from(this.lruCache.values())
        .map((node) => node.value)
        .filter((m) => m.type === options.type && m.content.includes(query));

      if (cached.length > 0) {
        return cached.slice(0, options.limit || cached.length);
      }
    }

    return this.memoryStore.search(query, options);
  }

  public async forget(memoryId: string): Promise<void> {
    const mem = await this.memoryStore.find(memoryId);
    if (!mem) return;

    await this.memoryStore.delete(memoryId);
    this.removeFromLRUCache(memoryId);
    void this.updateMetrics();
    await this.eventBus.publish('memory.deleted', { id: memoryId }, `trace_${memoryId}`);
  }

  public async compact(): Promise<void> {
    this.metrics.compactCount++;
    await this.cleanupExpired();

    const all = await this.memoryStore.list();
    for (const mem of all) {
      if (mem.importance <= 2 && mem.type === 'working') {
        await this.memoryStore.delete(mem.id);
        this.removeFromLRUCache(mem.id);
      }
    }
    void this.updateMetrics();
  }

  public getMetrics(): MemoryMetrics {
    return { ...this.metrics };
  }

  public async getShortTermMemories(limit?: number): Promise<Memory[]> {
    const memories = Array.from(this.lruCache.values())
      .map((node) => node.value)
      .slice(0, limit || this.maxCacheSize);
    return memories;
  }

  public async getLongTermMemories(minImportance: number = 7, limit?: number): Promise<Memory[]> {
    return this.memoryStore.search('', { minImportance, limit });
  }

  public async retrieveByType(type: MemoryType, limit?: number): Promise<Memory[]> {
    const cached = Array.from(this.lruCache.values())
      .map((node) => node.value)
      .filter((m) => m.type === type);

    if (cached.length > 0) {
      return cached.slice(0, limit || cached.length);
    }

    return this.memoryStore.search('', { type, limit });
  }

  public async retrieveByRecency(limit?: number): Promise<Memory[]> {
    const all = await this.memoryStore.list();
    return all
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit || this.maxCacheSize);
  }

  public async retrieveByImportance(minImportance?: number, limit?: number): Promise<Memory[]> {
    const all = await this.memoryStore.list();
    return all
      .filter((m) => !minImportance || m.importance >= minImportance)
      .sort((a, b) => b.importance - a.importance)
      .slice(0, limit || this.maxCacheSize);
  }

  public async retrieveByRelevance(query: string, limit?: number): Promise<Memory[]> {
    const all = await this.memoryStore.list();
    const scored = all.map((memory) => {
      let score = 0;
      if (memory.content.includes(query)) score += 10;
      if (memory.metadata && JSON.stringify(memory.metadata).includes(query)) score += 5;
      score += memory.importance;
      return { memory, score };
    });
    return scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit || this.maxCacheSize)
      .map((item) => item.memory);
  }

  public async retrieveBySession(sessionId: string, limit?: number): Promise<Memory[]> {
    return this.memoryStore.search('', { sessionId, limit });
  }

  public async retrieveByTask(taskId: string, limit?: number): Promise<Memory[]> {
    return this.memoryStore.search('', { taskId, limit });
  }

  private addToLRUCache(memory: Memory): void {
    if (this.lruCache.has(memory.id)) {
      this.removeLRUNode(this.lruCache.get(memory.id)!);
    }

    const node: LRUCacheNode = {
      key: memory.id,
      value: memory,
      previous: null,
      next: this.lruHead,
    };

    if (this.lruHead) {
      this.lruHead.previous = node;
    }
    this.lruHead = node;

    if (!this.lruTail) {
      this.lruTail = node;
    }

    this.lruCache.set(memory.id, node);

    while (this.lruCache.size > this.maxCacheSize && this.lruTail) {
      this.removeLRUNode(this.lruTail);
    }
  }

  private removeLRUNode(node: LRUCacheNode): void {
    if (node.previous) {
      node.previous.next = node.next;
    } else {
      this.lruHead = node.next;
    }

    if (node.next) {
      node.next.previous = node.previous;
    } else {
      this.lruTail = node.previous;
    }

    this.lruCache.delete(node.key);
  }

  private removeFromLRUCache(memoryId: string): void {
    const node = this.lruCache.get(memoryId);
    if (node) {
      this.removeLRUNode(node);
    }
  }

  private async cleanupExpired(): Promise<void> {
    const all = await this.memoryStore.list();
    const now = new Date();
    for (const mem of all) {
      if (mem.expiresAt && mem.expiresAt < now) {
        await this.memoryStore.delete(mem.id);
        this.removeFromLRUCache(mem.id);
        this.metrics.expiredCount++;
        await this.eventBus.publish('memory.expired', { id: mem.id }, `trace_${mem.id}`);
      }
    }
    void this.updateMetrics();
  }

  private async updateMetrics(): Promise<void> {
    const all = await this.memoryStore.list();
    this.metrics.totalMemories = all.length;
    let totalImp = 0;
    for (const m of all) {
      totalImp += m.importance;
    }
    this.metrics.averageImportance = all.length > 0 ? totalImp / all.length : 0;
  }
}

export class InMemoryStore implements IMemoryStore {
  private memories = new Map<string, Memory>();

  async save(memory: Memory): Promise<void> {
    this.memories.set(memory.id, memory);
  }

  async find(id: string): Promise<Memory | undefined> {
    return this.memories.get(id);
  }

  async search(query: string, options?: MemorySearchOptions): Promise<Memory[]> {
    let results = Array.from(this.memories.values());

    // Simple mock search
    if (query) {
      results = results.filter((m) => m.content.includes(query));
    }
    if (options?.type) {
      results = results.filter((m) => m.type === options.type);
    }
    const minImportance = options?.minImportance;
    if (minImportance) {
      results = results.filter((m) => m.importance >= minImportance);
    }
    if (options?.limit) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  async delete(id: string): Promise<void> {
    this.memories.delete(id);
  }

  async list(): Promise<Memory[]> {
    return Array.from(this.memories.values());
  }
}

export * from './prisma-store.js';
