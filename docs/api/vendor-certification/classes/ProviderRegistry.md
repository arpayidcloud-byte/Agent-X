[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [vendor-certification](../README.md) / ProviderRegistry

# Class: ProviderRegistry

Defined in: [packages/provider/vendor-certification/src/provider-registry.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/vendor-certification/src/provider-registry.ts#L9)

## Constructors

### Constructor

> **new ProviderRegistry**(): `ProviderRegistry`

#### Returns

`ProviderRegistry`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/provider/vendor-certification/src/provider-registry.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/vendor-certification/src/provider-registry.ts#L27)

#### Returns

`void`

---

### isRegistered()

> **isRegistered**(`providerId`): `boolean`

Defined in: [packages/provider/vendor-certification/src/provider-registry.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/vendor-certification/src/provider-registry.ts#L23)

#### Parameters

##### providerId

`string`

#### Returns

`boolean`

---

### register()

> **register**(`cert`): `void`

Defined in: [packages/provider/vendor-certification/src/provider-registry.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/vendor-certification/src/provider-registry.ts#L12)

#### Parameters

##### cert

[`CertificationCertificate`](../interfaces/CertificationCertificate.md)

#### Returns

`void`

---

### resolve()

> **resolve**(`providerId`): [`CertificationCertificate`](../interfaces/CertificationCertificate.md) \| `undefined`

Defined in: [packages/provider/vendor-certification/src/provider-registry.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/vendor-certification/src/provider-registry.ts#L19)

#### Parameters

##### providerId

`string`

#### Returns

[`CertificationCertificate`](../interfaces/CertificationCertificate.md) \| `undefined`
