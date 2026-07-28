[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/shared/src](../README.md) / IMetricsProvider

# Interface: IMetricsProvider

Defined in: [packages/shared/shared/src/metrics/interfaces.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/metrics/interfaces.ts#L24)

## Methods

### incrementCounter()

> **incrementCounter**(`counter`, `increment?`, `tags?`): `void`

Defined in: [packages/shared/shared/src/metrics/interfaces.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/metrics/interfaces.ts#L26)

#### Parameters

##### counter

`string`

##### increment?

`number`

##### tags?

`Record`\<`string`, `string`\>

#### Returns

`void`

---

### recordHealth()

> **recordHealth**(`metrics`): `void`

Defined in: [packages/shared/shared/src/metrics/interfaces.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/metrics/interfaces.ts#L27)

#### Parameters

##### metrics

[`HealthMetrics`](HealthMetrics.md)

#### Returns

`void`

---

### recordPerformance()

> **recordPerformance**(`metric`, `value`, `tags?`): `void`

Defined in: [packages/shared/shared/src/metrics/interfaces.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/metrics/interfaces.ts#L25)

#### Parameters

##### metric

`string`

##### value

`number`

##### tags?

`Record`\<`string`, `string`\>

#### Returns

`void`
