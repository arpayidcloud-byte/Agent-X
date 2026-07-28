[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / ArtifactRegistry

# Class: ArtifactRegistry

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:90](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L90)

## Constructors

### Constructor

> **new ArtifactRegistry**(): `ArtifactRegistry`

#### Returns

`ArtifactRegistry`

## Methods

### delete()

> **delete**(`artifactId`): `boolean`

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:107](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L107)

#### Parameters

##### artifactId

`string`

#### Returns

`boolean`

---

### get()

> **get**(`artifactId`): [`ArtifactEntry`](../interfaces/ArtifactEntry.md) \| `undefined`

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:103](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L103)

#### Parameters

##### artifactId

`string`

#### Returns

[`ArtifactEntry`](../interfaces/ArtifactEntry.md) \| `undefined`

---

### getAll()

> **getAll**(): [`ArtifactEntry`](../interfaces/ArtifactEntry.md)[]

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:111](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L111)

#### Returns

[`ArtifactEntry`](../interfaces/ArtifactEntry.md)[]

---

### upload()

> **upload**(`name`, `type`, `size`): [`ArtifactEntry`](../interfaces/ArtifactEntry.md)

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:93](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L93)

#### Parameters

##### name

`string`

##### type

`string`

##### size

`number`

#### Returns

[`ArtifactEntry`](../interfaces/ArtifactEntry.md)
