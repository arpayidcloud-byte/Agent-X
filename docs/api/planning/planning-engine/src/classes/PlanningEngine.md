[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [planning/planning-engine/src](../README.md) / PlanningEngine

# Class: PlanningEngine

Defined in: [packages/planning/planning-engine/src/engine.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/planning-engine/src/engine.ts#L10)

## Implements

- [`IPlanningEngine`](../interfaces/IPlanningEngine.md)

## Constructors

### Constructor

> **new PlanningEngine**(`eventBus`): `PlanningEngine`

Defined in: [packages/planning/planning-engine/src/engine.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/planning-engine/src/engine.ts#L18)

#### Parameters

##### eventBus

`IEventBus`

#### Returns

`PlanningEngine`

## Methods

### createPlan()

> **createPlan**(`goal`, `context`): `Promise`\<[`ExecutionPlan`](../interfaces/ExecutionPlan.md)>>>>\>

Defined in: [packages/planning/planning-engine/src/engine.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/planning-engine/src/engine.ts#L20)

#### Parameters

##### goal

`string`

##### context

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<[`ExecutionPlan`](../interfaces/ExecutionPlan.md)\>

#### Implementation of

[`IPlanningEngine`](../interfaces/IPlanningEngine.md).[`createPlan`](../interfaces/IPlanningEngine.md#createplan)

---

### explainPlan()

> **explainPlan**(`plan`): `string`

Defined in: [packages/planning/planning-engine/src/engine.ts:91](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/planning-engine/src/engine.ts#L91)

#### Parameters

##### plan

[`ExecutionPlan`](../interfaces/ExecutionPlan.md)

#### Returns

`string`

#### Implementation of

[`IPlanningEngine`](../interfaces/IPlanningEngine.md).[`explainPlan`](../interfaces/IPlanningEngine.md#explainplan)

---

### getMetrics()

> **getMetrics**(): [`PlanMetrics`](../interfaces/PlanMetrics.md)

Defined in: [packages/planning/planning-engine/src/engine.ts:103](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/planning-engine/src/engine.ts#L103)

#### Returns

[`PlanMetrics`](../interfaces/PlanMetrics.md)

#### Implementation of

[`IPlanningEngine`](../interfaces/IPlanningEngine.md).[`getMetrics`](../interfaces/IPlanningEngine.md#getmetrics)

---

### optimizePlan()

> **optimizePlan**(`plan`): `Promise`\<[`ExecutionPlan`](../interfaces/ExecutionPlan.md)>>>>\>

Defined in: [packages/planning/planning-engine/src/engine.ts:59](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/planning-engine/src/engine.ts#L59)

#### Parameters

##### plan

[`ExecutionPlan`](../interfaces/ExecutionPlan.md)

#### Returns

`Promise`\<[`ExecutionPlan`](../interfaces/ExecutionPlan.md)\>

#### Implementation of

[`IPlanningEngine`](../interfaces/IPlanningEngine.md).[`optimizePlan`](../interfaces/IPlanningEngine.md#optimizeplan)

---

### validatePlan()

> **validatePlan**(`plan`): `Promise`\<[`ValidationResult`](../interfaces/ValidationResult.md)>>>>\>

Defined in: [packages/planning/planning-engine/src/engine.ts:73](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/planning-engine/src/engine.ts#L73)

#### Parameters

##### plan

[`ExecutionPlan`](../interfaces/ExecutionPlan.md)

#### Returns

`Promise`\<[`ValidationResult`](../interfaces/ValidationResult.md)\>

#### Implementation of

[`IPlanningEngine`](../interfaces/IPlanningEngine.md).[`validatePlan`](../interfaces/IPlanningEngine.md#validateplan)
