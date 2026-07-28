[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [goal-intelligence](../README.md) / SubGoalManager

# Class: SubGoalManager

Defined in: [packages/planning/goal-intelligence/src/subgoal-manager.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/subgoal-manager.ts#L8)

## Constructors

### Constructor

> **new SubGoalManager**(): `SubGoalManager`

#### Returns

`SubGoalManager`

## Methods

### get()

> **get**(`id`): [`SubGoal`](../interfaces/SubGoal.md) \| `undefined`

Defined in: [packages/planning/goal-intelligence/src/subgoal-manager.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/subgoal-manager.ts#L15)

#### Parameters

##### id

`string`

#### Returns

[`SubGoal`](../interfaces/SubGoal.md) \| `undefined`

---

### getAll()

> **getAll**(): [`SubGoal`](../interfaces/SubGoal.md)[]

Defined in: [packages/planning/goal-intelligence/src/subgoal-manager.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/subgoal-manager.ts#L24)

#### Returns

[`SubGoal`](../interfaces/SubGoal.md)[]

---

### getByGoal()

> **getByGoal**(`goalId`): [`SubGoal`](../interfaces/SubGoal.md)[]

Defined in: [packages/planning/goal-intelligence/src/subgoal-manager.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/subgoal-manager.ts#L28)

#### Parameters

##### goalId

`string`

#### Returns

[`SubGoal`](../interfaces/SubGoal.md)[]

---

### register()

> **register**(`subgoal`): `void`

Defined in: [packages/planning/goal-intelligence/src/subgoal-manager.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/subgoal-manager.ts#L11)

#### Parameters

##### subgoal

[`SubGoal`](../interfaces/SubGoal.md)

#### Returns

`void`

---

### updateStatus()

> **updateStatus**(`id`, `status`): `void`

Defined in: [packages/planning/goal-intelligence/src/subgoal-manager.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/subgoal-manager.ts#L19)

#### Parameters

##### id

`string`

##### status

`"COMPLETED"` \| `"FAILED"` \| `"PENDING"` \| `"IN_PROGRESS"`

#### Returns

`void`
