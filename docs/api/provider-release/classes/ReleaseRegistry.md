[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [provider-release](../README.md) / ReleaseRegistry

# Class: ReleaseRegistry

Defined in: [packages/provider/provider-release/src/release-registry.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/release-registry.ts#L9)

## Constructors

### Constructor

> **new ReleaseRegistry**(): `ReleaseRegistry`

#### Returns

`ReleaseRegistry`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/provider/provider-release/src/release-registry.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/release-registry.ts#L31)

#### Returns

`void`

---

### isReleaseCompatible()

> **isReleaseCompatible**(`providerId`): `boolean`

Defined in: [packages/provider/provider-release/src/release-registry.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/release-registry.ts#L26)

#### Parameters

##### providerId

`string`

#### Returns

`boolean`

---

### register()

> **register**(`manifest`): `void`

Defined in: [packages/provider/provider-release/src/release-registry.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/release-registry.ts#L12)

#### Parameters

##### manifest

[`ReleaseManifest`](../interfaces/ReleaseManifest.md)

#### Returns

`void`

---

### resolve()

> **resolve**(`providerId`): [`ReleaseManifest`](../interfaces/ReleaseManifest.md) \| `undefined`

Defined in: [packages/provider/provider-release/src/release-registry.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/release-registry.ts#L22)

#### Parameters

##### providerId

`string`

#### Returns

[`ReleaseManifest`](../interfaces/ReleaseManifest.md) \| `undefined`
