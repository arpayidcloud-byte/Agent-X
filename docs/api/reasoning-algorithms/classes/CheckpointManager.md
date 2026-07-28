[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [reasoning-algorithms](../README.md) / CheckpointManager

# Class: CheckpointManager

Defined in: [packages/reasoning/reasoning-algorithms/src/checkpoint.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/checkpoint.ts#L6)

## Constructors

### Constructor

> **new CheckpointManager**(): `CheckpointManager`

#### Returns

`CheckpointManager`

## Methods

### load()

> **load**(`sessionId`): `Record`\<`string`, `unknown`> > > > \> \| `undefined`

Defined in: [packages/reasoning/reasoning-algorithms/src/checkpoint.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/checkpoint.ts#L13)

#### Parameters

##### sessionId

`string`

#### Returns

`Record`\<`string`, `unknown`\> \| `undefined`

---

### save()

> **save**(`sessionId`, `snapshot`): `void`

Defined in: [packages/reasoning/reasoning-algorithms/src/checkpoint.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/checkpoint.ts#L9)

#### Parameters

##### sessionId

`string`

##### snapshot

`Record`\<`string`, `unknown`\>

#### Returns

`void`
