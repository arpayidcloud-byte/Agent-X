[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / ToolDiscovery

# Class: ToolDiscovery

Defined in: [packages/shared/tool-sdk/src/discovery/index.ts:4](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/discovery/index.ts#L4)

## Implements

- [`IToolDiscovery`](../interfaces/IToolDiscovery.md)

## Constructors

### Constructor

> **new ToolDiscovery**(`validator`, `registry`): `ToolDiscovery`

Defined in: [packages/shared/tool-sdk/src/discovery/index.ts:5](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/discovery/index.ts#L5)

#### Parameters

##### validator

[`IToolValidator`](../interfaces/IToolValidator.md)

##### registry

[`IToolRegistry`](../interfaces/IToolRegistry.md)

#### Returns

`ToolDiscovery`

## Methods

### checkCompatibility()

> **checkCompatibility**(`manifest`): `boolean`

Defined in: [packages/shared/tool-sdk/src/discovery/index.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/discovery/index.ts#L39)

#### Parameters

##### manifest

[`ToolManifest`](../interfaces/ToolManifest.md)

#### Returns

`boolean`

#### Implementation of

[`IToolDiscovery`](../interfaces/IToolDiscovery.md).[`checkCompatibility`](../interfaces/IToolDiscovery.md#checkcompatibility)

---

### loadManifest()

> **loadManifest**(`_path`): `Promise`\<[`ToolManifest`](../interfaces/ToolManifest.md)>>>>\>

Defined in: [packages/shared/tool-sdk/src/discovery/index.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/discovery/index.ts#L10)

#### Parameters

##### \_path

`string`

#### Returns

`Promise`\<[`ToolManifest`](../interfaces/ToolManifest.md)\>

#### Implementation of

[`IToolDiscovery`](../interfaces/IToolDiscovery.md).[`loadManifest`](../interfaces/IToolDiscovery.md#loadmanifest)

---

### registerFromManifest()

> **registerFromManifest**(`manifest`, `tools`): `void`

Defined in: [packages/shared/tool-sdk/src/discovery/index.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/discovery/index.ts#L17)

#### Parameters

##### manifest

[`ToolManifest`](../interfaces/ToolManifest.md)

##### tools

[`ITool`](../interfaces/ITool.md)[]

#### Returns

`void`

#### Implementation of

[`IToolDiscovery`](../interfaces/IToolDiscovery.md).[`registerFromManifest`](../interfaces/IToolDiscovery.md#registerfrommanifest)

---

### validateVersion()

> **validateVersion**(`version`): `boolean`

Defined in: [packages/shared/tool-sdk/src/discovery/index.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/discovery/index.ts#L34)

#### Parameters

##### version

`string`

#### Returns

`boolean`

#### Implementation of

[`IToolDiscovery`](../interfaces/IToolDiscovery.md).[`validateVersion`](../interfaces/IToolDiscovery.md#validateversion)
