[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-orchestration](../README.md) / WorkflowDependencyManager

# Class: WorkflowDependencyManager

Defined in: [packages/workflow/workflow-orchestration/src/workflow-dependency.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-dependency.ts#L8)

## Constructors

### Constructor

> **new WorkflowDependencyManager**(): `WorkflowDependencyManager`

#### Returns

`WorkflowDependencyManager`

## Methods

### addEdge()

> **addEdge**(`source`, `target`, `weight?`): `void`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-dependency.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-dependency.ts#L11)

#### Parameters

##### source

`string`

##### target

`string`

##### weight?

`number` = `1`

#### Returns

`void`

---

### getEdges()

> **getEdges**(): [`WorkflowEdge`](../interfaces/WorkflowEdge.md)[]

Defined in: [packages/workflow/workflow-orchestration/src/workflow-dependency.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-dependency.ts#L15)

#### Returns

[`WorkflowEdge`](../interfaces/WorkflowEdge.md)[]

---

### hasDependency()

> **hasDependency**(`taskId`): `boolean`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-dependency.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-dependency.ts#L19)

#### Parameters

##### taskId

`string`

#### Returns

`boolean`
