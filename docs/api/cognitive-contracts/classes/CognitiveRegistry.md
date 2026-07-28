[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [cognitive-contracts](../README.md) / CognitiveRegistry

# Class: CognitiveRegistry

Defined in: [packages/cognitive/cognitive-contracts/src/cognitive-registry.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/cognitive-registry.ts#L8)

## Constructors

### Constructor

> **new CognitiveRegistry**(): `CognitiveRegistry`

#### Returns

`CognitiveRegistry`

## Methods

### list()

> **list**(): [`ICognitiveEngine`](../interfaces/ICognitiveEngine.md)[]

Defined in: [packages/cognitive/cognitive-contracts/src/cognitive-registry.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/cognitive-registry.ts#L20)

#### Returns

[`ICognitiveEngine`](../interfaces/ICognitiveEngine.md)[]

---

### register()

> **register**(`engine`): `void`

Defined in: [packages/cognitive/cognitive-contracts/src/cognitive-registry.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/cognitive-registry.ts#L11)

#### Parameters

##### engine

[`ICognitiveEngine`](../interfaces/ICognitiveEngine.md)

#### Returns

`void`

---

### resolve()

> **resolve**(`id`): [`ICognitiveEngine`](../interfaces/ICognitiveEngine.md) \| `undefined`

Defined in: [packages/cognitive/cognitive-contracts/src/cognitive-registry.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/cognitive-registry.ts#L16)

#### Parameters

##### id

`string`

#### Returns

[`ICognitiveEngine`](../interfaces/ICognitiveEngine.md) \| `undefined`
