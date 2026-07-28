[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [multi-agent-collaboration](../README.md) / CollaborationCheckpointManager

# Class: CollaborationCheckpointManager

Defined in: [packages/agent/multi-agent-collaboration/src/collaboration-checkpoint-manager.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/collaboration-checkpoint-manager.ts#L9)

## Constructors

### Constructor

> **new CollaborationCheckpointManager**(): `CollaborationCheckpointManager`

#### Returns

`CollaborationCheckpointManager`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/agent/multi-agent-collaboration/src/collaboration-checkpoint-manager.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/collaboration-checkpoint-manager.ts#L34)

#### Returns

`void`

---

### load()

> **load**(`sessionId`): [`CollaborationCheckpoint`](../interfaces/CollaborationCheckpoint.md) \| `undefined`

Defined in: [packages/agent/multi-agent-collaboration/src/collaboration-checkpoint-manager.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/collaboration-checkpoint-manager.ts#L30)

#### Parameters

##### sessionId

`string`

#### Returns

[`CollaborationCheckpoint`](../interfaces/CollaborationCheckpoint.md) \| `undefined`

---

### save()

> **save**(`sessionId`, `agentStates`, `sharedState`): [`CollaborationCheckpoint`](../interfaces/CollaborationCheckpoint.md)

Defined in: [packages/agent/multi-agent-collaboration/src/collaboration-checkpoint-manager.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/collaboration-checkpoint-manager.ts#L12)

#### Parameters

##### sessionId

`string`

##### agentStates

`Record`\<`string`, `string`\>

##### sharedState

`Record`\<`string`, `unknown`\>

#### Returns

[`CollaborationCheckpoint`](../interfaces/CollaborationCheckpoint.md)
