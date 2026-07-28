[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [reasoning-framework](../README.md) / PipelineHook

# Interface: PipelineHook

Defined in: [packages/reasoning/reasoning-framework/src/interfaces.ts:98](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/interfaces.ts#L98)

## Properties

### afterPipeline?

> `optional` **afterPipeline?**: (`sessionId`, `result`) => `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-framework/src/interfaces.ts:100](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/interfaces.ts#L100)

#### Parameters

##### sessionId

`string`

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### afterStage?

> `optional` **afterStage?**: (`sessionId`, `stage`) => `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-framework/src/interfaces.ts:102](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/interfaces.ts#L102)

#### Parameters

##### sessionId

`string`

##### stage

[`PipelineStageName`](../type-aliases/PipelineStageName.md)

#### Returns

`Promise`\<`void`\>

---

### beforePipeline?

> `optional` **beforePipeline?**: (`sessionId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-framework/src/interfaces.ts:99](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/interfaces.ts#L99)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

---

### beforeStage?

> `optional` **beforeStage?**: (`sessionId`, `stage`) => `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-framework/src/interfaces.ts:101](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/interfaces.ts#L101)

#### Parameters

##### sessionId

`string`

##### stage

[`PipelineStageName`](../type-aliases/PipelineStageName.md)

#### Returns

`Promise`\<`void`\>

---

### onFailure?

> `optional` **onFailure?**: (`sessionId`, `error`) => `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-framework/src/interfaces.ts:103](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/interfaces.ts#L103)

#### Parameters

##### sessionId

`string`

##### error

`Error`

#### Returns

`Promise`\<`void`\>

---

### onRecovery?

> `optional` **onRecovery?**: (`sessionId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-framework/src/interfaces.ts:104](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/interfaces.ts#L104)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>
