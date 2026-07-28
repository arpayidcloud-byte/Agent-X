/**
 * @module runtime-adapters/interfaces
 * @description Contontract definition for Production Adapter Layer.
 */

export interface ProviderMetadata {
  id: string;
  name: string;
  type: 'queue' | 'lock' | 'storage' | 'telemetry' | 'secret' | 'worker-discovery';
  version: string;
}

export interface ProviderCapabilities {
  transactions?: boolean;
  priorityQueue?: boolean;
  distributedLocks?: boolean;
  leaderElection?: boolean;
  telemetry?: boolean;
  secretRotation?: boolean;
}

export type ProviderStatus = 'ACTIVE' | 'DOWN' | 'DEGRADED';

export interface ProviderHealth {
  healthy: boolean;
  latencyMs: number;
  lastChecked: Date;
  status: ProviderStatus;
  details?: Record<string, unknown>;
}

export interface ProviderMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatencyMs: number;
}

export interface ProviderStatistics {
  uptimeMs: number;
  loadFactor: number;
}

export interface ProviderConfiguration {
  endpoint?: string;
  credentials?: Record<string, string>;
  options?: Record<string, unknown>;
}

export interface ProviderContext {
  traceId: string;
  correlationId?: string;
}

export interface IProvider {
  getMetadata(): ProviderMetadata;
  getCapabilities(): ProviderCapabilities;
  healthCheck(): Promise<ProviderHealth>;
  getMetrics(): ProviderMetrics;
}

export interface IQueueProvider extends IProvider {
  enqueue(topic: string, message: unknown, priority?: number): Promise<void>;
  dequeue(topic: string): Promise<unknown | undefined>;
  peek(topic: string): Promise<unknown | undefined>;
  ack(topic: string, messageId: string): Promise<void>;
  retry(topic: string, messageId: string): Promise<void>;
  deadLetter(topic: string, messageId: string): Promise<void>;
  getDepth(topic: string): Promise<number>;
  purge(topic: string): Promise<void>;
}

export interface ILockProvider extends IProvider {
  acquire(key: string, ttlMs: number): Promise<string>;
  release(key: string, lockId: string): Promise<void>;
  renew(key: string, lockId: string, ttlMs: number): Promise<void>;
  expire(key: string): Promise<void>;
  isLocked(key: string): Promise<boolean>;
}

export interface IStorageProvider extends IProvider {
  put(bucket: string, key: string, value: string): Promise<void>;
  get(bucket: string, key: string): Promise<string | undefined>;
  delete(bucket: string, key: string): Promise<void>;
  list(bucket: string, prefix?: string): Promise<string[]>;
  exists(bucket: string, key: string): Promise<boolean>;
  transaction(operations: () => Promise<void>): Promise<void>;
}

export interface ITelemetryProvider extends IProvider {
  startSpan(name: string, context?: ProviderContext): string;
  endSpan(spanId: string, status?: 'OK' | 'ERROR'): void;
  recordCounter(name: string, value?: number): void;
  recordHistogram(name: string, value: number): void;
  recordGauge(name: string, value: number): void;
  flush(): Promise<void>;
}

export interface ISecretProvider extends IProvider {
  getSecret(key: string): Promise<string | undefined>;
  putSecret(key: string, value: string): Promise<void>;
  deleteSecret(key: string): Promise<void>;
  listSecrets(): Promise<string[]>;
  rotateSecret(key: string, newValue: string): Promise<void>;
}

export interface IWorkerDiscoveryProvider extends IProvider {
  registerWorker(workerId: string, metadata: Record<string, unknown>): Promise<void>;
  heartbeat(workerId: string): Promise<void>;
  listWorkers(): Promise<Array<{ id: string; metadata: Record<string, unknown> }>>;
  removeWorker(workerId: string): Promise<void>;
  discover(capability: string): Promise<string[]>;
}

export interface ProviderFactory {
  create(type: string, config: ProviderConfiguration): Promise<IProvider>;
}
