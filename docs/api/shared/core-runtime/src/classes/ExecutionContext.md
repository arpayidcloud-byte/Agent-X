[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/core-runtime/src](../README.md) / ExecutionContext

# Class: ExecutionContext

Defined in: [packages/shared/core-runtime/src/context/index.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/context/index.ts#L19)

## Constructors

### Constructor

> **new ExecutionContext**(`config`): `ExecutionContext`

Defined in: [packages/shared/core-runtime/src/context/index.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/context/index.ts#L31)

#### Parameters

##### config

[`ExecutionContextConfig`](../interfaces/ExecutionContextConfig.md)

#### Returns

`ExecutionContext`

## Properties

### agentId?

> `readonly` `optional` **agentId?**: `string`

Defined in: [packages/shared/core-runtime/src/context/index.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/context/index.ts#L23)

---

### credentialResolver

> `readonly` **credentialResolver**: [`ICredentialResolver`](../interfaces/ICredentialResolver.md)

Defined in: [packages/shared/core-runtime/src/context/index.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/context/index.ts#L26)

---

### logger

> `readonly` **logger**: `ILogger`

Defined in: [packages/shared/core-runtime/src/context/index.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/context/index.ts#L25)

---

### providerId?

> `readonly` `optional` **providerId?**: `string`

Defined in: [packages/shared/core-runtime/src/context/index.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/context/index.ts#L24)

---

### task

> `readonly` **task**: [`TaskModel`](../interfaces/TaskModel.md)

Defined in: [packages/shared/core-runtime/src/context/index.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/context/index.ts#L27)

---

### taskId

> `readonly` **taskId**: `string`

Defined in: [packages/shared/core-runtime/src/context/index.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/context/index.ts#L21)

---

### traceId

> `readonly` **traceId**: `string`

Defined in: [packages/shared/core-runtime/src/context/index.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/context/index.ts#L20)

---

### workflowId?

> `readonly` `optional` **workflowId?**: `string`

Defined in: [packages/shared/core-runtime/src/context/index.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/context/index.ts#L22)

## Methods

### cloneWithAgent()

> **cloneWithAgent**(`agentId`): `ExecutionContext`

Defined in: [packages/shared/core-runtime/src/context/index.ts:56](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/context/index.ts#L56)

#### Parameters

##### agentId

`string`

#### Returns

`ExecutionContext`

---

### cloneWithProvider()

> **cloneWithProvider**(`providerId`): `ExecutionContext`

Defined in: [packages/shared/core-runtime/src/context/index.ts:69](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/context/index.ts#L69)

#### Parameters

##### providerId

`string`

#### Returns

`ExecutionContext`

---

### getScopedVar()

> **getScopedVar**\<`T`>>>>\>(`key`): `T` \| `undefined`

Defined in: [packages/shared/core-runtime/src/context/index.ts:52](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/context/index.ts#L52)

#### Type Parameters

##### T

`T`

#### Parameters

##### key

`string`

#### Returns

`T` \| `undefined`

---

### setScopedVar()

> **setScopedVar**(`key`, `value`): `void`

Defined in: [packages/shared/core-runtime/src/context/index.ts:48](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/context/index.ts#L48)

#### Parameters

##### key

`string`

##### value

`unknown`

#### Returns

`void`
