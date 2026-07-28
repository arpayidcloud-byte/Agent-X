[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [planning/planning-engine/src](../README.md) / IPlanningEngine

# Interface: IPlanningEngine

Defined in: [packages/planning/planning-engine/src/interfaces.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/planning-engine/src/interfaces.ts#L6)

## Methods

### createPlan()

> **createPlan**(`goal`, `context`): `Promise`\<[`ExecutionPlan`](ExecutionPlan.md)>>>>\>

Defined in: [packages/planning/planning-engine/src/interfaces.ts:7](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/planning-engine/src/interfaces.ts#L7)

#### Parameters

##### goal

`string`

##### context

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<[`ExecutionPlan`](ExecutionPlan.md)\>

---

### explainPlan()

> **explainPlan**(`plan`): `string`

Defined in: [packages/planning/planning-engine/src/interfaces.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/planning-engine/src/interfaces.ts#L10)

#### Parameters

##### plan

[`ExecutionPlan`](ExecutionPlan.md)

#### Returns

`string`

---

### getMetrics()

> **getMetrics**(): [`PlanMetrics`](PlanMetrics.md)

Defined in: [packages/planning/planning-engine/src/interfaces.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/planning-engine/src/interfaces.ts#L11)

#### Returns

[`PlanMetrics`](PlanMetrics.md)

---

### optimizePlan()

> **optimizePlan**(`plan`): `Promise`\<[`ExecutionPlan`](ExecutionPlan.md)>>>>\>

Defined in: [packages/planning/planning-engine/src/interfaces.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/planning-engine/src/interfaces.ts#L8)

#### Parameters

##### plan

[`ExecutionPlan`](ExecutionPlan.md)

#### Returns

`Promise`\<[`ExecutionPlan`](ExecutionPlan.md)\>

---

### validatePlan()

> **validatePlan**(`plan`): `Promise`\<[`ValidationResult`](ValidationResult.md)>>>>\>

Defined in: [packages/planning/planning-engine/src/interfaces.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/planning-engine/src/interfaces.ts#L9)

#### Parameters

##### plan

[`ExecutionPlan`](ExecutionPlan.md)

#### Returns

`Promise`\<[`ValidationResult`](ValidationResult.md)\>
