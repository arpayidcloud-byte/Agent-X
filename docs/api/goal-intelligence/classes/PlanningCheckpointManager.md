[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [goal-intelligence](../README.md) / PlanningCheckpointManager

# Class: PlanningCheckpointManager

Defined in: [packages/planning/goal-intelligence/src/planning-checkpoint.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/planning-checkpoint.ts#L17)

## Constructors

### Constructor

> **new PlanningCheckpointManager**(): `PlanningCheckpointManager`

#### Returns

`PlanningCheckpointManager`

## Methods

### load()

> **load**(`goalId`): [`PlanningCheckpoint`](../interfaces/PlanningCheckpoint.md) \| `undefined`

Defined in: [packages/planning/goal-intelligence/src/planning-checkpoint.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/planning-checkpoint.ts#L33)

#### Parameters

##### goalId

`string`

#### Returns

[`PlanningCheckpoint`](../interfaces/PlanningCheckpoint.md) \| `undefined`

---

### save()

> **save**(`goalId`, `plan`): [`PlanningCheckpoint`](../interfaces/PlanningCheckpoint.md)

Defined in: [packages/planning/goal-intelligence/src/planning-checkpoint.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/planning-checkpoint.ts#L20)

#### Parameters

##### goalId

`string`

##### plan

[`PlanningPlan`](../interfaces/PlanningPlan.md)

#### Returns

[`PlanningCheckpoint`](../interfaces/PlanningCheckpoint.md)
