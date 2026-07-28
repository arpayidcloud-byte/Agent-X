[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / ApprovalRegistry

# Class: ApprovalRegistry

Defined in: [packages/shared/tool-sdk/src/approval/approval-registry.ts:66](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-registry.ts#L66)

Approval registry

## Constructors

### Constructor

> **new ApprovalRegistry**(): `ApprovalRegistry`

Defined in: [packages/shared/tool-sdk/src/approval/approval-registry.ts:69](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-registry.ts#L69)

#### Returns

`ApprovalRegistry`

## Methods

### getEntry()

> **getEntry**(`category`): [`ApprovalRegistryEntry`](../interfaces/ApprovalRegistryEntry.md) \| `undefined`

Defined in: [packages/shared/tool-sdk/src/approval/approval-registry.ts:81](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-registry.ts#L81)

Gets the approval entry for a category

#### Parameters

##### category

`string`

Tool category

#### Returns

[`ApprovalRegistryEntry`](../interfaces/ApprovalRegistryEntry.md) \| `undefined`

ApprovalRegistryEntry or undefined

---

### getRiskScore()

> **getRiskScore**(`category`): `number`

Defined in: [packages/shared/tool-sdk/src/approval/approval-registry.ts:98](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-registry.ts#L98)

Gets the risk score for a category

#### Parameters

##### category

`string`

Tool category

#### Returns

`number`

Risk score or 0 if not found

---

### registerEntry()

> **registerEntry**(`entry`): `void`

Defined in: [packages/shared/tool-sdk/src/approval/approval-registry.ts:89](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-registry.ts#L89)

Registers a new approval entry

#### Parameters

##### entry

[`ApprovalRegistryEntry`](../interfaces/ApprovalRegistryEntry.md)

The entry to register

#### Returns

`void`

---

### requiresApproval()

> **requiresApproval**(`category`): `boolean`

Defined in: [packages/shared/tool-sdk/src/approval/approval-registry.ts:107](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/approval/approval-registry.ts#L107)

Checks if a category requires approval

#### Parameters

##### category

`string`

Tool category

#### Returns

`boolean`

true if approval is required
