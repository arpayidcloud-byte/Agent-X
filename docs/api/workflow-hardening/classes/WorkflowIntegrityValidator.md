[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-hardening](../README.md) / WorkflowIntegrityValidator

# Class: WorkflowIntegrityValidator

Defined in: [packages/workflow/workflow-hardening/src/integrity-validator.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/integrity-validator.ts#L10)

## Constructors

### Constructor

> **new WorkflowIntegrityValidator**(): `WorkflowIntegrityValidator`

#### Returns

`WorkflowIntegrityValidator`

## Methods

### validateChecksum()

> **validateChecksum**(`data`, `expectedChecksum`): `void`

Defined in: [packages/workflow/workflow-hardening/src/integrity-validator.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/integrity-validator.ts#L11)

#### Parameters

##### data

`string`

##### expectedChecksum

`string`

#### Returns

`void`

---

### validateGraphIntegrity()

> **validateGraphIntegrity**(`nodes`, `edges`): `void`

Defined in: [packages/workflow/workflow-hardening/src/integrity-validator.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/integrity-validator.ts#L28)

#### Parameters

##### nodes

`string`[]

##### edges

\[`string`, `string`\][]

#### Returns

`void`

---

### validateStateIntegrity()

> **validateStateIntegrity**(`state`): `void`

Defined in: [packages/workflow/workflow-hardening/src/integrity-validator.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/integrity-validator.ts#L21)

#### Parameters

##### state

[`WorkflowState`](../interfaces/WorkflowState.md)

#### Returns

`void`
