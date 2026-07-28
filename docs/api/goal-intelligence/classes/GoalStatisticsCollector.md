[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [goal-intelligence](../README.md) / GoalStatisticsCollector

# Class: GoalStatisticsCollector

Defined in: [packages/planning/goal-intelligence/src/goal-statistics.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-statistics.ts#L19)

## Constructors

### Constructor

> **new GoalStatisticsCollector**(): `GoalStatisticsCollector`

#### Returns

`GoalStatisticsCollector`

## Properties

### completedGoals

> **completedGoals**: `number` = `0`

Defined in: [packages/planning/goal-intelligence/src/goal-statistics.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-statistics.ts#L21)

---

### failedGoals

> **failedGoals**: `number` = `0`

Defined in: [packages/planning/goal-intelligence/src/goal-statistics.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-statistics.ts#L22)

---

### recoveredGoals

> **recoveredGoals**: `number` = `0`

Defined in: [packages/planning/goal-intelligence/src/goal-statistics.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-statistics.ts#L23)

---

### totalBranchFactors

> **totalBranchFactors**: `number`[] = `[]`

Defined in: [packages/planning/goal-intelligence/src/goal-statistics.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-statistics.ts#L26)

---

### totalCosts

> **totalCosts**: `number`[] = `[]`

Defined in: [packages/planning/goal-intelligence/src/goal-statistics.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-statistics.ts#L28)

---

### totalDependencyCounts

> **totalDependencyCounts**: `number`[] = `[]`

Defined in: [packages/planning/goal-intelligence/src/goal-statistics.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-statistics.ts#L27)

---

### totalGoals

> **totalGoals**: `number` = `0`

Defined in: [packages/planning/goal-intelligence/src/goal-statistics.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-statistics.ts#L20)

---

### totalPlanningDepths

> **totalPlanningDepths**: `number`[] = `[]`

Defined in: [packages/planning/goal-intelligence/src/goal-statistics.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-statistics.ts#L25)

---

### totalPlanningTimes

> **totalPlanningTimes**: `number`[] = `[]`

Defined in: [packages/planning/goal-intelligence/src/goal-statistics.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-statistics.ts#L30)

---

### totalRisks

> **totalRisks**: `number`[] = `[]`

Defined in: [packages/planning/goal-intelligence/src/goal-statistics.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-statistics.ts#L29)

---

### totalSubgoalSizes

> **totalSubgoalSizes**: `number`[] = `[]`

Defined in: [packages/planning/goal-intelligence/src/goal-statistics.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-statistics.ts#L24)

## Methods

### getStatistics()

> **getStatistics**(): [`GoalStatistics`](../interfaces/GoalStatistics.md)

Defined in: [packages/planning/goal-intelligence/src/goal-statistics.ts:58](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-statistics.ts#L58)

#### Returns

[`GoalStatistics`](../interfaces/GoalStatistics.md)

---

### recordGoalCompletion()

> **recordGoalCompletion**(`completed`, `subgoalSize`, `planningDepth`, `branchFactor`, `dependencyCount`, `cost`, `risk`, `planningTime`): `void`

Defined in: [packages/planning/goal-intelligence/src/goal-statistics.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-statistics.ts#L32)

#### Parameters

##### completed

`boolean`

##### subgoalSize

`number`

##### planningDepth

`number`

##### branchFactor

`number`

##### dependencyCount

`number`

##### cost

`number`

##### risk

`number`

##### planningTime

`number`

#### Returns

`void`

---

### recordRecovery()

> **recordRecovery**(): `void`

Defined in: [packages/planning/goal-intelligence/src/goal-statistics.ts:54](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/goal-statistics.ts#L54)

#### Returns

`void`
