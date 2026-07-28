[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/secrets/src](../README.md) / SecretCache

# Class: SecretCache

Defined in: [packages/shared/secrets/src/cache.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/cache.ts#L9)

## Constructors

### Constructor

> **new SecretCache**(`config?`): `SecretCache`

Defined in: [packages/shared/secrets/src/cache.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/cache.ts#L13)

#### Parameters

##### config?

`SecretCacheConfig` = `{}`

#### Returns

`SecretCache`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/shared/secrets/src/cache.ts:56](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/cache.ts#L56)

#### Returns

`void`

---

### delete()

> **delete**(`key`): `void`

Defined in: [packages/shared/secrets/src/cache.ts:51](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/cache.ts#L51)

#### Parameters

##### key

`string`

#### Returns

`void`

---

### get()

> **get**(`key`): `string` \| `undefined`

Defined in: [packages/shared/secrets/src/cache.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/cache.ts#L35)

#### Parameters

##### key

`string`

#### Returns

`string` \| `undefined`

---

### has()

> **has**(`key`): `boolean`

Defined in: [packages/shared/secrets/src/cache.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/cache.ts#L39)

#### Parameters

##### key

`string`

#### Returns

`boolean`

---

### hasNegative()

> **hasNegative**(`key`): `boolean`

Defined in: [packages/shared/secrets/src/cache.ts:47](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/cache.ts#L47)

#### Parameters

##### key

`string`

#### Returns

`boolean`

---

### hasPositive()

> **hasPositive**(`key`): `boolean`

Defined in: [packages/shared/secrets/src/cache.ts:43](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/cache.ts#L43)

#### Parameters

##### key

`string`

#### Returns

`boolean`

---

### set()

> **set**(`key`, `value`): `void`

Defined in: [packages/shared/secrets/src/cache.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/cache.ts#L25)

#### Parameters

##### key

`string`

##### value

`string`

#### Returns

`void`

---

### setNegative()

> **setNegative**(`key`): `void`

Defined in: [packages/shared/secrets/src/cache.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/cache.ts#L30)

#### Parameters

##### key

`string`

#### Returns

`void`
