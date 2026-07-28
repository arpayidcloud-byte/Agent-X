[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / ApprovalValidator

# Class: ApprovalValidator

Defined in: [packages/shared/tool-sdk/src/approval/approval-validator.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-validator.ts#L13)

Approval validator implementation

## Implements

- [`IApprovalValidator`](../interfaces/IApprovalValidator.md)

## Constructors

### Constructor

> **new ApprovalValidator**(): `ApprovalValidator`

#### Returns

`ApprovalValidator`

## Methods

### isActionAllowed()

> **isActionAllowed**(`request`, `action`): `boolean`

Defined in: [packages/shared/tool-sdk/src/approval/approval-validator.ts:74](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-validator.ts#L74)

Validates if an approval action is allowed

#### Parameters

##### request

[`ApprovalRequest`](../interfaces/ApprovalRequest.md)

The approval request

##### action

`"approve"` \| `"reject"` \| `"cancel"`

The action to perform

#### Returns

`boolean`

true if valid

---

### validateAction()

> **validateAction**(`request`, `action`): `boolean`

Defined in: [packages/shared/tool-sdk/src/approval/approval-validator.ts:50](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-validator.ts#L50)

Validate an approval action

#### Parameters

##### request

[`ApprovalRequest`](../interfaces/ApprovalRequest.md)

##### action

`"approve"` \| `"reject"` \| `"cancel"`

#### Returns

`boolean`

#### Implementation of

[`IApprovalValidator`](../interfaces/IApprovalValidator.md).[`validateAction`](../interfaces/IApprovalValidator.md#validateaction)

---

### validateCreation()

> **validateCreation**(`request`): `boolean`

Defined in: [packages/shared/tool-sdk/src/approval/approval-validator.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-validator.ts#L15)

Validate an approval request before creation

#### Parameters

##### request

`Partial`\<[`ApprovalRequest`](../interfaces/ApprovalRequest.md)\>

#### Returns

`boolean`

#### Implementation of

[`IApprovalValidator`](../interfaces/IApprovalValidator.md).[`validateCreation`](../interfaces/IApprovalValidator.md#validatecreation)
