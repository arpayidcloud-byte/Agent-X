[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [cognitive-contracts](../README.md) / DecisionEngineBase

# Class: DecisionEngineBase

Defined in: [packages/cognitive/cognitive-contracts/src/decision-engine.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/decision-engine.ts#L9)

## Implements

- [`IDecisionEngine`](../interfaces/IDecisionEngine.md)

## Constructors

### Constructor

> **new DecisionEngineBase**(): `DecisionEngineBase`

#### Returns

`DecisionEngineBase`

## Methods

### makeDecision()

> **makeDecision**(`options`, `_policy`): `Promise`\<[`DecisionResult`](../interfaces/DecisionResult.md)>>>>\>

Defined in: [packages/cognitive/cognitive-contracts/src/decision-engine.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/decision-engine.ts#L10)

#### Parameters

##### options

`string`[]

##### \_policy

[`SafetyPolicy`](../interfaces/SafetyPolicy.md)

#### Returns

`Promise`\<[`DecisionResult`](../interfaces/DecisionResult.md)\>

#### Implementation of

[`IDecisionEngine`](../interfaces/IDecisionEngine.md).[`makeDecision`](../interfaces/IDecisionEngine.md#makedecision)
