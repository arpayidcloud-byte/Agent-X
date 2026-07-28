[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-adapters](../README.md) / ITelemetryProvider

# Interface: ITelemetryProvider

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:90](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L90)

## Extends

- [`IProvider`](IProvider.md)

## Methods

### endSpan()

> **endSpan**(`spanId`, `status?`): `void`

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:92](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L92)

#### Parameters

##### spanId

`string`

##### status?

`"OK"` \| `"ERROR"`

#### Returns

`void`

---

### flush()

> **flush**(): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:96](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L96)

#### Returns

`Promise`\<`void`\>

---

### getCapabilities()

> **getCapabilities**(): [`ProviderCapabilities`](ProviderCapabilities.md)

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:57](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L57)

#### Returns

[`ProviderCapabilities`](ProviderCapabilities.md)

#### Inherited from

[`IProvider`](IProvider.md).[`getCapabilities`](IProvider.md#getcapabilities)

---

### getMetadata()

> **getMetadata**(): [`ProviderMetadata`](ProviderMetadata.md)

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:56](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L56)

#### Returns

[`ProviderMetadata`](ProviderMetadata.md)

#### Inherited from

[`IProvider`](IProvider.md).[`getMetadata`](IProvider.md#getmetadata)

---

### getMetrics()

> **getMetrics**(): [`ProviderMetrics`](ProviderMetrics.md)

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:59](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L59)

#### Returns

[`ProviderMetrics`](ProviderMetrics.md)

#### Inherited from

[`IProvider`](IProvider.md).[`getMetrics`](IProvider.md#getmetrics)

---

### healthCheck()

> **healthCheck**(): `Promise`\<[`ProviderHealth`](ProviderHealth.md)>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:58](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L58)

#### Returns

`Promise`\<[`ProviderHealth`](ProviderHealth.md)\>

#### Inherited from

[`IProvider`](IProvider.md).[`healthCheck`](IProvider.md#healthcheck)

---

### recordCounter()

> **recordCounter**(`name`, `value?`): `void`

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:93](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L93)

#### Parameters

##### name

`string`

##### value?

`number`

#### Returns

`void`

---

### recordGauge()

> **recordGauge**(`name`, `value`): `void`

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:95](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L95)

#### Parameters

##### name

`string`

##### value

`number`

#### Returns

`void`

---

### recordHistogram()

> **recordHistogram**(`name`, `value`): `void`

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:94](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L94)

#### Parameters

##### name

`string`

##### value

`number`

#### Returns

`void`

---

### startSpan()

> **startSpan**(`name`, `context?`): `string`

Defined in: [packages/runtime/runtime-adapters/src/interfaces.ts:91](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/interfaces.ts#L91)

#### Parameters

##### name

`string`

##### context?

[`ProviderContext`](ProviderContext.md)

#### Returns

`string`
