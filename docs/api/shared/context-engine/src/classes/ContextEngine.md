[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/context-engine/src](../README.md) / ContextEngine

# Class: ContextEngine

Defined in: [packages/shared/context-engine/src/engine.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/context-engine/src/engine.ts#L12)

## Implements

- [`IContextEngine`](../interfaces/IContextEngine.md)

## Constructors

### Constructor

> **new ContextEngine**(`eventBus`, `estimator`, `compressor`): `ContextEngine`

Defined in: [packages/shared/context-engine/src/engine.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/context-engine/src/engine.ts#L21)

#### Parameters

##### eventBus

`IEventBus`

##### estimator

[`ITokenEstimator`](../interfaces/ITokenEstimator.md)

##### compressor

[`IContextCompressor`](../interfaces/IContextCompressor.md)

#### Returns

`ContextEngine`

## Methods

### compressContext()

> **compressContext**(`contextId`, `targetTokens`): `Promise`\<[`ContextSnapshot`](../interfaces/ContextSnapshot.md)>>>>\>

Defined in: [packages/shared/context-engine/src/engine.ts:98](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/context-engine/src/engine.ts#L98)

#### Parameters

##### contextId

`string`

##### targetTokens

`number`

#### Returns

`Promise`\<[`ContextSnapshot`](../interfaces/ContextSnapshot.md)\>

#### Implementation of

[`IContextEngine`](../interfaces/IContextEngine.md).[`compressContext`](../interfaces/IContextEngine.md#compresscontext)

---

### createContext()

> **createContext**(`scope`, `initialData?`): `Promise`\<[`ContextSnapshot`](../interfaces/ContextSnapshot.md)>>>>\>

Defined in: [packages/shared/context-engine/src/engine.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/context-engine/src/engine.ts#L31)

#### Parameters

##### scope

[`ContextScope`](../type-aliases/ContextScope.md)

##### initialData?

`Record`\<`string`, `unknown`\> = `{}`

#### Returns

`Promise`\<[`ContextSnapshot`](../interfaces/ContextSnapshot.md)\>

#### Implementation of

[`IContextEngine`](../interfaces/IContextEngine.md).[`createContext`](../interfaces/IContextEngine.md#createcontext)

---

### getContext()

> **getContext**(`contextId`): `Promise`\<[`ContextSnapshot`](../interfaces/ContextSnapshot.md) \| `undefined`>>>>\>

Defined in: [packages/shared/context-engine/src/engine.ts:78](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/context-engine/src/engine.ts#L78)

#### Parameters

##### contextId

`string`

#### Returns

`Promise`\<[`ContextSnapshot`](../interfaces/ContextSnapshot.md) \| `undefined`\>

#### Implementation of

[`IContextEngine`](../interfaces/IContextEngine.md).[`getContext`](../interfaces/IContextEngine.md#getcontext)

---

### getMetrics()

> **getMetrics**(): [`ContextMetrics`](../interfaces/ContextMetrics.md)

Defined in: [packages/shared/context-engine/src/engine.ts:125](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/context-engine/src/engine.ts#L125)

#### Returns

[`ContextMetrics`](../interfaces/ContextMetrics.md)

---

### mergeContexts()

> **mergeContexts**(`sourceIds`, `targetScope`): `Promise`\<[`ContextSnapshot`](../interfaces/ContextSnapshot.md)>>>>\>

Defined in: [packages/shared/context-engine/src/engine.ts:82](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/context-engine/src/engine.ts#L82)

#### Parameters

##### sourceIds

`string`[]

##### targetScope

[`ContextScope`](../type-aliases/ContextScope.md)

#### Returns

`Promise`\<[`ContextSnapshot`](../interfaces/ContextSnapshot.md)\>

#### Implementation of

[`IContextEngine`](../interfaces/IContextEngine.md).[`mergeContexts`](../interfaces/IContextEngine.md#mergecontexts)

---

### updateContext()

> **updateContext**(`contextId`, `updates`): `Promise`\<[`ContextSnapshot`](../interfaces/ContextSnapshot.md)>>>>\>

Defined in: [packages/shared/context-engine/src/engine.ts:54](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/context-engine/src/engine.ts#L54)

#### Parameters

##### contextId

`string`

##### updates

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<[`ContextSnapshot`](../interfaces/ContextSnapshot.md)\>

#### Implementation of

[`IContextEngine`](../interfaces/IContextEngine.md).[`updateContext`](../interfaces/IContextEngine.md#updatecontext)

---

### validateContext()

> **validateContext**(`contextId`): `Promise`\<`boolean`>>>>\>

Defined in: [packages/shared/context-engine/src/engine.ts:110](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/context-engine/src/engine.ts#L110)

#### Parameters

##### contextId

`string`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`IContextEngine`](../interfaces/IContextEngine.md).[`validateContext`](../interfaces/IContextEngine.md#validatecontext)
