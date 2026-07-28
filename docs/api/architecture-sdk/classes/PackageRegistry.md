[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [architecture-sdk](../README.md) / PackageRegistry

# Class: PackageRegistry

Defined in: [packages/quality/architecture-sdk/src/package-registry.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/quality/architecture-sdk/src/package-registry.ts#L8)

## Constructors

### Constructor

> **new PackageRegistry**(): `PackageRegistry`

#### Returns

`PackageRegistry`

## Methods

### get()

> **get**(`id`): [`PackageMetadata`](../interfaces/PackageMetadata.md) \| `undefined`

Defined in: [packages/quality/architecture-sdk/src/package-registry.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/quality/architecture-sdk/src/package-registry.ts#L15)

#### Parameters

##### id

`string`

#### Returns

[`PackageMetadata`](../interfaces/PackageMetadata.md) \| `undefined`

---

### getAll()

> **getAll**(): [`PackageMetadata`](../interfaces/PackageMetadata.md)[]

Defined in: [packages/quality/architecture-sdk/src/package-registry.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/quality/architecture-sdk/src/package-registry.ts#L19)

#### Returns

[`PackageMetadata`](../interfaces/PackageMetadata.md)[]

---

### register()

> **register**(`pkg`): `void`

Defined in: [packages/quality/architecture-sdk/src/package-registry.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/quality/architecture-sdk/src/package-registry.ts#L11)

#### Parameters

##### pkg

[`PackageMetadata`](../interfaces/PackageMetadata.md)

#### Returns

`void`
