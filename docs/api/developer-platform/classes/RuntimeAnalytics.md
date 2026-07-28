[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / RuntimeAnalytics

# Class: RuntimeAnalytics

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:219](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L219)

## Constructors

### Constructor

> **new RuntimeAnalytics**(): `RuntimeAnalytics`

#### Returns

`RuntimeAnalytics`

## Methods

### getAll()

> **getAll**(): [`AnalyticsEntry`](../interfaces/AnalyticsEntry.md)[]

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:242](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L242)

#### Returns

[`AnalyticsEntry`](../interfaces/AnalyticsEntry.md)[]

---

### query()

> **query**(`metric`): [`AnalyticsEntry`](../interfaces/AnalyticsEntry.md)[]

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:238](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L238)

#### Parameters

##### metric

`string`

#### Returns

[`AnalyticsEntry`](../interfaces/AnalyticsEntry.md)[]

---

### record()

> **record**(`metric`, `value`): [`AnalyticsEntry`](../interfaces/AnalyticsEntry.md)

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:222](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L222)

#### Parameters

##### metric

`string`

##### value

`number`

#### Returns

[`AnalyticsEntry`](../interfaces/AnalyticsEntry.md)
