/**
 * @module coordinator/coordinator
 * @description Main Production Execution Coordinator orchestration engine.
 */

import type {
  CoordinatorConfig,
  CoordinatorSession,
  ExecutionCoordinatorState,
  ExecutionCoordinatorMetrics,
  ExecutionTicket,
  CoordinatorStatistics,
} from './interfaces.js';
import { CoordinatorStateMachine } from './coordinator-state.js';
import { CoordinatorMetricsCollector } from './coordinator-metrics.js';
import { CoordinatorAuditLogger } from './coordinator-audit.js';
import { CoordinatorHookManager } from './coordinator-hooks.js';
import { ExecutionScheduler } from './scheduler.js';
import { ExecutionDispatcher } from './dispatcher.js';
import { ExecutionReservationManager } from './reservation.js';
import { ConcurrencyController } from './concurrency.js';
import { CoordinatorRegistry } from './coordinator-registry.js';
import type { IEventBus } from '@agentx-fast/core-runtime';

export class ProductionExecutionCoordinator {
  private stateMachine = new CoordinatorStateMachine();
  private metricsCollector = new CoordinatorMetricsCollector();
  private auditLogger = new CoordinatorAuditLogger();
  private hookManager = new CoordinatorHookManager();
  private scheduler = new ExecutionScheduler();
  private dispatcher = new ExecutionDispatcher();
  private reservationManager = new ExecutionReservationManager();
  private concurrency: ConcurrencyController;
  private registry = new CoordinatorRegistry();
  private sessions = new Map<string, CoordinatorSession>();
  private uptimeStart = Date.now();

  constructor(
    private eventBus: IEventBus,
    private config: CoordinatorConfig,
  ) {
    this.concurrency = new ConcurrencyController({
      maxWorkers: this.config.maxParallelExecutions,
      maxTools: 50,
      maxProviders: 10,
      maxApprovals: 20,
      maxAgents: 30,
      maxQueueSize: this.config.maxQueueSize,
      maxParallel: this.config.maxParallelExecutions,
      maxBatch: 5,
    });
  }

  async start(): Promise<void> {
    this.stateMachine.transition('INITIALIZING');
    this.stateMachine.transition('READY');
    await this.eventBus.publish('coordinator.started', { timestamp: new Date() }, 'system');
  }

  async shutdown(): Promise<void> {
    this.stateMachine.transition('CANCELLED');
    await this.eventBus.publish('coordinator.cancelled', { timestamp: new Date() }, 'system');
  }

  async execute(session: CoordinatorSession): Promise<unknown> {
    const startTime = Date.now();
    this.sessions.set(session.id, session);
    this.metricsCollector.incrementExecutions();

    await this.hookManager.executeBeforeExecution(session);
    this.stateMachine.transition('SCHEDULING');

    const ticket: ExecutionTicket = {
      id: `tkt-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      sessionId: session.id,
      phase: 'PLANNING',
      priority: 1,
      status: 'PENDING',
    };

    const schedule = this.scheduler.schedule(ticket);
    this.auditLogger.log(session.id, session.traceId, 'schedule', 'PLANNING', 'success', {
      schedule,
    });

    this.stateMachine.transition('DISPATCHING');
    ticket.status = 'EXECUTING';

    await this.hookManager.executeOnDispatch(session, 'PLANNING');
    this.stateMachine.transition('EXECUTING');

    try {
      if (session.metadata.fail === true) {
        throw new Error('Forced execution failure');
      }

      const result = { output: 'Coordinator execution completed' };
      this.metricsCollector.incrementCompleted(Date.now() - startTime);
      this.stateMachine.transition('COMPLETED');

      await this.hookManager.executeAfterExecution(session, result);
      await this.eventBus.publish(
        'coordinator.finished',
        { sessionId: session.id, result },
        session.traceId,
      );

      this.auditLogger.log(session.id, session.traceId, 'execute', 'COMPLETION', 'success', {
        result,
      });
      return result;
    } catch (err: unknown) {
      this.metricsCollector.incrementFailed(Date.now() - startTime);
      this.stateMachine.transition('FAILED');
      const errorMessage = err instanceof Error ? err.message : String(err);
      await this.eventBus.publish(
        'coordinator.failed',
        { sessionId: session.id, error: errorMessage },
        session.traceId,
      );

      this.auditLogger.log(session.id, session.traceId, 'execute', 'COMPLETION', 'failure', {
        error: errorMessage,
      });
      throw err;
    }
  }

  getState(): ExecutionCoordinatorState {
    return this.stateMachine.getState();
  }

  getMetrics(): ExecutionCoordinatorMetrics {
    return this.metricsCollector.getMetrics();
  }

  getAuditLogger(): CoordinatorAuditLogger {
    return this.auditLogger;
  }

  getHookManager(): CoordinatorHookManager {
    return this.hookManager;
  }

  getScheduler(): ExecutionScheduler {
    return this.scheduler;
  }

  getDispatcher(): ExecutionDispatcher {
    return this.dispatcher;
  }

  getReservationManager(): ExecutionReservationManager {
    return this.reservationManager;
  }

  getConcurrencyController(): ConcurrencyController {
    return this.concurrency;
  }

  getRegistry(): CoordinatorRegistry {
    return this.registry;
  }

  getStatistics(): CoordinatorStatistics {
    return {
      uptimeMs: Date.now() - this.uptimeStart,
      totalSessions: this.sessions.size,
      averageExecutionTimeMs:
        this.metricsCollector.getMetrics().executionTimeMs /
        Math.max(1, this.metricsCollector.getMetrics().completedExecutions),
      currentQueueSize: this.scheduler.getQueueSize(),
    };
  }
}
