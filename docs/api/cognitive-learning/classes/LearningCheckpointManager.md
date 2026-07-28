[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [cognitive-learning](../README.md) / LearningCheckpointManager

# Class: LearningCheckpointManager

Defined in: [packages/cognitive/cognitive-learning/src/checkpoint.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/checkpoint.ts#L15)

## Constructors

### Constructor

> **new LearningCheckpointManager**(): `LearningCheckpointManager`

#### Returns

`LearningCheckpointManager`

## Methods

### load()

> **load**(`sessionId`): [`LearningCheckpoint`](../interfaces/LearningCheckpoint.md) \| `undefined`

Defined in: [packages/cognitive/cognitive-learning/src/checkpoint.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/checkpoint.ts#L30)

#### Parameters

##### sessionId

`string`

#### Returns

[`LearningCheckpoint`](../interfaces/LearningCheckpoint.md) \| `undefined`

---

### save()

> **save**(`sessionId`, `snapshot`): [`LearningCheckpoint`](../interfaces/LearningCheckpoint.md)

Defined in: [packages/cognitive/cognitive-learning/src/checkpoint.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/checkpoint.ts#L18)

#### Parameters

##### sessionId

`string`

##### snapshot

`Record`\<`string`, `unknown`\>

#### Returns

[`LearningCheckpoint`](../interfaces/LearningCheckpoint.md)
