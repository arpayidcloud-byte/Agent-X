/**
 * @module runtime-production/interfaces
 * @description Interfaces and types for Production Infrastructure and Distributed Runtime.
 */

export interface LockOptions {
  ttlMs: number;
  retryCount?: number;
  retryDelayMs?: number;
}

export interface LockInfo {
  id: string;
  key: string;
  ownerId: string;
  acquiredAt: Date;
  expiresAt: Date;
}

export interface QueueMessage<T = unknown> {
  id: string;
  traceId: string;
  workflowId: string;
  payload: T;
  priority: number;
  retryCount: number;
  status: 'PENDING' | 'PROCESSING' | 'FAILED' | 'COMPLETED';
  createdAt: Date;
}

export interface LeaseInfo {
  workerId: string;
  resourceType: string;
  resourceId: string;
  leasedAt: Date;
  expiresAt: Date;
  heartbeatMs: number;
}

export interface WorkerMetadata {
  id: string;
  hostname: string;
  capabilities: string[];
  maxMemoryMb: number;
  maxCpu: number;
  registeredAt: Date;
  lastHeartbeat: Date;
}

export interface ClusterNode {
  id: string;
  address: string;
  status: 'ACTIVE' | 'DOWN' | 'JOINING' | 'LEAVING';
  lastHeartbeat: Date;
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  recoveryTimeoutMs: number;
}

export interface CircuitBreakerMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  lastFailureTime?: Date;
}

export interface BackpressureConfig {
  cpuThreshold: number;
  memoryThreshold: number;
  queueLengthThreshold: number;
  tokenThreshold: number;
  costThreshold: number;
}

export interface TelemetrySpan {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  attributes: Record<string, string | number | boolean>;
  status: 'OK' | 'ERROR';
}

export interface TelemetryMetrics {
  counters: Record<string, number>;
  gauges: Record<string, number>;
  histograms: Record<string, number[]>;
}
