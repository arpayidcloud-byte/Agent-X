[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [cognitive-contracts](../README.md) / PlanningEngineBase

# Class: PlanningEngineBase

Defined in: [packages/cognitive/cognitive-contracts/src/planning-engine.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/planning-engine.ts#L8)

## Implements

- [`IPlanningEngine`](../interfaces/IPlanningEngine.md)

## Constructors

### Constructor

> **new PlanningEngineBase**(): `PlanningEngineBase`

#### Returns

`PlanningEngineBase`

## Methods

### generatePlan()

> **generatePlan**(`_goal`, `_context`): `Promise`\<`string`[]\>

Defined in: [packages/cognitive/cognitive-contracts/src/planning-engine.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/planning-engine.ts#L9)

#### Parameters

##### \_goal

`string`

##### \_context

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`IPlanningEngine`](../interfaces/IPlanningEngine.md).[`generatePlan`](../interfaces/IPlanningEngine.md#generateplan)
