[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / ApprovalMiddleware

# Class: ApprovalMiddleware

Defined in: [packages/shared/tool-sdk/src/approval/approval-middleware.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-middleware.ts#L13)

Approval middleware implementation

## Implements

- [`IApprovalMiddleware`](../interfaces/IApprovalMiddleware.md)

## Constructors

### Constructor

> **new ApprovalMiddleware**(`store`): `ApprovalMiddleware`

Defined in: [packages/shared/tool-sdk/src/approval/approval-middleware.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-middleware.ts#L16)

#### Parameters

##### store

[`IApprovalStore`](../interfaces/IApprovalStore.md)

#### Returns

`ApprovalMiddleware`

## Methods

### getApprovalStatus()

> **getApprovalStatus**(`requestId`): `Promise`\<[`ApprovalState`](../type-aliases/ApprovalState.md) \| `undefined`>>>>\>

Defined in: [packages/shared/tool-sdk/src/approval/approval-middleware.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-middleware.ts#L27)

Get approval request if exists

#### Parameters

##### requestId

`string`

#### Returns

`Promise`\<[`ApprovalState`](../type-aliases/ApprovalState.md) \| `undefined`\>

#### Implementation of

[`IApprovalMiddleware`](../interfaces/IApprovalMiddleware.md).[`getApprovalStatus`](../interfaces/IApprovalMiddleware.md#getapprovalstatus)

---

### isApprovalRequired()

> **isApprovalRequired**(`_category`, `riskScore`): `boolean`

Defined in: [packages/shared/tool-sdk/src/approval/approval-middleware.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-middleware.ts#L21)

Check if approval is required for an operation

#### Parameters

##### \_category

`string`

##### riskScore

`number`

#### Returns

`boolean`

#### Implementation of

[`IApprovalMiddleware`](../interfaces/IApprovalMiddleware.md).[`isApprovalRequired`](../interfaces/IApprovalMiddleware.md#isapprovalrequired)
