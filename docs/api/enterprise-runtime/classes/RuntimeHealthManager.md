[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / RuntimeHealthManager

# Class: RuntimeHealthManager

Defined in: [packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts:89](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts#L89)

## Constructors

### Constructor

> **new RuntimeHealthManager**(): `RuntimeHealthManager`

#### Returns

`RuntimeHealthManager`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts:108](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts#L108)

#### Returns

`void`

---

### get()

> **get**(`componentId`): [`HealthStatus`](../interfaces/HealthStatus.md) \| `undefined`

Defined in: [packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts:96](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts#L96)

#### Parameters

##### componentId

`string`

#### Returns

[`HealthStatus`](../interfaces/HealthStatus.md) \| `undefined`

---

### getAll()

> **getAll**(): [`HealthStatus`](../interfaces/HealthStatus.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts:100](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts#L100)

#### Returns

[`HealthStatus`](../interfaces/HealthStatus.md)[]

---

### isHealthy()

> **isHealthy**(): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts:104](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts#L104)

#### Returns

`boolean`

---

### update()

> **update**(`status`): `void`

Defined in: [packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts:92](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts#L92)

#### Parameters

##### status

[`HealthStatus`](../interfaces/HealthStatus.md)

#### Returns

`void`
