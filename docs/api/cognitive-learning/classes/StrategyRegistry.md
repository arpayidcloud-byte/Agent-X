[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [cognitive-learning](../README.md) / StrategyRegistry

# Class: StrategyRegistry

Defined in: [packages/cognitive/cognitive-learning/src/strategy-registry.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/strategy-registry.ts#L8)

## Constructors

### Constructor

> **new StrategyRegistry**(): `StrategyRegistry`

#### Returns

`StrategyRegistry`

## Methods

### get()

> **get**(`id`): [`StrategyRecord`](../interfaces/StrategyRecord.md) \| `undefined`

Defined in: [packages/cognitive/cognitive-learning/src/strategy-registry.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/strategy-registry.ts#L15)

#### Parameters

##### id

`string`

#### Returns

[`StrategyRecord`](../interfaces/StrategyRecord.md) \| `undefined`

---

### getAll()

> **getAll**(): [`StrategyRecord`](../interfaces/StrategyRecord.md)[]

Defined in: [packages/cognitive/cognitive-learning/src/strategy-registry.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/strategy-registry.ts#L19)

#### Returns

[`StrategyRecord`](../interfaces/StrategyRecord.md)[]

---

### register()

> **register**(`strategy`): `void`

Defined in: [packages/cognitive/cognitive-learning/src/strategy-registry.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/strategy-registry.ts#L11)

#### Parameters

##### strategy

[`StrategyRecord`](../interfaces/StrategyRecord.md)

#### Returns

`void`
