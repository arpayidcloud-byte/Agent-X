[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / ConfigurationManager

# Class: ConfigurationManager

Defined in: [packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts#L12)

## Constructors

### Constructor

> **new ConfigurationManager**(): `ConfigurationManager`

#### Returns

`ConfigurationManager`

## Methods

### delete()

> **delete**(`key`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts:43](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts#L43)

#### Parameters

##### key

`string`

#### Returns

`boolean`

---

### get()

> **get**(`key`): [`ConfigEntry`](../interfaces/ConfigEntry.md) \| `undefined`

Defined in: [packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts#L33)

#### Parameters

##### key

`string`

#### Returns

[`ConfigEntry`](../interfaces/ConfigEntry.md) \| `undefined`

---

### getAll()

> **getAll**(): [`ConfigEntry`](../interfaces/ConfigEntry.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts:47](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts#L47)

#### Returns

[`ConfigEntry`](../interfaces/ConfigEntry.md)[]

---

### getValue()

> **getValue**(`key`): `unknown`

Defined in: [packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts#L37)

#### Parameters

##### key

`string`

#### Returns

`unknown`

---

### set()

> **set**(`key`, `value`, `source`): [`ConfigEntry`](../interfaces/ConfigEntry.md)

Defined in: [packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts#L15)

#### Parameters

##### key

`string`

##### value

`unknown`

##### source

`string`

#### Returns

[`ConfigEntry`](../interfaces/ConfigEntry.md)

---

### sync()

> **sync**(`entries`): `void`

Defined in: [packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts:51](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/config/ConfigManager.ts#L51)

#### Parameters

##### entries

[`ConfigEntry`](../interfaces/ConfigEntry.md)[]

#### Returns

`void`
