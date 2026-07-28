[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [agent/agent-platform/src](../README.md) / MessageBus

# Class: MessageBus

Defined in: [packages/agent/agent-platform/src/sub-agents/message-bus.ts:4](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/message-bus.ts#L4)

## Constructors

### Constructor

> **new MessageBus**(`globalEventBus`): `MessageBus`

Defined in: [packages/agent/agent-platform/src/sub-agents/message-bus.ts:7](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/message-bus.ts#L7)

#### Parameters

##### globalEventBus

`IEventBus`

#### Returns

`MessageBus`

## Methods

### broadcastToGlobalBus()

> **broadcastToGlobalBus**(`message`): `Promise`\<`void`>>>>\>

Defined in: [packages/agent/agent-platform/src/sub-agents/message-bus.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/message-bus.ts#L25)

#### Parameters

##### message

[`AgentMessage`](../interfaces/AgentMessage.md)

#### Returns

`Promise`\<`void`\>

---

### publish()

> **publish**(`message`): `void`

Defined in: [packages/agent/agent-platform/src/sub-agents/message-bus.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/message-bus.ts#L16)

#### Parameters

##### message

[`AgentMessage`](../interfaces/AgentMessage.md)

#### Returns

`void`

---

### subscribe()

> **subscribe**(`topic`, `handler`): `void`

Defined in: [packages/agent/agent-platform/src/sub-agents/message-bus.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/message-bus.ts#L9)

#### Parameters

##### topic

`"TaskAssigned"` \| `"TaskStarted"` \| `"TaskCompleted"` \| `"TaskFailed"` \| `"TaskMerged"` \| `"TaskRetried"` \| `"TaskCancelled"` \| `"AgentSpawned"` \| `"AgentDestroyed"`

##### handler

(`msg`) => `void`

#### Returns

`void`
