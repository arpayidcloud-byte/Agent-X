[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-production](../README.md) / MemoryLockProvider

# Class: MemoryLockProvider

Defined in: [packages/runtime/runtime-production/src/lock-manager.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/lock-manager.ts#L16)

## Implements

- [`IDistributedLockManager`](../interfaces/IDistributedLockManager.md)

## Constructors

### Constructor

> **new MemoryLockProvider**(): `MemoryLockProvider`

#### Returns

`MemoryLockProvider`

## Methods

### acquire()

> **acquire**(`key`, `options`): `Promise`\<[`LockInfo`](../interfaces/LockInfo.md)>>>>\>

Defined in: [packages/runtime/runtime-production/src/lock-manager.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/lock-manager.ts#L19)

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

Defined in: [packages/runtime/runtime-production/src/lock-manager.ts:56](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/lock-manager.ts#L56)

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

Defined in: [packages/runtime/runtime-production/src/lock-manager.ts:36](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/lock-manager.ts#L36)

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

Defined in: [packages/runtime/runtime-production/src/lock-manager.ts:46](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/lock-manager.ts#L46)

#### Parameters

##### lockId

`string`

##### ttlMs

`number`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IDistributedLockManager`](../interfaces/IDistributedLockManager.md).[`renew`](../interfaces/IDistributedLockManager.md#renew)
