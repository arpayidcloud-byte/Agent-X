[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [reasoning-framework](../README.md) / PipelineHookManager

# Class: PipelineHookManager

Defined in: [packages/reasoning/reasoning-framework/src/pipeline-hooks.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline-hooks.ts#L8)

## Constructors

### Constructor

> **new PipelineHookManager**(): `PipelineHookManager`

#### Returns

`PipelineHookManager`

## Methods

### register()

> **register**(`hook`): `void`

Defined in: [packages/reasoning/reasoning-framework/src/pipeline-hooks.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline-hooks.ts#L11)

#### Parameters

##### hook

[`PipelineHook`](../interfaces/PipelineHook.md)

#### Returns

`void`

---

### runAfterPipeline()

> **runAfterPipeline**(`sessionId`, `result`): `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-framework/src/pipeline-hooks.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline-hooks.ts#L21)

#### Parameters

##### sessionId

`string`

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### runAfterStage()

> **runAfterStage**(`sessionId`, `stage`): `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-framework/src/pipeline-hooks.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline-hooks.ts#L33)

#### Parameters

##### sessionId

`string`

##### stage

[`PipelineStageName`](../type-aliases/PipelineStageName.md)

#### Returns

`Promise`\<`void`\>

---

### runBeforePipeline()

> **runBeforePipeline**(`sessionId`): `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-framework/src/pipeline-hooks.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline-hooks.ts#L15)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

---

### runBeforeStage()

> **runBeforeStage**(`sessionId`, `stage`): `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-framework/src/pipeline-hooks.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline-hooks.ts#L27)

#### Parameters

##### sessionId

`string`

##### stage

[`PipelineStageName`](../type-aliases/PipelineStageName.md)

#### Returns

`Promise`\<`void`\>

---

### runOnFailure()

> **runOnFailure**(`sessionId`, `error`): `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-framework/src/pipeline-hooks.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline-hooks.ts#L39)

#### Parameters

##### sessionId

`string`

##### error

`Error`

#### Returns

`Promise`\<`void`\>

---

### runOnRecovery()

> **runOnRecovery**(`sessionId`): `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-framework/src/pipeline-hooks.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/pipeline-hooks.ts#L45)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>
