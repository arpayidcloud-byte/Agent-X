[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [native-providers](../README.md) / OTELTelemetryProvider

# ~~Class: OTELTelemetryProvider~~

Defined in: [packages/provider/native-providers/src/providers/otel-telemetry.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/otel-telemetry.ts#L17)

## Implements

- `ITelemetryProvider`
- [`INativeProvider`](../interfaces/INativeProvider.md)

## Constructors

### Constructor

> **new OTELTelemetryProvider**(): `OTELTelemetryProvider`

#### Returns

`OTELTelemetryProvider`

## Properties

### ~~id~~

> **id**: `string` = `'otel-telemetry'`

Defined in: [packages/provider/native-providers/src/providers/otel-telemetry.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/otel-telemetry.ts#L18)

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`id`](../interfaces/INativeProvider.md#id)

---

### ~~name~~

> **name**: `string` = `'OpenTelemetry Provider'`

Defined in: [packages/provider/native-providers/src/providers/otel-telemetry.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/otel-telemetry.ts#L19)

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`name`](../interfaces/INativeProvider.md#name)

## Methods

### ~~connect()~~

> **connect**(): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/otel-telemetry.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/otel-telemetry.ts#L30)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`connect`](../interfaces/INativeProvider.md#connect)

---

### ~~disconnect()~~

> **disconnect**(): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/otel-telemetry.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/otel-telemetry.ts#L34)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`disconnect`](../interfaces/INativeProvider.md#disconnect)

---

### ~~endSpan()~~

> **endSpan**(`_spanId`, `_status?`): `void`

Defined in: [packages/provider/native-providers/src/providers/otel-telemetry.ts:71](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/otel-telemetry.ts#L71)

#### Parameters

##### \_spanId

`string`

##### \_status?

`"OK"` \| `"ERROR"`

#### Returns

`void`

#### Implementation of

`ITelemetryProvider.endSpan`

---

### ~~flush()~~

> **flush**(): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/otel-telemetry.ts:75](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/otel-telemetry.ts#L75)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`ITelemetryProvider.flush`

---

### ~~getCapabilities()~~

> **getCapabilities**(): `ProviderCapabilities`

Defined in: [packages/provider/native-providers/src/providers/otel-telemetry.ts:50](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/otel-telemetry.ts#L50)

#### Returns

`ProviderCapabilities`

#### Implementation of

`ITelemetryProvider.getCapabilities`

---

### ~~getHealth()~~

> **getHealth**(): `Promise`\<\{ `latencyMs`: `number`; `status`: `"UP"` \| `"DOWN"` \| `"DEGRADED"`; \}\>

Defined in: [packages/provider/native-providers/src/providers/otel-telemetry.ts:42](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/otel-telemetry.ts#L42)

#### Returns

`Promise`\<\{ `latencyMs`: `number`; `status`: `"UP"` \| `"DOWN"` \| `"DEGRADED"`; \}\>

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`getHealth`](../interfaces/INativeProvider.md#gethealth)

---

### ~~getMetadata()~~

> **getMetadata**(): `ProviderMetadata`

Defined in: [packages/provider/native-providers/src/providers/otel-telemetry.ts:46](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/otel-telemetry.ts#L46)

#### Returns

`ProviderMetadata`

#### Implementation of

`ITelemetryProvider.getMetadata`

---

### ~~getMetrics()~~

> **getMetrics**(): `ProviderMetrics`

Defined in: [packages/provider/native-providers/src/providers/otel-telemetry.ts:63](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/otel-telemetry.ts#L63)

#### Returns

`ProviderMetrics`

#### Implementation of

`ITelemetryProvider.getMetrics`

---

### ~~healthCheck()~~

> **healthCheck**(): `Promise`\<`ProviderHealth`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/otel-telemetry.ts:54](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/otel-telemetry.ts#L54)

#### Returns

`Promise`\<`ProviderHealth`\>

#### Implementation of

`ITelemetryProvider.healthCheck`

---

### ~~initialize()~~

> **initialize**(`config`): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/providers/otel-telemetry.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/otel-telemetry.ts#L23)

#### Parameters

##### config

[`IConfigurationProvider`](../interfaces/IConfigurationProvider.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`initialize`](../interfaces/INativeProvider.md#initialize)

---

### ~~isConnected()~~

> **isConnected**(): `boolean`

Defined in: [packages/provider/native-providers/src/providers/otel-telemetry.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/otel-telemetry.ts#L38)

#### Returns

`boolean`

#### Implementation of

[`INativeProvider`](../interfaces/INativeProvider.md).[`isConnected`](../interfaces/INativeProvider.md#isconnected)

---

### ~~recordCounter()~~

> **recordCounter**(`_name`, `_value?`): `void`

Defined in: [packages/provider/native-providers/src/providers/otel-telemetry.ts:72](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/otel-telemetry.ts#L72)

#### Parameters

##### \_name

`string`

##### \_value?

`number`

#### Returns

`void`

#### Implementation of

`ITelemetryProvider.recordCounter`

---

### ~~recordGauge()~~

> **recordGauge**(`_name`, `_value`): `void`

Defined in: [packages/provider/native-providers/src/providers/otel-telemetry.ts:74](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/otel-telemetry.ts#L74)

#### Parameters

##### \_name

`string`

##### \_value

`number`

#### Returns

`void`

#### Implementation of

`ITelemetryProvider.recordGauge`

---

### ~~recordHistogram()~~

> **recordHistogram**(`_name`, `_value`): `void`

Defined in: [packages/provider/native-providers/src/providers/otel-telemetry.ts:73](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/otel-telemetry.ts#L73)

#### Parameters

##### \_name

`string`

##### \_value

`number`

#### Returns

`void`

#### Implementation of

`ITelemetryProvider.recordHistogram`

---

### ~~startSpan()~~

> **startSpan**(`_name`, `_context?`): `string`

Defined in: [packages/provider/native-providers/src/providers/otel-telemetry.ts:67](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/providers/otel-telemetry.ts#L67)

#### Parameters

##### \_name

`string`

##### \_context?

`ProviderContext`

#### Returns

`string`

#### Implementation of

`ITelemetryProvider.startSpan`
