[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / PackageRegistry

# Class: PackageRegistry

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:56](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L56)

## Constructors

### Constructor

> **new PackageRegistry**(): `PackageRegistry`

#### Returns

`PackageRegistry`

## Methods

### findByName()

> **findByName**(`name`): [`PackageEntry`](../interfaces/PackageEntry.md)[]

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:73](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L73)

#### Parameters

##### name

`string`

#### Returns

[`PackageEntry`](../interfaces/PackageEntry.md)[]

---

### get()

> **get**(`packageId`): [`PackageEntry`](../interfaces/PackageEntry.md) \| `undefined`

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:69](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L69)

#### Parameters

##### packageId

`string`

#### Returns

[`PackageEntry`](../interfaces/PackageEntry.md) \| `undefined`

---

### getAll()

> **getAll**(): [`PackageEntry`](../interfaces/PackageEntry.md)[]

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:77](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L77)

#### Returns

[`PackageEntry`](../interfaces/PackageEntry.md)[]

---

### publish()

> **publish**(`name`, `version`, `type`): [`PackageEntry`](../interfaces/PackageEntry.md)

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:59](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L59)

#### Parameters

##### name

`string`

##### version

`string`

##### type

`"SDK"` \| `"PLUGIN"` \| `"EXTENSION"` \| `"AGENT"` \| `"WORKFLOW"`

#### Returns

[`PackageEntry`](../interfaces/PackageEntry.md)
