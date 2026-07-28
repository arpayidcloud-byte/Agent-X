[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / RuntimeRegistry

# Class: RuntimeRegistry

Defined in: [packages/runtime/runtime/src/runtime-registry.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-registry.ts#L12)

## Constructors

### Constructor

> **new RuntimeRegistry**(): `RuntimeRegistry`

#### Returns

`RuntimeRegistry`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/runtime/runtime/src/runtime-registry.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-registry.ts#L35)

#### Returns

`void`

---

### get()

> **get**\<`T`>>>>\>(`name`): `T` \| `undefined`

Defined in: [packages/runtime/runtime/src/runtime-registry.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-registry.ts#L19)

#### Type Parameters

##### T

`T`

#### Parameters

##### name

`string`

#### Returns

`T` \| `undefined`

---

### has()

> **has**(`name`): `boolean`

Defined in: [packages/runtime/runtime/src/runtime-registry.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-registry.ts#L23)

#### Parameters

##### name

`string`

#### Returns

`boolean`

---

### list()

> **list**(): [`ComponentEntry`](../interfaces/ComponentEntry.md)[]

Defined in: [packages/runtime/runtime/src/runtime-registry.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-registry.ts#L31)

#### Returns

[`ComponentEntry`](../interfaces/ComponentEntry.md)[]

---

### register()

> **register**(`name`, `instance`): `void`

Defined in: [packages/runtime/runtime/src/runtime-registry.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-registry.ts#L15)

#### Parameters

##### name

`string`

##### instance

`unknown`

#### Returns

`void`

---

### remove()

> **remove**(`name`): `void`

Defined in: [packages/runtime/runtime/src/runtime-registry.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-registry.ts#L27)

#### Parameters

##### name

`string`

#### Returns

`void`
