[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [reasoning-framework](../README.md) / ReasoningCheckpointManager

# Class: ReasoningCheckpointManager

Defined in: [packages/reasoning/reasoning-framework/src/reasoning-checkpoint.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/reasoning-checkpoint.ts#L9)

## Constructors

### Constructor

> **new ReasoningCheckpointManager**(): `ReasoningCheckpointManager`

#### Returns

`ReasoningCheckpointManager`

## Methods

### getSnapshots()

> **getSnapshots**(`sessionId`): [`ReasoningSnapshot`](../interfaces/ReasoningSnapshot.md)[]

Defined in: [packages/reasoning/reasoning-framework/src/reasoning-checkpoint.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/reasoning-checkpoint.ts#L26)

#### Parameters

##### sessionId

`string`

#### Returns

[`ReasoningSnapshot`](../interfaces/ReasoningSnapshot.md)[]

---

### save()

> **save**(`sessionId`, `snapshot`): [`ReasoningSnapshot`](../interfaces/ReasoningSnapshot.md)

Defined in: [packages/reasoning/reasoning-framework/src/reasoning-checkpoint.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/reasoning-checkpoint.ts#L12)

#### Parameters

##### sessionId

`string`

##### snapshot

`Record`\<`string`, `unknown`\>

#### Returns

[`ReasoningSnapshot`](../interfaces/ReasoningSnapshot.md)
