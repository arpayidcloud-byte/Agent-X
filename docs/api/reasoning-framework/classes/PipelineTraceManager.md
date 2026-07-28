[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [reasoning-framework](../README.md) / PipelineTraceManager

# Class: PipelineTraceManager

Defined in: [packages/reasoning/reasoning-framework/src/pipeline-trace.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline-trace.ts#L13)

## Constructors

### Constructor

> **new PipelineTraceManager**(): `PipelineTraceManager`

#### Returns

`PipelineTraceManager`

## Methods

### addRecord()

> **addRecord**(`traceId`, `stage`): `void`

Defined in: [packages/reasoning/reasoning-framework/src/pipeline-trace.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline-trace.ts#L20)

#### Parameters

##### traceId

`string`

##### stage

[`PipelineStageName`](../type-aliases/PipelineStageName.md)

#### Returns

`void`

---

### getTrace()

> **getTrace**(`traceId`): [`TraceRecord`](../interfaces/TraceRecord.md)[]

Defined in: [packages/reasoning/reasoning-framework/src/pipeline-trace.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline-trace.ts#L26)

#### Parameters

##### traceId

`string`

#### Returns

[`TraceRecord`](../interfaces/TraceRecord.md)[]

---

### startTrace()

> **startTrace**(`traceId`): `void`

Defined in: [packages/reasoning/reasoning-framework/src/pipeline-trace.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline-trace.ts#L16)

#### Parameters

##### traceId

`string`

#### Returns

`void`
