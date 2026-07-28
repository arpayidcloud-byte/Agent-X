[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [cognitive-contracts](../README.md) / ReasoningEngineBase

# Class: ReasoningEngineBase

Defined in: [packages/cognitive/cognitive-contracts/src/reasoning-engine.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/reasoning-engine.ts#L9)

## Implements

- [`IReasoningEngine`](../interfaces/IReasoningEngine.md)

## Constructors

### Constructor

> **new ReasoningEngineBase**(): `ReasoningEngineBase`

#### Returns

`ReasoningEngineBase`

## Methods

### reason()

> **reason**(`_context`, `_input`): `Promise`\<[`ReasoningResult`](../interfaces/ReasoningResult.md)>>>>\>

Defined in: [packages/cognitive/cognitive-contracts/src/reasoning-engine.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/reasoning-engine.ts#L10)

#### Parameters

##### \_context

[`ReasoningContext`](../interfaces/ReasoningContext.md)

##### \_input

`string`

#### Returns

`Promise`\<[`ReasoningResult`](../interfaces/ReasoningResult.md)\>

#### Implementation of

[`IReasoningEngine`](../interfaces/IReasoningEngine.md).[`reason`](../interfaces/IReasoningEngine.md#reason)
