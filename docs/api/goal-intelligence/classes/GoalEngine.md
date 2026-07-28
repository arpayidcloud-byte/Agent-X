[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [goal-intelligence](../README.md) / GoalEngine

# Class: GoalEngine

Defined in: [packages/planning/goal-intelligence/src/goal-engine.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-engine.ts#L25)

## Constructors

### Constructor

> **new GoalEngine**(): `GoalEngine`

#### Returns

`GoalEngine`

## Properties

### checkpointManager

> **checkpointManager**: [`PlanningCheckpointManager`](PlanningCheckpointManager.md)

Defined in: [packages/planning/goal-intelligence/src/goal-engine.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-engine.ts#L37)

---

### decomposer

> **decomposer**: [`GoalDecomposer`](GoalDecomposer.md)

Defined in: [packages/planning/goal-intelligence/src/goal-engine.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-engine.ts#L29)

---

### dependencyGraph

> **dependencyGraph**: [`DependencyGraph`](DependencyGraph.md)

Defined in: [packages/planning/goal-intelligence/src/goal-engine.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-engine.ts#L32)

---

### events

> **events**: [`GoalEventBus`](GoalEventBus.md)

Defined in: [packages/planning/goal-intelligence/src/goal-engine.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-engine.ts#L39)

---

### hooks

> **hooks**: [`GoalHookManager`](GoalHookManager.md)

Defined in: [packages/planning/goal-intelligence/src/goal-engine.ts:40](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-engine.ts#L40)

---

### metrics

> **metrics**: [`GoalIntelligenceMetricsCollector`](GoalIntelligenceMetricsCollector.md)

Defined in: [packages/planning/goal-intelligence/src/goal-engine.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-engine.ts#L41)

---

### objectiveTree

> **objectiveTree**: [`ObjectiveTree`](ObjectiveTree.md)

Defined in: [packages/planning/goal-intelligence/src/goal-engine.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-engine.ts#L31)

---

### parser

> **parser**: [`GoalParser`](GoalParser.md)

Defined in: [packages/planning/goal-intelligence/src/goal-engine.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-engine.ts#L27)

---

### planningEngine

> **planningEngine**: [`PlanningEngine`](PlanningEngine.md)

Defined in: [packages/planning/goal-intelligence/src/goal-engine.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-engine.ts#L35)

---

### planningValidator

> **planningValidator**: [`PlanningValidator`](PlanningValidator.md)

Defined in: [packages/planning/goal-intelligence/src/goal-engine.ts:36](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-engine.ts#L36)

---

### recoveryManager

> **recoveryManager**: [`PlanningRecoveryManager`](PlanningRecoveryManager.md)

Defined in: [packages/planning/goal-intelligence/src/goal-engine.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-engine.ts#L38)

---

### stateMachine

> **stateMachine**: [`GoalStateMachine`](GoalStateMachine.md)

Defined in: [packages/planning/goal-intelligence/src/goal-engine.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-engine.ts#L26)

---

### subgoalManager

> **subgoalManager**: [`SubGoalManager`](SubGoalManager.md)

Defined in: [packages/planning/goal-intelligence/src/goal-engine.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-engine.ts#L30)

---

### taskOrdering

> **taskOrdering**: [`TaskOrderingEngine`](TaskOrderingEngine.md)

Defined in: [packages/planning/goal-intelligence/src/goal-engine.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-engine.ts#L33)

---

### taskPriority

> **taskPriority**: [`TaskPriorityEngine`](TaskPriorityEngine.md)

Defined in: [packages/planning/goal-intelligence/src/goal-engine.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-engine.ts#L34)

---

### validator

> **validator**: [`GoalValidator`](GoalValidator.md)

Defined in: [packages/planning/goal-intelligence/src/goal-engine.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-engine.ts#L28)

## Methods

### processGoal()

> **processGoal**(`title`, `description`, `objectiveCount?`, `_policy?`): `Promise`\<\{ `plan`: [`PlanningPlan`](../interfaces/PlanningPlan.md); `subgoals`: `number`; \}\>

Defined in: [packages/planning/goal-intelligence/src/goal-engine.ts:43](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-engine.ts#L43)

#### Parameters

##### title

`string`

##### description

`string`

##### objectiveCount?

`number` = `2`

##### \_policy?

`"safe"` \| `"balanced"` \| `"aggressive"`

#### Returns

`Promise`\<\{ `plan`: [`PlanningPlan`](../interfaces/PlanningPlan.md); `subgoals`: `number`; \}\>

---

### recoverPlanning()

> **recoverPlanning**(`goalId`): `object`

Defined in: [packages/planning/goal-intelligence/src/goal-engine.ts:119](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-engine.ts#L119)

#### Parameters

##### goalId

`string`

#### Returns

`object`

##### goalId

> **goalId**: `string`

##### restored

> **restored**: `boolean`
