[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [multi-agent-collaboration](../README.md) / CollaborationEventBus

# Class: CollaborationEventBus

Defined in: [packages/agent/multi-agent-collaboration/src/collaboration-event-bus.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/collaboration-event-bus.ts#L6)

## Constructors

### Constructor

> **new CollaborationEventBus**(): `CollaborationEventBus`

#### Returns

`CollaborationEventBus`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/agent/multi-agent-collaboration/src/collaboration-event-bus.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/collaboration-event-bus.ts#L19)

#### Returns

`void`

---

### publish()

> **publish**(`type`, `payload?`): `void`

Defined in: [packages/agent/multi-agent-collaboration/src/collaboration-event-bus.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/collaboration-event-bus.ts#L9)

#### Parameters

##### type

`string`

##### payload?

`Record`\<`string`, `unknown`\> = `{}`

#### Returns

`void`

---

### subscribe()

> **subscribe**(`type`, `fn`): `void`

Defined in: [packages/agent/multi-agent-collaboration/src/collaboration-event-bus.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/collaboration-event-bus.ts#L14)

#### Parameters

##### type

`string`

##### fn

`Function`

#### Returns

`void`
