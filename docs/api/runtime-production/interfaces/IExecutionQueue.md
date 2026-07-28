[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-production](../README.md) / IExecutionQueue

# Interface: IExecutionQueue

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L8)

## Methods

### ack()

> **ack**(`id`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L11)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>

---

### dequeue()

> **dequeue**(): `Promise`\<[`QueueMessage`](QueueMessage.md)\<`unknown`> > > > \> \| `undefined`>>>>\>

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L10)

#### Returns

`Promise`\<[`QueueMessage`](QueueMessage.md)\<`unknown`\> \| `undefined`\>

---

### enqueue()

> **enqueue**(`msg`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L9)

#### Parameters

##### msg

[`QueueMessage`](QueueMessage.md)

#### Returns

`Promise`\<`void`\>

---

### retry()

> **retry**(`id`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-production/src/queue-adapter.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/queue-adapter.ts#L12)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>
