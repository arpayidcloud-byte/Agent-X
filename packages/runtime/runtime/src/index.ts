/**
 * @module runtime
 * @description Production Runtime Integration Package.
 * Orchestrates all engines into a single execution entry point.
 */

// Core interfaces and types
export type {
  RuntimeState,
  SessionStatus,
  RuntimeSession,
  ExecutionSession,
  RuntimeConfig,
  RuntimeMetrics,
  ErrorSeverity,
} from './interfaces.js';
export type {
  AuditRecord as BaseAuditRecord,
  HealthStatus,
  ResourceLimits,
  RuntimeError as BaseRuntimeError,
} from './interfaces.js';
export {
  RuntimeError,
  RuntimeRecoverableError,
  RuntimeNonRecoverableError,
  RuntimeTimeoutError,
  RuntimeCancellationError,
  RuntimeResourceLimitError,
  RuntimeWorkflowFailureError,
  RuntimeApprovalFailureError,
  RuntimeAgentFailureError,
  RuntimeToolFailureError,
  RuntimeContextFailureError,
  RuntimeMemoryFailureError,
  RuntimeKnowledgeFailureError,
  RuntimePlannerFailureError,
} from './errors.js';

// Core runtime
export * from './runtime.js';
export * from './runtime-config.js';
export * from './runtime-state.js';
export * from './runtime-session.js';
export * from './runtime-executor.js';
export * from './runtime-bootstrap.js';
export * from './runtime-context.js';
export * from './runtime-hooks.js';
export * from './runtime-events.js';
export * from './runtime-metrics.js';
export * from './runtime-registry.js';
export * from './runtime-lifecycle.js';

// Production integration (M4.1)
export * from './audit-store.js';
export * from './audit-postgres.js';
export * from './checkpoint-store.js';
export * from './execution-pipeline.js';
export * from './runtime-observability.js';
export * from './runtime-recovery.js';
export * from './runtime-health-v2.js';
export * from './runtime-supervisor-v2.js';
export * from './runtime-di.js';
export * from './runtime-bootstrap-v2.js';
export * from './runtime-integration.js';
export * from './coordinator/index.js';

// Internal core runtime exports needed for tests and internals
export * from './runtime-audit.js';
export * from './runtime-health.js';
