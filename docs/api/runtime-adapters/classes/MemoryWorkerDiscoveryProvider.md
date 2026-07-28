[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-adapters](../README.md) / MemoryWorkerDiscoveryProvider

# Class: MemoryWorkerDiscoveryProvider

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-worker-discovery.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-worker-discovery.ts#L14)

## Implements

- [`IWorkerDiscoveryProvider`](../interfaces/IWorkerDiscoveryProvider.md)

## Constructors

### Constructor

> **new MemoryWorkerDiscoveryProvider**(): `MemoryWorkerDiscoveryProvider`

#### Returns

`MemoryWorkerDiscoveryProvider`

## Methods

### discover()

> **discover**(`capability`): `Promise`\<`string`[]\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-worker-discovery.ts:65](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-worker-discovery.ts#L65)

#### Parameters

##### capability

`string`

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`IWorkerDiscoveryProvider`](../interfaces/IWorkerDiscoveryProvider.md).[`discover`](../interfaces/IWorkerDiscoveryProvider.md#discover)

---

### getCapabilities()

> **getCapabilities**(): [`ProviderCapabilities`](../interfaces/ProviderCapabilities.md)

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-worker-discovery.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-worker-discovery.ts#L30)

#### Returns

[`ProviderCapabilities`](../interfaces/ProviderCapabilities.md)

#### Implementation of

[`IWorkerDiscoveryProvider`](../interfaces/IWorkerDiscoveryProvider.md).[`getCapabilities`](../interfaces/IWorkerDiscoveryProvider.md#getcapabilities)

---

### getMetadata()

> **getMetadata**(): [`ProviderMetadata`](../interfaces/ProviderMetadata.md)

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-worker-discovery.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-worker-discovery.ts#L21)

#### Returns

[`ProviderMetadata`](../interfaces/ProviderMetadata.md)

#### Implementation of

[`IWorkerDiscoveryProvider`](../interfaces/IWorkerDiscoveryProvider.md).[`getMetadata`](../interfaces/IWorkerDiscoveryProvider.md#getmetadata)

---

### getMetrics()

> **getMetrics**(): [`ProviderMetrics`](../interfaces/ProviderMetrics.md)

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-worker-discovery.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-worker-discovery.ts#L38)

#### Returns

[`ProviderMetrics`](../interfaces/ProviderMetrics.md)

#### Implementation of

[`IWorkerDiscoveryProvider`](../interfaces/IWorkerDiscoveryProvider.md).[`getMetrics`](../interfaces/IWorkerDiscoveryProvider.md#getmetrics)

---

### healthCheck()

> **healthCheck**(): `Promise`\<[`ProviderHealth`](../interfaces/ProviderHealth.md)>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-worker-discovery.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-worker-discovery.ts#L34)

#### Returns

`Promise`\<[`ProviderHealth`](../interfaces/ProviderHealth.md)\>

#### Implementation of

[`IWorkerDiscoveryProvider`](../interfaces/IWorkerDiscoveryProvider.md).[`healthCheck`](../interfaces/IWorkerDiscoveryProvider.md#healthcheck)

---

### heartbeat()

> **heartbeat**(`_workerId`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-worker-discovery.ts:53](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-worker-discovery.ts#L53)

#### Parameters

##### \_workerId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IWorkerDiscoveryProvider`](../interfaces/IWorkerDiscoveryProvider.md).[`heartbeat`](../interfaces/IWorkerDiscoveryProvider.md#heartbeat)

---

### listWorkers()

> **listWorkers**(): `Promise`\<`object`[]\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-worker-discovery.ts:57](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-worker-discovery.ts#L57)

#### Returns

`Promise`\<`object`[]\>

#### Implementation of

[`IWorkerDiscoveryProvider`](../interfaces/IWorkerDiscoveryProvider.md).[`listWorkers`](../interfaces/IWorkerDiscoveryProvider.md#listworkers)

---

### registerWorker()

> **registerWorker**(`workerId`, `metadata`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-worker-discovery.ts:47](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-worker-discovery.ts#L47)

#### Parameters

##### workerId

`string`

##### metadata

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IWorkerDiscoveryProvider`](../interfaces/IWorkerDiscoveryProvider.md).[`registerWorker`](../interfaces/IWorkerDiscoveryProvider.md#registerworker)

---

### removeWorker()

> **removeWorker**(`workerId`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-worker-discovery.ts:61](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-worker-discovery.ts#L61)

#### Parameters

##### workerId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IWorkerDiscoveryProvider`](../interfaces/IWorkerDiscoveryProvider.md).[`removeWorker`](../interfaces/IWorkerDiscoveryProvider.md#removeworker)
