[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [provider/provider-sdk/src](../README.md) / CostCalculator

# Class: CostCalculator

Defined in: [packages/provider/provider-sdk/src/metrics.ts:46](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/metrics.ts#L46)

## Constructors

### Constructor

> **new CostCalculator**(`customPricing?`): `CostCalculator`

Defined in: [packages/provider/provider-sdk/src/metrics.ts:49](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/metrics.ts#L49)

#### Parameters

##### customPricing?

`Record`\<`string`, `ModelMetadata`\>

#### Returns

`CostCalculator`

## Methods

### calculateCost()

> **calculateCost**(`providerId`, `modelId`, `usage`): `number`

Defined in: [packages/provider/provider-sdk/src/metrics.ts:67](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/metrics.ts#L67)

#### Parameters

##### providerId

`string`

##### modelId

`string`

##### usage

`TokenUsage`

#### Returns

`number`

---

### createMetrics()

> **createMetrics**(`traceId`, `requestId`, `providerId`, `modelId`, `latencyMs`, `usage`): `ProviderMetrics`

Defined in: [packages/provider/provider-sdk/src/metrics.ts:77](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/metrics.ts#L77)

#### Parameters

##### traceId

`string` \| `undefined`

##### requestId

`string`

##### providerId

`string`

##### modelId

`string`

##### latencyMs

`number`

##### usage

`TokenUsage`

#### Returns

`ProviderMetrics`

---

### getModelMetadata()

> **getModelMetadata**(`providerId`, `modelId`): `ModelMetadata` \| `undefined`

Defined in: [packages/provider/provider-sdk/src/metrics.ts:53](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/metrics.ts#L53)

#### Parameters

##### providerId

`string`

##### modelId

`string`

#### Returns

`ModelMetadata` \| `undefined`
