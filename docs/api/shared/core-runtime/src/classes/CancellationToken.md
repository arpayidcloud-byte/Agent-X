[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/core-runtime/src](../README.md) / CancellationToken

# Class: CancellationToken

Defined in: [packages/shared/core-runtime/src/cancellation/index.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/cancellation/index.ts#L11)

## Implements

- [`ICancellationToken`](../interfaces/ICancellationToken.md)

## Constructors

### Constructor

> **new CancellationToken**(): `CancellationToken`

Defined in: [packages/shared/core-runtime/src/cancellation/index.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/cancellation/index.ts#L15)

#### Returns

`CancellationToken`

## Accessors

### isCancelled

#### Get Signature

> **get** **isCancelled**(): `boolean`

Defined in: [packages/shared/core-runtime/src/cancellation/index.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/cancellation/index.ts#L27)

##### Returns

`boolean`

#### Implementation of

[`ICancellationToken`](../interfaces/ICancellationToken.md).[`isCancelled`](../interfaces/ICancellationToken.md#iscancelled)

---

### reason

#### Get Signature

> **get** **reason**(): `string`

Defined in: [packages/shared/core-runtime/src/cancellation/index.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/cancellation/index.ts#L23)

##### Returns

`string`

#### Implementation of

[`ICancellationToken`](../interfaces/ICancellationToken.md).[`reason`](../interfaces/ICancellationToken.md#reason)

---

### signal

#### Get Signature

> **get** **signal**(): `AbortSignal`

Defined in: [packages/shared/core-runtime/src/cancellation/index.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/cancellation/index.ts#L19)

##### Returns

`AbortSignal`

#### Implementation of

[`ICancellationToken`](../interfaces/ICancellationToken.md).[`signal`](../interfaces/ICancellationToken.md#signal)

## Methods

### cancel()

> **cancel**(`reason`): `void`

Defined in: [packages/shared/core-runtime/src/cancellation/index.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/cancellation/index.ts#L31)

#### Parameters

##### reason

`string`

#### Returns

`void`

#### Implementation of

[`ICancellationToken`](../interfaces/ICancellationToken.md).[`cancel`](../interfaces/ICancellationToken.md#cancel)

---

### checkCancellation()

> **checkCancellation**(): `void`

Defined in: [packages/shared/core-runtime/src/cancellation/index.ts:36](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/cancellation/index.ts#L36)

#### Returns

`void`

#### Implementation of

[`ICancellationToken`](../interfaces/ICancellationToken.md).[`checkCancellation`](../interfaces/ICancellationToken.md#checkcancellation)

---

### fork()

> **fork**(): [`ICancellationToken`](../interfaces/ICancellationToken.md)

Defined in: [packages/shared/core-runtime/src/cancellation/index.ts:42](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/cancellation/index.ts#L42)

#### Returns

[`ICancellationToken`](../interfaces/ICancellationToken.md)

#### Implementation of

[`ICancellationToken`](../interfaces/ICancellationToken.md).[`fork`](../interfaces/ICancellationToken.md#fork)
