[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [cognitive-contracts](../README.md) / MemoryStrategyBase

# Class: MemoryStrategyBase

Defined in: [packages/cognitive/cognitive-contracts/src/memory-strategy.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/memory-strategy.ts#L9)

## Implements

- [`IMemoryStrategy`](../interfaces/IMemoryStrategy.md)

## Constructors

### Constructor

> **new MemoryStrategyBase**(): `MemoryStrategyBase`

#### Returns

`MemoryStrategyBase`

## Methods

### retrieve()

> **retrieve**(`_query`, `_strategy`): `Promise`\<`unknown`[]\>

Defined in: [packages/cognitive/cognitive-contracts/src/memory-strategy.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/memory-strategy.ts#L10)

#### Parameters

##### \_query

`string`

##### \_strategy

[`MemoryRetrievalStrategy`](../interfaces/MemoryRetrievalStrategy.md)

#### Returns

`Promise`\<`unknown`[]\>

#### Implementation of

[`IMemoryStrategy`](../interfaces/IMemoryStrategy.md).[`retrieve`](../interfaces/IMemoryStrategy.md#retrieve)

---

### update()

> **update**(`_key`, `_value`, `_strategy`): `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-contracts/src/memory-strategy.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/memory-strategy.ts#L14)

#### Parameters

##### \_key

`string`

##### \_value

`unknown`

##### \_strategy

[`MemoryUpdateStrategy`](../interfaces/MemoryUpdateStrategy.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMemoryStrategy`](../interfaces/IMemoryStrategy.md).[`update`](../interfaces/IMemoryStrategy.md#update)
