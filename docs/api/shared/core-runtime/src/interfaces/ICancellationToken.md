[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/core-runtime/src](../README.md) / ICancellationToken

# Interface: ICancellationToken

Defined in: [packages/shared/core-runtime/src/cancellation/index.ts:1](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/cancellation/index.ts#L1)

## Properties

### isCancelled

> `readonly` **isCancelled**: `boolean`

Defined in: [packages/shared/core-runtime/src/cancellation/index.ts:4](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/cancellation/index.ts#L4)

---

### reason

> `readonly` **reason**: `string`

Defined in: [packages/shared/core-runtime/src/cancellation/index.ts:3](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/cancellation/index.ts#L3)

---

### signal

> `readonly` **signal**: `AbortSignal`

Defined in: [packages/shared/core-runtime/src/cancellation/index.ts:2](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/cancellation/index.ts#L2)

## Methods

### cancel()

> **cancel**(`reason`): `void`

Defined in: [packages/shared/core-runtime/src/cancellation/index.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/cancellation/index.ts#L6)

#### Parameters

##### reason

`string`

#### Returns

`void`

---

### checkCancellation()

> **checkCancellation**(): `void`

Defined in: [packages/shared/core-runtime/src/cancellation/index.ts:7](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/cancellation/index.ts#L7)

#### Returns

`void`

---

### fork()

> **fork**(): `ICancellationToken`

Defined in: [packages/shared/core-runtime/src/cancellation/index.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/cancellation/index.ts#L8)

#### Returns

`ICancellationToken`
