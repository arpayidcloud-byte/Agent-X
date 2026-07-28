[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / RuntimeLifecycleManager

# Class: RuntimeLifecycleManager

Defined in: [packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts:4](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts#L4)

## Constructors

### Constructor

> **new RuntimeLifecycleManager**(): `RuntimeLifecycleManager`

#### Returns

`RuntimeLifecycleManager`

## Methods

### getState()

> **getState**(): [`RuntimeState`](../type-aliases/RuntimeState.md)

Defined in: [packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts#L31)

#### Returns

[`RuntimeState`](../type-aliases/RuntimeState.md)

---

### getTransitions()

> **getTransitions**(): `object`[]

Defined in: [packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts#L35)

#### Returns

`object`[]

---

### transition()

> **transition**(`newState`): `void`

Defined in: [packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts#L8)

#### Parameters

##### newState

[`RuntimeState`](../type-aliases/RuntimeState.md)

#### Returns

`void`
