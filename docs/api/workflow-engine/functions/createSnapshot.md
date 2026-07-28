[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-engine](../README.md) / createSnapshot

# Function: createSnapshot()

> **createSnapshot**(`workflowId`, `nodeStates`, `results`, `version`): [`ExecutionSnapshot`](../interfaces/ExecutionSnapshot.md)

Defined in: [packages/workflow/workflow-engine/src/checkpoint.ts:61](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/checkpoint.ts#L61)

Creates an execution snapshot

## Parameters

### workflowId

`string`

### nodeStates

`Map`\<`string`, [`NodeState`](../type-aliases/NodeState.md)\>

### results

`Map`\<`string`, `unknown`\>

### version

`number`

## Returns

[`ExecutionSnapshot`](../interfaces/ExecutionSnapshot.md)
