[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / ApprovalEngine

# Class: ApprovalEngine

Defined in: [packages/shared/tool-sdk/src/approval/approval-engine.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-engine.ts#L37)

Approval engine implementation

## Implements

- [`IApprovalEngine`](../interfaces/IApprovalEngine.md)

## Constructors

### Constructor

> **new ApprovalEngine**(`store`): `ApprovalEngine`

Defined in: [packages/shared/tool-sdk/src/approval/approval-engine.ts:42](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-engine.ts#L42)

#### Parameters

##### store

[`IApprovalStore`](../interfaces/IApprovalStore.md)

#### Returns

`ApprovalEngine`

## Methods

### approve()

> **approve**(`requestId`, `operatorId`, `confirmed?`): `Promise`\<[`ApprovalResult`](../interfaces/ApprovalResult.md)>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/approval-engine.ts:66](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-engine.ts#L66)

Approve a request

#### Parameters

##### requestId

`string`

##### operatorId

`string`

##### confirmed?

`boolean` = `true`

#### Returns

`Promise`\<[`ApprovalResult`](../interfaces/ApprovalResult.md)\>

#### Implementation of

[`IApprovalEngine`](../interfaces/IApprovalEngine.md).[`approve`](../interfaces/IApprovalEngine.md#approve)

---

### cancel()

> **cancel**(`requestId`, `operatorId`): `Promise`\<[`ApprovalResult`](../interfaces/ApprovalResult.md)>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/approval-engine.ts:158](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-engine.ts#L158)

Cancel a request

#### Parameters

##### requestId

`string`

##### operatorId

`string`

#### Returns

`Promise`\<[`ApprovalResult`](../interfaces/ApprovalResult.md)\>

#### Implementation of

[`IApprovalEngine`](../interfaces/IApprovalEngine.md).[`cancel`](../interfaces/IApprovalEngine.md#cancel)

---

### createRequest()

> **createRequest**(`params`): `Promise`\<[`ApprovalRequest`](../interfaces/ApprovalRequest.md)>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/approval-engine.ts:49](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-engine.ts#L49)

Create an approval request

#### Parameters

##### params

[`CreateApprovalRequestParams`](../interfaces/CreateApprovalRequestParams.md)

#### Returns

`Promise`\<[`ApprovalRequest`](../interfaces/ApprovalRequest.md)\>

#### Implementation of

[`IApprovalEngine`](../interfaces/IApprovalEngine.md).[`createRequest`](../interfaces/IApprovalEngine.md#createrequest)

---

### execute()

> **execute**(`requestId`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/approval-engine.ts:191](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-engine.ts#L191)

Execute approved operation

#### Parameters

##### requestId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IApprovalEngine`](../interfaces/IApprovalEngine.md).[`execute`](../interfaces/IApprovalEngine.md#execute)

---

### getAuditLogger()

> **getAuditLogger**(): [`ApprovalAuditLogger`](ApprovalAuditLogger.md)

Defined in: [packages/shared/tool-sdk/src/approval/approval-engine.ts:213](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-engine.ts#L213)

Gets the audit logger

#### Returns

[`ApprovalAuditLogger`](ApprovalAuditLogger.md)

ApprovalAuditLogger instance

---

### getRequest()

> **getRequest**(`requestId`): `Promise`\<[`ApprovalRequest`](../interfaces/ApprovalRequest.md) \| `undefined`>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/approval-engine.ts:186](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-engine.ts#L186)

Get request status

#### Parameters

##### requestId

`string`

#### Returns

`Promise`\<[`ApprovalRequest`](../interfaces/ApprovalRequest.md) \| `undefined`\>

#### Implementation of

[`IApprovalEngine`](../interfaces/IApprovalEngine.md).[`getRequest`](../interfaces/IApprovalEngine.md#getrequest)

---

### reject()

> **reject**(`requestId`, `operatorId`, `reason?`): `Promise`\<[`ApprovalResult`](../interfaces/ApprovalResult.md)>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/approval-engine.ts:129](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-engine.ts#L129)

Reject a request

#### Parameters

##### requestId

`string`

##### operatorId

`string`

##### reason?

`string`

#### Returns

`Promise`\<[`ApprovalResult`](../interfaces/ApprovalResult.md)\>

#### Implementation of

[`IApprovalEngine`](../interfaces/IApprovalEngine.md).[`reject`](../interfaces/IApprovalEngine.md#reject)
