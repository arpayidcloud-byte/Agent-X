[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-orchestration](../README.md) / ExecutionPolicyManager

# Class: ExecutionPolicyManager

Defined in: [packages/workflow/workflow-orchestration/src/execution-policy.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/execution-policy.ts#L8)

## Constructors

### Constructor

> **new ExecutionPolicyManager**(): `ExecutionPolicyManager`

#### Returns

`ExecutionPolicyManager`

## Methods

### getAvailablePolicies()

> **getAvailablePolicies**(): [`ExecutionPolicy`](../type-aliases/ExecutionPolicy.md)[]

Defined in: [packages/workflow/workflow-orchestration/src/execution-policy.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/execution-policy.ts#L11)

#### Returns

[`ExecutionPolicy`](../type-aliases/ExecutionPolicy.md)[]

---

### requiresApproval()

> **requiresApproval**(`policy`): `boolean`

Defined in: [packages/workflow/workflow-orchestration/src/execution-policy.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/execution-policy.ts#L19)

#### Parameters

##### policy

[`ExecutionPolicy`](../type-aliases/ExecutionPolicy.md)

#### Returns

`boolean`

---

### validate()

> **validate**(`policy`): `boolean`

Defined in: [packages/workflow/workflow-orchestration/src/execution-policy.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/execution-policy.ts#L15)

#### Parameters

##### policy

[`ExecutionPolicy`](../type-aliases/ExecutionPolicy.md)

#### Returns

`boolean`
