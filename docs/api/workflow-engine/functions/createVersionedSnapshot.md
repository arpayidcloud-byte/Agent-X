[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-engine](../README.md) / createVersionedSnapshot

# Function: createVersionedSnapshot()

> **createVersionedSnapshot**(`workflowId`, `nodeStates`, `results`, `version`, `createdBy`): [`VersionedExecutionSnapshot`](../interfaces/VersionedExecutionSnapshot.md)

Defined in: [packages/workflow/workflow-engine/src/snapshot-v2.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/snapshot-v2.ts#L9)

## Parameters

### workflowId

`string`

### nodeStates

`Map`\<`string`, [`NodeState`](../type-aliases/NodeState.md)\>

### results

`Map`\<`string`, `unknown`\>

### version

`number`

### createdBy

`string`

## Returns

[`VersionedExecutionSnapshot`](../interfaces/VersionedExecutionSnapshot.md)
