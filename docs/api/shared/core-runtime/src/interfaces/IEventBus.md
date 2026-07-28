[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/core-runtime/src](../README.md) / IEventBus

# Interface: IEventBus

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:103](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L103)

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

## Methods

### broadcast()

> **broadcast**\<`T`>>>>\>(`topic`, `payload`, `traceId`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:178](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L178)

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

---

### publish()

> **publish**\<`T`>>>>\>(`topic`, `payload`, `traceId`, `taskId?`, `metadata?`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:114](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L114)

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

---

### reply()

> **reply**\<`TReq`, `TRes`>>>>\>(`topic`, `handler`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:165](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L165)

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

---

### request()

> **request**\<`TReq`, `TRes`>>>>\>(`topic`, `payload`, `traceId`, `timeoutMs?`): `Promise`\<[`EventEnvelope`](EventEnvelope.md)\<`TRes`>>>>>>>>\>\>

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:150](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L150)

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

`number`

Optional timeout in milliseconds

#### Returns

`Promise`\<[`EventEnvelope`](EventEnvelope.md)\<`TRes`\>\>

The response envelope

#### Throws

Will throw if the timeout is exceeded

---

### subscribe()

> **subscribe**\<`T`>>>>\>(`topic`, `handler`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:129](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L129)

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

---

### unsubscribe()

> **unsubscribe**(`topic`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/core-runtime/src/interfaces/events.ts:136](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/events.ts#L136)

Unsubscribe from a topic, removing all handlers.

#### Parameters

##### topic

`string`

The topic to unsubscribe from

#### Returns

`Promise`\<`void`\>
