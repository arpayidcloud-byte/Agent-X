[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [cognitive-contracts](../README.md) / CognitiveBudgetManager

# Class: CognitiveBudgetManager

Defined in: [packages/cognitive/cognitive-contracts/src/cognitive-budget.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/cognitive-budget.ts#L9)

## Constructors

### Constructor

> **new CognitiveBudgetManager**(`budget`): `CognitiveBudgetManager`

Defined in: [packages/cognitive/cognitive-contracts/src/cognitive-budget.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/cognitive-budget.ts#L13)

#### Parameters

##### budget

[`CognitiveBudget`](../interfaces/CognitiveBudget.md)

#### Returns

`CognitiveBudgetManager`

## Methods

### consume()

> **consume**(`type`, `amount`): `void`

Defined in: [packages/cognitive/cognitive-contracts/src/cognitive-budget.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/cognitive-budget.ts#L17)

#### Parameters

##### type

`string`

##### amount

`number`

#### Returns

`void`

---

### getConsumption()

> **getConsumption**(): `Record`\<`string`, `number`>>>>\>

Defined in: [packages/cognitive/cognitive-contracts/src/cognitive-budget.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/cognitive-budget.ts#L30)

#### Returns

`Record`\<`string`, `number`\>
