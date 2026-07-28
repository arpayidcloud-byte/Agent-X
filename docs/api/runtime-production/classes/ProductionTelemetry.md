[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-production](../README.md) / ProductionTelemetry

# Class: ProductionTelemetry

Defined in: [packages/runtime/runtime-production/src/telemetry.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/telemetry.ts#L8)

## Constructors

### Constructor

> **new ProductionTelemetry**(): `ProductionTelemetry`

#### Returns

`ProductionTelemetry`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/runtime/runtime-production/src/telemetry.ts:56](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/telemetry.ts#L56)

#### Returns

`void`

---

### endSpan()

> **endSpan**(`spanId`, `status?`): `void`

Defined in: [packages/runtime/runtime-production/src/telemetry.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/telemetry.ts#L26)

#### Parameters

##### spanId

`string`

##### status?

`"OK"` \| `"ERROR"`

#### Returns

`void`

---

### getMetrics()

> **getMetrics**(): [`TelemetryMetrics`](../interfaces/TelemetryMetrics.md)

Defined in: [packages/runtime/runtime-production/src/telemetry.ts:48](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/telemetry.ts#L48)

#### Returns

[`TelemetryMetrics`](../interfaces/TelemetryMetrics.md)

---

### getSpans()

> **getSpans**(): [`TelemetrySpan`](../interfaces/TelemetrySpan.md)[]

Defined in: [packages/runtime/runtime-production/src/telemetry.ts:52](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/telemetry.ts#L52)

#### Returns

[`TelemetrySpan`](../interfaces/TelemetrySpan.md)[]

---

### incrementCounter()

> **incrementCounter**(`name`, `value?`): `void`

Defined in: [packages/runtime/runtime-production/src/telemetry.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/telemetry.ts#L34)

#### Parameters

##### name

`string`

##### value?

`number` = `1`

#### Returns

`void`

---

### recordHistogram()

> **recordHistogram**(`name`, `value`): `void`

Defined in: [packages/runtime/runtime-production/src/telemetry.ts:42](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/telemetry.ts#L42)

#### Parameters

##### name

`string`

##### value

`number`

#### Returns

`void`

---

### setGauge()

> **setGauge**(`name`, `value`): `void`

Defined in: [packages/runtime/runtime-production/src/telemetry.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/telemetry.ts#L38)

#### Parameters

##### name

`string`

##### value

`number`

#### Returns

`void`

---

### startSpan()

> **startSpan**(`name`, `traceId`, `parentSpanId?`): [`TelemetrySpan`](../interfaces/TelemetrySpan.md)

Defined in: [packages/runtime/runtime-production/src/telemetry.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/telemetry.ts#L12)

#### Parameters

##### name

`string`

##### traceId

`string`

##### parentSpanId?

`string`

#### Returns

[`TelemetrySpan`](../interfaces/TelemetrySpan.md)
