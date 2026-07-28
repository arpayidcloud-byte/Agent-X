/**
 * @module runtime/runtime-executor
 * @description Runtime executor orchestrating the complete execution pipeline.
 */

import type { RuntimeConfig, ExecutionSession } from './interfaces.js';
import { createAuditRecord, AuditStore } from './runtime-audit.js';
import { MetricsCollector } from './runtime-metrics.js';
import type { RuntimeEvent } from './runtime-events.js';
import { createRuntimeEvent } from './runtime-events.js';

export interface IRuntimePipeline {
  execute(session: ExecutionSession, config: RuntimeConfig): Promise<unknown>;
}

export class RuntimeExecutor {
  private auditStore: AuditStore;
  private metricsCollector: MetricsCollector;
  private events: RuntimeEvent[] = [];

  constructor(private pipeline: IRuntimePipeline) {
    this.auditStore = new AuditStore();
    this.metricsCollector = new MetricsCollector();
  }

  /**
   * Executes the full pipeline
   */
  async execute(session: ExecutionSession, _config: RuntimeConfig): Promise<unknown> {
    this.metricsCollector.startTiming();

    const startAudit = createAuditRecord({
      traceId: session.traceId,
      correlationId: '',
      sessionId: session.traceId,
      workflowId: session.id,
      timestamp: new Date(),
      result: 'success',
    });

    try {
      const result = await this.pipeline.execute(session, {} as RuntimeConfig);

      this.metricsCollector.recordExecutionTime();

      const endAudit = createAuditRecord({
        ...startAudit,
        durationMs: this.metricsCollector.getMetrics().executionTimeMs,
        result: 'success',
      });
      this.auditStore.record(endAudit);

      this.events.push(
        createRuntimeEvent('runtime.finished', session.id, session.traceId, { result }),
      );

      return result;
    } catch (error) {
      const errorAudit = createAuditRecord({
        ...startAudit,
        result: 'failure',
        metadata: { error: error instanceof Error ? error.message : String(error) },
      });
      this.auditStore.record(errorAudit);

      this.events.push(
        createRuntimeEvent('runtime.failed', session.id, session.traceId, { error: String(error) }),
      );

      throw error;
    }
  }

  getAuditStore(): AuditStore {
    return this.auditStore;
  }
  getMetricsCollector(): MetricsCollector {
    return this.metricsCollector;
  }
  getEvents(): RuntimeEvent[] {
    return [...this.events];
  }
}
