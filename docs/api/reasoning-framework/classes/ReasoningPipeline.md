[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [reasoning-framework](../README.md) / ReasoningPipeline

# Class: ReasoningPipeline

Defined in: [packages/reasoning/reasoning-framework/src/pipeline.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline.ts#L12)

## Constructors

### Constructor

> **new ReasoningPipeline**(): `ReasoningPipeline`

#### Returns

`ReasoningPipeline`

## Methods

### execute()

> **execute**(`session`, `stages`): `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-framework/src/pipeline.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline.ts#L18)

#### Parameters

##### session

[`ReasoningSession`](../interfaces/ReasoningSession.md)

##### stages

[`PipelineStageName`](../type-aliases/PipelineStageName.md)[]

#### Returns

`Promise`\<`void`\>

---

### getState()

> **getState**(): [`PipelineStageName`](../type-aliases/PipelineStageName.md)

Defined in: [packages/reasoning/reasoning-framework/src/pipeline.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline.ts#L39)

#### Returns

[`PipelineStageName`](../type-aliases/PipelineStageName.md)
