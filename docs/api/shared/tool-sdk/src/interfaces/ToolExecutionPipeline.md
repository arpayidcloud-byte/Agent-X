[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / ToolExecutionPipeline

# Interface: ToolExecutionPipeline

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:135](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L135)

## Methods

### addHook()

> **addHook**(`hook`): `void`

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:136](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L136)

#### Parameters

##### hook

[`ExecutionHooks`](ExecutionHooks.md)

#### Returns

`void`

---

### execute()

> **execute**(`req`, `tool`): `Promise`\<[`ToolExecutionResponse`](ToolExecutionResponse.md)>>>>\>

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:137](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L137)

#### Parameters

##### req

[`ToolExecutionRequest`](ToolExecutionRequest.md)

##### tool

[`ITool`](ITool.md)

#### Returns

`Promise`\<[`ToolExecutionResponse`](ToolExecutionResponse.md)\>
