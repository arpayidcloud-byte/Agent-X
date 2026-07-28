[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [reasoning-algorithms](../README.md) / HypothesisEngine

# Class: HypothesisEngine

Defined in: [packages/reasoning/reasoning-algorithms/src/hypothesis-engine.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/hypothesis-engine.ts#L8)

## Constructors

### Constructor

> **new HypothesisEngine**(): `HypothesisEngine`

#### Returns

`HypothesisEngine`

## Methods

### prune()

> **prune**(`candidates`, `threshold`): [`Hypothesis`](../interfaces/Hypothesis.md)[]

Defined in: [packages/reasoning/reasoning-algorithms/src/hypothesis-engine.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/hypothesis-engine.ts#L13)

#### Parameters

##### candidates

[`Hypothesis`](../interfaces/Hypothesis.md)[]

##### threshold

`number`

#### Returns

[`Hypothesis`](../interfaces/Hypothesis.md)[]

---

### rank()

> **rank**(`candidates`): [`Hypothesis`](../interfaces/Hypothesis.md)[]

Defined in: [packages/reasoning/reasoning-algorithms/src/hypothesis-engine.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/hypothesis-engine.ts#L9)

#### Parameters

##### candidates

[`Hypothesis`](../interfaces/Hypothesis.md)[]

#### Returns

[`Hypothesis`](../interfaces/Hypothesis.md)[]
