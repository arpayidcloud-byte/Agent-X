[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [provider/provider-sdk/src](../README.md) / CircuitBreaker

# Class: CircuitBreaker

Defined in: [packages/provider/provider-sdk/src/resilience.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/resilience.ts#L9)

## Constructors

### Constructor

> **new CircuitBreaker**(`config`): `CircuitBreaker`

Defined in: [packages/provider/provider-sdk/src/resilience.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/resilience.ts#L14)

#### Parameters

##### config

`CircuitBreakerConfig`

#### Returns

`CircuitBreaker`

## Methods

### isOpen()

> **isOpen**(): `boolean`

Defined in: [packages/provider/provider-sdk/src/resilience.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/resilience.ts#L18)

#### Returns

`boolean`

---

### recordFailure()

> **recordFailure**(): `void`

Defined in: [packages/provider/provider-sdk/src/resilience.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/resilience.ts#L33)

#### Returns

`void`

---

### recordSuccess()

> **recordSuccess**(): `void`

Defined in: [packages/provider/provider-sdk/src/resilience.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/resilience.ts#L29)

#### Returns

`void`
