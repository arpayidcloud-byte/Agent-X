[**agentx-workspace**](../README.md)

---

[agentx-workspace](../README.md) / runtime-production

# runtime-production

## Description

Production Infrastructure & Distributed Runtime package exports.

## Classes

- [BackpressureController](classes/BackpressureController.md)
- [BackpressureError](classes/BackpressureError.md)
- [BullMQAdapter](classes/BullMQAdapter.md)
- [CircuitBreaker](classes/CircuitBreaker.md)
- [CircuitOpenError](classes/CircuitOpenError.md)
- [ClusterError](classes/ClusterError.md)
- [ClusterMembership](classes/ClusterMembership.md)
- [DeadLetterQueue](classes/DeadLetterQueue.md)
- [DistributedLockError](classes/DistributedLockError.md)
- [ExecutionDeduplicator](classes/ExecutionDeduplicator.md)
- [ExecutionLeaseManager](classes/ExecutionLeaseManager.md)
- [GracefulShutdownManager](classes/GracefulShutdownManager.md)
- [IdempotencyError](classes/IdempotencyError.md)
- [IdempotencyManager](classes/IdempotencyManager.md)
- [LeaseError](classes/LeaseError.md)
- [MemoryLockProvider](classes/MemoryLockProvider.md)
- [MemoryQueue](classes/MemoryQueue.md)
- [NATSAdapter](classes/NATSAdapter.md)
- [PostgresAdvisoryLockProvider](classes/PostgresAdvisoryLockProvider.md)
- [ProductionError](classes/ProductionError.md)
- [ProductionRuntime](classes/ProductionRuntime.md)
- [ProductionTelemetry](classes/ProductionTelemetry.md)
- [QueueError](classes/QueueError.md)
- [RedisLockProvider](classes/RedisLockProvider.md)
- [ShutdownError](classes/ShutdownError.md)
- [TemporalAdapter](classes/TemporalAdapter.md)
- [WorkerRegistry](classes/WorkerRegistry.md)
- [WorkerRegistryError](classes/WorkerRegistryError.md)

## Interfaces

- [BackpressureConfig](interfaces/BackpressureConfig.md)
- [CircuitBreakerConfig](interfaces/CircuitBreakerConfig.md)
- [CircuitBreakerMetrics](interfaces/CircuitBreakerMetrics.md)
- [ClusterNode](interfaces/ClusterNode.md)
- [IDistributedLockManager](interfaces/IDistributedLockManager.md)
- [IExecutionQueue](interfaces/IExecutionQueue.md)
- [LeaseInfo](interfaces/LeaseInfo.md)
- [LockInfo](interfaces/LockInfo.md)
- [LockOptions](interfaces/LockOptions.md)
- [QueueMessage](interfaces/QueueMessage.md)
- [TelemetryMetrics](interfaces/TelemetryMetrics.md)
- [TelemetrySpan](interfaces/TelemetrySpan.md)
- [WorkerMetadata](interfaces/WorkerMetadata.md)

## Type Aliases

- [ShutdownHook](type-aliases/ShutdownHook.md)
