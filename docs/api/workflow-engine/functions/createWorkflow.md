[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-engine](../README.md) / createWorkflow

# Function: createWorkflow()

> **createWorkflow**(`id`, `name`, `createdBy`, `nodes?`, `edges?`): [`WorkflowDefinition`](../interfaces/WorkflowDefinition.md)

Defined in: [packages/workflow/workflow-engine/src/graph.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/graph.ts#L21)

Creates a new workflow definition

## Parameters

### id

`string`

### name

`string`

### createdBy

`string`

### nodes?

[`WorkflowNode`](../interfaces/WorkflowNode.md)[] = `[]`

### edges?

[`WorkflowEdge`](../interfaces/WorkflowEdge.md)[] = `[]`

## Returns

[`WorkflowDefinition`](../interfaces/WorkflowDefinition.md)
