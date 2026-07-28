/**
 * @module coordinator/coordinator.test
 * @description Comprehensive tests for the Production Execution Coordinator (M4.1.5).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ProductionExecutionCoordinator,
  CoordinatorConfig,
  CoordinatorSession,
  CoordinatorStateMachine,
  CoordinatorMetricsCollector,
  CoordinatorAuditLogger,
  CoordinatorHookManager,
  CoordinatorRegistry,
  CoordinatorHealthChecker,
  ExecutionScheduler,
  ExecutionDispatcher,
  ExecutionReservationManager,
  ConcurrencyController,
  CoordinatorBootstrap,
  createCoordinatorContext,
  extendCoordinatorContext,
  createCoordinatorEvent,
  CoordinatorError,
  CoordinatorStateError,
  CoordinatorExecutionError,
  CoordinatorReservationError,
  CoordinatorSchedulingError,
  CoordinatorTimeoutError,
  CoordinatorCancelledError,
  CoordinatorDependencyError,
  CoordinatorBatchError,
  CoordinatorConcurrencyError,
  CoordinatorResourceLimitError,
  CoordinatorRecoveryError,
} from '../src/coordinator/index.js';
import { IEventBus } from '@agentx-fast/core-runtime';

const mockEventBus: IEventBus = {
  publish: vi.fn().mockResolvedValue(undefined),
  subscribe: vi.fn(),
  unsubscribe: vi.fn(),
};

const defaultConfig: CoordinatorConfig = {
  maxParallelExecutions: 10,
  maxQueueSize: 100,
  defaultTimeoutMs: 60000,
  retryBudget: 3,
  tokenBudget: 100000,
  costBudget: 50.0,
};

describe('Coordinator State Machine', () => {
  it('starts in CREATED state', () => {
    const sm = new CoordinatorStateMachine();
    expect(sm.getState()).toBe('CREATED');
  });

  it('validates valid transitions', () => {
    const sm = new CoordinatorStateMachine();
    sm.transition('INITIALIZING');
    sm.transition('READY');
    sm.transition('SCHEDULING');
    sm.transition('DISPATCHING');
    sm.transition('EXECUTING');
    sm.transition('COMPLETED');
    expect(sm.getState()).toBe('COMPLETED');
  });

  it('rejects invalid transitions', () => {
    const sm = new CoordinatorStateMachine();
    expect(() => sm.transition('COMPLETED')).toThrow(CoordinatorStateError);
  });

  it('resets state', () => {
    const sm = new CoordinatorStateMachine();
    sm.transition('INITIALIZING');
    sm.reset();
    expect(sm.getState()).toBe('CREATED');
  });
});

describe('Coordinator Context', () => {
  it('creates and extends context', () => {
    const ctx = createCoordinatorContext('t1', 's1', 'e1');
    expect(ctx.traceId).toBe('t1');
    const ext = extendCoordinatorContext(ctx, { metadata: { a: 1 } });
    expect(ext.metadata.a).toBe(1);
  });
});

describe('Coordinator Events', () => {
  it('creates coordinator event', () => {
    const event = createCoordinatorEvent('coordinator.started', 's1', 't1');
    expect(event.type).toBe('coordinator.started');
    expect(event.sessionId).toBe('s1');
  });
});

describe('Coordinator Hooks', () => {
  it('executes hooks', async () => {
    const manager = new CoordinatorHookManager();
    const session = {
      id: 's1',
      traceId: 't1',
      correlationId: 'c1',
      goal: 'test',
      status: 'ACTIVE' as const,
      startedAt: new Date(),
      metadata: {},
    };
    const hook = {
      name: 'test',
      beforeExecution: vi.fn(),
      afterExecution: vi.fn(),
      onDispatch: vi.fn(),
      onRetry: vi.fn(),
    };
    manager.register(hook);
    await manager.executeBeforeExecution(session);
    await manager.executeAfterExecution(session, {});
    await manager.executeOnDispatch(session, 'PLANNING');
    await manager.executeOnRetry(session, 'PLANNING', 1);
    expect(hook.beforeExecution).toHaveBeenCalled();
  });
});

describe('Coordinator Audit', () => {
  it('logs and retrieves records', () => {
    const logger = new CoordinatorAuditLogger();
    const record = logger.log('s1', 't1', 'action', 'PLANNING', 'success');
    expect(logger.getRecords()).toHaveLength(1);
    expect(record.action).toBe('action');
  });
});

describe('Coordinator Metrics', () => {
  it('tracks metrics', () => {
    const collector = new CoordinatorMetricsCollector();
    collector.incrementExecutions();
    collector.incrementCompleted(100);
    const metrics = collector.getMetrics();
    expect(metrics.totalExecutions).toBe(1);
    expect(metrics.completedExecutions).toBe(1);
  });
});

describe('Coordinator Registry', () => {
  it('registers and resolves services', () => {
    const registry = new CoordinatorRegistry();
    registry.register('service', { name: 'test' });
    expect(registry.resolve('service')).toEqual({ name: 'test' });
  });
});

describe('Coordinator Health', () => {
  it('checks health', () => {
    const health = new CoordinatorHealthChecker();
    health.register('test', () => ({ component: 'test', healthy: true, details: {} }));
    expect(health.isHealthy()).toBe(true);
  });
});

describe('Execution Scheduler', () => {
  it('schedules and dequeues tickets', () => {
    const scheduler = new ExecutionScheduler();
    const ticket = {
      id: 't1',
      sessionId: 's1',
      phase: 'PLANNING' as const,
      priority: 1,
      status: 'PENDING' as const,
    };
    scheduler.schedule(ticket);
    expect(scheduler.getQueueSize()).toBe(1);
    const dequeued = scheduler.dequeue();
    expect(dequeued?.id).toBe('t1');
  });
});

describe('Execution Dispatcher', () => {
  it('dispatches to registered engines', async () => {
    const dispatcher = new ExecutionDispatcher();
    const mockEngine = { execute: vi.fn().mockResolvedValue('result') };
    dispatcher.registerEngine('PLANNING', mockEngine);
    const ticket = {
      id: 't1',
      sessionId: 's1',
      phase: 'PLANNING' as const,
      priority: 1,
      status: 'EXECUTING' as const,
    };
    await dispatcher.dispatch(ticket);
    expect(mockEngine.execute).toHaveBeenCalled();
  });
});

describe('Execution Reservation', () => {
  it('manages reservations', () => {
    const manager = new ExecutionReservationManager();
    const res = manager.reserve('worker', 10, 1000);
    manager.allocate(res.id, 5);
    expect(manager.getReservations()).toHaveLength(1);
    manager.release(res.id);
    expect(manager.getReservations()).toHaveLength(0);
  });
});

describe('Concurrency Controller', () => {
  it('manages concurrency limits', () => {
    const controller = new ConcurrencyController({
      maxWorkers: 2,
      maxTools: 10,
      maxProviders: 10,
      maxApprovals: 10,
      maxAgents: 10,
      maxQueueSize: 100,
      maxParallel: 10,
      maxBatch: 5,
    });
    expect(controller.canAcquire('worker')).toBe(true);
    controller.acquire('worker');
    controller.acquire('worker');
    expect(controller.canAcquire('worker')).toBe(false);
    controller.release('worker');
    expect(controller.canAcquire('worker')).toBe(true);
  });
});

describe('Coordinator Errors', () => {
  it('covers all error types and properties', () => {
    const errorTypes = [
      CoordinatorStateError,
      CoordinatorExecutionError,
      CoordinatorReservationError,
      CoordinatorSchedulingError,
      CoordinatorTimeoutError,
      CoordinatorCancelledError,
      CoordinatorDependencyError,
      CoordinatorBatchError,
      CoordinatorConcurrencyError,
      CoordinatorResourceLimitError,
      CoordinatorRecoveryError,
    ];

    for (const Err of errorTypes) {
      const err = new Err('test msg', 'test src');
      expect(err.message).toBe('test msg');
      expect(err.source).toBe('test src');
      expect(err.code).toBeDefined();
    }

    const baseErr = new CoordinatorError('msg', 'CODE', 'src');
    expect(baseErr.message).toBe('msg');
    expect(baseErr.code).toBe('CODE');
    expect(baseErr.source).toBe('src');
  });
});

describe('Production Execution Coordinator', () => {
  let coordinator: ProductionExecutionCoordinator;

  beforeEach(async () => {
    coordinator = new ProductionExecutionCoordinator(mockEventBus, defaultConfig);
    await coordinator.start();
  });

  it('starts and executes goals', async () => {
    const session: CoordinatorSession = {
      id: 's1',
      traceId: 't1',
      correlationId: 'c1',
      goal: 'build',
      status: 'ACTIVE',
      startedAt: new Date(),
      metadata: {},
    };
    await coordinator.execute(session);
    expect(coordinator.getState()).toBe('COMPLETED');
  });

  it('handles execution failure', async () => {
    const session: CoordinatorSession = {
      id: 's2',
      traceId: 't2',
      correlationId: 'c2',
      goal: 'fail',
      status: 'ACTIVE',
      startedAt: new Date(),
      metadata: { fail: true },
    };
    try {
      await coordinator.execute(session);
    } catch (e) {}
    expect(coordinator.getState()).toBe('FAILED');
  });

  it('retrieves coordinator sub-components', () => {
    expect(coordinator.getMetrics()).toBeDefined();
    expect(coordinator.getAuditLogger()).toBeDefined();
    expect(coordinator.getHookManager()).toBeDefined();
    expect(coordinator.getScheduler()).toBeDefined();
    expect(coordinator.getDispatcher()).toBeDefined();
    expect(coordinator.getReservationManager()).toBeDefined();
    expect(coordinator.getConcurrencyController()).toBeDefined();
    expect(coordinator.getRegistry()).toBeDefined();
    expect(coordinator.getStatistics()).toBeDefined();
  });
});

describe('Coordinator Bootstrap', () => {
  it('bootstraps coordinator', async () => {
    const bootstrap = new CoordinatorBootstrap();
    const coordinator = await bootstrap.bootstrap({ eventBus: mockEventBus });
    expect(coordinator).toBeDefined();
  });
});

describe('Execution Scheduler additional functions', () => {
  it('covers cancel, batching, dequeue, peek, and clear', () => {
    const scheduler = new ExecutionScheduler();
    const t1 = {
      id: 't1',
      sessionId: 's1',
      phase: 'PLANNING' as const,
      priority: 1,
      status: 'PENDING' as const,
    };
    const t2 = {
      id: 't2',
      sessionId: 's1',
      phase: 'PLANNING' as const,
      priority: 2,
      status: 'PENDING' as const,
    };
    scheduler.schedule(t1);
    scheduler.schedule(t2);
    expect(scheduler.peek()?.id).toBe('t2');
    scheduler.cancel('t2');
    expect(scheduler.peek()?.id).toBe('t1');
    const batch = scheduler.createBatch([t1]);
    expect(batch.status).toBe('PENDING');
    scheduler.completeBatch(batch.id);
    scheduler.completeBatch('non-existent');
    scheduler.clear();
    expect(scheduler.getQueueSize()).toBe(0);
  });
});

describe('Execution Reservation manager edge cases', () => {
  it('covers expired reservations and allocate failures', () => {
    const manager = new ExecutionReservationManager();
    const res = manager.reserve('worker', 5, -100);
    expect(() => manager.allocate(res.id, 1)).toThrow(CoordinatorReservationError);
    expect(() => manager.allocate('non-existent', 1)).toThrow(CoordinatorReservationError);

    const activeRes = manager.reserve('worker', 5, 10000);
    expect(() => manager.allocate(activeRes.id, 10)).toThrow(CoordinatorReservationError);

    manager.clear();
    expect(manager.getReservations()).toHaveLength(0);
  });
});

describe('Concurrency Controller limits', () => {
  it('covers all limits', () => {
    const controller = new ConcurrencyController({
      maxWorkers: 1,
      maxTools: 1,
      maxProviders: 1,
      maxApprovals: 1,
      maxAgents: 1,
      maxQueueSize: 1,
      maxParallel: 1,
      maxBatch: 1,
    });
    const limits = [
      'worker',
      'tool',
      'provider',
      'approval',
      'agent',
      'queue',
      'parallel',
      'batch',
      'unknown',
    ];
    for (const lim of limits) {
      expect(controller.canAcquire(lim)).toBe(true);
      controller.acquire(lim);
      if (lim !== 'unknown') {
        expect(controller.canAcquire(lim)).toBe(false);
      }
      controller.release(lim);
      controller.getUsage(lim);
    }
    controller.reset();
  });
});

describe('Coordinator Registry additional coverage', () => {
  it('covers throws for missing service, clear, and has checks', () => {
    const registry = new CoordinatorRegistry();
    expect(() => registry.resolve('missing')).toThrow();
    expect(registry.has('missing')).toBe(false);
    registry.register('a', 1);
    expect(registry.has('a')).toBe(true);
    registry.clear();
    expect(registry.has('a')).toBe(false);
  });
});

describe('Coordinator Health Checker registration and check methods', () => {
  it('covers check of missing component and checkAll', () => {
    const health = new CoordinatorHealthChecker();
    expect(health.check('missing').healthy).toBe(false);
    health.register('a', () => ({ component: 'a', healthy: true, details: {} }));
    health.register('b', () => ({ component: 'b', healthy: false, details: {} }));
    expect(health.isHealthy()).toBe(false);
  });
});

describe('Coordinator Hooks manager edge cases', () => {
  it('covers hooks omission and clear method', async () => {
    const manager = new CoordinatorHookManager();
    const session = {
      id: 's1',
      traceId: 't1',
      correlationId: 'c1',
      goal: 'test',
      status: 'ACTIVE' as const,
      startedAt: new Date(),
      metadata: {},
    };
    await manager.executeBeforeExecution(session);
    await manager.executeAfterExecution(session, {});
    await manager.executeOnDispatch(session, 'PLANNING');
    await manager.executeOnRetry(session, 'PLANNING', 1);

    manager.register({ name: 'hook' });
    manager.unregister('hook');
    manager.clear();
  });
});

describe('Coordinator Audit log methods', () => {
  it('covers clear method', () => {
    const logger = new CoordinatorAuditLogger();
    logger.log('s1', 't1', 'action', 'PLANNING', 'success');
    logger.clear();
    expect(logger.getRecords()).toHaveLength(0);
  });
});

describe('Coordinator Metrics Collector reset and decrement edge cases', () => {
  it('covers decrement active below zero and reset', () => {
    const collector = new CoordinatorMetricsCollector();
    collector.decrementActive();
    expect(collector.getMetrics().activeExecutions).toBe(0);

    collector.incrementExecutions();
    collector.incrementFailed(100);
    collector.incrementCancelled();
    collector.incrementRetries();
    collector.incrementRecoveries();
    collector.addQueueTime(50);

    collector.reset();
    expect(collector.getMetrics().totalExecutions).toBe(0);
  });
});

describe('Execution Dispatcher missing engine throw', () => {
  it('throws when dispatching to unregistered phase', async () => {
    const dispatcher = new ExecutionDispatcher();
    const ticket = {
      id: 't1',
      sessionId: 's1',
      phase: 'PLANNING' as const,
      priority: 1,
      status: 'EXECUTING' as const,
    };
    await expect(dispatcher.dispatch(ticket)).rejects.toThrow(CoordinatorExecutionError);
  });
});

describe('Coordinator State Machine transition validation', () => {
  it('validates transition list and canTransition checks', () => {
    const sm = new CoordinatorStateMachine();
    expect(sm.getValidTransitions()).toContain('INITIALIZING');
    expect(sm.canTransition('READY')).toBe(false);
    sm.transition('INITIALIZING');
    expect(sm.isTerminal()).toBe(false);
    sm.transition('FAILED');
    expect(sm.isTerminal()).toBe(true);
    expect(sm.getHistory()).toHaveLength(2);
  });
});
