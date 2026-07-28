[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / QueueManager

# Class: QueueManager

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts:86](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts#L86)

## Constructors

### Constructor

> **new QueueManager**(): `QueueManager`

#### Returns

`QueueManager`

## Methods

### dequeue()

> **dequeue**(`queue`): [`QueueMessage`](../interfaces/QueueMessage.md) \| `undefined`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts:107](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts#L107)

#### Parameters

##### queue

`string`

#### Returns

[`QueueMessage`](../interfaces/QueueMessage.md) \| `undefined`

---

### enqueue()

> **enqueue**(`queue`, `payload`): [`QueueMessage`](../interfaces/QueueMessage.md)

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts:89](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts#L89)

#### Parameters

##### queue

`string`

##### payload

`Record`\<`string`, `unknown`\>

#### Returns

[`QueueMessage`](../interfaces/QueueMessage.md)

---

### getQueues()

> **getQueues**(): `string`[]

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts:117](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts#L117)

#### Returns

`string`[]

---

### size()

> **size**(`queue`): `number`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts:113](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts#L113)

#### Parameters

##### queue

`string`

#### Returns

`number`
