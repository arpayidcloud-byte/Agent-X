[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / DistributedCheckpointManager

# Class: DistributedCheckpointManager

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/state/DistributedCheckpointManager.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/state/DistributedCheckpointManager.ts#L13)

## Constructors

### Constructor

> **new DistributedCheckpointManager**(): `DistributedCheckpointManager`

#### Returns

`DistributedCheckpointManager`

## Methods

### list()

> **list**(`sessionId`): [`DistributedCheckpoint`](../interfaces/DistributedCheckpoint.md)[]

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/state/DistributedCheckpointManager.ts:62](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/state/DistributedCheckpointManager.ts#L62)

#### Parameters

##### sessionId

`string`

#### Returns

[`DistributedCheckpoint`](../interfaces/DistributedCheckpoint.md)[]

---

### load()

> **load**(`sessionId`, `nodeId?`): [`DistributedCheckpoint`](../interfaces/DistributedCheckpoint.md) \| `undefined`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/state/DistributedCheckpointManager.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/state/DistributedCheckpointManager.ts#L41)

#### Parameters

##### sessionId

`string`

##### nodeId?

`string`

#### Returns

[`DistributedCheckpoint`](../interfaces/DistributedCheckpoint.md) \| `undefined`

---

### remove()

> **remove**(`sessionId`, `checkpointId`): `boolean`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/state/DistributedCheckpointManager.ts:66](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/state/DistributedCheckpointManager.ts#L66)

#### Parameters

##### sessionId

`string`

##### checkpointId

`string`

#### Returns

`boolean`

---

### save()

> **save**(`nodeId`, `sessionId`, `state`, `version`): [`DistributedCheckpoint`](../interfaces/DistributedCheckpoint.md)

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/state/DistributedCheckpointManager.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/state/DistributedCheckpointManager.ts#L16)

#### Parameters

##### nodeId

`string`

##### sessionId

`string`

##### state

`Record`\<`string`, `unknown`\>

##### version

`number`

#### Returns

[`DistributedCheckpoint`](../interfaces/DistributedCheckpoint.md)

---

### validate()

> **validate**(`checkpoint`): `boolean`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/state/DistributedCheckpointManager.ts:48](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/state/DistributedCheckpointManager.ts#L48)

#### Parameters

##### checkpoint

[`DistributedCheckpoint`](../interfaces/DistributedCheckpoint.md)

#### Returns

`boolean`
