[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / HealthChecker

# Class: HealthChecker

Defined in: [packages/runtime/runtime/src/runtime-health.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-health.ts#L8)

## Constructors

### Constructor

> **new HealthChecker**(): `HealthChecker`

#### Returns

`HealthChecker`

## Methods

### check()

> **check**(`component`): [`HealthStatus`](../interfaces/HealthStatus.md)

Defined in: [packages/runtime/runtime/src/runtime-health.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-health.ts#L25)

Checks health of a specific component

#### Parameters

##### component

`string`

Component name

#### Returns

[`HealthStatus`](../interfaces/HealthStatus.md)

HealthStatus

---

### checkAll()

> **checkAll**(): [`HealthStatus`](../interfaces/HealthStatus.md)[]

Defined in: [packages/runtime/runtime/src/runtime-health.ts:42](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-health.ts#L42)

Checks all components

#### Returns

[`HealthStatus`](../interfaces/HealthStatus.md)[]

Array of HealthStatus

---

### isHealthy()

> **isHealthy**(): `boolean`

Defined in: [packages/runtime/runtime/src/runtime-health.ts:54](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-health.ts#L54)

Checks if all components are healthy

#### Returns

`boolean`

true if all healthy

---

### register()

> **register**(`component`, `checkFn`): `void`

Defined in: [packages/runtime/runtime/src/runtime-health.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-health.ts#L16)

Registers a health check

#### Parameters

##### component

`string`

Component name

##### checkFn

() => [`HealthStatus`](../interfaces/HealthStatus.md)

Health check function

#### Returns

`void`
