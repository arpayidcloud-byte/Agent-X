import { createHash } from 'crypto';
import type {
  IContextEngine,
  ContextScope,
  ContextSnapshot,
  ITokenEstimator,
  IContextCompressor,
  ContextMetrics,
} from './interfaces.js';
import type { IEventBus } from '@agentx-fast/core-runtime';

export class ContextEngine implements IContextEngine {
  private contexts = new Map<string, ContextSnapshot>();
  private metrics: ContextMetrics = {
    totalContexts: 0,
    averageTokens: 0,
    compressionRatio: 1.0,
    mergeCount: 0,
  };

  constructor(
    private eventBus: IEventBus,
    private estimator: ITokenEstimator,
    private compressor: IContextCompressor,
  ) {}

  private computeChecksum(data: unknown): string {
    return createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }

  public async createContext(
    scope: ContextScope,
    initialData: Record<string, unknown> = {},
  ): Promise<ContextSnapshot> {
    const id = `ctx_${Math.random().toString(36).substring(2, 9)}`;
    const snapshot: ContextSnapshot = {
      id,
      scope,
      version: 1,
      data: { ...initialData },
      checksum: this.computeChecksum(initialData),
      tokenEstimate: this.estimator.estimate(initialData),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.contexts.set(id, snapshot);
    this.updateMetrics();

    await this.eventBus.publish('context.created', snapshot, `trace_${id}`);
    return snapshot;
  }

  public async updateContext(
    contextId: string,
    updates: Record<string, unknown>,
  ): Promise<ContextSnapshot> {
    const existing = this.contexts.get(contextId);
    if (!existing) throw new Error(`Context ${contextId} not found`);

    const newData = { ...existing.data, ...updates };
    const snapshot: ContextSnapshot = {
      ...existing,
      version: existing.version + 1,
      data: newData,
      checksum: this.computeChecksum(newData),
      tokenEstimate: this.estimator.estimate(newData),
      updatedAt: new Date(),
    };

    this.contexts.set(contextId, snapshot);
    this.updateMetrics();

    await this.eventBus.publish('context.updated', snapshot, `trace_${contextId}`);
    return snapshot;
  }

  public async getContext(contextId: string): Promise<ContextSnapshot | undefined> {
    return this.contexts.get(contextId);
  }

  public async mergeContexts(
    sourceIds: string[],
    targetScope: ContextScope,
  ): Promise<ContextSnapshot> {
    const mergedData: Record<string, unknown> = {};
    for (const id of sourceIds) {
      const ctx = this.contexts.get(id);
      if (ctx) {
        Object.assign(mergedData, ctx.data);
      }
    }

    this.metrics.mergeCount++;
    return this.createContext(targetScope, mergedData);
  }

  public async compressContext(contextId: string, targetTokens: number): Promise<ContextSnapshot> {
    const existing = this.contexts.get(contextId);
    if (!existing) throw new Error(`Context ${contextId} not found`);

    if (existing.tokenEstimate <= targetTokens) return existing;

    const ratio = targetTokens / existing.tokenEstimate;
    const compressedData = this.compressor.compress(existing.data, ratio);

    return this.updateContext(contextId, compressedData);
  }

  public async validateContext(contextId: string): Promise<boolean> {
    const existing = this.contexts.get(contextId);
    if (!existing) return false;
    return existing.checksum === this.computeChecksum(existing.data);
  }

  private updateMetrics(): void {
    this.metrics.totalContexts = this.contexts.size;
    let totalTokens = 0;
    for (const ctx of this.contexts.values() as IterableIterator<ContextSnapshot>) {
      totalTokens += (ctx as ContextSnapshot).tokenEstimate;
    }
    this.metrics.averageTokens = this.contexts.size > 0 ? totalTokens / this.contexts.size : 0;
  }

  public getMetrics(): ContextMetrics {
    return { ...this.metrics };
  }
}
