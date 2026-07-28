[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / DistributedLockManager

# Class: DistributedLockManager

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts:122](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts#L122)

## Constructors

### Constructor

> **new DistributedLockManager**(): `DistributedLockManager`

#### Returns

`DistributedLockManager`

## Methods

### acquire()

> **acquire**(`resource`, `owner`, `ttlMs?`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts:125](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts#L125)

#### Parameters

##### resource

`string`

##### owner

`string`

##### ttlMs?

`number` = `30000`

#### Returns

`boolean`

---

### getOwner()

> **getOwner**(`resource`): `string` \| `undefined`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts:149](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts#L149)

#### Parameters

##### resource

`string`

#### Returns

`string` \| `undefined`

---

### isLocked()

> **isLocked**(`resource`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts:139](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts#L139)

#### Parameters

##### resource

`string`

#### Returns

`boolean`

---

### release()

> **release**(`resource`, `owner`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts:132](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts#L132)

#### Parameters

##### resource

`string`

##### owner

`string`

#### Returns

`boolean`
