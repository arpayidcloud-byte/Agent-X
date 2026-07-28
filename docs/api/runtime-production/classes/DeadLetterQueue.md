[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-production](../README.md) / DeadLetterQueue

# Class: DeadLetterQueue

Defined in: [packages/runtime/runtime-production/src/dead-letter-queue.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/dead-letter-queue.ts#L8)

## Constructors

### Constructor

> **new DeadLetterQueue**(): `DeadLetterQueue`

#### Returns

`DeadLetterQueue`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/runtime/runtime-production/src/dead-letter-queue.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/dead-letter-queue.ts#L23)

#### Returns

`void`

---

### list()

> **list**(): [`QueueMessage`](../interfaces/QueueMessage.md)\<`unknown`>>>>\>[]

Defined in: [packages/runtime/runtime-production/src/dead-letter-queue.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/dead-letter-queue.ts#L15)

#### Returns

[`QueueMessage`](../interfaces/QueueMessage.md)\<`unknown`\>[]

---

### send()

> **send**(`msg`): `void`

Defined in: [packages/runtime/runtime-production/src/dead-letter-queue.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/dead-letter-queue.ts#L11)

#### Parameters

##### msg

[`QueueMessage`](../interfaces/QueueMessage.md)

#### Returns

`void`

---

### size()

> **size**(): `number`

Defined in: [packages/runtime/runtime-production/src/dead-letter-queue.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/dead-letter-queue.ts#L19)

#### Returns

`number`
