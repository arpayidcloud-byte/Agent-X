[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-adapters](../README.md) / ProviderHealthMonitor

# Class: ProviderHealthMonitor

Defined in: [packages/runtime/runtime-adapters/src/provider-health.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-health.ts#L8)

## Constructors

### Constructor

> **new ProviderHealthMonitor**(): `ProviderHealthMonitor`

#### Returns

`ProviderHealthMonitor`

## Methods

### availability()

> **availability**(`providerId`): `number`

Defined in: [packages/runtime/runtime-adapters/src/provider-health.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-health.ts#L32)

#### Parameters

##### providerId

`string`

#### Returns

`number`

---

### failureCount()

> **failureCount**(`providerId`): `number`

Defined in: [packages/runtime/runtime-adapters/src/provider-health.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-health.ts#L39)

#### Parameters

##### providerId

`string`

#### Returns

`number`

---

### getHistory()

> **getHistory**(`providerId`): [`ProviderHealth`](../interfaces/ProviderHealth.md)[]

Defined in: [packages/runtime/runtime-adapters/src/provider-health.ts:51](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-health.ts#L51)

#### Parameters

##### providerId

`string`

#### Returns

[`ProviderHealth`](../interfaces/ProviderHealth.md)[]

---

### health()

> **health**(`provider`): `Promise`\<[`ProviderHealth`](../interfaces/ProviderHealth.md)>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/provider-health.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-health.ts#L11)

#### Parameters

##### provider

[`IProvider`](../interfaces/IProvider.md)

#### Returns

`Promise`\<[`ProviderHealth`](../interfaces/ProviderHealth.md)\>

---

### lastFailure()

> **lastFailure**(`providerId`): `Date` \| `undefined`

Defined in: [packages/runtime/runtime-adapters/src/provider-health.ts:44](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-health.ts#L44)

#### Parameters

##### providerId

`string`

#### Returns

`Date` \| `undefined`

---

### latency()

> **latency**(`providerId`): `number`

Defined in: [packages/runtime/runtime-adapters/src/provider-health.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-health.ts#L26)

#### Parameters

##### providerId

`string`

#### Returns

`number`

---

### ping()

> **ping**(`provider`): `Promise`\<`number`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/provider-health.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-health.ts#L20)

#### Parameters

##### provider

[`IProvider`](../interfaces/IProvider.md)

#### Returns

`Promise`\<`number`\>
