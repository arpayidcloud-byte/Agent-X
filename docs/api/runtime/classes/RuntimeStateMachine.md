[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / RuntimeStateMachine

# Class: RuntimeStateMachine

Defined in: [packages/runtime/runtime/src/runtime-state.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-state.ts#L8)

## Constructors

### Constructor

> **new RuntimeStateMachine**(): `RuntimeStateMachine`

#### Returns

`RuntimeStateMachine`

## Methods

### canTransition()

> `static` **canTransition**(`current`, `next`): `boolean`

Defined in: [packages/runtime/runtime/src/runtime-state.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-state.ts#L32)

#### Parameters

##### current

[`RuntimeState`](../type-aliases/RuntimeState.md)

##### next

[`RuntimeState`](../type-aliases/RuntimeState.md)

#### Returns

`boolean`

---

### getValidTransitions()

> `static` **getValidTransitions**(`state`): [`RuntimeState`](../type-aliases/RuntimeState.md)[]

Defined in: [packages/runtime/runtime/src/runtime-state.ts:36](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-state.ts#L36)

#### Parameters

##### state

[`RuntimeState`](../type-aliases/RuntimeState.md)

#### Returns

[`RuntimeState`](../type-aliases/RuntimeState.md)[]
