[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / APISpecManager

# Class: APISpecManager

Defined in: [packages/platform/developer-platform/src/domain/sdk/SDKManager.ts:88](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/sdk/SDKManager.ts#L88)

## Constructors

### Constructor

> **new APISpecManager**(): `APISpecManager`

#### Returns

`APISpecManager`

## Methods

### create()

> **create**(`title`, `version`, `endpoints`): [`APISpec`](../interfaces/APISpec.md)

Defined in: [packages/platform/developer-platform/src/domain/sdk/SDKManager.ts:91](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/sdk/SDKManager.ts#L91)

#### Parameters

##### title

`string`

##### version

`string`

##### endpoints

[`APIEndpoint`](../interfaces/APIEndpoint.md)[]

#### Returns

[`APISpec`](../interfaces/APISpec.md)

---

### get()

> **get**(`specId`): [`APISpec`](../interfaces/APISpec.md) \| `undefined`

Defined in: [packages/platform/developer-platform/src/domain/sdk/SDKManager.ts:107](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/sdk/SDKManager.ts#L107)

#### Parameters

##### specId

`string`

#### Returns

[`APISpec`](../interfaces/APISpec.md) \| `undefined`

---

### getAll()

> **getAll**(): [`APISpec`](../interfaces/APISpec.md)[]

Defined in: [packages/platform/developer-platform/src/domain/sdk/SDKManager.ts:111](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/sdk/SDKManager.ts#L111)

#### Returns

[`APISpec`](../interfaces/APISpec.md)[]
