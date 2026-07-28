[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-adapters](../README.md) / IProvider

# Interface: IProvider

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:55](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L55)

## Extended by

- [`IQueueProvider`](IQueueProvider.md)
- [`ILockProvider`](ILockProvider.md)
- [`IStorageProvider`](IStorageProvider.md)
- [`ITelemetryProvider`](ITelemetryProvider.md)
- [`ISecretProvider`](ISecretProvider.md)
- [`IWorkerDiscoveryProvider`](IWorkerDiscoveryProvider.md)

## Methods

### getCapabilities()

> **getCapabilities**(): [`ProviderCapabilities`](ProviderCapabilities.md)

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:57](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L57)

#### Returns

[`ProviderCapabilities`](ProviderCapabilities.md)

---

### getMetadata()

> **getMetadata**(): [`ProviderMetadata`](ProviderMetadata.md)

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:56](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L56)

#### Returns

[`ProviderMetadata`](ProviderMetadata.md)

---

### getMetrics()

> **getMetrics**(): [`ProviderMetrics`](ProviderMetrics.md)

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:59](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L59)

#### Returns

[`ProviderMetrics`](ProviderMetrics.md)

---

### healthCheck()

> **healthCheck**(): `Promise`\<[`ProviderHealth`](ProviderHealth.md)>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:58](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L58)

#### Returns

`Promise`\<[`ProviderHealth`](ProviderHealth.md)\>
