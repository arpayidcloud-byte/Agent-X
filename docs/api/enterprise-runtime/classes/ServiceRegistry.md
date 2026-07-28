[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / ServiceRegistry

# Class: ServiceRegistry

Defined in: [packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts#L13)

## Constructors

### Constructor

> **new ServiceRegistry**(): `ServiceRegistry`

#### Returns

`ServiceRegistry`

## Methods

### findByName()

> **findByName**(`name`): [`ServiceEntry`](../interfaces/ServiceEntry.md) \| `undefined`

Defined in: [packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts#L45)

#### Parameters

##### name

`string`

#### Returns

[`ServiceEntry`](../interfaces/ServiceEntry.md) \| `undefined`

---

### get()

> **get**(`serviceId`): [`ServiceEntry`](../interfaces/ServiceEntry.md) \| `undefined`

Defined in: [packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts#L37)

#### Parameters

##### serviceId

`string`

#### Returns

[`ServiceEntry`](../interfaces/ServiceEntry.md) \| `undefined`

---

### getAll()

> **getAll**(): [`ServiceEntry`](../interfaces/ServiceEntry.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts#L41)

#### Returns

[`ServiceEntry`](../interfaces/ServiceEntry.md)[]

---

### register()

> **register**(`name`, `version`): [`ServiceEntry`](../interfaces/ServiceEntry.md)

Defined in: [packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts#L16)

#### Parameters

##### name

`string`

##### version

`string`

#### Returns

[`ServiceEntry`](../interfaces/ServiceEntry.md)

---

### unregister()

> **unregister**(`serviceId`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts#L33)

#### Parameters

##### serviceId

`string`

#### Returns

`boolean`
