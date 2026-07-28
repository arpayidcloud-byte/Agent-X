[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / RemoteConfiguration

# Class: RemoteConfiguration

Defined in: [packages/platform/developer-platform/src/infrastructure/controlplane/ControlPlane.ts:42](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/controlplane/ControlPlane.ts#L42)

## Constructors

### Constructor

> **new RemoteConfiguration**(): `RemoteConfiguration`

#### Returns

`RemoteConfiguration`

## Methods

### get()

> **get**(`configId`): [`RemoteConfig`](../interfaces/RemoteConfig.md) \| `undefined`

Defined in: [packages/platform/developer-platform/src/infrastructure/controlplane/ControlPlane.ts:60](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/controlplane/ControlPlane.ts#L60)

#### Parameters

##### configId

`string`

#### Returns

[`RemoteConfig`](../interfaces/RemoteConfig.md) \| `undefined`

---

### getAll()

> **getAll**(): [`RemoteConfig`](../interfaces/RemoteConfig.md)[]

Defined in: [packages/platform/developer-platform/src/infrastructure/controlplane/ControlPlane.ts:64](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/controlplane/ControlPlane.ts#L64)

#### Returns

[`RemoteConfig`](../interfaces/RemoteConfig.md)[]

---

### set()

> **set**(`key`, `value`): [`RemoteConfig`](../interfaces/RemoteConfig.md)

Defined in: [packages/platform/developer-platform/src/infrastructure/controlplane/ControlPlane.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/controlplane/ControlPlane.ts#L45)

#### Parameters

##### key

`string`

##### value

`unknown`

#### Returns

[`RemoteConfig`](../interfaces/RemoteConfig.md)
