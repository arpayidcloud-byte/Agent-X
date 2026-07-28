import { createHash } from 'crypto';

export class DistributedCache {
  private cache = new Map<string, { value: unknown; expiresAt: number }>();

  set(key: string, value: unknown, ttlMs: number = 60000): void {
    this.cache.set(key, {
      value: typeof value === 'object' ? JSON.parse(JSON.stringify(value)) : value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  get(key: string): unknown {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }
    return typeof entry.value === 'object' ? JSON.parse(JSON.stringify(entry.value)) : entry.value;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export interface JobEntry {
  readonly jobId: string;
  readonly type: string;
  readonly payload: Record<string, unknown>;
  readonly status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  readonly createdAt: Date;
  readonly checksum: string;
}

export class BackgroundJobScheduler {
  private jobs: JobEntry[] = [];

  schedule(type: string, payload: Record<string, unknown>): JobEntry {
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ jobId, type, payload }))
      .digest('hex');
    const job: JobEntry = Object.freeze({
      jobId,
      type,
      payload: { ...payload },
      status: 'PENDING',
      createdAt: new Date(),
      checksum,
    });
    this.jobs.push(job);
    return job;
  }

  getPending(): JobEntry[] {
    return this.jobs.filter((j) => j.status === 'PENDING');
  }

  getAll(): JobEntry[] {
    return [...this.jobs];
  }
}

export interface QueueMessage {
  readonly messageId: string;
  readonly queue: string;
  readonly payload: Record<string, unknown>;
  readonly enqueuedAt: Date;
  readonly checksum: string;
}

export class QueueManager {
  private queues = new Map<string, QueueMessage[]>();

  enqueue(queue: string, payload: Record<string, unknown>): QueueMessage {
    const messageId = `qm-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ messageId, queue, payload }))
      .digest('hex');
    const msg: QueueMessage = Object.freeze({
      messageId,
      queue,
      payload: { ...payload },
      enqueuedAt: new Date(),
      checksum,
    });
    const existing = this.queues.get(queue) ?? [];
    existing.push(msg);
    this.queues.set(queue, existing);
    return msg;
  }

  dequeue(queue: string): QueueMessage | undefined {
    const q = this.queues.get(queue);
    if (!q || q.length === 0) return undefined;
    return q.shift();
  }

  size(queue: string): number {
    return (this.queues.get(queue) ?? []).length;
  }

  getQueues(): string[] {
    return Array.from(this.queues.keys());
  }
}

export class DistributedLockManager {
  private locks = new Map<string, { owner: string; expiresAt: number }>();

  acquire(resource: string, owner: string, ttlMs: number = 30000): boolean {
    const existing = this.locks.get(resource);
    if (existing && Date.now() < existing.expiresAt) return false;
    this.locks.set(resource, { owner, expiresAt: Date.now() + ttlMs });
    return true;
  }

  release(resource: string, owner: string): boolean {
    const lock = this.locks.get(resource);
    if (!lock || lock.owner !== owner) return false;
    this.locks.delete(resource);
    return true;
  }

  isLocked(resource: string): boolean {
    const lock = this.locks.get(resource);
    if (!lock) return false;
    if (Date.now() > lock.expiresAt) {
      this.locks.delete(resource);
      return false;
    }
    return true;
  }

  getOwner(resource: string): string | undefined {
    return this.locks.get(resource)?.owner;
  }
}
