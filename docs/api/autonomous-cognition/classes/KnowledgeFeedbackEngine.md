[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [autonomous-cognition](../README.md) / KnowledgeFeedbackEngine

# Class: KnowledgeFeedbackEngine

Defined in: [packages/cognitive/autonomous-cognition/src/domain/planning/KnowledgeEngine.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/planning/KnowledgeEngine.ts#L11)

## Constructors

### Constructor

> **new KnowledgeFeedbackEngine**(): `KnowledgeFeedbackEngine`

#### Returns

`KnowledgeFeedbackEngine`

## Methods

### getAll()

> **getAll**(): [`FeedbackEntry`](../interfaces/FeedbackEntry.md)[]

Defined in: [packages/cognitive/autonomous-cognition/src/domain/planning/KnowledgeEngine.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/planning/KnowledgeEngine.ts#L34)

#### Returns

[`FeedbackEntry`](../interfaces/FeedbackEntry.md)[]

---

### getByGoal()

> **getByGoal**(`goalId`): [`FeedbackEntry`](../interfaces/FeedbackEntry.md)[]

Defined in: [packages/cognitive/autonomous-cognition/src/domain/planning/KnowledgeEngine.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/planning/KnowledgeEngine.ts#L30)

#### Parameters

##### goalId

`string`

#### Returns

[`FeedbackEntry`](../interfaces/FeedbackEntry.md)[]

---

### record()

> **record**(`goalId`, `outcome`, `lessons`): [`FeedbackEntry`](../interfaces/FeedbackEntry.md)

Defined in: [packages/cognitive/autonomous-cognition/src/domain/planning/KnowledgeEngine.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/planning/KnowledgeEngine.ts#L14)

#### Parameters

##### goalId

`string`

##### outcome

`string`

##### lessons

`string`[]

#### Returns

[`FeedbackEntry`](../interfaces/FeedbackEntry.md)
