[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / ToolExecutionPipelineImpl

# Class: ToolExecutionPipelineImpl

Defined in: [packages/shared/tool-sdk/src/pipeline/index.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/pipeline/index.ts#L19)

## Implements

- [`ToolExecutionPipeline`](../interfaces/ToolExecutionPipeline.md)

## Constructors

### Constructor

> **new ToolExecutionPipelineImpl**(`cacheTtlMs?`, `timeoutMs?`): `ToolExecutionPipelineImpl`

Defined in: [packages/shared/tool-sdk/src/pipeline/index.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/pipeline/index.ts#L26)

#### Parameters

##### cacheTtlMs?

`number` = `300_000`

##### timeoutMs?

`number` = `60000`

#### Returns

`ToolExecutionPipelineImpl`

## Methods

### addHook()

> **addHook**(`hook`): `void`

Defined in: [packages/shared/tool-sdk/src/pipeline/index.ts:48](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/pipeline/index.ts#L48)

#### Parameters

##### hook

[`ExecutionHooks`](../interfaces/ExecutionHooks.md)

#### Returns

`void`

#### Implementation of

[`ToolExecutionPipeline`](../interfaces/ToolExecutionPipeline.md).[`addHook`](../interfaces/ToolExecutionPipeline.md#addhook)

---

### execute()

> **execute**(`req`, `tool`): `Promise`\<[`ToolExecutionResponse`](../interfaces/ToolExecutionResponse.md)>>>>\>

Defined in: [packages/shared/tool-sdk/src/pipeline/index.ts:52](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/pipeline/index.ts#L52)

#### Parameters

##### req

[`ToolExecutionRequest`](../interfaces/ToolExecutionRequest.md)

##### tool

[`ITool`](../interfaces/ITool.md)

#### Returns

`Promise`\<[`ToolExecutionResponse`](../interfaces/ToolExecutionResponse.md)\>

#### Implementation of

[`ToolExecutionPipeline`](../interfaces/ToolExecutionPipeline.md).[`execute`](../interfaces/ToolExecutionPipeline.md#execute)
