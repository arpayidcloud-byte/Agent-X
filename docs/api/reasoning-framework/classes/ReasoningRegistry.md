[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [reasoning-framework](../README.md) / ReasoningRegistry

# Class: ReasoningRegistry

Defined in: [packages/reasoning/reasoning-framework/src/reasoning-registry.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/reasoning-registry.ts#L8)

## Constructors

### Constructor

> **new ReasoningRegistry**(): `ReasoningRegistry`

#### Returns

`ReasoningRegistry`

## Methods

### register()

> **register**(`id`, `strategy`): `void`

Defined in: [packages/reasoning/reasoning-framework/src/reasoning-registry.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/reasoning-registry.ts#L11)

#### Parameters

##### id

`string`

##### strategy

[`IReasoningStrategy`](../interfaces/IReasoningStrategy.md)

#### Returns

`void`

---

### resolve()

> **resolve**(`id`): [`IReasoningStrategy`](../interfaces/IReasoningStrategy.md) \| `undefined`

Defined in: [packages/reasoning/reasoning-framework/src/reasoning-registry.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/reasoning-registry.ts#L15)

#### Parameters

##### id

`string`

#### Returns

[`IReasoningStrategy`](../interfaces/IReasoningStrategy.md) \| `undefined`
