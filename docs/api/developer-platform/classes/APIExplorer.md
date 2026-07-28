[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / APIExplorer

# Class: APIExplorer

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L41)

## Constructors

### Constructor

> **new APIExplorer**(): `APIExplorer`

#### Returns

`APIExplorer`

## Methods

### addEndpoint()

> **addEndpoint**(`method`, `path`, `description`): [`ExplorerEndpoint`](../interfaces/ExplorerEndpoint.md)

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:44](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L44)

#### Parameters

##### method

`string`

##### path

`string`

##### description

`string`

#### Returns

[`ExplorerEndpoint`](../interfaces/ExplorerEndpoint.md)

---

### getAll()

> **getAll**(): [`ExplorerEndpoint`](../interfaces/ExplorerEndpoint.md)[]

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:64](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L64)

#### Returns

[`ExplorerEndpoint`](../interfaces/ExplorerEndpoint.md)[]

---

### getEndpoint()

> **getEndpoint**(`endpointId`): [`ExplorerEndpoint`](../interfaces/ExplorerEndpoint.md) \| `undefined`

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:60](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L60)

#### Parameters

##### endpointId

`string`

#### Returns

[`ExplorerEndpoint`](../interfaces/ExplorerEndpoint.md) \| `undefined`
