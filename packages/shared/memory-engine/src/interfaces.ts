/**
 * @module memory-engine/interfaces
 * @description Interfaces for Memory Engine
 */

export interface IMemoryEngine {
  store(memory: Partial<Memory>): Promise<Memory>;
  retrieve(query: string, options?: MemorySearchOptions): Promise<Memory[]>;
  forget(memoryId: string): Promise<void>;
  compact(): Promise<void>;
  getMetrics(): MemoryMetrics;
}

export type MemoryType =
  'working' | 'short_term' | 'long_term' | 'session' | 'workflow' | 'agent' | 'shared';

export interface Memory {
  id: string;
  type: MemoryType;
  content: string;
  importance: number; // 1 to 10
  ttl?: number; // expiration in seconds
  createdAt: Date;
  updatedAt?: Date;
  expiresAt?: Date;
  sessionId?: string;
  taskId?: string;
  metadata?: Record<string, unknown>;
}

export interface MemorySearchOptions {
  limit?: number;
  minImportance?: number;
  type?: MemoryType;
  sessionId?: string;
  taskId?: string;
  orderByImportance?: boolean;
}

export interface IMemoryStore {
  save(memory: Memory): Promise<void>;
  find(id: string): Promise<Memory | undefined>;
  search(query: string, options?: MemorySearchOptions): Promise<Memory[]>;
  delete(id: string): Promise<void>;
  list(): Promise<Memory[]>;
}

export interface MemoryMetrics {
  totalMemories: number;
  averageImportance: number;
  compactCount: number;
  expiredCount: number;
}
