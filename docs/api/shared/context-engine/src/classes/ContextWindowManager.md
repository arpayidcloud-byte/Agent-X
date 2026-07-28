[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/context-engine/src](../README.md) / ContextWindowManager

# Class: ContextWindowManager

Defined in: [packages/shared/context-engine/src/window.ts:3](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/context-engine/src/window.ts#L3)

## Implements

- [`IContextWindowManager`](../interfaces/IContextWindowManager.md)

## Constructors

### Constructor

> **new ContextWindowManager**(`estimator`): `ContextWindowManager`

Defined in: [packages/shared/context-engine/src/window.ts:4](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/context-engine/src/window.ts#L4)

#### Parameters

##### estimator

[`ITokenEstimator`](../interfaces/ITokenEstimator.md)

#### Returns

`ContextWindowManager`

## Methods

### slideWindow()

> **slideWindow**(`history`, `maxTokens`): `unknown`[]

Defined in: [packages/shared/context-engine/src/window.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/context-engine/src/window.ts#L25)

#### Parameters

##### history

`unknown`[]

##### maxTokens

`number`

#### Returns

`unknown`[]

#### Implementation of

[`IContextWindowManager`](../interfaces/IContextWindowManager.md).[`slideWindow`](../interfaces/IContextWindowManager.md#slidewindow)

---

### trim()

> **trim**(`data`, `maxTokens`): `Record`\<`string`, `unknown`>>>>\>

Defined in: [packages/shared/context-engine/src/window.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/context-engine/src/window.ts#L6)

#### Parameters

##### data

`Record`\<`string`, `unknown`\>

##### maxTokens

`number`

#### Returns

`Record`\<`string`, `unknown`\>

#### Implementation of

[`IContextWindowManager`](../interfaces/IContextWindowManager.md).[`trim`](../interfaces/IContextWindowManager.md#trim)
