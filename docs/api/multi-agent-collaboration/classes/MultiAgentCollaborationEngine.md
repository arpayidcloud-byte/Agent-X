[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [multi-agent-collaboration](../README.md) / MultiAgentCollaborationEngine

# Class: MultiAgentCollaborationEngine

Defined in: [packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts#L27)

## Constructors

### Constructor

> **new MultiAgentCollaborationEngine**(): `MultiAgentCollaborationEngine`

#### Returns

`MultiAgentCollaborationEngine`

## Properties

### agentDirectory

> **agentDirectory**: [`AgentDirectory`](AgentDirectory.md)

Defined in: [packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts#L29)

---

### agentRegistry

> **agentRegistry**: [`AgentRegistry`](AgentRegistry.md)

Defined in: [packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts#L28)

---

### agentSelection

> **agentSelection**: [`AgentSelectionEngine`](AgentSelectionEngine.md)

Defined in: [packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts#L30)

---

### checkpointManager

> **checkpointManager**: [`CollaborationCheckpointManager`](CollaborationCheckpointManager.md)

Defined in: [packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts:40](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts#L40)

---

### conflictResolution

> **conflictResolution**: [`ConflictResolutionEngine`](ConflictResolutionEngine.md)

Defined in: [packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts#L35)

---

### consensusEngine

> **consensusEngine**: [`ConsensusEngine`](ConsensusEngine.md)

Defined in: [packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts#L34)

---

### delegationEngine

> **delegationEngine**: [`TaskDelegationEngine`](TaskDelegationEngine.md)

Defined in: [packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts#L32)

---

### events

> **events**: [`CollaborationEventBus`](CollaborationEventBus.md)

Defined in: [packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts:44](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts#L44)

---

### hooks

> **hooks**: [`CollaborationHookManager`](CollaborationHookManager.md)

Defined in: [packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts:43](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts#L43)

---

### knowledgeSynchronizer

> **knowledgeSynchronizer**: [`KnowledgeSynchronizer`](KnowledgeSynchronizer.md)

Defined in: [packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts#L38)

---

### messageRouter

> **messageRouter**: [`MessageRouter`](MessageRouter.md)

Defined in: [packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts#L39)

---

### metrics

> **metrics**: [`CollaborationMetricsCollector`](CollaborationMetricsCollector.md)

Defined in: [packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts:42](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts#L42)

---

### planner

> **planner**: [`CollaborationPlanner`](CollaborationPlanner.md)

Defined in: [packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts#L31)

---

### recoveryManager

> **recoveryManager**: [`CollaborationRecoveryManager`](CollaborationRecoveryManager.md)

Defined in: [packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts#L41)

---

### scheduler

> **scheduler**: [`CollaborationScheduler`](CollaborationScheduler.md)

Defined in: [packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts#L33)

---

### sharedContext

> **sharedContext**: [`SharedContextManager`](SharedContextManager.md)

Defined in: [packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts:36](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts#L36)

---

### sharedMemory

> **sharedMemory**: [`SharedMemoryCoordinator`](SharedMemoryCoordinator.md)

Defined in: [packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts#L37)

## Methods

### reachConsensus()

> **reachConsensus**(`proposalId`, `agentIds`, `proposal`): `Promise`\<`boolean`>>>>\>

Defined in: [packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts:84](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts#L84)

#### Parameters

##### proposalId

`string`

##### agentIds

`string`[]

##### proposal

`string`

#### Returns

`Promise`\<`boolean`\>

---

### recover()

> **recover**(`sessionId`): `boolean`

Defined in: [packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts:108](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts#L108)

#### Parameters

##### sessionId

`string`

#### Returns

`boolean`

---

### resolveConflict()

> **resolveConflict**(`agentIds`, `conflictType`, `resolution`): `void`

Defined in: [packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts:97](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts#L97)

#### Parameters

##### agentIds

`string`[]

##### conflictType

`string`

##### resolution

`string`

#### Returns

`void`

---

### saveCheckpoint()

> **saveCheckpoint**(`sessionId`): `void`

Defined in: [packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts:103](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts#L103)

#### Parameters

##### sessionId

`string`

#### Returns

`void`

---

### startSession()

> **startSession**(`goalId`, `agentIds`): `Promise`\<[`CollaborationSession`](../interfaces/CollaborationSession.md)>>>>\>

Defined in: [packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts:46](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/multi-agent-collaboration-engine.ts#L46)

#### Parameters

##### goalId

`string`

##### agentIds

`string`[]

#### Returns

`Promise`\<[`CollaborationSession`](../interfaces/CollaborationSession.md)\>
