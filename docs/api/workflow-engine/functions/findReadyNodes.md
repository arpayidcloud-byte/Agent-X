[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-engine](../README.md) / findReadyNodes

# Function: findReadyNodes()

> **findReadyNodes**(`nodes`, `edges`, `completedNodes`, `activeNodes`): [`WorkflowNode`](../interfaces/WorkflowNode.md)[]

Defined in: [packages/workflow/workflow-engine/src/graph.ts:190](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/graph.ts#L190)

Finds all ready nodes

## Parameters

### nodes

[`WorkflowNode`](../interfaces/WorkflowNode.md)[]

### edges

[`WorkflowEdge`](../interfaces/WorkflowEdge.md)[]

### completedNodes

`Set`\<`string`\>

### activeNodes

`Set`\<`string`\>

## Returns

[`WorkflowNode`](../interfaces/WorkflowNode.md)[]
