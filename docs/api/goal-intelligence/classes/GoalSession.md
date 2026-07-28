[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [goal-intelligence](../README.md) / GoalSession

# Class: GoalSession

Defined in: [packages/planning/goal-intelligence/src/goal-session.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-session.ts#L9)

## Constructors

### Constructor

> **new GoalSession**(`traceId`, `goal`): `GoalSession`

Defined in: [packages/planning/goal-intelligence/src/goal-session.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-session.ts#L17)

#### Parameters

##### traceId

`string`

##### goal

[`Goal`](../interfaces/Goal.md)

#### Returns

`GoalSession`

## Properties

### checksum

> **checksum**: `string`

Defined in: [packages/planning/goal-intelligence/src/goal-session.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-session.ts#L15)

---

### goal

> **goal**: [`Goal`](../interfaces/Goal.md)

Defined in: [packages/planning/goal-intelligence/src/goal-session.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-session.ts#L12)

---

### id

> `readonly` **id**: `string`

Defined in: [packages/planning/goal-intelligence/src/goal-session.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-session.ts#L10)

---

### startedAt

> **startedAt**: `Date`

Defined in: [packages/planning/goal-intelligence/src/goal-session.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-session.ts#L14)

---

### state

> **state**: [`GoalState`](../type-aliases/GoalState.md) = `'CREATED'`

Defined in: [packages/planning/goal-intelligence/src/goal-session.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-session.ts#L13)

---

### traceId

> `readonly` **traceId**: `string`

Defined in: [packages/planning/goal-intelligence/src/goal-session.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-session.ts#L11)

## Methods

### markComplete()

> **markComplete**(): `void`

Defined in: [packages/planning/goal-intelligence/src/goal-session.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-session.ts#L24)

#### Returns

`void`
