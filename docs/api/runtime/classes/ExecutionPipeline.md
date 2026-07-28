[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / ExecutionPipeline

# Class: ExecutionPipeline

Defined in: [packages/runtime/runtime/src/execution-pipeline.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/execution-pipeline.ts#L25)

## Constructors

### Constructor

> **new ExecutionPipeline**(`auditStore`, `config`): `ExecutionPipeline`

Defined in: [packages/runtime/runtime/src/execution-pipeline.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/execution-pipeline.ts#L26)

#### Parameters

##### auditStore

[`IAuditStore`](../interfaces/IAuditStore.md)

##### config

[`RuntimeConfig`](../interfaces/RuntimeConfig.md)

#### Returns

`ExecutionPipeline`

## Methods

### execute()

> **execute**(`session`, `_context?`): `Promise`\<[`PipelineResult`](../interfaces/PipelineResult.md)>>>>\>

Defined in: [packages/runtime/runtime/src/execution-pipeline.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/execution-pipeline.ts#L35)

#### Parameters

##### session

###### goal

`string`

###### id

`string`

###### traceId

`string`

##### \_context?

`Record`\<`string`, `unknown`\> = `{}`

#### Returns

`Promise`\<[`PipelineResult`](../interfaces/PipelineResult.md)\>

---

### getConfig()

> **getConfig**(): [`RuntimeConfig`](../interfaces/RuntimeConfig.md)

Defined in: [packages/runtime/runtime/src/execution-pipeline.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/execution-pipeline.ts#L31)

#### Returns

[`RuntimeConfig`](../interfaces/RuntimeConfig.md)
