[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/core-runtime/src](../README.md) / InMemoryEventBus

# Class: InMemoryEventBus

Defined in: [packages/shared/core-runtime/src/events/index.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/events/index.ts#L17)

In-memory implementation of IEventBus for testing and development.
Provides pub/sub, request/reply, and broadcast patterns.

## Example

```ts
const bus = new InMemoryEventBus();
await bus.subscribe('task.created', handler);
await bus.publish('task.created', task, traceId);
```

## Implements

- [`IEventBus`](../interfaces/IEventBus.md)

## Constructors

### Constructor

> **new InMemoryEventBus**(): `InMemoryEventBus`

#### Returns

`InMemoryEventBus`

## Methods

### broadcast()

> **broadcast**\<`T`>>>>\>(`topic`, `payload`, `traceId`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/core-runtime/src/events/index.ts:134](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/events/index.ts#L134)

Broadcasts an event to all subscribers of a topic.

#### Type Parameters

##### T

`T`

#### Parameters

##### topic

`string`

Topic to broadcast to

##### payload

`T`

Event payload

##### traceId

`string`

Trace ID for distributed tracing

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IEventBus`](../interfaces/IEventBus.md).[`broadcast`](../interfaces/IEventBus.md#broadcast)

---

### publish()

> **publish**\<`T`>>>>\>(`topic`, `payload`, `traceId`, `taskId?`, `metadata?`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/core-runtime/src/events/index.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/events/index.ts#L30)

Publishes an event to a topic.

#### Type Parameters

##### T

`T`

#### Parameters

##### topic

`string`

Event topic to publish to

##### payload

`T`

Event payload data

##### traceId

`string`

Trace ID for distributed tracing

##### taskId?

`string`

Optional task ID associated with the event

##### metadata?

`Record`\<`string`, `unknown`\>

Optional metadata for the event

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IEventBus`](../interfaces/IEventBus.md).[`publish`](../interfaces/IEventBus.md#publish)

---

### reply()

> **reply**\<`TReq`, `TRes`>>>>\>(`topic`, `handler`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/core-runtime/src/events/index.ts:111](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/events/index.ts#L111)

Registers a handler that replies to requests on a topic.

#### Type Parameters

##### TReq

`TReq`

##### TRes

`TRes`

#### Parameters

##### topic

`string`

Request topic to handle

##### handler

(`event`) => `Promise`\<`TRes`\>

Async handler that processes requests and returns responses

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IEventBus`](../interfaces/IEventBus.md).[`reply`](../interfaces/IEventBus.md#reply)

---

### request()

> **request**\<`TReq`, `TRes`>>>>\>(`topic`, `payload`, `traceId`, `timeoutMs?`): `Promise`\<[`EventEnvelope`](../interfaces/EventEnvelope.md)\<`TRes`>>>>>>>>\>\>

Defined in: [packages/shared/core-runtime/src/events/index.ts:83](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/events/index.ts#L83)

Sends a request and waits for a reply.

#### Type Parameters

##### TReq

`TReq`

##### TRes

`TRes`

#### Parameters

##### topic

`string`

Request topic

##### payload

`TReq`

Request payload

##### traceId

`string`

Trace ID for distributed tracing

##### timeoutMs?

`number` = `5000`

Timeout in milliseconds (default: 5000)

#### Returns

`Promise`\<[`EventEnvelope`](../interfaces/EventEnvelope.md)\<`TRes`\>\>

Promise resolving to the reply event envelope

#### Throws

EventBusError if request times out

#### Implementation of

[`IEventBus`](../interfaces/IEventBus.md).[`request`](../interfaces/IEventBus.md#request)

---

### subscribe()

> **subscribe**\<`T`>>>>\>(`topic`, `handler`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/core-runtime/src/events/index.ts:56](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/events/index.ts#L56)

Subscribes a handler to a topic.

#### Type Parameters

##### T

`T`

#### Parameters

##### topic

`string`

Topic to subscribe to

##### handler

(`event`) => `Promise`\<`void`\>

Async handler function to process events

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IEventBus`](../interfaces/IEventBus.md).[`subscribe`](../interfaces/IEventBus.md#subscribe)

---

### unsubscribe()

> **unsubscribe**(`topic`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/core-runtime/src/events/index.ts:70](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/events/index.ts#L70)

Unsubscribes all handlers from a topic.

#### Parameters

##### topic

`string`

Topic to unsubscribe from

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IEventBus`](../interfaces/IEventBus.md).[`unsubscribe`](../interfaces/IEventBus.md#unsubscribe)
