[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-adapters](../README.md) / MemoryTelemetryProvider

# Class: MemoryTelemetryProvider

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-telemetry.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-telemetry.ts#L22)

## Implements

- [`ITelemetryProvider`](../interfaces/ITelemetryProvider.md)

## Constructors

### Constructor

> **new MemoryTelemetryProvider**(): `MemoryTelemetryProvider`

#### Returns

`MemoryTelemetryProvider`

## Methods

### endSpan()

> **endSpan**(`spanId`, `status?`): `void`

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-telemetry.ts:61](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-telemetry.ts#L61)

#### Parameters

##### spanId

`string`

##### status?

`"OK"` \| `"ERROR"`

#### Returns

`void`

#### Implementation of

[`ITelemetryProvider`](../interfaces/ITelemetryProvider.md).[`endSpan`](../interfaces/ITelemetryProvider.md#endspan)

---

### flush()

> **flush**(): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-telemetry.ts:82](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-telemetry.ts#L82)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ITelemetryProvider`](../interfaces/ITelemetryProvider.md).[`flush`](../interfaces/ITelemetryProvider.md#flush)

---

### getCapabilities()

> **getCapabilities**(): [`ProviderCapabilities`](../interfaces/ProviderCapabilities.md)

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-telemetry.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-telemetry.ts#L37)

#### Returns

[`ProviderCapabilities`](../interfaces/ProviderCapabilities.md)

#### Implementation of

[`ITelemetryProvider`](../interfaces/ITelemetryProvider.md).[`getCapabilities`](../interfaces/ITelemetryProvider.md#getcapabilities)

---

### getGauges()

> **getGauges**(): `Map`\<`string`, `number`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-telemetry.ts:90](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-telemetry.ts#L90)

#### Returns

`Map`\<`string`, `number`\>

---

### getMetadata()

> **getMetadata**(): [`ProviderMetadata`](../interfaces/ProviderMetadata.md)

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-telemetry.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-telemetry.ts#L28)

#### Returns

[`ProviderMetadata`](../interfaces/ProviderMetadata.md)

#### Implementation of

[`ITelemetryProvider`](../interfaces/ITelemetryProvider.md).[`getMetadata`](../interfaces/ITelemetryProvider.md#getmetadata)

---

### getMetrics()

> **getMetrics**(): [`ProviderMetrics`](../interfaces/ProviderMetrics.md)

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-telemetry.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-telemetry.ts#L45)

#### Returns

[`ProviderMetrics`](../interfaces/ProviderMetrics.md)

#### Implementation of

[`ITelemetryProvider`](../interfaces/ITelemetryProvider.md).[`getMetrics`](../interfaces/ITelemetryProvider.md#getmetrics)

---

### getSpans()

> **getSpans**(): `Map`\<`string`, [`TelemetrySpanRecord`](../interfaces/TelemetrySpanRecord.md)>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-telemetry.ts:86](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-telemetry.ts#L86)

#### Returns

`Map`\<`string`, [`TelemetrySpanRecord`](../interfaces/TelemetrySpanRecord.md)\>

---

### healthCheck()

> **healthCheck**(): `Promise`\<[`ProviderHealth`](../interfaces/ProviderHealth.md)>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-telemetry.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-telemetry.ts#L41)

#### Returns

`Promise`\<[`ProviderHealth`](../interfaces/ProviderHealth.md)\>

#### Implementation of

[`ITelemetryProvider`](../interfaces/ITelemetryProvider.md).[`healthCheck`](../interfaces/ITelemetryProvider.md#healthcheck)

---

### recordCounter()

> **recordCounter**(`name`, `value?`): `void`

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-telemetry.ts:68](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-telemetry.ts#L68)

#### Parameters

##### name

`string`

##### value?

`number` = `1`

#### Returns

`void`

#### Implementation of

[`ITelemetryProvider`](../interfaces/ITelemetryProvider.md).[`recordCounter`](../interfaces/ITelemetryProvider.md#recordcounter)

---

### recordGauge()

> **recordGauge**(`name`, `value`): `void`

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-telemetry.ts:78](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-telemetry.ts#L78)

#### Parameters

##### name

`string`

##### value

`number`

#### Returns

`void`

#### Implementation of

[`ITelemetryProvider`](../interfaces/ITelemetryProvider.md).[`recordGauge`](../interfaces/ITelemetryProvider.md#recordgauge)

---

### recordHistogram()

> **recordHistogram**(`name`, `value`): `void`

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-telemetry.ts:72](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-telemetry.ts#L72)

#### Parameters

##### name

`string`

##### value

`number`

#### Returns

`void`

#### Implementation of

[`ITelemetryProvider`](../interfaces/ITelemetryProvider.md).[`recordHistogram`](../interfaces/ITelemetryProvider.md#recordhistogram)

---

### startSpan()

> **startSpan**(`name`, `context?`): `string`

Defined in: [packages/runtime/runtime-adapters/src/memory/memory-telemetry.ts:54](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/memory/memory-telemetry.ts#L54)

#### Parameters

##### name

`string`

##### context?

[`ProviderContext`](../interfaces/ProviderContext.md)

#### Returns

`string`

#### Implementation of

[`ITelemetryProvider`](../interfaces/ITelemetryProvider.md).[`startSpan`](../interfaces/ITelemetryProvider.md#startspan)
