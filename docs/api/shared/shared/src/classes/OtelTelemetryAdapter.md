[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/shared/src](../README.md) / OtelTelemetryAdapter

# Class: OtelTelemetryAdapter

Defined in: [packages/shared/shared/src/telemetry/otel-adapter.ts:95](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/telemetry/otel-adapter.ts#L95)

OpenTelemetry-compatible ITelemetryProvider implementation.

Wire this to an actual OTel SDK by providing a custom span factory in the
constructor options. Without a factory, spans are collected in-memory and
can be retrieved via `getSpans()`.

## Implements

- [`ITelemetryProvider`](../interfaces/ITelemetryProvider.md)

## Constructors

### Constructor

> **new OtelTelemetryAdapter**(): `OtelTelemetryAdapter`

#### Returns

`OtelTelemetryAdapter`

## Methods

### getActiveSpan()

> **getActiveSpan**(): [`ISpan`](../interfaces/ISpan.md) \| `undefined`

Defined in: [packages/shared/shared/src/telemetry/otel-adapter.ts:109](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/telemetry/otel-adapter.ts#L109)

#### Returns

[`ISpan`](../interfaces/ISpan.md) \| `undefined`

#### Implementation of

[`ITelemetryProvider`](../interfaces/ITelemetryProvider.md).[`getActiveSpan`](../interfaces/ITelemetryProvider.md#getactivespan)

---

### getSpans()

> **getSpans**(): [`ISpan`](../interfaces/ISpan.md)[]

Defined in: [packages/shared/shared/src/telemetry/otel-adapter.ts:114](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/telemetry/otel-adapter.ts#L114)

Return all spans created by this adapter (for OTel export).

#### Returns

[`ISpan`](../interfaces/ISpan.md)[]

---

### startSpan()

> **startSpan**(`name`, `options?`): [`ISpan`](../interfaces/ISpan.md)

Defined in: [packages/shared/shared/src/telemetry/otel-adapter.ts:99](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/telemetry/otel-adapter.ts#L99)

#### Parameters

##### name

`string`

##### options?

###### attributes?

`Record`\<`string`, `string` \| `number` \| `boolean`\>

###### kind?

[`SpanKind`](../type-aliases/SpanKind.md)

#### Returns

[`ISpan`](../interfaces/ISpan.md)

#### Implementation of

[`ITelemetryProvider`](../interfaces/ITelemetryProvider.md).[`startSpan`](../interfaces/ITelemetryProvider.md#startspan)
