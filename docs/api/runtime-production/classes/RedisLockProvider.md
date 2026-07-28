[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-production](../README.md) / RedisLockProvider

# Class: RedisLockProvider

Defined in: [packages/runtime/runtime-production/src/lock-manager.ts:61](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/lock-manager.ts#L61)

## Implements

- [`IDistributedLockManager`](../interfaces/IDistributedLockManager.md)

## Constructors

### Constructor

> **new RedisLockProvider**(): `RedisLockProvider`

#### Returns

`RedisLockProvider`

## Methods

### acquire()

> **acquire**(`key`, `options`): `Promise`\<[`LockInfo`](../interfaces/LockInfo.md)>>>>\>

Defined in: [packages/runtime/runtime-production/src/lock-manager.ts:65](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/lock-manager.ts#L65)

#### Parameters

##### key

`string`

##### options

[`LockOptions`](../interfaces/LockOptions.md)

#### Returns

`Promise`\<[`LockInfo`](../interfaces/LockInfo.md)\>

#### Implementation of

[`IDistributedLockManager`](../interfaces/IDistributedLockManager.md).[`acquire`](../interfaces/IDistributedLockManager.md#acquire)

---

### expire()

> **expire**(`key`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-production/src/lock-manager.ts:118](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/lock-manager.ts#L118)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IDistributedLockManager`](../interfaces/IDistributedLockManager.md).[`expire`](../interfaces/IDistributedLockManager.md#expire)

---

### release()

> **release**(`lockId`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-production/src/lock-manager.ts:95](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/lock-manager.ts#L95)

#### Parameters

##### lockId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IDistributedLockManager`](../interfaces/IDistributedLockManager.md).[`release`](../interfaces/IDistributedLockManager.md#release)

---

### renew()

> **renew**(`lockId`, `ttlMs`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-production/src/lock-manager.ts:105](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/lock-manager.ts#L105)

#### Parameters

##### lockId

`string`

##### ttlMs

`number`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IDistributedLockManager`](../interfaces/IDistributedLockManager.md).[`renew`](../interfaces/IDistributedLockManager.md#renew)
