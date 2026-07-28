[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [multi-agent-reasoning](../README.md) / CollaborationSessionManager

# Class: CollaborationSessionManager

Defined in: [packages/agent/multi-agent-reasoning/src/domain/collaboration/CollaborationSessionManager.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/collaboration/CollaborationSessionManager.ts#L9)

## Constructors

### Constructor

> **new CollaborationSessionManager**(): `CollaborationSessionManager`

#### Returns

`CollaborationSessionManager`

## Methods

### completeSession()

> **completeSession**(`sessionId`): `void`

Defined in: [packages/agent/multi-agent-reasoning/src/domain/collaboration/CollaborationSessionManager.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/collaboration/CollaborationSessionManager.ts#L33)

#### Parameters

##### sessionId

`string`

#### Returns

`void`

---

### createSession()

> **createSession**(`goalId`, `agentIds`): [`CollaborationSession`](../interfaces/CollaborationSession.md)

Defined in: [packages/agent/multi-agent-reasoning/src/domain/collaboration/CollaborationSessionManager.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/collaboration/CollaborationSessionManager.ts#L12)

#### Parameters

##### goalId

`string`

##### agentIds

`string`[]

#### Returns

[`CollaborationSession`](../interfaces/CollaborationSession.md)

---

### failSession()

> **failSession**(`sessionId`): `void`

Defined in: [packages/agent/multi-agent-reasoning/src/domain/collaboration/CollaborationSessionManager.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/collaboration/CollaborationSessionManager.ts#L38)

#### Parameters

##### sessionId

`string`

#### Returns

`void`

---

### getSession()

> **getSession**(`sessionId`): [`CollaborationSession`](../interfaces/CollaborationSession.md) \| `undefined`

Defined in: [packages/agent/multi-agent-reasoning/src/domain/collaboration/CollaborationSessionManager.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/collaboration/CollaborationSessionManager.ts#L29)

#### Parameters

##### sessionId

`string`

#### Returns

[`CollaborationSession`](../interfaces/CollaborationSession.md) \| `undefined`

---

### listSessions()

> **listSessions**(): [`CollaborationSession`](../interfaces/CollaborationSession.md)[]

Defined in: [packages/agent/multi-agent-reasoning/src/domain/collaboration/CollaborationSessionManager.ts:43](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/collaboration/CollaborationSessionManager.ts#L43)

#### Returns

[`CollaborationSession`](../interfaces/CollaborationSession.md)[]
