[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / HealthEndpoint

# Class: HealthEndpoint

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts:230](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts#L230)

## Constructors

### Constructor

> **new HealthEndpoint**(): `HealthEndpoint`

#### Returns

`HealthEndpoint`

## Methods

### check()

> **check**(`component`, `status`, `latencyMs`): [`HealthCheckResult`](../interfaces/HealthCheckResult.md)

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts:233](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts#L233)

#### Parameters

##### component

`string`

##### status

`"DEGRADED"` \| `"UP"` \| `"DOWN"`

##### latencyMs

`number`

#### Returns

[`HealthCheckResult`](../interfaces/HealthCheckResult.md)

---

### getResults()

> **getResults**(): [`HealthCheckResult`](../interfaces/HealthCheckResult.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts:248](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts#L248)

#### Returns

[`HealthCheckResult`](../interfaces/HealthCheckResult.md)[]

---

### isHealthy()

> **isHealthy**(): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts:252](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts#L252)

#### Returns

`boolean`
