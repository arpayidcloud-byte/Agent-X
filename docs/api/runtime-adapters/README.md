[**agentx-workspace**](../README.md)

---

[agentx-workspace](../README.md) / runtime-adapters

# runtime-adapters

## Description

Production Adapter Layer barrel exports.

## Classes

- [AdapterError](classes/AdapterError.md)
- [BullMQProvider](classes/BullMQProvider.md)
- [InMemoryTaskRepository](classes/InMemoryTaskRepository.md)
- [MemoryLockProvider](classes/MemoryLockProvider.md)
- [MemoryQueueProvider](classes/MemoryQueueProvider.md)
- [MemorySecretProvider](classes/MemorySecretProvider.md)
- [MemoryStorageProvider](classes/MemoryStorageProvider.md)
- [MemoryTelemetryProvider](classes/MemoryTelemetryProvider.md)
- [MemoryWorkerDiscoveryProvider](classes/MemoryWorkerDiscoveryProvider.md)
- [ProviderCapabilityResolver](classes/ProviderCapabilityResolver.md)
- [ProviderFailoverManager](classes/ProviderFailoverManager.md)
- [ProviderHealthMonitor](classes/ProviderHealthMonitor.md)
- [ProviderRegistry](classes/ProviderRegistry.md)
- [ProviderResolutionError](classes/ProviderResolutionError.md)
- [ProviderUnavailableError](classes/ProviderUnavailableError.md)
- [RedisLockProvider](classes/RedisLockProvider.md)
- [UnsupportedProviderCapabilityError](classes/UnsupportedProviderCapabilityError.md)

## Interfaces

- [AdapterConfig](interfaces/AdapterConfig.md)
- [ILockProvider](interfaces/ILockProvider.md)
- [IProvider](interfaces/IProvider.md)
- [IQueueProvider](interfaces/IQueueProvider.md)
- [ISecretProvider](interfaces/ISecretProvider.md)
- [IStorageProvider](interfaces/IStorageProvider.md)
- [ITelemetryProvider](interfaces/ITelemetryProvider.md)
- [IWorkerDiscoveryProvider](interfaces/IWorkerDiscoveryProvider.md)
- [ProviderCapabilities](interfaces/ProviderCapabilities.md)
- [ProviderConfiguration](interfaces/ProviderConfiguration.md)
- [ProviderContext](interfaces/ProviderContext.md)
- [ProviderFactory](interfaces/ProviderFactory.md)
- [ProviderHealth](interfaces/ProviderHealth.md)
- [ProviderMetadata](interfaces/ProviderMetadata.md)
- [ProviderMetrics](interfaces/ProviderMetrics.md)
- [ProviderStatistics](interfaces/ProviderStatistics.md)
- [TelemetrySpanRecord](interfaces/TelemetrySpanRecord.md)

## Type Aliases

- [ProviderStatus](type-aliases/ProviderStatus.md)

## Functions

- [createLockProvider](functions/createLockProvider.md)
- [createQueueProvider](functions/createQueueProvider.md)
