[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / DeveloperProjectManager

# Class: DeveloperProjectManager

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L12)

## Constructors

### Constructor

> **new DeveloperProjectManager**(): `DeveloperProjectManager`

#### Returns

`DeveloperProjectManager`

## Methods

### create()

> **create**(`name`, `accountId`): `object`

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L18)

#### Parameters

##### name

`string`

##### accountId

`string`

#### Returns

`object`

##### accountId

> **accountId**: `string`

##### checksum

> **checksum**: `string`

##### name

> **name**: `string`

##### projectId

> **projectId**: `string`

---

### delete()

> **delete**(`projectId`): `boolean`

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L39)

#### Parameters

##### projectId

`string`

#### Returns

`boolean`

---

### get()

> **get**(`projectId`): \{ `accountId`: `string`; `checksum`: `string`; `name`: `string`; `projectId`: `string`; \} \| `undefined`

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L31)

#### Parameters

##### projectId

`string`

#### Returns

\{ `accountId`: `string`; `checksum`: `string`; `name`: `string`; `projectId`: `string`; \} \| `undefined`

---

### getAll()

> **getAll**(): `object`[]

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:43](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L43)

#### Returns

`object`[]

---

### getByAccount()

> **getByAccount**(`accountId`): `object`[]

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L35)

#### Parameters

##### accountId

`string`

#### Returns

`object`[]
