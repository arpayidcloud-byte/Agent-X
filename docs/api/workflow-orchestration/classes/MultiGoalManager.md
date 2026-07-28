[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-orchestration](../README.md) / MultiGoalManager

# Class: MultiGoalManager

Defined in: [packages/workflow/workflow-orchestration/src/multi-goal-manager.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/multi-goal-manager.ts#L12)

## Constructors

### Constructor

> **new MultiGoalManager**(): `MultiGoalManager`

#### Returns

`MultiGoalManager`

## Methods

### cancel()

> **cancel**(`id`): `void`

Defined in: [packages/workflow/workflow-orchestration/src/multi-goal-manager.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/multi-goal-manager.ts#L19)

#### Parameters

##### id

`string`

#### Returns

`void`

---

### complete()

> **complete**(`id`): `void`

Defined in: [packages/workflow/workflow-orchestration/src/multi-goal-manager.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/multi-goal-manager.ts#L34)

#### Parameters

##### id

`string`

#### Returns

`void`

---

### getRunning()

> **getRunning**(): [`GoalSession`](../interfaces/GoalSession.md)[]

Defined in: [packages/workflow/workflow-orchestration/src/multi-goal-manager.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/multi-goal-manager.ts#L39)

#### Returns

[`GoalSession`](../interfaces/GoalSession.md)[]

---

### register()

> **register**(`id`, `priority`): `void`

Defined in: [packages/workflow/workflow-orchestration/src/multi-goal-manager.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/multi-goal-manager.ts#L15)

#### Parameters

##### id

`string`

##### priority

`number`

#### Returns

`void`

---

### resume()

> **resume**(`id`): `void`

Defined in: [packages/workflow/workflow-orchestration/src/multi-goal-manager.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/multi-goal-manager.ts#L29)

#### Parameters

##### id

`string`

#### Returns

`void`

---

### suspend()

> **suspend**(`id`): `void`

Defined in: [packages/workflow/workflow-orchestration/src/multi-goal-manager.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/multi-goal-manager.ts#L24)

#### Parameters

##### id

`string`

#### Returns

`void`
