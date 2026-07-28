[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / IToolDiscovery

# Interface: IToolDiscovery

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:100](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L100)

## Methods

### checkCompatibility()

> **checkCompatibility**(`manifest`): `boolean`

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:104](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L104)

#### Parameters

##### manifest

[`ToolManifest`](ToolManifest.md)

#### Returns

`boolean`

---

### loadManifest()

> **loadManifest**(`path`): `Promise`\<[`ToolManifest`](ToolManifest.md)>>>>\>

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:101](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L101)

#### Parameters

##### path

`string`

#### Returns

`Promise`\<[`ToolManifest`](ToolManifest.md)\>

---

### registerFromManifest()

> **registerFromManifest**(`manifest`, `tools`): `void`

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:102](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L102)

#### Parameters

##### manifest

[`ToolManifest`](ToolManifest.md)

##### tools

[`ITool`](ITool.md)[]

#### Returns

`void`

---

### validateVersion()

> **validateVersion**(`version`): `boolean`

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:103](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L103)

#### Parameters

##### version

`string`

#### Returns

`boolean`
