[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / MetricsCollector

# Class: MetricsCollector

Defined in: [packages/runtime/runtime/src/runtime-metrics.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-metrics.ts#L9)

## Constructors

### Constructor

> **new MetricsCollector**(): `MetricsCollector`

Defined in: [packages/runtime/runtime/src/runtime-metrics.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-metrics.ts#L13)

#### Returns

`MetricsCollector`

## Methods

### getMetrics()

> **getMetrics**(): [`RuntimeMetrics`](../interfaces/RuntimeMetrics.md)

Defined in: [packages/runtime/runtime/src/runtime-metrics.ts:100](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-metrics.ts#L100)

Gets current metrics

#### Returns

[`RuntimeMetrics`](../interfaces/RuntimeMetrics.md)

RuntimeMetrics

---

### incrementCheckpointCount()

> **incrementCheckpointCount**(): `void`

Defined in: [packages/runtime/runtime/src/runtime-metrics.ts:85](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-metrics.ts#L85)

Increments checkpoint count

#### Returns

`void`

---

### incrementProviderUsage()

> **incrementProviderUsage**(): `void`

Defined in: [packages/runtime/runtime/src/runtime-metrics.ts:71](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-metrics.ts#L71)

Increments provider usage

#### Returns

`void`

---

### incrementRetryCount()

> **incrementRetryCount**(): `void`

Defined in: [packages/runtime/runtime/src/runtime-metrics.ts:78](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-metrics.ts#L78)

Increments retry count

#### Returns

`void`

---

### incrementTokenUsage()

> **incrementTokenUsage**(`tokens`): `void`

Defined in: [packages/runtime/runtime/src/runtime-metrics.ts:64](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-metrics.ts#L64)

Increments token usage

#### Parameters

##### tokens

`number`

#### Returns

`void`

---

### incrementToolUsage()

> **incrementToolUsage**(): `void`

Defined in: [packages/runtime/runtime/src/runtime-metrics.ts:57](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-metrics.ts#L57)

Increments tool usage

#### Returns

`void`

---

### recordApprovalDelay()

> **recordApprovalDelay**(`durationMs`): `void`

Defined in: [packages/runtime/runtime/src/runtime-metrics.ts:50](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-metrics.ts#L50)

Records approval delay

#### Parameters

##### durationMs

`number`

#### Returns

`void`

---

### recordExecutionTime()

> **recordExecutionTime**(): `void`

Defined in: [packages/runtime/runtime/src/runtime-metrics.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-metrics.ts#L27)

Records execution time

#### Returns

`void`

---

### recordPlanningTime()

> **recordPlanningTime**(`durationMs`): `void`

Defined in: [packages/runtime/runtime/src/runtime-metrics.ts:43](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-metrics.ts#L43)

Records planning time

#### Parameters

##### durationMs

`number`

#### Returns

`void`

---

### recordWorkflowTime()

> **recordWorkflowTime**(`durationMs`): `void`

Defined in: [packages/runtime/runtime/src/runtime-metrics.ts:36](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-metrics.ts#L36)

Records workflow time

#### Parameters

##### durationMs

`number`

#### Returns

`void`

---

### reset()

> **reset**(): `void`

Defined in: [packages/runtime/runtime/src/runtime-metrics.ts:107](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-metrics.ts#L107)

Resets metrics

#### Returns

`void`

---

### setSuccessRate()

> **setSuccessRate**(`successful`, `total`): `void`

Defined in: [packages/runtime/runtime/src/runtime-metrics.ts:92](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-metrics.ts#L92)

Sets success rate

#### Parameters

##### successful

`number`

##### total

`number`

#### Returns

`void`

---

### startTiming()

> **startTiming**(): `void`

Defined in: [packages/runtime/runtime/src/runtime-metrics.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-metrics.ts#L20)

Starts timing

#### Returns

`void`
