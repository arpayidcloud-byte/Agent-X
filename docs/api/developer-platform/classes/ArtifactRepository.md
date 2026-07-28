[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / ArtifactRepository

# Class: ArtifactRepository

Defined in: [packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts:107](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts#L107)

## Constructors

### Constructor

> **new ArtifactRepository**(): `ArtifactRepository`

#### Returns

`ArtifactRepository`

## Methods

### delete()

> **delete**(`artifactId`): `boolean`

Defined in: [packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts:124](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts#L124)

#### Parameters

##### artifactId

`string`

#### Returns

`boolean`

---

### get()

> **get**(`artifactId`): [`ArtifactRepoEntry`](../interfaces/ArtifactRepoEntry.md) \| `undefined`

Defined in: [packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts:120](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts#L120)

#### Parameters

##### artifactId

`string`

#### Returns

[`ArtifactRepoEntry`](../interfaces/ArtifactRepoEntry.md) \| `undefined`

---

### getAll()

> **getAll**(): [`ArtifactRepoEntry`](../interfaces/ArtifactRepoEntry.md)[]

Defined in: [packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts:128](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts#L128)

#### Returns

[`ArtifactRepoEntry`](../interfaces/ArtifactRepoEntry.md)[]

---

### upload()

> **upload**(`name`, `type`, `size`): [`ArtifactRepoEntry`](../interfaces/ArtifactRepoEntry.md)

Defined in: [packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts:110](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts#L110)

#### Parameters

##### name

`string`

##### type

`string`

##### size

`number`

#### Returns

[`ArtifactRepoEntry`](../interfaces/ArtifactRepoEntry.md)
