[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [multi-agent-collaboration](../README.md) / SharedMemoryCoordinator

# Class: SharedMemoryCoordinator

Defined in: [packages/agent/multi-agent-collaboration/src/shared-memory-coordinator.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/shared-memory-coordinator.ts#L9)

## Constructors

### Constructor

> **new SharedMemoryCoordinator**(): `SharedMemoryCoordinator`

#### Returns

`SharedMemoryCoordinator`

## Methods

### delete()

> **delete**(`key`): `void`

Defined in: [packages/agent/multi-agent-collaboration/src/shared-memory-coordinator.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/shared-memory-coordinator.ts#L32)

#### Parameters

##### key

`string`

#### Returns

`void`

---

### get()

> **get**(`key`): [`SharedMemory`](../interfaces/SharedMemory.md) \| `undefined`

Defined in: [packages/agent/multi-agent-collaboration/src/shared-memory-coordinator.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/shared-memory-coordinator.ts#L28)

#### Parameters

##### key

`string`

#### Returns

[`SharedMemory`](../interfaces/SharedMemory.md) \| `undefined`

---

### put()

> **put**(`key`, `value`, `ownerAgentId`): [`SharedMemory`](../interfaces/SharedMemory.md)

Defined in: [packages/agent/multi-agent-collaboration/src/shared-memory-coordinator.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/shared-memory-coordinator.ts#L12)

#### Parameters

##### key

`string`

##### value

`unknown`

##### ownerAgentId

`string`

#### Returns

[`SharedMemory`](../interfaces/SharedMemory.md)
