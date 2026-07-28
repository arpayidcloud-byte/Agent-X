[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / CrossNodeCollaborationManager

# Class: CrossNodeCollaborationManager

Defined in: [packages/distributed/distributed-cognition/src/domain/collaboration/CrossNodeCollaborationManager.ts:4](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/collaboration/CrossNodeCollaborationManager.ts#L4)

## Constructors

### Constructor

> **new CrossNodeCollaborationManager**(): `CrossNodeCollaborationManager`

#### Returns

`CrossNodeCollaborationManager`

## Methods

### getMessages()

> **getMessages**(`fromNode?`, `toNode?`): [`CollaborationMessage`](../interfaces/CollaborationMessage.md)[]

Defined in: [packages/distributed/distributed-cognition/src/domain/collaboration/CrossNodeCollaborationManager.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/collaboration/CrossNodeCollaborationManager.ts#L39)

#### Parameters

##### fromNode?

`string`

##### toNode?

`string`

#### Returns

[`CollaborationMessage`](../interfaces/CollaborationMessage.md)[]

---

### getSession()

> **getSession**(`sessionId`): [`CrossNodeSession`](../interfaces/CrossNodeSession.md) \| `undefined`

Defined in: [packages/distributed/distributed-cognition/src/domain/collaboration/CrossNodeCollaborationManager.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/collaboration/CrossNodeCollaborationManager.ts#L45)

#### Parameters

##### sessionId

`string`

#### Returns

[`CrossNodeSession`](../interfaces/CrossNodeSession.md) \| `undefined`

---

### getSessionsByNode()

> **getSessionsByNode**(`nodeId`): [`CrossNodeSession`](../interfaces/CrossNodeSession.md)[]

Defined in: [packages/distributed/distributed-cognition/src/domain/collaboration/CrossNodeCollaborationManager.ts:49](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/collaboration/CrossNodeCollaborationManager.ts#L49)

#### Parameters

##### nodeId

`string`

#### Returns

[`CrossNodeSession`](../interfaces/CrossNodeSession.md)[]

---

### initiate()

> **initiate**(`initiatorNode`, `goalId`, `participants`): [`CrossNodeSession`](../interfaces/CrossNodeSession.md)

Defined in: [packages/distributed/distributed-cognition/src/domain/collaboration/CrossNodeCollaborationManager.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/collaboration/CrossNodeCollaborationManager.ts#L8)

#### Parameters

##### initiatorNode

`string`

##### goalId

`string`

##### participants

`string`[]

#### Returns

[`CrossNodeSession`](../interfaces/CrossNodeSession.md)

---

### sendMessage()

> **sendMessage**(`message`): `void`

Defined in: [packages/distributed/distributed-cognition/src/domain/collaboration/CrossNodeCollaborationManager.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/collaboration/CrossNodeCollaborationManager.ts#L35)

#### Parameters

##### message

[`CollaborationMessage`](../interfaces/CollaborationMessage.md)

#### Returns

`void`

---

### transition()

> **transition**(`sessionId`, `newState`): [`CrossNodeSession`](../interfaces/CrossNodeSession.md)

Defined in: [packages/distributed/distributed-cognition/src/domain/collaboration/CrossNodeCollaborationManager.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/collaboration/CrossNodeCollaborationManager.ts#L27)

#### Parameters

##### sessionId

`string`

##### newState

[`CollaborationState`](../type-aliases/CollaborationState.md)

#### Returns

[`CrossNodeSession`](../interfaces/CrossNodeSession.md)
