[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/shared/src](../README.md) / ITelemetryProvider

# Interface: ITelemetryProvider

Defined in: [packages/shared/shared/src/telemetry/interfaces.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/telemetry/interfaces.ts#L16)

An abstraction layer over OpenTelemetry.
Allows business logic to create spans without importing `@opentelemetry/api`.

## Methods

### getActiveSpan()

> **getActiveSpan**(): [`ISpan`](ISpan.md) \| `undefined`

Defined in: [packages/shared/shared/src/telemetry/interfaces.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/telemetry/interfaces.ts#L21)

#### Returns

[`ISpan`](ISpan.md) \| `undefined`

---

### startSpan()

> **startSpan**(`name`, `options?`): [`ISpan`](ISpan.md)

Defined in: [packages/shared/shared/src/telemetry/interfaces.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/telemetry/interfaces.ts#L17)

#### Parameters

##### name

`string`

##### options?

###### attributes?

`Record`\<`string`, `string` \| `number` \| `boolean`\>

###### kind?

[`SpanKind`](../type-aliases/SpanKind.md)

#### Returns

[`ISpan`](ISpan.md)
