[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [cognitive-kernel](../README.md) / KernelCheckpointManager

# Class: KernelCheckpointManager

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-checkpoint.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-checkpoint.ts#L9)

## Constructors

### Constructor

> **new KernelCheckpointManager**(): `KernelCheckpointManager`

#### Returns

`KernelCheckpointManager`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-checkpoint.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-checkpoint.ts#L34)

#### Returns

`void`

---

### getCheckpoint()

> **getCheckpoint**(`sessionId`): [`SessionCheckpoint`](../interfaces/SessionCheckpoint.md) \| `undefined`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-checkpoint.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-checkpoint.ts#L30)

#### Parameters

##### sessionId

`string`

#### Returns

[`SessionCheckpoint`](../interfaces/SessionCheckpoint.md) \| `undefined`

---

### saveCheckpoint()

> **saveCheckpoint**(`sessionId`, `snapshot`): [`SessionCheckpoint`](../interfaces/SessionCheckpoint.md)

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-checkpoint.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-checkpoint.ts#L12)

#### Parameters

##### sessionId

`string`

##### snapshot

`Record`\<`string`, `unknown`\>

#### Returns

[`SessionCheckpoint`](../interfaces/SessionCheckpoint.md)
