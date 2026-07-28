[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / RuntimeHealthService

# Class: RuntimeHealthService

Defined in: [packages/runtime/runtime/src/runtime-health-v2.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-health-v2.ts#L22)

## Constructors

### Constructor

> **new RuntimeHealthService**(): `RuntimeHealthService`

#### Returns

`RuntimeHealthService`

## Methods

### checkAll()

> **checkAll**(): `Promise`\<[`RuntimeHealthReport`](../interfaces/RuntimeHealthReport.md)>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-health-v2.ts:47](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-health-v2.ts#L47)

#### Returns

`Promise`\<[`RuntimeHealthReport`](../interfaces/RuntimeHealthReport.md)\>

---

### checkComponent()

> **checkComponent**(`component`): `Promise`\<[`HealthCheckResult`](../interfaces/HealthCheckResult.md)>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-health-v2.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-health-v2.ts#L31)

#### Parameters

##### component

`string`

#### Returns

`Promise`\<[`HealthCheckResult`](../interfaces/HealthCheckResult.md)\>

---

### getLastResults()

> **getLastResults**(): `Map`\<`string`, [`HealthCheckResult`](../interfaces/HealthCheckResult.md)>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-health-v2.ts:60](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-health-v2.ts#L60)

#### Returns

`Map`\<`string`, [`HealthCheckResult`](../interfaces/HealthCheckResult.md)\>

---

### registerCheck()

> **registerCheck**(`component`, `checkFn`): `void`

Defined in: [packages/runtime/runtime/src/runtime-health-v2.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-health-v2.ts#L27)

#### Parameters

##### component

`string`

##### checkFn

() => `Promise`\<[`HealthCheckResult`](../interfaces/HealthCheckResult.md)\>

#### Returns

`void`
