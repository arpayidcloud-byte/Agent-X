[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [reasoning-framework](../README.md) / PipelineEventEmitter

# Class: PipelineEventEmitter

Defined in: [packages/reasoning/reasoning-framework/src/pipeline-events.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline-events.ts#L14)

## Constructors

### Constructor

> **new PipelineEventEmitter**(): `PipelineEventEmitter`

#### Returns

`PipelineEventEmitter`

## Methods

### emit()

> **emit**(`type`, `traceId`, `sessionId`, `payload`): `void`

Defined in: [packages/reasoning/reasoning-framework/src/pipeline-events.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline-events.ts#L17)

#### Parameters

##### type

`string`

##### traceId

`string`

##### sessionId

`string`

##### payload

`Record`\<`string`, `unknown`\>

#### Returns

`void`

---

### getEvents()

> **getEvents**(): [`ReasoningEvent`](../interfaces/ReasoningEvent.md)[]

Defined in: [packages/reasoning/reasoning-framework/src/pipeline-events.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline-events.ts#L21)

#### Returns

[`ReasoningEvent`](../interfaces/ReasoningEvent.md)[]
