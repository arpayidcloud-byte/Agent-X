[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [reasoning-framework](../README.md) / ReasoningStrategyBase

# Class: ReasoningStrategyBase

Defined in: [packages/reasoning/reasoning-framework/src/reasoning-strategy.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/reasoning-strategy.ts#L8)

## Implements

- [`IReasoningStrategy`](../interfaces/IReasoningStrategy.md)

## Constructors

### Constructor

> **new ReasoningStrategyBase**(): `ReasoningStrategyBase`

#### Returns

`ReasoningStrategyBase`

## Methods

### checkpoint()

> **checkpoint**(`_sessionId`, `_snapshot`): `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-framework/src/reasoning-strategy.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/reasoning-strategy.ts#L17)

#### Parameters

##### \_sessionId

`string`

##### \_snapshot

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IReasoningStrategy`](../interfaces/IReasoningStrategy.md).[`checkpoint`](../interfaces/IReasoningStrategy.md#checkpoint)

---

### cleanup()

> **cleanup**(): `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-framework/src/reasoning-strategy.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/reasoning-strategy.ts#L21)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IReasoningStrategy`](../interfaces/IReasoningStrategy.md).[`cleanup`](../interfaces/IReasoningStrategy.md#cleanup)

---

### execute()

> **execute**(`graph`): `Promise`\<[`ReasoningGraph`](../interfaces/ReasoningGraph.md)>>>>\>

Defined in: [packages/reasoning/reasoning-framework/src/reasoning-strategy.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/reasoning-strategy.ts#L11)

#### Parameters

##### graph

[`ReasoningGraph`](../interfaces/ReasoningGraph.md)

#### Returns

`Promise`\<[`ReasoningGraph`](../interfaces/ReasoningGraph.md)\>

#### Implementation of

[`IReasoningStrategy`](../interfaces/IReasoningStrategy.md).[`execute`](../interfaces/IReasoningStrategy.md#execute)

---

### initialize()

> **initialize**(`_context`): `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-framework/src/reasoning-strategy.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/reasoning-strategy.ts#L9)

#### Parameters

##### \_context

[`ReasoningContext`](../interfaces/ReasoningContext.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IReasoningStrategy`](../interfaces/IReasoningStrategy.md).[`initialize`](../interfaces/IReasoningStrategy.md#initialize)

---

### prepare()

> **prepare**(`_graph`): `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-framework/src/reasoning-strategy.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/reasoning-strategy.ts#L10)

#### Parameters

##### \_graph

[`ReasoningGraph`](../interfaces/ReasoningGraph.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IReasoningStrategy`](../interfaces/IReasoningStrategy.md).[`prepare`](../interfaces/IReasoningStrategy.md#prepare)

---

### recover()

> **recover**(`_sessionId`): `Promise`\<`Record`\<`string`, `unknown`>>>>>>>>\>\>

Defined in: [packages/reasoning/reasoning-framework/src/reasoning-strategy.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/reasoning-strategy.ts#L18)

#### Parameters

##### \_sessionId

`string`

#### Returns

`Promise`\<`Record`\<`string`, `unknown`\>\>

#### Implementation of

[`IReasoningStrategy`](../interfaces/IReasoningStrategy.md).[`recover`](../interfaces/IReasoningStrategy.md#recover)

---

### validate()

> **validate**(`_graph`): `Promise`\<`boolean`>>>>\>

Defined in: [packages/reasoning/reasoning-framework/src/reasoning-strategy.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/reasoning-strategy.ts#L14)

#### Parameters

##### \_graph

[`ReasoningGraph`](../interfaces/ReasoningGraph.md)

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`IReasoningStrategy`](../interfaces/IReasoningStrategy.md).[`validate`](../interfaces/IReasoningStrategy.md#validate)
