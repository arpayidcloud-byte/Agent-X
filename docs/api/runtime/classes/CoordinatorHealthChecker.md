[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / CoordinatorHealthChecker

# Class: CoordinatorHealthChecker

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-health.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-health.ts#L8)

## Constructors

### Constructor

> **new CoordinatorHealthChecker**(): `CoordinatorHealthChecker`

#### Returns

`CoordinatorHealthChecker`

## Methods

### check()

> **check**(`component`): [`CoordinatorHealthStatus`](../interfaces/CoordinatorHealthStatus.md)

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-health.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-health.ts#L15)

#### Parameters

##### component

`string`

#### Returns

[`CoordinatorHealthStatus`](../interfaces/CoordinatorHealthStatus.md)

---

### checkAll()

> **checkAll**(): [`CoordinatorHealthStatus`](../interfaces/CoordinatorHealthStatus.md)[]

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-health.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-health.ts#L23)

#### Returns

[`CoordinatorHealthStatus`](../interfaces/CoordinatorHealthStatus.md)[]

---

### isHealthy()

> **isHealthy**(): `boolean`

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-health.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-health.ts#L27)

#### Returns

`boolean`

---

### register()

> **register**(`component`, `checkFn`): `void`

Defined in: [packages/runtime/runtime/src/coordinator/coordinator-health.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator-health.ts#L11)

#### Parameters

##### component

`string`

##### checkFn

() => [`CoordinatorHealthStatus`](../interfaces/CoordinatorHealthStatus.md)

#### Returns

`void`
