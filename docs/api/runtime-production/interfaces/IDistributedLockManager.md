[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-production](../README.md) / IDistributedLockManager

# Interface: IDistributedLockManager

Defined in: [packages/runtime/runtime-production/src/lock-manager.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/lock-manager.ts#L9)

## Methods

### acquire()

> **acquire**(`key`, `options`): `Promise`\<[`LockInfo`](LockInfo.md)>>>>\>

Defined in: [packages/runtime/runtime-production/src/lock-manager.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/lock-manager.ts#L10)

#### Parameters

##### key

`string`

##### options

[`LockOptions`](LockOptions.md)

#### Returns

`Promise`\<[`LockInfo`](LockInfo.md)\>

---

### expire()

> **expire**(`key`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-production/src/lock-manager.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/lock-manager.ts#L13)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`void`\>

---

### release()

> **release**(`lockId`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-production/src/lock-manager.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/lock-manager.ts#L11)

#### Parameters

##### lockId

`string`

#### Returns

`Promise`\<`void`\>

---

### renew()

> **renew**(`lockId`, `ttlMs`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-production/src/lock-manager.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/lock-manager.ts#L12)

#### Parameters

##### lockId

`string`

##### ttlMs

`number`

#### Returns

`Promise`\<`void`\>
