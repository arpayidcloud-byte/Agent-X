[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / IApprovalStore

# Interface: IApprovalStore

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:103](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L103)

## Description

Approval store interface

## Methods

### delete()

> **delete**(`id`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:111](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L111)

Delete an approval request

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>

---

### list()

> **list**(): `Promise`\<[`ApprovalRequest`](ApprovalRequest.md)[]\>

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:113](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L113)

List all requests

#### Returns

`Promise`\<[`ApprovalRequest`](ApprovalRequest.md)[]\>

---

### listByState()

> **listByState**(`state`): `Promise`\<[`ApprovalRequest`](ApprovalRequest.md)[]\>

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:115](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L115)

List requests by state

#### Parameters

##### state

[`ApprovalState`](../type-aliases/ApprovalState.md)

#### Returns

`Promise`\<[`ApprovalRequest`](ApprovalRequest.md)[]\>

---

### retrieve()

> **retrieve**(`id`): `Promise`\<[`ApprovalRequest`](ApprovalRequest.md) \| `undefined`>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:107](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L107)

Retrieve an approval request

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`ApprovalRequest`](ApprovalRequest.md) \| `undefined`\>

---

### store()

> **store**(`request`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:105](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L105)

Store an approval request

#### Parameters

##### request

[`ApprovalRequest`](ApprovalRequest.md)

#### Returns

`Promise`\<`void`\>

---

### update()

> **update**(`request`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/interfaces.ts:109](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/interfaces.ts#L109)

Update an approval request

#### Parameters

##### request

[`ApprovalRequest`](ApprovalRequest.md)

#### Returns

`Promise`\<`void`\>
