[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / EventStreaming

# Class: EventStreaming

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts:98](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts#L98)

## Constructors

### Constructor

> **new EventStreaming**(): `EventStreaming`

#### Returns

`EventStreaming`

## Methods

### getAllTopics()

> **getAllTopics**(): `string`[]

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts:123](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts#L123)

#### Returns

`string`[]

---

### getEvents()

> **getEvents**(`topic`): [`StreamEvent`](../interfaces/StreamEvent.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts:119](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts#L119)

#### Parameters

##### topic

`string`

#### Returns

[`StreamEvent`](../interfaces/StreamEvent.md)[]

---

### publish()

> **publish**(`topic`, `data`): [`StreamEvent`](../interfaces/StreamEvent.md)

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts:101](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts#L101)

#### Parameters

##### topic

`string`

##### data

`Record`\<`string`, `unknown`\>

#### Returns

[`StreamEvent`](../interfaces/StreamEvent.md)
