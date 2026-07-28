import { PrismaClient } from '@prisma/client';
import {
  PrismaTaskRepository,
  PrismaEventRepository,
  PrismaApprovalRepository,
} from '@agentx-fast/persistence';
import { BullMQProvider, RedisLockProvider } from '@agentx-fast/runtime-adapters';
import { Scheduler, InMemoryEventBus } from '@agentx-fast/core-runtime';
import { GracefulShutdownManager } from './graceful-shutdown-manager.js';

export class ProductionRuntime {
  public prisma: PrismaClient;
  public taskRepo: PrismaTaskRepository;
  public eventRepo: PrismaEventRepository;
  public approvalRepo: PrismaApprovalRepository;
  public queue: BullMQProvider;
  public lock: RedisLockProvider;
  public scheduler: Scheduler;
  public eventBus: InMemoryEventBus;
  public shutdownManager: GracefulShutdownManager;

  constructor(redisUrl: string = process.env.REDIS_URL || 'redis://localhost:6379') {
    this.prisma = new PrismaClient();
    this.taskRepo = new PrismaTaskRepository(this.prisma);
    this.eventRepo = new PrismaEventRepository(this.prisma);
    this.approvalRepo = new PrismaApprovalRepository(this.prisma);
    this.queue = new BullMQProvider(redisUrl);
    this.lock = new RedisLockProvider(redisUrl);
    this.eventBus = new InMemoryEventBus();
    this.shutdownManager = new GracefulShutdownManager();

    this.scheduler = new Scheduler(this.eventBus, this.taskRepo);
    this.setupShutdownHooks();
  }

  /**
   * Setup graceful shutdown hooks for resource cleanup.
   */
  private setupShutdownHooks(): void {
    // Register Prisma disconnect (most critical)
    this.shutdownManager.registerHook(async () => {
      await this.prisma.$disconnect();
      console.log('[SHUTDOWN] Prisma disconnected');
    });

    // Install signal handlers
    this.shutdownManager.installSignalHandlers();
  }

  async start() {
    await this.prisma.$connect();
    console.log('[RUNTIME] Production runtime started');
  }

  async stop(reason?: string) {
    console.log(`[RUNTIME] Stopping runtime: ${reason || 'manual'}`);
    await this.shutdownManager.initiateShutdown({
      reason: reason || 'Manual stop',
      timeoutMs: 30000,
    });
  }
}
