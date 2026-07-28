[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / DeveloperPlatformCoordinator

# Class: DeveloperPlatformCoordinator

Defined in: [packages/platform/developer-platform/src/application/coordinator/Coordinators.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/application/coordinator/Coordinators.ts#L16)

## Constructors

### Constructor

> **new DeveloperPlatformCoordinator**(`projects`, `packages`): `DeveloperPlatformCoordinator`

Defined in: [packages/platform/developer-platform/src/application/coordinator/Coordinators.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/application/coordinator/Coordinators.ts#L17)

#### Parameters

##### projects

[`DeveloperProjectManager`](DeveloperProjectManager.md)

##### packages

[`PackageRegistry`](PackageRegistry.md)

#### Returns

`DeveloperPlatformCoordinator`

## Methods

### createProject()

> **createProject**(`name`, `accountId`): `string`

Defined in: [packages/platform/developer-platform/src/application/coordinator/Coordinators.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/application/coordinator/Coordinators.ts#L22)

#### Parameters

##### name

`string`

##### accountId

`string`

#### Returns

`string`

---

### publishPackage()

> **publishPackage**(`name`, `version`): `string`

Defined in: [packages/platform/developer-platform/src/application/coordinator/Coordinators.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/application/coordinator/Coordinators.ts#L27)

#### Parameters

##### name

`string`

##### version

`string`

#### Returns

`string`
