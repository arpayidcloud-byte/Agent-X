[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / InMemoryApprovalStore

# Class: InMemoryApprovalStore

Defined in: [packages/shared/tool-sdk/src/approval/approval-store.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-store.ts#L13)

In-memory approval store

## Implements

- [`IApprovalStore`](../interfaces/IApprovalStore.md)

## Constructors

### Constructor

> **new InMemoryApprovalStore**(): `InMemoryApprovalStore`

#### Returns

`InMemoryApprovalStore`

## Methods

### delete()

> **delete**(`id`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/approval-store.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-store.ts#L35)

Delete an approval request

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IApprovalStore`](../interfaces/IApprovalStore.md).[`delete`](../interfaces/IApprovalStore.md#delete)

---

### list()

> **list**(): `Promise`\<[`ApprovalRequest`](../interfaces/ApprovalRequest.md)[]\>

Defined in: [packages/shared/tool-sdk/src/approval/approval-store.ts:40](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-store.ts#L40)

List all requests

#### Returns

`Promise`\<[`ApprovalRequest`](../interfaces/ApprovalRequest.md)[]\>

#### Implementation of

[`IApprovalStore`](../interfaces/IApprovalStore.md).[`list`](../interfaces/IApprovalStore.md#list)

---

### listByState()

> **listByState**(`state`): `Promise`\<[`ApprovalRequest`](../interfaces/ApprovalRequest.md)[]\>

Defined in: [packages/shared/tool-sdk/src/approval/approval-store.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-store.ts#L45)

List requests by state

#### Parameters

##### state

[`ApprovalState`](../type-aliases/ApprovalState.md)

#### Returns

`Promise`\<[`ApprovalRequest`](../interfaces/ApprovalRequest.md)[]\>

#### Implementation of

[`IApprovalStore`](../interfaces/IApprovalStore.md).[`listByState`](../interfaces/IApprovalStore.md#listbystate)

---

### retrieve()

> **retrieve**(`id`): `Promise`\<[`ApprovalRequest`](../interfaces/ApprovalRequest.md) \| `undefined`>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/approval-store.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-store.ts#L22)

Retrieve an approval request

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`ApprovalRequest`](../interfaces/ApprovalRequest.md) \| `undefined`\>

#### Implementation of

[`IApprovalStore`](../interfaces/IApprovalStore.md).[`retrieve`](../interfaces/IApprovalStore.md#retrieve)

---

### store()

> **store**(`request`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/approval-store.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-store.ts#L17)

Store an approval request

#### Parameters

##### request

[`ApprovalRequest`](../interfaces/ApprovalRequest.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IApprovalStore`](../interfaces/IApprovalStore.md).[`store`](../interfaces/IApprovalStore.md#store)

---

### update()

> **update**(`request`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/approval-store.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-store.ts#L27)

Update an approval request

#### Parameters

##### request

[`ApprovalRequest`](../interfaces/ApprovalRequest.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IApprovalStore`](../interfaces/IApprovalStore.md).[`update`](../interfaces/IApprovalStore.md#update)
