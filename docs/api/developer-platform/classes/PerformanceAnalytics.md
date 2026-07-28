[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / PerformanceAnalytics

# Class: PerformanceAnalytics

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:263](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L263)

## Constructors

### Constructor

> **new PerformanceAnalytics**(): `PerformanceAnalytics`

#### Returns

`PerformanceAnalytics`

## Methods

### getAll()

> **getAll**(): `Record`\<`string`, `number`[]\>

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:286](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L286)

#### Returns

`Record`\<`string`, `number`[]\>

---

### getAverage()

> **getAverage**(`operation`): `number`

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:272](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L272)

#### Parameters

##### operation

`string`

#### Returns

`number`

---

### getPercentile()

> **getPercentile**(`operation`, `percentile`): `number`

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:278](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L278)

#### Parameters

##### operation

`string`

##### percentile

`number`

#### Returns

`number`

---

### record()

> **record**(`operation`, `durationMs`): `void`

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:266](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L266)

#### Parameters

##### operation

`string`

##### durationMs

`number`

#### Returns

`void`
