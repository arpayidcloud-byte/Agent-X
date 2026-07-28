[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / DistributedCache

# Class: DistributedCache

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts:3](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts#L3)

## Constructors

### Constructor

> **new DistributedCache**(): `DistributedCache`

#### Returns

`DistributedCache`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts#L31)

#### Returns

`void`

---

### delete()

> **delete**(`key`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts#L23)

#### Parameters

##### key

`string`

#### Returns

`boolean`

---

### get()

> **get**(`key`): `unknown`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts#L13)

#### Parameters

##### key

`string`

#### Returns

`unknown`

---

### has()

> **has**(`key`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts#L27)

#### Parameters

##### key

`string`

#### Returns

`boolean`

---

### set()

> **set**(`key`, `value`, `ttlMs?`): `void`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts#L6)

#### Parameters

##### key

`string`

##### value

`unknown`

##### ttlMs?

`number` = `60000`

#### Returns

`void`

---

### size()

> **size**(): `number`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts#L35)

#### Returns

`number`
