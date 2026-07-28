[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / CoordinatorRegistry

# Class: CoordinatorRegistry

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-registry.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-registry.ts#L6)

## Constructors

### Constructor

> **new CoordinatorRegistry**(): `CoordinatorRegistry`

#### Returns

`CoordinatorRegistry`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-registry.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-registry.ts#L25)

#### Returns

`void`

---

### has()

> **has**(`name`): `boolean`

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-registry.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-registry.ts#L21)

#### Parameters

##### name

`string`

#### Returns

`boolean`

---

### register()

> **register**\<`T`>>>>\>(`name`, `service`): `void`

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-registry.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-registry.ts#L9)

#### Type Parameters

##### T

`T`

#### Parameters

##### name

`string`

##### service

`T`

#### Returns

`void`

---

### resolve()

> **resolve**\<`T`>>>>\>(`name`): `T`

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-registry.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-registry.ts#L13)

#### Type Parameters

##### T

`T`

#### Parameters

##### name

`string`

#### Returns

`T`
