[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / APICoordinator

# Class: APICoordinator

Defined in: [packages/platform/developer-platform/src/application/coordinator/Coordinators.ts:50](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/application/coordinator/Coordinators.ts#L50)

## Constructors

### Constructor

> **new APICoordinator**(`specManager`, `openAPI`, `clientGen`): `APICoordinator`

Defined in: [packages/platform/developer-platform/src/application/coordinator/Coordinators.ts:51](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/application/coordinator/Coordinators.ts#L51)

#### Parameters

##### specManager

[`APISpecManager`](APISpecManager.md)

##### openAPI

[`OpenAPIGenerator`](OpenAPIGenerator.md)

##### clientGen

[`ClientGenerator`](ClientGenerator.md)

#### Returns

`APICoordinator`

## Methods

### createAPI()

> **createAPI**(`title`, `version`): `string`

Defined in: [packages/platform/developer-platform/src/application/coordinator/Coordinators.ts:57](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/application/coordinator/Coordinators.ts#L57)

#### Parameters

##### title

`string`

##### version

`string`

#### Returns

`string`

---

### generateClient()

> **generateClient**(`language`, `specId`): `string`

Defined in: [packages/platform/developer-platform/src/application/coordinator/Coordinators.ts:69](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/application/coordinator/Coordinators.ts#L69)

#### Parameters

##### language

`string`

##### specId

`string`

#### Returns

`string`

---

### generateDocs()

> **generateDocs**(`specId`): `string`

Defined in: [packages/platform/developer-platform/src/application/coordinator/Coordinators.ts:62](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/application/coordinator/Coordinators.ts#L62)

#### Parameters

##### specId

`string`

#### Returns

`string`
