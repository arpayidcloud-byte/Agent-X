[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / ITool

# Interface: ITool

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:84](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L84)

## Properties

### definition

> `readonly` **definition**: [`ToolDefinition`](ToolDefinition.md)

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:85](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L85)

---

### metadata

> `readonly` **metadata**: [`ToolMetadata`](ToolMetadata.md)

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:86](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L86)

## Methods

### execute()

> **execute**(`req`): `Promise`\<[`ToolExecutionResponse`](ToolExecutionResponse.md)>>>>\>

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:87](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L87)

#### Parameters

##### req

[`ToolExecutionRequest`](ToolExecutionRequest.md)

#### Returns

`Promise`\<[`ToolExecutionResponse`](ToolExecutionResponse.md)\>
