[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / ExecutionScheduler

# Class: ExecutionScheduler

Defined in: [packages/runtime/runtime/src/coordinator/scheduler.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/scheduler.ts#L8)

## Constructors

### Constructor

> **new ExecutionScheduler**(): `ExecutionScheduler`

#### Returns

`ExecutionScheduler`

## Methods

### cancel()

> **cancel**(`ticketId`): `boolean`

Defined in: [packages/runtime/runtime/src/coordinator/scheduler.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/scheduler.ts#L31)

#### Parameters

##### ticketId

`string`

#### Returns

`boolean`

---

### clear()

> **clear**(): `void`

Defined in: [packages/runtime/runtime/src/coordinator/scheduler.ts:58](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/scheduler.ts#L58)

#### Returns

`void`

---

### completeBatch()

> **completeBatch**(`batchId`): `void`

Defined in: [packages/runtime/runtime/src/coordinator/scheduler.ts:47](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/scheduler.ts#L47)

#### Parameters

##### batchId

`string`

#### Returns

`void`

---

### createBatch()

> **createBatch**(`tickets`): [`ExecutionBatch`](../interfaces/ExecutionBatch.md)

Defined in: [packages/runtime/runtime/src/coordinator/scheduler.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/scheduler.ts#L37)

#### Parameters

##### tickets

[`ExecutionTicket`](../interfaces/ExecutionTicket.md)[]

#### Returns

[`ExecutionBatch`](../interfaces/ExecutionBatch.md)

---

### dequeue()

> **dequeue**(): [`ExecutionTicket`](../interfaces/ExecutionTicket.md) \| `undefined`

Defined in: [packages/runtime/runtime/src/coordinator/scheduler.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/scheduler.ts#L23)

#### Returns

[`ExecutionTicket`](../interfaces/ExecutionTicket.md) \| `undefined`

---

### getQueueSize()

> **getQueueSize**(): `number`

Defined in: [packages/runtime/runtime/src/coordinator/scheduler.ts:54](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/scheduler.ts#L54)

#### Returns

`number`

---

### peek()

> **peek**(): [`ExecutionTicket`](../interfaces/ExecutionTicket.md) \| `undefined`

Defined in: [packages/runtime/runtime/src/coordinator/scheduler.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/scheduler.ts#L27)

#### Returns

[`ExecutionTicket`](../interfaces/ExecutionTicket.md) \| `undefined`

---

### schedule()

> **schedule**(`ticket`): [`ExecutionSchedule`](../interfaces/ExecutionSchedule.md)

Defined in: [packages/runtime/runtime/src/coordinator/scheduler.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/scheduler.ts#L12)

#### Parameters

##### ticket

[`ExecutionTicket`](../interfaces/ExecutionTicket.md)

#### Returns

[`ExecutionSchedule`](../interfaces/ExecutionSchedule.md)
