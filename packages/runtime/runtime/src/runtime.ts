/**
 * @module runtime/runtime
 * @description Main Production Runtime integrating all engines.
 */

import type { RuntimeSession, RuntimeMetrics, AuditRecord, RuntimeConfig } from './interfaces.js';
import { RuntimeLifecycle } from './runtime-lifecycle.js';
import { RuntimeExecutor } from './runtime-executor.js';
import { RuntimeSupervisor } from './runtime-supervisor.js';
import { RuntimeHookManager } from './runtime-hooks.js';
import type { RuntimeHook } from './runtime-hooks.js';
import type { AuditStore } from './runtime-audit.js';
import type { MetricsCollector } from './runtime-metrics.js';
import { HealthChecker } from './runtime-health.js';
import { createRuntimeSession, createExecutionSession } from './runtime-session.js';
import type { BootstrapOptions } from './runtime-bootstrap.js';
import { createBootstrapConfig } from './runtime-bootstrap.js';
import { RuntimeError } from './errors.js';
import type { IEventBus } from '@agentx-fast/core-runtime';
import type { IRuntimePipeline } from './runtime-executor.js';
import type { CoordinatorSession, CoordinatorConfig } from './coordinator/index.js';
import { ProductionExecutionCoordinator } from './coordinator/index.js';

export class Runtime {
  private lifecycle: RuntimeLifecycle;
  private executor: RuntimeExecutor;
  private supervisor: RuntimeSupervisor;
  private hookManager: RuntimeHookManager;
  private auditStore: AuditStore;
  private metricsCollector: MetricsCollector;
  private healthChecker: HealthChecker;
  private runtimeConfig: RuntimeConfig;
  private sessions = new Map<string, RuntimeSession>();
  private coordinator: ProductionExecutionCoordinator;

  constructor(
    private eventBus: IEventBus,
    pipeline: IRuntimePipeline,
    options: BootstrapOptions = {},
  ) {
    const bootstrap = createBootstrapConfig(options);
    this.runtimeConfig = bootstrap.config;
    this.lifecycle = new RuntimeLifecycle();
    this.executor = new RuntimeExecutor(pipeline);
    this.supervisor = new RuntimeSupervisor();
    this.hookManager = new RuntimeHookManager();
    this.auditStore = this.executor.getAuditStore();
    this.metricsCollector = this.executor.getMetricsCollector();
    this.healthChecker = new HealthChecker();

    const coordinatorConfig: CoordinatorConfig = {
      maxParallelExecutions: 10,
      maxQueueSize: 100,
      defaultTimeoutMs: 60000,
      retryBudget: 3,
      tokenBudget: 500000,
      costBudget: 100.0,
    };
    this.coordinator = new ProductionExecutionCoordinator(eventBus, coordinatorConfig);
  }

  async start(): Promise<RuntimeSession> {
    this.lifecycle.transition('INITIALIZING');
    await this.coordinator.start();
    const session = createRuntimeSession('system');
    this.sessions.set(session.id, session);
    this.lifecycle.transition('PLANNING');
    this.lifecycle.transition('RUNNING');
    this.supervisor.start();
    this.metricsCollector.startTiming();
    return session;
  }

  async executeGoal(
    sessionId: string,
    goal: string,
    _context: Record<string, unknown> = {},
  ): Promise<unknown> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new RuntimeError('Session not found', 'SESSION_NOT_FOUND', 'runtime');
    const execSession = createExecutionSession(session.traceId, goal);

    const coordSession: CoordinatorSession = {
      id: sessionId,
      traceId: session.traceId,
      correlationId: session.correlationId,
      goal,
      status: 'ACTIVE',
      startedAt: new Date(),
      metadata: {},
    };

    try {
      await this.coordinator.execute(coordSession);

      const result = await this.executor.execute(execSession, this.runtimeConfig);
      const currentState = this.lifecycle.getState();
      if (currentState === 'RUNNING') {
        this.lifecycle.transition('COMPLETED');
      }
      await this.eventBus.publish('runtime.finished', { sessionId, result }, session.traceId);
      return result;
    } catch (error) {
      const currentState = this.lifecycle.getState();
      if (
        currentState !== 'FAILED' &&
        currentState !== 'COMPLETED' &&
        currentState !== 'CANCELLED'
      ) {
        this.lifecycle.transition('FAILED');
      }
      await this.hookManager.executeOnError(
        session,
        error instanceof Error ? error : new Error(String(error)),
      );
      throw error;
    }
  }

  pause(): void {
    if (this.lifecycle.getState() === 'RUNNING') {
      this.lifecycle.transition('WAITING_APPROVAL');
      this.supervisor.pause();
    }
  }

  resume(): void {
    if (this.lifecycle.getState() === 'WAITING_APPROVAL') {
      this.lifecycle.transition('RUNNING');
      this.supervisor.resume();
    }
  }

  cancel(): void {
    if (this.lifecycle.getState() !== 'COMPLETED' && this.lifecycle.getState() !== 'CANCELLED') {
      this.lifecycle.transition('CANCELLED');
      this.supervisor.stop();
    }
  }

  getMetrics(): RuntimeMetrics {
    return this.metricsCollector.getMetrics();
  }

  getHealthStatus() {
    return this.healthChecker.checkAll();
  }

  getAuditRecords(): AuditRecord[] {
    return this.auditStore.getAll();
  }

  getSession(sessionId: string): RuntimeSession | undefined {
    return this.sessions.get(sessionId);
  }

  addHook(hook: RuntimeHook): void {
    this.hookManager.register(hook);
  }

  getState(): string {
    return this.lifecycle.getState();
  }

  getCoordinator(): ProductionExecutionCoordinator {
    return this.coordinator;
  }
}
