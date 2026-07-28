[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [autonomous-cognition](../README.md) / ExperienceRepository

# Class: ExperienceRepository

Defined in: [packages/cognitive/autonomous-cognition/src/domain/planning/KnowledgeEngine.ts:96](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/planning/KnowledgeEngine.ts#L96)

## Constructors

### Constructor

> **new ExperienceRepository**(): `ExperienceRepository`

#### Returns

`ExperienceRepository`

## Methods

### getAll()

> **getAll**(): [`Experience`](../interfaces/Experience.md)[]

Defined in: [packages/cognitive/autonomous-cognition/src/domain/planning/KnowledgeEngine.ts:121](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/planning/KnowledgeEngine.ts#L121)

#### Returns

[`Experience`](../interfaces/Experience.md)[]

---

### getByGoal()

> **getByGoal**(`goalId`): [`Experience`](../interfaces/Experience.md)[]

Defined in: [packages/cognitive/autonomous-cognition/src/domain/planning/KnowledgeEngine.ts:117](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/planning/KnowledgeEngine.ts#L117)

#### Parameters

##### goalId

`string`

#### Returns

[`Experience`](../interfaces/Experience.md)[]

---

### record()

> **record**(`goalId`, `action`, `result`, `score`): [`Experience`](../interfaces/Experience.md)

Defined in: [packages/cognitive/autonomous-cognition/src/domain/planning/KnowledgeEngine.ts:99](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/planning/KnowledgeEngine.ts#L99)

#### Parameters

##### goalId

`string`

##### action

`string`

##### result

`string`

##### score

`number`

#### Returns

[`Experience`](../interfaces/Experience.md)
