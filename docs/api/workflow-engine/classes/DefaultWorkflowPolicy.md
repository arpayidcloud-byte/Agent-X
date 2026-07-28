[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-engine](../README.md) / DefaultWorkflowPolicy

# Class: DefaultWorkflowPolicy

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:214](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L214)

## Description

Graph-level approval policy (Vol 5 Ch. 2)

## Implements

- [`WorkflowPolicy`](../interfaces/WorkflowPolicy.md)

## Constructors

### Constructor

> **new DefaultWorkflowPolicy**(`opts?`): `DefaultWorkflowPolicy`

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:219](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L219)

#### Parameters

##### opts?

###### approvalNodeIds?

`string`[]

###### approvalTimeoutMs?

`number`

###### maxReroutes?

`number`

#### Returns

`DefaultWorkflowPolicy`

## Methods

### getApprovalTimeout()

> **getApprovalTimeout**(`_nodeId`): `number`

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:235](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L235)

#### Parameters

##### \_nodeId

`string`

#### Returns

`number`

#### Implementation of

[`WorkflowPolicy`](../interfaces/WorkflowPolicy.md).[`getApprovalTimeout`](../interfaces/WorkflowPolicy.md#getapprovaltimeout)

---

### getMaxReroutes()

> **getMaxReroutes**(`_nodeId`): `number`

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:239](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L239)

#### Parameters

##### \_nodeId

`string`

#### Returns

`number`

#### Implementation of

[`WorkflowPolicy`](../interfaces/WorkflowPolicy.md).[`getMaxReroutes`](../interfaces/WorkflowPolicy.md#getmaxreroutes)

---

### requiresApprovalFor()

> **requiresApprovalFor**(`nodeId`, `graph`): `boolean`

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:229](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L229)

#### Parameters

##### nodeId

`string`

##### graph

[`WorkflowDefinition`](../interfaces/WorkflowDefinition.md)

#### Returns

`boolean`

#### Implementation of

[`WorkflowPolicy`](../interfaces/WorkflowPolicy.md).[`requiresApprovalFor`](../interfaces/WorkflowPolicy.md#requiresapprovalfor)
