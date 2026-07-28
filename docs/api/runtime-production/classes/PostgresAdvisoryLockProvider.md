[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-production](../README.md) / PostgresAdvisoryLockProvider

# Class: PostgresAdvisoryLockProvider

Defined in: [packages/runtime/runtime-production/src/lock-manager.ts:123](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/lock-manager.ts#L123)

## Implements

- [`IDistributedLockManager`](../interfaces/IDistributedLockManager.md)

## Constructors

### Constructor

> **new PostgresAdvisoryLockProvider**(): `PostgresAdvisoryLockProvider`

#### Returns

`PostgresAdvisoryLockProvider`

## Methods

### acquire()

> **acquire**(`key`, `options`): `Promise`\<[`LockInfo`](../interfaces/LockInfo.md)>>>>\>

Defined in: [packages/runtime/runtime-production/src/lock-manager.ts:136](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/lock-manager.ts#L136)

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

Defined in: [packages/runtime/runtime-production/src/lock-manager.ts:191](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/lock-manager.ts#L191)

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

Defined in: [packages/runtime/runtime-production/src/lock-manager.ts:167](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/lock-manager.ts#L167)

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

Defined in: [packages/runtime/runtime-production/src/lock-manager.ts:178](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/lock-manager.ts#L178)

#### Parameters

##### lockId

`string`

##### ttlMs

`number`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IDistributedLockManager`](../interfaces/IDistributedLockManager.md).[`renew`](../interfaces/IDistributedLockManager.md#renew)
