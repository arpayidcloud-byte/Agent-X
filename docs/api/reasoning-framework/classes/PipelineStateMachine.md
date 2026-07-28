[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [reasoning-framework](../README.md) / PipelineStateMachine

# Class: PipelineStateMachine

Defined in: [packages/reasoning/reasoning-framework/src/pipeline-state.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline-state.ts#L24)

## Constructors

### Constructor

> **new PipelineStateMachine**(): `PipelineStateMachine`

#### Returns

`PipelineStateMachine`

## Methods

### canTransition()

> **canTransition**(`next`): `boolean`

Defined in: [packages/reasoning/reasoning-framework/src/pipeline-state.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline-state.ts#L41)

#### Parameters

##### next

[`PipelineStageName`](../type-aliases/PipelineStageName.md)

#### Returns

`boolean`

---

### getState()

> **getState**(): [`PipelineStageName`](../type-aliases/PipelineStageName.md)

Defined in: [packages/reasoning/reasoning-framework/src/pipeline-state.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline-state.ts#L27)

#### Returns

[`PipelineStageName`](../type-aliases/PipelineStageName.md)

---

### transition()

> **transition**(`next`): `void`

Defined in: [packages/reasoning/reasoning-framework/src/pipeline-state.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline-state.ts#L31)

#### Parameters

##### next

[`PipelineStageName`](../type-aliases/PipelineStageName.md)

#### Returns

`void`
