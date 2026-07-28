[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / ToolClassifier

# Class: ToolClassifier

Defined in: [packages/shared/tool-sdk/src/classification/index.ts:4](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/classification/index.ts#L4)

## Constructors

### Constructor

> **new ToolClassifier**(): `ToolClassifier`

#### Returns

`ToolClassifier`

## Methods

### classifyCategory()

> `static` **classifyCategory**(`category`): [`ToolClassification`](../type-aliases/ToolClassification.md)

Defined in: [packages/shared/tool-sdk/src/classification/index.ts:5](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/classification/index.ts#L5)

#### Parameters

##### category

`string`

#### Returns

[`ToolClassification`](../type-aliases/ToolClassification.md)

---

### getRequiredPermissionLevel()

> `static` **getRequiredPermissionLevel**(`category`): [`PermissionLevel`](../enumerations/PermissionLevel.md)

Defined in: [packages/shared/tool-sdk/src/classification/index.ts:36](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/classification/index.ts#L36)

#### Parameters

##### category

`string`

#### Returns

[`PermissionLevel`](../enumerations/PermissionLevel.md)

---

### getRiskScore()

> `static` **getRiskScore**(`category`): `number`

Defined in: [packages/shared/tool-sdk/src/classification/index.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/classification/index.ts#L18)

#### Parameters

##### category

`string`

#### Returns

`number`

---

### requiresApproval()

> `static` **requiresApproval**(`classification`): `boolean`

Defined in: [packages/shared/tool-sdk/src/classification/index.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/classification/index.ts#L32)

#### Parameters

##### classification

[`ToolClassification`](../type-aliases/ToolClassification.md)

#### Returns

`boolean`
