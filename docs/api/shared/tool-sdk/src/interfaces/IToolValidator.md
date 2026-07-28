[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / IToolValidator

# Interface: IToolValidator

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:122](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L122)

## Methods

### detectDuplicate()

> **detectDuplicate**(`registry`, `toolName`): `boolean`

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:126](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L126)

#### Parameters

##### registry

[`IToolRegistry`](IToolRegistry.md)

##### toolName

`string`

#### Returns

`boolean`

---

### validateCapabilities()

> **validateCapabilities**(`tool`): `boolean`

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:125](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L125)

#### Parameters

##### tool

[`ITool`](ITool.md)

#### Returns

`boolean`

---

### validateManifest()

> **validateManifest**(`manifest`): `boolean`

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:124](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L124)

#### Parameters

##### manifest

[`ToolManifest`](ToolManifest.md)

#### Returns

`boolean`

---

### validateSchema()

> **validateSchema**(`schema`, `args`): `boolean`

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:123](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L123)

#### Parameters

##### schema

`Record`\<`string`, `unknown`\>

##### args

`Record`\<`string`, `unknown`\>

#### Returns

`boolean`
