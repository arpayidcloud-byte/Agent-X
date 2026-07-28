[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / DistributedVersionManager

# Class: DistributedVersionManager

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedVersionManager.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedVersionManager.ts#L8)

## Constructors

### Constructor

> **new DistributedVersionManager**(): `DistributedVersionManager`

#### Returns

`DistributedVersionManager`

## Methods

### deprecate()

> **deprecate**(`packageName`, `version`): `void`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedVersionManager.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedVersionManager.ts#L31)

#### Parameters

##### packageName

`string`

##### version

`string`

#### Returns

`void`

---

### getAll()

> **getAll**(): [`VersionInfo`](../interfaces/VersionInfo.md)[]

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedVersionManager.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedVersionManager.ts#L27)

#### Returns

[`VersionInfo`](../interfaces/VersionInfo.md)[]

---

### getVersion()

> **getVersion**(`packageName`): [`VersionInfo`](../interfaces/VersionInfo.md) \| `undefined`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedVersionManager.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedVersionManager.ts#L23)

#### Parameters

##### packageName

`string`

#### Returns

[`VersionInfo`](../interfaces/VersionInfo.md) \| `undefined`

---

### isCompatible()

> **isCompatible**(`packageName`, `version`): `boolean`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedVersionManager.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedVersionManager.ts#L15)

#### Parameters

##### packageName

`string`

##### version

`string`

#### Returns

`boolean`

---

### register()

> **register**(`info`): `void`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedVersionManager.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/governance/DistributedVersionManager.ts#L11)

#### Parameters

##### info

[`VersionInfo`](../interfaces/VersionInfo.md)

#### Returns

`void`
