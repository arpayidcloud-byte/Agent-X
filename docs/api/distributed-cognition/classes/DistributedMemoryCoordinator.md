[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / DistributedMemoryCoordinator

# Class: DistributedMemoryCoordinator

Defined in: [packages/distributed/distributed-cognition/src/domain/memory/DistributedMemoryCoordinator.ts:4](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/memory/DistributedMemoryCoordinator.ts#L4)

## Constructors

### Constructor

> **new DistributedMemoryCoordinator**(): `DistributedMemoryCoordinator`

#### Returns

`DistributedMemoryCoordinator`

## Methods

### delete()

> **delete**(`key`): `boolean`

Defined in: [packages/distributed/distributed-cognition/src/domain/memory/DistributedMemoryCoordinator.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/memory/DistributedMemoryCoordinator.ts#L33)

#### Parameters

##### key

`string`

#### Returns

`boolean`

---

### get()

> **get**(`key`): [`MemoryEntry`](../interfaces/MemoryEntry.md) \| `undefined`

Defined in: [packages/distributed/distributed-cognition/src/domain/memory/DistributedMemoryCoordinator.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/memory/DistributedMemoryCoordinator.ts#L23)

#### Parameters

##### key

`string`

#### Returns

[`MemoryEntry`](../interfaces/MemoryEntry.md) \| `undefined`

---

### getAll()

> **getAll**(): [`MemoryEntry`](../interfaces/MemoryEntry.md)[]

Defined in: [packages/distributed/distributed-cognition/src/domain/memory/DistributedMemoryCoordinator.ts:58](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/memory/DistributedMemoryCoordinator.ts#L58)

#### Returns

[`MemoryEntry`](../interfaces/MemoryEntry.md)[]

---

### restore()

> **restore**(`snapshot`): `void`

Defined in: [packages/distributed/distributed-cognition/src/domain/memory/DistributedMemoryCoordinator.ts:52](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/memory/DistributedMemoryCoordinator.ts#L52)

#### Parameters

##### snapshot

[`MemorySnapshot`](../interfaces/MemorySnapshot.md)

#### Returns

`void`

---

### set()

> **set**(`key`, `value`, `nodeId`, `ttlMs?`): [`MemoryEntry`](../interfaces/MemoryEntry.md)

Defined in: [packages/distributed/distributed-cognition/src/domain/memory/DistributedMemoryCoordinator.ts:7](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/memory/DistributedMemoryCoordinator.ts#L7)

#### Parameters

##### key

`string`

##### value

`unknown`

##### nodeId

`string`

##### ttlMs?

`number` = `600000`

#### Returns

[`MemoryEntry`](../interfaces/MemoryEntry.md)

---

### snapshot()

> **snapshot**(`nodeId`): [`MemorySnapshot`](../interfaces/MemorySnapshot.md)

Defined in: [packages/distributed/distributed-cognition/src/domain/memory/DistributedMemoryCoordinator.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/memory/DistributedMemoryCoordinator.ts#L37)

#### Parameters

##### nodeId

`string`

#### Returns

[`MemorySnapshot`](../interfaces/MemorySnapshot.md)
