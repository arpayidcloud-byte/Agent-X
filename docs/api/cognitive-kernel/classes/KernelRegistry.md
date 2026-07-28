[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [cognitive-kernel](../README.md) / KernelRegistry

# Class: KernelRegistry

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-registry.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-registry.ts#L8)

## Constructors

### Constructor

> **new KernelRegistry**(): `KernelRegistry`

#### Returns

`KernelRegistry`

## Methods

### listEngines()

> **listEngines**(): [`EngineContract`](../interfaces/EngineContract.md)[]

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-registry.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-registry.ts#L19)

#### Returns

[`EngineContract`](../interfaces/EngineContract.md)[]

---

### register()

> **register**(`engine`): `void`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-registry.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-registry.ts#L11)

#### Parameters

##### engine

[`EngineContract`](../interfaces/EngineContract.md)

#### Returns

`void`

---

### resolve()

> **resolve**(`id`): [`EngineContract`](../interfaces/EngineContract.md) \| `undefined`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-registry.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-registry.ts#L15)

#### Parameters

##### id

`string`

#### Returns

[`EngineContract`](../interfaces/EngineContract.md) \| `undefined`
