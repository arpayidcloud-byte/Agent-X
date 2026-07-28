[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / ServiceDiscovery

# Class: ServiceDiscovery

Defined in: [packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts:53](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts#L53)

## Constructors

### Constructor

> **new ServiceDiscovery**(`registry`): `ServiceDiscovery`

Defined in: [packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts:54](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts#L54)

#### Parameters

##### registry

[`ServiceRegistry`](ServiceRegistry.md)

#### Returns

`ServiceDiscovery`

## Methods

### discover()

> **discover**(`name`): [`ServiceEntry`](../interfaces/ServiceEntry.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts:56](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts#L56)

#### Parameters

##### name

`string`

#### Returns

[`ServiceEntry`](../interfaces/ServiceEntry.md)[]

---

### discoverAll()

> **discoverAll**(): [`ServiceEntry`](../interfaces/ServiceEntry.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts:60](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts#L60)

#### Returns

[`ServiceEntry`](../interfaces/ServiceEntry.md)[]
