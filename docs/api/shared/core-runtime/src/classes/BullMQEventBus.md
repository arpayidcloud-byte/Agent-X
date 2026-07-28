[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/core-runtime/src](../README.md) / BullMQEventBus

# Class: BullMQEventBus

Defined in: [packages/shared/core-runtime/src/events/index.ts:168](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/events/index.ts#L168)

Event bus interface for publishing, subscribing, and advanced routing of events.

## Example

```ts
// Subscribe to task events
await eventBus.subscribe(EventTopic.TASK_COMPLETED, async (event) => {
  console.log('Task completed:', event.payload);
});

// Publish an event
await eventBus.publish(EventTopic.TASK_CREATED, taskData, 'trace-abc', 'task-123');
```

## Implements

- [`IEventBus`](../interfaces/IEventBus.md)

## Constructors

### Constructor

> **new BullMQEventBus**(`redisUrl?`): `BullMQEventBus`

Defined in: [packages/shared/core-runtime/src/events/index.ts:175](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/events/index.ts#L175)

#### Parameters

##### redisUrl?

`string` = `'redis://localhost:6379'`

#### Returns

`BullMQEventBus`

## Methods

### broadcast()

> **broadcast**\<`T`>>>>\>(`topic`, `payload`, `traceId`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/core-runtime/src/events/index.ts:289](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/events/index.ts#L289)

Broadcast an event to all subscribers without waiting for acknowledgement.

#### Type Parameters

##### T

`T`

The shape of the event payload

#### Parameters

##### topic

`string`

The topic to broadcast on

##### payload

`T`

The event payload

##### traceId

`string`

Distributed tracing identifier

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IEventBus`](../interfaces/IEventBus.md).[`broadcast`](../interfaces/IEventBus.md#broadcast)

---

### close()

> **close**(): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/core-runtime/src/events/index.ts:293](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/events/index.ts#L293)

#### Returns

`Promise`\<`void`\>

---

### publish()

> **publish**\<`T`>>>>\>(`topic`, `payload`, `traceId`, `taskId?`, `metadata?`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/core-runtime/src/events/index.ts:181](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/events/index.ts#L181)

Publish an event to a topic.

#### Type Parameters

##### T

`T`

The shape of the event payload

#### Parameters

##### topic

`string`

The topic to publish to

##### payload

`T`

The event payload

##### traceId

`string`

Distributed tracing identifier

##### taskId?

`string`

Optional associated task identifier

##### metadata?

`Record`\<`string`, `unknown`\>

Optional additional metadata

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IEventBus`](../interfaces/IEventBus.md).[`publish`](../interfaces/IEventBus.md#publish)

---

### reply()

> **reply**\<`TReq`, `TRes`>>>>\>(`topic`, `handler`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/core-runtime/src/events/index.ts:272](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/events/index.ts#L272)

Register a handler to reply to requests on a topic.

#### Type Parameters

##### TReq

`TReq`

Request payload type

##### TRes

`TRes`

Response payload type

#### Parameters

##### topic

`string`

The topic to listen for requests on

##### handler

(`event`) => `Promise`\<`TRes`\>

Async callback that processes the request and returns a response

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IEventBus`](../interfaces/IEventBus.md).[`reply`](../interfaces/IEventBus.md#reply)

---

### request()

> **request**\<`TReq`, `TRes`>>>>\>(`topic`, `payload`, `traceId`, `timeoutMs?`): `Promise`\<[`EventEnvelope`](../interfaces/EventEnvelope.md)\<`TRes`>>>>>>>>\>\>

Defined in: [packages/shared/core-runtime/src/events/index.ts:241](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/events/index.ts#L241)

Send a request and wait for a correlated response (request/reply pattern).

#### Type Parameters

##### TReq

`TReq`

Request payload type

##### TRes

`TRes`

Response payload type

#### Parameters

##### topic

`string`

The topic to send the request to

##### payload

`TReq`

The request payload

##### traceId

`string`

Distributed tracing identifier

##### timeoutMs?

`number` = `5000`

Optional timeout in milliseconds

#### Returns

`Promise`\<[`EventEnvelope`](../interfaces/EventEnvelope.md)\<`TRes`\>\>

The response envelope

#### Throws

Will throw if the timeout is exceeded

#### Implementation of

[`IEventBus`](../interfaces/IEventBus.md).[`request`](../interfaces/IEventBus.md#request)

---

### subscribe()

> **subscribe**\<`T`>>>>\>(`topic`, `handler`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/core-runtime/src/events/index.ts:211](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/events/index.ts#L211)

Subscribe to events on a topic.

#### Type Parameters

##### T

`T`

The shape of the event payload

#### Parameters

##### topic

`string`

The topic to subscribe to

##### handler

(`event`) => `Promise`\<`void`\>

Async callback invoked for each matching event

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IEventBus`](../interfaces/IEventBus.md).[`subscribe`](../interfaces/IEventBus.md#subscribe)

---

### unsubscribe()

> **unsubscribe**(`topic`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/core-runtime/src/events/index.ts:233](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/events/index.ts#L233)

Unsubscribe from a topic, removing all handlers.

#### Parameters

##### topic

`string`

The topic to unsubscribe from

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IEventBus`](../interfaces/IEventBus.md).[`unsubscribe`](../interfaces/IEventBus.md#unsubscribe)
