import { MemoryQueueProvider } from './memory/memory-queue.js';
import { MemoryLockProvider } from './memory/memory-lock.js';
import { BullMQProvider } from './bullmq/bullmq-queue.js';
import { RedisLockProvider } from './redis/redis-lock.js';
import type { IQueueProvider, ILockProvider } from './interfaces.js';

export interface AdapterConfig {
  type: 'memory' | 'redis';
  redisUrl?: string;
}

export function createQueueProvider(config: AdapterConfig): IQueueProvider {
  if (config.type === 'redis') {
    return new BullMQProvider(config.redisUrl);
  }
  return new MemoryQueueProvider();
}

export function createLockProvider(config: AdapterConfig): ILockProvider {
  if (config.type === 'redis') {
    return new RedisLockProvider(config.redisUrl);
  }
  return new MemoryLockProvider();
}
