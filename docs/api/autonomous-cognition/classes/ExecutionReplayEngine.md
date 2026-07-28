[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [autonomous-cognition](../README.md) / ExecutionReplayEngine

# Class: ExecutionReplayEngine

Defined in: [packages/cognitive/autonomous-cognition/src/domain/execution/CheckpointReplayEngine.ts:63](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/execution/CheckpointReplayEngine.ts#L63)

## Constructors

### Constructor

> **new ExecutionReplayEngine**(): `ExecutionReplayEngine`

#### Returns

`ExecutionReplayEngine`

## Methods

### getEntries()

> **getEntries**(`goalId`): [`ReplayEntry`](../interfaces/ReplayEntry.md)[]

Defined in: [packages/cognitive/autonomous-cognition/src/domain/execution/CheckpointReplayEngine.ts:85](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/execution/CheckpointReplayEngine.ts#L85)

#### Parameters

##### goalId

`string`

#### Returns

[`ReplayEntry`](../interfaces/ReplayEntry.md)[]

---

### record()

> **record**(`goalId`, `action`, `state`): [`ReplayEntry`](../interfaces/ReplayEntry.md)

Defined in: [packages/cognitive/autonomous-cognition/src/domain/execution/CheckpointReplayEngine.ts:66](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/execution/CheckpointReplayEngine.ts#L66)

#### Parameters

##### goalId

`string`

##### action

`string`

##### state

`Record`\<`string`, `unknown`\>

#### Returns

[`ReplayEntry`](../interfaces/ReplayEntry.md)

---

### validate()

> **validate**(`goalId`): `boolean`

Defined in: [packages/cognitive/autonomous-cognition/src/domain/execution/CheckpointReplayEngine.ts:91](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/execution/CheckpointReplayEngine.ts#L91)

#### Parameters

##### goalId

`string`

#### Returns

`boolean`
