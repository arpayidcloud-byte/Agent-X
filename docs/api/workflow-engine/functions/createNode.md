[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-engine](../README.md) / createNode

# Function: createNode()

> **createNode**(`id`, `type`, `name`, `config`, `options?`): [`WorkflowNode`](../interfaces/WorkflowNode.md)

Defined in: [packages/workflow/workflow-engine/src/graph.ts:48](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/graph.ts#L48)

Creates a new workflow node

## Parameters

### id

`string`

### type

`NodeType`

### name

`string`

### config

[`NodeConfig`](../type-aliases/NodeConfig.md)

### options?

#### retryPolicy?

[`RetryPolicy`](../interfaces/RetryPolicy.md)

#### timeout?

`number`

## Returns

[`WorkflowNode`](../interfaces/WorkflowNode.md)
