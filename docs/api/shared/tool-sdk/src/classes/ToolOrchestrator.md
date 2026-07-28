[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / ToolOrchestrator

# Class: ToolOrchestrator

Defined in: [packages/shared/tool-sdk/src/orchestrator/index.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/orchestrator/index.ts#L30)

## Constructors

### Constructor

> **new ToolOrchestrator**(`registry`, `pipeline`, `config?`): `ToolOrchestrator`

Defined in: [packages/shared/tool-sdk/src/orchestrator/index.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/orchestrator/index.ts#L37)

#### Parameters

##### registry

[`IToolRegistry`](../interfaces/IToolRegistry.md)

##### pipeline

[`ToolExecutionPipeline`](../interfaces/ToolExecutionPipeline.md)

##### config?

`Partial`\<[`ToolOrchestratorConfig`](../interfaces/ToolOrchestratorConfig.md)\>

#### Returns

`ToolOrchestrator`

## Methods

### executeToolCalls()

> **executeToolCalls**(`toolCalls`, `context`): `Promise`\<`ToolResult`[]\>

Defined in: [packages/shared/tool-sdk/src/orchestrator/index.ts:53](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/orchestrator/index.ts#L53)

#### Parameters

##### toolCalls

`NormalizedToolCall`[]

##### context

[`ToolExecutionContext`](../interfaces/ToolExecutionContext.md)

#### Returns

`Promise`\<`ToolResult`[]\>

---

### runWithToolLoop()

> **runWithToolLoop**(`initialResponse`, `context`): `Promise`\<[`OrchestrationResult`](../interfaces/OrchestrationResult.md)>>>>\>

Defined in: [packages/shared/tool-sdk/src/orchestrator/index.ts:145](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/orchestrator/index.ts#L145)

#### Parameters

##### initialResponse

`CompletionResponse`

##### context

[`ToolExecutionContext`](../interfaces/ToolExecutionContext.md)

#### Returns

`Promise`\<[`OrchestrationResult`](../interfaces/OrchestrationResult.md)\>

---

### toolSpecsFromRegistry()

> `static` **toolSpecsFromRegistry**(`registry`): `NormalizedToolSpec`[]

Defined in: [packages/shared/tool-sdk/src/orchestrator/index.ts:227](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/orchestrator/index.ts#L227)

#### Parameters

##### registry

[`IToolRegistry`](../interfaces/IToolRegistry.md)

#### Returns

`NormalizedToolSpec`[]
