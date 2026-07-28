[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / RuntimeSupervisor

# Class: RuntimeSupervisor

Defined in: [packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts:65](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts#L65)

## Constructors

### Constructor

> **new RuntimeSupervisor**(): `RuntimeSupervisor`

#### Returns

`RuntimeSupervisor`

## Methods

### checkAll()

> **checkAll**(): [`HealthStatus`](../interfaces/HealthStatus.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts:76](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts#L76)

#### Returns

[`HealthStatus`](../interfaces/HealthStatus.md)[]

---

### isHealthy()

> **isHealthy**(): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts:84](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts#L84)

#### Returns

`boolean`

---

### register()

> **register**(`componentId`, `check`): `void`

Defined in: [packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts:68](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts#L68)

#### Parameters

##### componentId

`string`

##### check

() => [`HealthStatus`](../interfaces/HealthStatus.md)

#### Returns

`void`

---

### unregister()

> **unregister**(`componentId`): `void`

Defined in: [packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts:72](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/runtime/RuntimeManager.ts#L72)

#### Parameters

##### componentId

`string`

#### Returns

`void`
