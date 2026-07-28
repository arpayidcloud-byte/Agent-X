[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [agent/agent-platform/src](../README.md) / ParallelRunner

# Class: ParallelRunner

Defined in: [packages/agent/agent-platform/src/sub-agents/parallel-runner.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/parallel-runner.ts#L12)

## Constructors

### Constructor

> **new ParallelRunner**(`pool`, `bus`): `ParallelRunner`

Defined in: [packages/agent/agent-platform/src/sub-agents/parallel-runner.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/parallel-runner.ts#L13)

#### Parameters

##### pool

[`AgentPool`](AgentPool.md)

##### bus

[`MessageBus`](MessageBus.md)

#### Returns

`ParallelRunner`

## Methods

### runParallel()

> **runParallel**(`task`, `roles`, `context`): `Promise`\<[`ParallelExecutionResult`](../interfaces/ParallelExecutionResult.md)>>>>\>

Defined in: [packages/agent/agent-platform/src/sub-agents/parallel-runner.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/parallel-runner.ts#L18)

#### Parameters

##### task

`TaskModel`

##### roles

`AgentRole`[]

##### context

`unknown`

#### Returns

`Promise`\<[`ParallelExecutionResult`](../interfaces/ParallelExecutionResult.md)\>
