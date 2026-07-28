[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [autonomous-cognition](../README.md) / ExecutionCheckpointManager

# Class: ExecutionCheckpointManager

Defined in: [packages/cognitive/autonomous-cognition/src/domain/execution/CheckpointReplayEngine.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/execution/CheckpointReplayEngine.ts#L12)

## Constructors

### Constructor

> **new ExecutionCheckpointManager**(): `ExecutionCheckpointManager`

#### Returns

`ExecutionCheckpointManager`

## Methods

### list()

> **list**(`goalId`): [`Checkpoint`](../interfaces/Checkpoint.md)[]

Defined in: [packages/cognitive/autonomous-cognition/src/domain/execution/CheckpointReplayEngine.ts:47](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/execution/CheckpointReplayEngine.ts#L47)

#### Parameters

##### goalId

`string`

#### Returns

[`Checkpoint`](../interfaces/Checkpoint.md)[]

---

### load()

> **load**(`goalId`): [`Checkpoint`](../interfaces/Checkpoint.md) \| `undefined`

Defined in: [packages/cognitive/autonomous-cognition/src/domain/execution/CheckpointReplayEngine.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/execution/CheckpointReplayEngine.ts#L34)

#### Parameters

##### goalId

`string`

#### Returns

[`Checkpoint`](../interfaces/Checkpoint.md) \| `undefined`

---

### save()

> **save**(`goalId`, `state`, `version`): [`Checkpoint`](../interfaces/Checkpoint.md)

Defined in: [packages/cognitive/autonomous-cognition/src/domain/execution/CheckpointReplayEngine.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/execution/CheckpointReplayEngine.ts#L15)

#### Parameters

##### goalId

`string`

##### state

`Record`\<`string`, `unknown`\>

##### version

`number`

#### Returns

[`Checkpoint`](../interfaces/Checkpoint.md)

---

### validate()

> **validate**(`cp`): `boolean`

Defined in: [packages/cognitive/autonomous-cognition/src/domain/execution/CheckpointReplayEngine.ts:40](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/execution/CheckpointReplayEngine.ts#L40)

#### Parameters

##### cp

[`Checkpoint`](../interfaces/Checkpoint.md)

#### Returns

`boolean`
