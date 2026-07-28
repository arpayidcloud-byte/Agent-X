[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-adapters](../README.md) / ProviderFailoverManager

# Class: ProviderFailoverManager

Defined in: [packages/runtime/runtime-adapters/src/provider-failover.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-failover.ts#L8)

## Constructors

### Constructor

> **new ProviderFailoverManager**(): `ProviderFailoverManager`

#### Returns

`ProviderFailoverManager`

## Methods

### getPrimary()

> **getPrimary**(): [`IProvider`](../interfaces/IProvider.md) \| `null`

Defined in: [packages/runtime/runtime-adapters/src/provider-failover.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-failover.ts#L45)

#### Returns

[`IProvider`](../interfaces/IProvider.md) \| `null`

---

### getSecondary()

> **getSecondary**(): [`IProvider`](../interfaces/IProvider.md) \| `null`

Defined in: [packages/runtime/runtime-adapters/src/provider-failover.ts:49](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-failover.ts#L49)

#### Returns

[`IProvider`](../interfaces/IProvider.md) \| `null`

---

### monitorPrimary()

> **monitorPrimary**(`provider`): `void`

Defined in: [packages/runtime/runtime-adapters/src/provider-failover.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-failover.ts#L12)

#### Parameters

##### provider

[`IProvider`](../interfaces/IProvider.md)

#### Returns

`void`

---

### monitorSecondary()

> **monitorSecondary**(`provider`): `void`

Defined in: [packages/runtime/runtime-adapters/src/provider-failover.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-failover.ts#L16)

#### Parameters

##### provider

[`IProvider`](../interfaces/IProvider.md)

#### Returns

`void`

---

### promoteSecondary()

> **promoteSecondary**(): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/provider-failover.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-failover.ts#L30)

#### Returns

`Promise`\<`void`\>

---

### recover()

> **recover**(): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/provider-failover.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-failover.ts#L41)

#### Returns

`Promise`\<`void`\>

---

### rollback()

> **rollback**(): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/provider-failover.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-failover.ts#L37)

#### Returns

`Promise`\<`void`\>

---

### switchProvider()

> **switchProvider**(): `Promise`\<[`IProvider`](../interfaces/IProvider.md)>>>>\>

Defined in: [packages/runtime/runtime-adapters/src/provider-failover.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-adapters/src/provider-failover.ts#L20)

#### Returns

`Promise`\<[`IProvider`](../interfaces/IProvider.md)\>
