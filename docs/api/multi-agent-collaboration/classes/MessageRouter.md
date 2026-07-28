[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [multi-agent-collaboration](../README.md) / MessageRouter

# Class: MessageRouter

Defined in: [packages/agent/multi-agent-collaboration/src/message-router.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/message-router.ts#L8)

## Constructors

### Constructor

> **new MessageRouter**(): `MessageRouter`

#### Returns

`MessageRouter`

## Methods

### clearInbox()

> **clearInbox**(`agentId`): `void`

Defined in: [packages/agent/multi-agent-collaboration/src/message-router.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/message-router.ts#L21)

#### Parameters

##### agentId

`string`

#### Returns

`void`

---

### getInbox()

> **getInbox**(`agentId`): [`AgentMessage`](../interfaces/AgentMessage.md)[]

Defined in: [packages/agent/multi-agent-collaboration/src/message-router.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/message-router.ts#L17)

#### Parameters

##### agentId

`string`

#### Returns

[`AgentMessage`](../interfaces/AgentMessage.md)[]

---

### route()

> **route**(`message`): `void`

Defined in: [packages/agent/multi-agent-collaboration/src/message-router.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/message-router.ts#L11)

#### Parameters

##### message

[`AgentMessage`](../interfaces/AgentMessage.md)

#### Returns

`void`
