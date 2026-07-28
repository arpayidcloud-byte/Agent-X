[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / ExecutionHooks

# Interface: ExecutionHooks

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:129](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L129)

## Methods

### onError()?

> `optional` **onError**(`error`, `req`, `tool`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:132](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L132)

#### Parameters

##### error

`Error`

##### req

[`ToolExecutionRequest`](ToolExecutionRequest.md)

##### tool

[`ITool`](ITool.md)

#### Returns

`Promise`\<`void`\>

---

### postExecute()?

> `optional` **postExecute**(`res`, `req`, `tool`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:131](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L131)

#### Parameters

##### res

[`ToolExecutionResponse`](ToolExecutionResponse.md)

##### req

[`ToolExecutionRequest`](ToolExecutionRequest.md)

##### tool

[`ITool`](ITool.md)

#### Returns

`Promise`\<`void`\>

---

### preExecute()?

> `optional` **preExecute**(`req`, `tool`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:130](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L130)

#### Parameters

##### req

[`ToolExecutionRequest`](ToolExecutionRequest.md)

##### tool

[`ITool`](ITool.md)

#### Returns

`Promise`\<`void`\>
