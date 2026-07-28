[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [cognitive-kernel](../README.md) / KernelBudgetManager

# Class: KernelBudgetManager

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-budget.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-budget.ts#L8)

## Constructors

### Constructor

> **new KernelBudgetManager**(`maxGlobalTokens`): `KernelBudgetManager`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-budget.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-budget.ts#L11)

#### Parameters

##### maxGlobalTokens

`number`

#### Returns

`KernelBudgetManager`

## Methods

### consumeTokens()

> **consumeTokens**(`type`, `amount`): `void`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-budget.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-budget.ts#L26)

#### Parameters

##### type

`"inputTokens"` \| `"outputTokens"` \| `"thinkingTokens"` \| `"reasoningTokens"` \| `"reflectionTokens"` \| `"planningTokens"` \| `"memoryTokens"` \| `"toolTokens"` \| `"globalTokens"`

##### amount

`number`

#### Returns

`void`

---

### getSnapshot()

> **getSnapshot**(): [`BudgetSnapshot`](../interfaces/BudgetSnapshot.md)

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-budget.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-budget.ts#L34)

#### Returns

[`BudgetSnapshot`](../interfaces/BudgetSnapshot.md)
