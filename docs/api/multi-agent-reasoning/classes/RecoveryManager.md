[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [multi-agent-reasoning](../README.md) / RecoveryManager

# Class: RecoveryManager

Defined in: [packages/agent/multi-agent-reasoning/src/domain/recovery/RecoveryManager.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/recovery/RecoveryManager.ts#L9)

## Constructors

### Constructor

> **new RecoveryManager**(): `RecoveryManager`

#### Returns

`RecoveryManager`

## Methods

### recoverFromCheckpoint()

> **recoverFromCheckpoint**(`sessionId`): [`CollaborationCheckpoint`](../interfaces/CollaborationCheckpoint.md) \| `undefined`

Defined in: [packages/agent/multi-agent-reasoning/src/domain/recovery/RecoveryManager.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/recovery/RecoveryManager.ts#L31)

#### Parameters

##### sessionId

`string`

#### Returns

[`CollaborationCheckpoint`](../interfaces/CollaborationCheckpoint.md) \| `undefined`

---

### saveCheckpoint()

> **saveCheckpoint**(`sessionId`, `agentStates`, `sharedState`): [`CollaborationCheckpoint`](../interfaces/CollaborationCheckpoint.md)

Defined in: [packages/agent/multi-agent-reasoning/src/domain/recovery/RecoveryManager.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/recovery/RecoveryManager.ts#L12)

#### Parameters

##### sessionId

`string`

##### agentStates

`Record`\<`string`, `string`\>

##### sharedState

`Record`\<`string`, `unknown`\>

#### Returns

[`CollaborationCheckpoint`](../interfaces/CollaborationCheckpoint.md)

---

### validateCheckpoint()

> **validateCheckpoint**(`checkpoint`): `boolean`

Defined in: [packages/agent/multi-agent-reasoning/src/domain/recovery/RecoveryManager.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/recovery/RecoveryManager.ts#L35)

#### Parameters

##### checkpoint

[`CollaborationCheckpoint`](../interfaces/CollaborationCheckpoint.md)

#### Returns

`boolean`
