[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / DistributedConflictResolver

# Class: DistributedConflictResolver

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedConflictResolver.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedConflictResolver.ts#L15)

## Constructors

### Constructor

> **new DistributedConflictResolver**(): `DistributedConflictResolver`

#### Returns

`DistributedConflictResolver`

## Methods

### detect()

> **detect**(`_resourceKey`, `_nodeA`, `valueA`, `_nodeB`, `valueB`): `boolean`

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedConflictResolver.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedConflictResolver.ts#L18)

#### Parameters

##### \_resourceKey

`string`

##### \_nodeA

`string`

##### valueA

`unknown`

##### \_nodeB

`string`

##### valueB

`unknown`

#### Returns

`boolean`

---

### getConflicts()

> **getConflicts**(): [`ConflictEntry`](../interfaces/ConflictEntry.md)[]

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedConflictResolver.ts:55](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedConflictResolver.ts#L55)

#### Returns

[`ConflictEntry`](../interfaces/ConflictEntry.md)[]

---

### getConflictsByNode()

> **getConflictsByNode**(`nodeId`): [`ConflictEntry`](../interfaces/ConflictEntry.md)[]

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedConflictResolver.ts:59](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedConflictResolver.ts#L59)

#### Parameters

##### nodeId

`string`

#### Returns

[`ConflictEntry`](../interfaces/ConflictEntry.md)[]

---

### resolve()

> **resolve**(`resourceKey`, `nodeA`, `valueA`, `nodeB`, `valueB`, `resolution`): [`ConflictEntry`](../interfaces/ConflictEntry.md)

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedConflictResolver.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedConflictResolver.ts#L28)

#### Parameters

##### resourceKey

`string`

##### nodeA

`string`

##### valueA

`unknown`

##### nodeB

`string`

##### valueB

`unknown`

##### resolution

`"REJECTED"` \| `"MERGED"` \| `"NODE_A_WINS"` \| `"NODE_B_WINS"`

#### Returns

[`ConflictEntry`](../interfaces/ConflictEntry.md)
