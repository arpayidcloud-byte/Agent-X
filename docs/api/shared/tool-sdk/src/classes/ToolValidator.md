[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / ToolValidator

# Class: ToolValidator

Defined in: [packages/shared/tool-sdk/src/validation/index.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/validation/index.ts#L8)

## Implements

- [`IToolValidator`](../interfaces/IToolValidator.md)

## Constructors

### Constructor

> **new ToolValidator**(): `ToolValidator`

#### Returns

`ToolValidator`

## Methods

### detectDuplicate()

> **detectDuplicate**(`registry`, `toolName`): `boolean`

Defined in: [packages/shared/tool-sdk/src/validation/index.ts:66](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/validation/index.ts#L66)

#### Parameters

##### registry

[`IToolRegistry`](../interfaces/IToolRegistry.md)

##### toolName

`string`

#### Returns

`boolean`

#### Implementation of

[`IToolValidator`](../interfaces/IToolValidator.md).[`detectDuplicate`](../interfaces/IToolValidator.md#detectduplicate)

---

### validateCapabilities()

> **validateCapabilities**(`tool`): `boolean`

Defined in: [packages/shared/tool-sdk/src/validation/index.ts:53](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/validation/index.ts#L53)

#### Parameters

##### tool

[`ITool`](../interfaces/ITool.md)

#### Returns

`boolean`

#### Implementation of

[`IToolValidator`](../interfaces/IToolValidator.md).[`validateCapabilities`](../interfaces/IToolValidator.md#validatecapabilities)

---

### validateManifest()

> **validateManifest**(`manifest`): `boolean`

Defined in: [packages/shared/tool-sdk/src/validation/index.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/validation/index.ts#L26)

#### Parameters

##### manifest

[`ToolManifest`](../interfaces/ToolManifest.md)

#### Returns

`boolean`

#### Implementation of

[`IToolValidator`](../interfaces/IToolValidator.md).[`validateManifest`](../interfaces/IToolValidator.md#validatemanifest)

---

### validateSchema()

> **validateSchema**(`schema`, `args`): `boolean`

Defined in: [packages/shared/tool-sdk/src/validation/index.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/validation/index.ts#L9)

#### Parameters

##### schema

`Record`\<`string`, `unknown`\>

##### args

`Record`\<`string`, `unknown`\>

#### Returns

`boolean`

#### Implementation of

[`IToolValidator`](../interfaces/IToolValidator.md).[`validateSchema`](../interfaces/IToolValidator.md#validateschema)
