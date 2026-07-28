[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / VersionRegistry

# Class: VersionRegistry

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:123](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L123)

## Constructors

### Constructor

> **new VersionRegistry**(): `VersionRegistry`

#### Returns

`VersionRegistry`

## Methods

### get()

> **get**(`versionId`): [`VersionEntry`](../interfaces/VersionEntry.md) \| `undefined`

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:136](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L136)

#### Parameters

##### versionId

`string`

#### Returns

[`VersionEntry`](../interfaces/VersionEntry.md) \| `undefined`

---

### getAll()

> **getAll**(): [`VersionEntry`](../interfaces/VersionEntry.md)[]

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:144](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L144)

#### Returns

[`VersionEntry`](../interfaces/VersionEntry.md)[]

---

### getByPackage()

> **getByPackage**(`packageName`): [`VersionEntry`](../interfaces/VersionEntry.md)[]

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:140](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L140)

#### Parameters

##### packageName

`string`

#### Returns

[`VersionEntry`](../interfaces/VersionEntry.md)[]

---

### register()

> **register**(`packageName`, `version`): [`VersionEntry`](../interfaces/VersionEntry.md)

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:126](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L126)

#### Parameters

##### packageName

`string`

##### version

`string`

#### Returns

[`VersionEntry`](../interfaces/VersionEntry.md)
