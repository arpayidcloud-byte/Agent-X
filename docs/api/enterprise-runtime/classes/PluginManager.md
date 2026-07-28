[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / PluginManager

# Class: PluginManager

Defined in: [packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts:74](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts#L74)

## Constructors

### Constructor

> **new PluginManager**(): `PluginManager`

#### Returns

`PluginManager`

## Methods

### disable()

> **disable**(`pluginId`): `void`

Defined in: [packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts:110](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts#L110)

#### Parameters

##### pluginId

`string`

#### Returns

`void`

---

### enable()

> **enable**(`pluginId`): `void`

Defined in: [packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts:98](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts#L98)

#### Parameters

##### pluginId

`string`

#### Returns

`void`

---

### get()

> **get**(`pluginId`): [`PluginEntry`](../interfaces/PluginEntry.md) \| `undefined`

Defined in: [packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts:122](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts#L122)

#### Parameters

##### pluginId

`string`

#### Returns

[`PluginEntry`](../interfaces/PluginEntry.md) \| `undefined`

---

### getAll()

> **getAll**(): [`PluginEntry`](../interfaces/PluginEntry.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts:126](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts#L126)

#### Returns

[`PluginEntry`](../interfaces/PluginEntry.md)[]

---

### getEnabled()

> **getEnabled**(): [`PluginEntry`](../interfaces/PluginEntry.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts:130](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts#L130)

#### Returns

[`PluginEntry`](../interfaces/PluginEntry.md)[]

---

### load()

> **load**(`name`, `version`): [`PluginEntry`](../interfaces/PluginEntry.md)

Defined in: [packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts:77](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts#L77)

#### Parameters

##### name

`string`

##### version

`string`

#### Returns

[`PluginEntry`](../interfaces/PluginEntry.md)

---

### unload()

> **unload**(`pluginId`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts:94](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts#L94)

#### Parameters

##### pluginId

`string`

#### Returns

`boolean`
