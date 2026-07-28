/**
 * @module context-engine/interfaces
 * @description Interfaces for Context Engine
 */

export interface IContextEngine {
  createContext(
    scope: ContextScope,
    initialData?: Record<string, unknown>,
  ): Promise<ContextSnapshot>;
  updateContext(contextId: string, updates: Record<string, unknown>): Promise<ContextSnapshot>;
  getContext(contextId: string): Promise<ContextSnapshot | undefined>;
  mergeContexts(sourceIds: string[], targetScope: ContextScope): Promise<ContextSnapshot>;
  compressContext(contextId: string, targetTokens: number): Promise<ContextSnapshot>;
  validateContext(contextId: string): Promise<boolean>;
}

export type ContextScope =
  | 'global'
  | 'workflow'
  | 'task'
  | 'node'
  | 'agent'
  | 'execution'
  | 'approval'
  | 'tool'
  | 'conversation';

export interface ContextSnapshot {
  id: string;
  scope: ContextScope;
  version: number;
  data: Record<string, unknown>;
  parentId?: string;
  checksum: string;
  tokenEstimate: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IContextAssembler {
  assemble(contextId: string): Promise<Record<string, unknown>>;
  assemblePrompt(contextId: string, template: string): Promise<string>;
}

export interface IContextWindowManager {
  trim(data: Record<string, unknown>, maxTokens: number): Record<string, unknown>;
  slideWindow(history: unknown[], maxTokens: number): unknown[];
}

export interface ITokenEstimator {
  estimate(data: unknown): number;
}

export interface IContextCompressor {
  compress(data: Record<string, unknown>, ratio: number): Record<string, unknown>;
}

export interface ContextMetrics {
  totalContexts: number;
  averageTokens: number;
  compressionRatio: number;
  mergeCount: number;
}
