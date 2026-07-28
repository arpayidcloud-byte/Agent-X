[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / ConcurrencyController

# Class: ConcurrencyController

Defined in: [packages/runtime/runtime/src/coordinator/concurrency.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/concurrency.ts#L17)

## Constructors

### Constructor

> **new ConcurrencyController**(`config`): `ConcurrencyController`

Defined in: [packages/runtime/runtime/src/coordinator/concurrency.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/concurrency.ts#L21)

#### Parameters

##### config

[`ConcurrencyConfig`](../interfaces/ConcurrencyConfig.md)

#### Returns

`ConcurrencyController`

## Methods

### acquire()

> **acquire**(`type`): `boolean`

Defined in: [packages/runtime/runtime/src/coordinator/concurrency.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/concurrency.ts#L31)

#### Parameters

##### type

`string`

#### Returns

`boolean`

---

### canAcquire()

> **canAcquire**(`type`): `boolean`

Defined in: [packages/runtime/runtime/src/coordinator/concurrency.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/concurrency.ts#L25)

#### Parameters

##### type

`string`

#### Returns

`boolean`

---

### getUsage()

> **getUsage**(`type`): `number`

Defined in: [packages/runtime/runtime/src/coordinator/concurrency.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/concurrency.ts#L45)

#### Parameters

##### type

`string`

#### Returns

`number`

---

### release()

> **release**(`type`): `void`

Defined in: [packages/runtime/runtime/src/coordinator/concurrency.ts:40](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/concurrency.ts#L40)

#### Parameters

##### type

`string`

#### Returns

`void`

---

### reset()

> **reset**(): `void`

Defined in: [packages/runtime/runtime/src/coordinator/concurrency.ts:72](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/concurrency.ts#L72)

#### Returns

`void`
