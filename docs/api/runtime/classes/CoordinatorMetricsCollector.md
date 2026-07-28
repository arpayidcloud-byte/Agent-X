[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / CoordinatorMetricsCollector

# Class: CoordinatorMetricsCollector

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-metrics.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-metrics.ts#L8)

## Constructors

### Constructor

> **new CoordinatorMetricsCollector**(): `CoordinatorMetricsCollector`

#### Returns

`CoordinatorMetricsCollector`

## Methods

### addQueueTime()

> **addQueueTime**(`timeMs`): `void`

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-metrics.ts:53](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-metrics.ts#L53)

#### Parameters

##### timeMs

`number`

#### Returns

`void`

---

### decrementActive()

> **decrementActive**(): `void`

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-metrics.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-metrics.ts#L24)

#### Returns

`void`

---

### getMetrics()

> **getMetrics**(): [`ExecutionCoordinatorMetrics`](../interfaces/ExecutionCoordinatorMetrics.md)

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-metrics.ts:57](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-metrics.ts#L57)

#### Returns

[`ExecutionCoordinatorMetrics`](../interfaces/ExecutionCoordinatorMetrics.md)

---

### incrementCancelled()

> **incrementCancelled**(): `void`

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-metrics.ts:40](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-metrics.ts#L40)

#### Returns

`void`

---

### incrementCompleted()

> **incrementCompleted**(`timeMs`): `void`

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-metrics.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-metrics.ts#L28)

#### Parameters

##### timeMs

`number`

#### Returns

`void`

---

### incrementExecutions()

> **incrementExecutions**(): `void`

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-metrics.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-metrics.ts#L19)

#### Returns

`void`

---

### incrementFailed()

> **incrementFailed**(`timeMs`): `void`

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-metrics.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-metrics.ts#L34)

#### Parameters

##### timeMs

`number`

#### Returns

`void`

---

### incrementRecoveries()

> **incrementRecoveries**(): `void`

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-metrics.ts:49](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-metrics.ts#L49)

#### Returns

`void`

---

### incrementRetries()

> **incrementRetries**(): `void`

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-metrics.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-metrics.ts#L45)

#### Returns

`void`

---

### reset()

> **reset**(): `void`

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-metrics.ts:71](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-metrics.ts#L71)

#### Returns

`void`
