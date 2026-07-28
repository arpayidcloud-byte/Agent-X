[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-engine](../README.md) / WorkflowPolicy

# Interface: WorkflowPolicy

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:208](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L208)

## Description

Graph-level approval policy (Vol 5 Ch. 2)

## Methods

### getApprovalTimeout()

> **getApprovalTimeout**(`nodeId`): `number`

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:210](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L210)

#### Parameters

##### nodeId

`string`

#### Returns

`number`

---

### getMaxReroutes()

> **getMaxReroutes**(`nodeId`): `number`

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:211](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L211)

#### Parameters

##### nodeId

`string`

#### Returns

`number`

---

### requiresApprovalFor()

> **requiresApprovalFor**(`nodeId`, `graph`): `boolean`

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:209](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L209)

#### Parameters

##### nodeId

`string`

##### graph

[`WorkflowDefinition`](WorkflowDefinition.md)

#### Returns

`boolean`
