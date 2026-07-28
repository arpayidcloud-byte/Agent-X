[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [cognitive-kernel](../README.md) / KernelStateMachine

# Class: KernelStateMachine

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-state.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-state.ts#L38)

## Constructors

### Constructor

> **new KernelStateMachine**(): `KernelStateMachine`

#### Returns

`KernelStateMachine`

## Methods

### canTransition()

> **canTransition**(`next`): `boolean`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-state.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-state.ts#L45)

#### Parameters

##### next

[`KernelState`](../type-aliases/KernelState.md)

#### Returns

`boolean`

---

### getState()

> **getState**(): [`KernelState`](../type-aliases/KernelState.md)

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-state.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-state.ts#L41)

#### Returns

[`KernelState`](../type-aliases/KernelState.md)

---

### transition()

> **transition**(`next`): `void`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-state.ts:49](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-state.ts#L49)

#### Parameters

##### next

[`KernelState`](../type-aliases/KernelState.md)

#### Returns

`void`
