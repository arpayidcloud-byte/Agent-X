[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [autonomous-cognition](../README.md) / SelfImprovementEngine

# Class: SelfImprovementEngine

Defined in: [packages/cognitive/autonomous-cognition/src/domain/planning/PlanningEngine.ts:91](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/planning/PlanningEngine.ts#L91)

## Constructors

### Constructor

> **new SelfImprovementEngine**(): `SelfImprovementEngine`

#### Returns

`SelfImprovementEngine`

## Methods

### getRecords()

> **getRecords**(): [`ImprovementRecord`](../interfaces/ImprovementRecord.md)[]

Defined in: [packages/cognitive/autonomous-cognition/src/domain/planning/PlanningEngine.ts:128](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/planning/PlanningEngine.ts#L128)

#### Returns

[`ImprovementRecord`](../interfaces/ImprovementRecord.md)[]

---

### improve()

> **improve**(`goalId`, `reason`, `previousStrategy`, `newStrategy`, `score`): [`ImprovementRecord`](../interfaces/ImprovementRecord.md)

Defined in: [packages/cognitive/autonomous-cognition/src/domain/planning/PlanningEngine.ts:94](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/planning/PlanningEngine.ts#L94)

#### Parameters

##### goalId

`string`

##### reason

`string`

##### previousStrategy

`string`

##### newStrategy

`string`

##### score

`number`

#### Returns

[`ImprovementRecord`](../interfaces/ImprovementRecord.md)

---

### rollback()

> **rollback**(`improvementId`): [`ImprovementRecord`](../interfaces/ImprovementRecord.md) \| `undefined`

Defined in: [packages/cognitive/autonomous-cognition/src/domain/planning/PlanningEngine.ts:122](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/planning/PlanningEngine.ts#L122)

#### Parameters

##### improvementId

`string`

#### Returns

[`ImprovementRecord`](../interfaces/ImprovementRecord.md) \| `undefined`
