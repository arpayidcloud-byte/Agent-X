[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-engine](../README.md) / isNodeReady

# Function: isNodeReady()

> **isNodeReady**(`nodeId`, `edges`, `completedNodes`): `boolean`

Defined in: [packages/workflow/workflow-engine/src/graph.ts:178](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/graph.ts#L178)

Checks if a node is ready (all predecessors completed)

## Parameters

### nodeId

`string`

### edges

[`WorkflowEdge`](../interfaces/WorkflowEdge.md)[]

### completedNodes

`Set`\<`string`\>

## Returns

`boolean`
