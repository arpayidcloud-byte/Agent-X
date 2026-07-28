[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-production](../README.md) / WorkerRegistry

# Class: WorkerRegistry

Defined in: [packages/runtime/runtime-production/src/worker-registry.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/worker-registry.ts#L9)

## Constructors

### Constructor

> **new WorkerRegistry**(): `WorkerRegistry`

#### Returns

`WorkerRegistry`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/runtime/runtime-production/src/worker-registry.ts:50](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/worker-registry.ts#L50)

#### Returns

`void`

---

### getWorker()

> **getWorker**(`workerId`): [`WorkerMetadata`](../interfaces/WorkerMetadata.md) \| `undefined`

Defined in: [packages/runtime/runtime-production/src/worker-registry.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/worker-registry.ts#L31)

#### Parameters

##### workerId

`string`

#### Returns

[`WorkerMetadata`](../interfaces/WorkerMetadata.md) \| `undefined`

---

### heartbeat()

> **heartbeat**(`workerId`): `void`

Defined in: [packages/runtime/runtime-production/src/worker-registry.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/worker-registry.ts#L23)

#### Parameters

##### workerId

`string`

#### Returns

`void`

---

### listWorkers()

> **listWorkers**(): [`WorkerMetadata`](../interfaces/WorkerMetadata.md)[]

Defined in: [packages/runtime/runtime-production/src/worker-registry.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/worker-registry.ts#L35)

#### Returns

[`WorkerMetadata`](../interfaces/WorkerMetadata.md)[]

---

### register()

> **register**(`worker`): `void`

Defined in: [packages/runtime/runtime-production/src/worker-registry.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/worker-registry.ts#L12)

#### Parameters

##### worker

[`WorkerMetadata`](../interfaces/WorkerMetadata.md)

#### Returns

`void`

---

### unregister()

> **unregister**(`workerId`): `void`

Defined in: [packages/runtime/runtime-production/src/worker-registry.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/worker-registry.ts#L19)

#### Parameters

##### workerId

`string`

#### Returns

`void`
