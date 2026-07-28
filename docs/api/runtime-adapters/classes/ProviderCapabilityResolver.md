[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-adapters](../README.md) / ProviderCapabilityResolver

# Class: ProviderCapabilityResolver

Defined in: [packages/runtime/runtime-adapters/src/provider-capability.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-capability.ts#L9)

## Constructors

### Constructor

> **new ProviderCapabilityResolver**(): `ProviderCapabilityResolver`

#### Returns

`ProviderCapabilityResolver`

## Methods

### supportsDistributedLocks()

> **supportsDistributedLocks**(`capabilities`): `boolean`

Defined in: [packages/runtime/runtime-adapters/src/provider-capability.ts:60](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-capability.ts#L60)

#### Parameters

##### capabilities

[`ProviderCapabilities`](../interfaces/ProviderCapabilities.md)

#### Returns

`boolean`

---

### supportsLeaderElection()

> **supportsLeaderElection**(`capabilities`): `boolean`

Defined in: [packages/runtime/runtime-adapters/src/provider-capability.ts:64](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-capability.ts#L64)

#### Parameters

##### capabilities

[`ProviderCapabilities`](../interfaces/ProviderCapabilities.md)

#### Returns

`boolean`

---

### supportsPriorityQueue()

> **supportsPriorityQueue**(`capabilities`): `boolean`

Defined in: [packages/runtime/runtime-adapters/src/provider-capability.ts:56](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-capability.ts#L56)

#### Parameters

##### capabilities

[`ProviderCapabilities`](../interfaces/ProviderCapabilities.md)

#### Returns

`boolean`

---

### supportsSecretRotation()

> **supportsSecretRotation**(`capabilities`): `boolean`

Defined in: [packages/runtime/runtime-adapters/src/provider-capability.ts:72](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-capability.ts#L72)

#### Parameters

##### capabilities

[`ProviderCapabilities`](../interfaces/ProviderCapabilities.md)

#### Returns

`boolean`

---

### supportsTelemetry()

> **supportsTelemetry**(`capabilities`): `boolean`

Defined in: [packages/runtime/runtime-adapters/src/provider-capability.ts:68](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-capability.ts#L68)

#### Parameters

##### capabilities

[`ProviderCapabilities`](../interfaces/ProviderCapabilities.md)

#### Returns

`boolean`

---

### supportsTransactions()

> **supportsTransactions**(`capabilities`): `boolean`

Defined in: [packages/runtime/runtime-adapters/src/provider-capability.ts:52](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-capability.ts#L52)

#### Parameters

##### capabilities

[`ProviderCapabilities`](../interfaces/ProviderCapabilities.md)

#### Returns

`boolean`

---

### validateCapabilities()

> **validateCapabilities**(`required`, `actual`): `void`

Defined in: [packages/runtime/runtime-adapters/src/provider-capability.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-capability.ts#L10)

#### Parameters

##### required

`Partial`\<[`ProviderCapabilities`](../interfaces/ProviderCapabilities.md)\>

##### actual

[`ProviderCapabilities`](../interfaces/ProviderCapabilities.md)

#### Returns

`void`
