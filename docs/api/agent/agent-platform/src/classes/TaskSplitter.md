[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [agent/agent-platform/src](../README.md) / TaskSplitter

# Class: TaskSplitter

Defined in: [packages/agent/agent-platform/src/sub-agents/task-splitter.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/task-splitter.ts#L11)

## Constructors

### Constructor

> **new TaskSplitter**(): `TaskSplitter`

#### Returns

`TaskSplitter`

## Methods

### decomposeTask()

> **decomposeTask**(`_goal`, `_context`, `_globalBudget`): [`TaskGraphNode`](../interfaces/TaskGraphNode.md)[]

Defined in: [packages/agent/agent-platform/src/sub-agents/task-splitter.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/task-splitter.ts#L12)

#### Parameters

##### \_goal

`string`

##### \_context

`unknown`

##### \_globalBudget

[`ResourceAllocation`](../interfaces/ResourceAllocation.md)

#### Returns

[`TaskGraphNode`](../interfaces/TaskGraphNode.md)[]
