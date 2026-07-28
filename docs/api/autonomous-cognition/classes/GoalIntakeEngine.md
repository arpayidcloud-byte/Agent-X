[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [autonomous-cognition](../README.md) / GoalIntakeEngine

# Class: GoalIntakeEngine

Defined in: [packages/cognitive/autonomous-cognition/src/domain/goal/GoalEngine.ts:5](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/goal/GoalEngine.ts#L5)

## Constructors

### Constructor

> **new GoalIntakeEngine**(): `GoalIntakeEngine`

#### Returns

`GoalIntakeEngine`

## Methods

### get()

> **get**(`goalId`): [`Goal`](../interfaces/Goal.md) \| `undefined`

Defined in: [packages/cognitive/autonomous-cognition/src/domain/goal/GoalEngine.ts:48](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/goal/GoalEngine.ts#L48)

#### Parameters

##### goalId

`string`

#### Returns

[`Goal`](../interfaces/Goal.md) \| `undefined`

---

### getAll()

> **getAll**(): [`Goal`](../interfaces/Goal.md)[]

Defined in: [packages/cognitive/autonomous-cognition/src/domain/goal/GoalEngine.ts:52](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/goal/GoalEngine.ts#L52)

#### Returns

[`Goal`](../interfaces/Goal.md)[]

---

### intake()

> **intake**(`title`, `description`, `priority`, `metadata?`): [`Goal`](../interfaces/Goal.md)

Defined in: [packages/cognitive/autonomous-cognition/src/domain/goal/GoalEngine.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/goal/GoalEngine.ts#L8)

#### Parameters

##### title

`string`

##### description

`string`

##### priority

`number`

##### metadata?

`Record`\<`string`, `unknown`\> = `{}`

#### Returns

[`Goal`](../interfaces/Goal.md)

---

### transition()

> **transition**(`goalId`, `newState`): [`Goal`](../interfaces/Goal.md)

Defined in: [packages/cognitive/autonomous-cognition/src/domain/goal/GoalEngine.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/goal/GoalEngine.ts#L32)

#### Parameters

##### goalId

`string`

##### newState

[`GoalState`](../type-aliases/GoalState.md)

#### Returns

[`Goal`](../interfaces/Goal.md)
