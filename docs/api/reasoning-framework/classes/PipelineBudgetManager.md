[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [reasoning-framework](../README.md) / PipelineBudgetManager

# Class: PipelineBudgetManager

Defined in: [packages/reasoning/reasoning-framework/src/pipeline-budget.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline-budget.ts#L8)

## Constructors

### Constructor

> **new PipelineBudgetManager**(`maxTokens`, `maxDurationMs`): `PipelineBudgetManager`

Defined in: [packages/reasoning/reasoning-framework/src/pipeline-budget.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline-budget.ts#L11)

#### Parameters

##### maxTokens

`number`

##### maxDurationMs

`number`

#### Returns

`PipelineBudgetManager`

## Methods

### consume()

> **consume**(`tokens`, `durationMs`): `void`

Defined in: [packages/reasoning/reasoning-framework/src/pipeline-budget.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline-budget.ts#L20)

#### Parameters

##### tokens

`number`

##### durationMs

`number`

#### Returns

`void`

---

### getBudgetSnapshot()

> **getBudgetSnapshot**(): [`PipelineBudget`](../interfaces/PipelineBudget.md)

Defined in: [packages/reasoning/reasoning-framework/src/pipeline-budget.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline-budget.ts#L31)

#### Returns

[`PipelineBudget`](../interfaces/PipelineBudget.md)
