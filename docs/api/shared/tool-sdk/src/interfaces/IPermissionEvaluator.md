[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / IPermissionEvaluator

# Interface: IPermissionEvaluator

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:117](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L117)

## Methods

### evaluate()

> **evaluate**(`req`, `tool`): `boolean`

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:119](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L119)

#### Parameters

##### req

[`ToolExecutionRequest`](ToolExecutionRequest.md)

##### tool

[`ITool`](ITool.md)

#### Returns

`boolean`

---

### isAllowed()

> **isAllowed**(`agentRole`, `category`, `riskScore?`): `boolean`

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:118](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L118)

#### Parameters

##### agentRole

`string`

##### category

`string`

##### riskScore?

`number`

#### Returns

`boolean`
