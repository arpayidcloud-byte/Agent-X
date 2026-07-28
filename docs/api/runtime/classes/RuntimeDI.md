[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / RuntimeDI

# Class: RuntimeDI

Defined in: [packages/runtime/runtime/src/runtime-di.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-di.ts#L6)

## Constructors

### Constructor

> **new RuntimeDI**(): `RuntimeDI`

#### Returns

`RuntimeDI`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/runtime/runtime/src/runtime-di.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-di.ts#L39)

#### Returns

`void`

---

### has()

> **has**(`name`): `boolean`

Defined in: [packages/runtime/runtime/src/runtime-di.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-di.ts#L30)

#### Parameters

##### name

`string`

#### Returns

`boolean`

---

### register()

> **register**\<`T`>>>>\>(`name`, `instance`): `void`

Defined in: [packages/runtime/runtime/src/runtime-di.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-di.ts#L10)

#### Type Parameters

##### T

`T`

#### Parameters

##### name

`string`

##### instance

`T`

#### Returns

`void`

---

### registerFactory()

> **registerFactory**\<`T`>>>>\>(`name`, `factory`): `void`

Defined in: [packages/runtime/runtime/src/runtime-di.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-di.ts#L14)

#### Type Parameters

##### T

`T`

#### Parameters

##### name

`string`

##### factory

() => `T`

#### Returns

`void`

---

### remove()

> **remove**(`name`): `void`

Defined in: [packages/runtime/runtime/src/runtime-di.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-di.ts#L34)

#### Parameters

##### name

`string`

#### Returns

`void`

---

### resolve()

> **resolve**\<`T`>>>>\>(`name`): `T`

Defined in: [packages/runtime/runtime/src/runtime-di.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-di.ts#L18)

#### Type Parameters

##### T

`T`

#### Parameters

##### name

`string`

#### Returns

`T`
