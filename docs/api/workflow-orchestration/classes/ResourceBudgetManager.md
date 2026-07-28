[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-orchestration](../README.md) / ResourceBudgetManager

# Class: ResourceBudgetManager

Defined in: [packages/workflow/workflow-orchestration/src/resource-budget.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/resource-budget.ts#L9)

## Constructors

### Constructor

> **new ResourceBudgetManager**(): `ResourceBudgetManager`

#### Returns

`ResourceBudgetManager`

## Methods

### consumeTokens()

> **consumeTokens**(`amount`, `limit`): `void`

Defined in: [packages/workflow/workflow-orchestration/src/resource-budget.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/resource-budget.ts#L17)

#### Parameters

##### amount

`number`

##### limit

`number`

#### Returns

`void`

---

### getConsumption()

> **getConsumption**(): [`WorkflowBudget`](../interfaces/WorkflowBudget.md)

Defined in: [packages/workflow/workflow-orchestration/src/resource-budget.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/resource-budget.ts#L24)

#### Returns

[`WorkflowBudget`](../interfaces/WorkflowBudget.md)
