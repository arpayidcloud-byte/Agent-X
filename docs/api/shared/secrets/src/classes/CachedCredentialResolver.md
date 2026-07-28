[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/secrets/src](../README.md) / CachedCredentialResolver

# Class: CachedCredentialResolver

Defined in: [packages/shared/secrets/src/resolver.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/resolver.ts#L8)

## Implements

- [`CredentialResolver`](../interfaces/CredentialResolver.md)

## Constructors

### Constructor

> **new CachedCredentialResolver**(`store`, `config?`): `CachedCredentialResolver`

Defined in: [packages/shared/secrets/src/resolver.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/resolver.ts#L14)

#### Parameters

##### store

[`SecretStore`](../interfaces/SecretStore.md)

##### config?

[`CredentialResolverConfig`](../interfaces/CredentialResolverConfig.md) = `...`

#### Returns

`CachedCredentialResolver`

## Methods

### invalidate()

> **invalidate**(`logicalKey`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/secrets/src/resolver.ts:76](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/resolver.ts#L76)

#### Parameters

##### logicalKey

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`CredentialResolver`](../interfaces/CredentialResolver.md).[`invalidate`](../interfaces/CredentialResolver.md#invalidate)

---

### invalidateAll()

> **invalidateAll**(): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/secrets/src/resolver.ts:83](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/resolver.ts#L83)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`CredentialResolver`](../interfaces/CredentialResolver.md).[`invalidateAll`](../interfaces/CredentialResolver.md#invalidateall)

---

### resolve()

> **resolve**(`logicalKey`): `Promise`\<`string`>>>>\>

Defined in: [packages/shared/secrets/src/resolver.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/resolver.ts#L27)

#### Parameters

##### logicalKey

`string`

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`CredentialResolver`](../interfaces/CredentialResolver.md).[`resolve`](../interfaces/CredentialResolver.md#resolve)

---

### resolveMetadata()

> **resolveMetadata**(`logicalKey`): `Promise`\<[`SecretMetadata`](../interfaces/SecretMetadata.md) \| `undefined`>>>>\>

Defined in: [packages/shared/secrets/src/resolver.ts:60](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/resolver.ts#L60)

#### Parameters

##### logicalKey

`string`

#### Returns

`Promise`\<[`SecretMetadata`](../interfaces/SecretMetadata.md) \| `undefined`\>

#### Implementation of

[`CredentialResolver`](../interfaces/CredentialResolver.md).[`resolveMetadata`](../interfaces/CredentialResolver.md#resolvemetadata)

---

### resolveRedacted()

> **resolveRedacted**(`logicalKey`): `Promise`\<[`RedactedString`](RedactedString.md)>>>>\>

Defined in: [packages/shared/secrets/src/resolver.ts:55](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/resolver.ts#L55)

#### Parameters

##### logicalKey

`string`

#### Returns

`Promise`\<[`RedactedString`](RedactedString.md)\>
