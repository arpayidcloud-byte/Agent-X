[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-production](../README.md) / CircuitBreaker

# Class: CircuitBreaker

Defined in: [packages/runtime/runtime-production/src/circuit-breaker.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/circuit-breaker.ts#L9)

## Constructors

### Constructor

> **new CircuitBreaker**(`config`): `CircuitBreaker`

Defined in: [packages/runtime/runtime-production/src/circuit-breaker.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/circuit-breaker.ts#L18)

#### Parameters

##### config

[`CircuitBreakerConfig`](../interfaces/CircuitBreakerConfig.md)

#### Returns

`CircuitBreaker`

## Methods

### execute()

> **execute**\<`T`>>>>\>(`operation`): `Promise`\<`T`>>>>\>

Defined in: [packages/runtime/runtime-production/src/circuit-breaker.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/circuit-breaker.ts#L22)

#### Type Parameters

##### T

`T`

#### Parameters

##### operation

() => `Promise`\<`T`\>

#### Returns

`Promise`\<`T`\>

---

### getMetrics()

> **getMetrics**(): [`CircuitBreakerMetrics`](../interfaces/CircuitBreakerMetrics.md)

Defined in: [packages/runtime/runtime-production/src/circuit-breaker.ts:66](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/circuit-breaker.ts#L66)

#### Returns

[`CircuitBreakerMetrics`](../interfaces/CircuitBreakerMetrics.md)

---

### reset()

> **reset**(): `void`

Defined in: [packages/runtime/runtime-production/src/circuit-breaker.ts:76](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/circuit-breaker.ts#L76)

#### Returns

`void`
