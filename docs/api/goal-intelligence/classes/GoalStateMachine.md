[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [goal-intelligence](../README.md) / GoalStateMachine

# Class: GoalStateMachine

Defined in: [packages/planning/goal-intelligence/src/goal-state.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-state.ts#L23)

## Constructors

### Constructor

> **new GoalStateMachine**(): `GoalStateMachine`

#### Returns

`GoalStateMachine`

## Methods

### canTransition()

> **canTransition**(`next`): `boolean`

Defined in: [packages/planning/goal-intelligence/src/goal-state.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-state.ts#L41)

#### Parameters

##### next

[`GoalState`](../type-aliases/GoalState.md)

#### Returns

`boolean`

---

### getState()

> **getState**(): [`GoalState`](../type-aliases/GoalState.md)

Defined in: [packages/planning/goal-intelligence/src/goal-state.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-state.ts#L26)

#### Returns

[`GoalState`](../type-aliases/GoalState.md)

---

### transition()

> **transition**(`next`): `void`

Defined in: [packages/planning/goal-intelligence/src/goal-state.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-state.ts#L30)

#### Parameters

##### next

[`GoalState`](../type-aliases/GoalState.md)

#### Returns

`void`
