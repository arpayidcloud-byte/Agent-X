[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-orchestration](../README.md) / WorkflowSplitter

# Class: WorkflowSplitter

Defined in: [packages/workflow/workflow-orchestration/src/workflow-splitter.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-splitter.ts#L8)

## Constructors

### Constructor

> **new WorkflowSplitter**(): `WorkflowSplitter`

#### Returns

`WorkflowSplitter`

## Methods

### split()

> **split**(`nodes`, `_sourceNode`, `_targetCount`): `object`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-splitter.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-splitter.ts#L9)

#### Parameters

##### nodes

[`WorkflowNode`](../interfaces/WorkflowNode.md)[]

##### \_sourceNode

`string`

##### \_targetCount

`number`

#### Returns

`object`

##### edges

> **edges**: [`WorkflowEdge`](../interfaces/WorkflowEdge.md)[]

##### nodes

> **nodes**: [`WorkflowNode`](../interfaces/WorkflowNode.md)[]
