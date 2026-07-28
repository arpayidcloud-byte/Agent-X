[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [reasoning-framework](../README.md) / PipelineMetrics

# Class: PipelineMetrics

Defined in: [packages/reasoning/reasoning-framework/src/pipeline-metrics.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline-metrics.ts#L8)

## Constructors

### Constructor

> **new PipelineMetrics**(): `PipelineMetrics`

#### Returns

`PipelineMetrics`

## Properties

### totalTimeMs

> **totalTimeMs**: `number` = `0`

Defined in: [packages/reasoning/reasoning-framework/src/pipeline-metrics.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline-metrics.ts#L10)

## Methods

### getMetrics()

> **getMetrics**(): `Record`\<`string`, `number`>>>>\>

Defined in: [packages/reasoning/reasoning-framework/src/pipeline-metrics.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline-metrics.ts#L17)

#### Returns

`Record`\<`string`, `number`\>

---

### recordStageDuration()

> **recordStageDuration**(`stage`, `durationMs`): `void`

Defined in: [packages/reasoning/reasoning-framework/src/pipeline-metrics.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline-metrics.ts#L12)

#### Parameters

##### stage

[`PipelineStageName`](../type-aliases/PipelineStageName.md)

##### durationMs

`number`

#### Returns

`void`
