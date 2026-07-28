[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [provider/provider-sdk/src](../README.md) / ProviderBuilder

# Class: ProviderBuilder\<T\>

Defined in: [packages/provider/provider-sdk/src/conformance/provider-builder.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/conformance/provider-builder.ts#L9)

## Type Parameters

### T

`T` _extends_ `IProvider`

## Constructors

### Constructor

> **new ProviderBuilder**\<`T`>>>>\>(): `ProviderBuilder`\<`T`>>>>\>

#### Returns

`ProviderBuilder`\<`T`\>

## Methods

### build()

> **build**(): `T`

Defined in: [packages/provider/provider-sdk/src/conformance/provider-builder.ts:36](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/conformance/provider-builder.ts#L36)

#### Returns

`T`

---

### configure()

> **configure**(`config`): `this`

Defined in: [packages/provider/provider-sdk/src/conformance/provider-builder.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/conformance/provider-builder.ts#L18)

#### Parameters

##### config

`ProviderConfiguration`

#### Returns

`this`

---

### create()

> **create**(`provider`): `this`

Defined in: [packages/provider/provider-sdk/src/conformance/provider-builder.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/conformance/provider-builder.ts#L13)

#### Parameters

##### provider

`T`

#### Returns

`this`

---

### getConfig()

> **getConfig**(): `ProviderConfiguration`

Defined in: [packages/provider/provider-sdk/src/conformance/provider-builder.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/conformance/provider-builder.ts#L23)

#### Returns

`ProviderConfiguration`

---

### getMetadata()

> **getMetadata**(): `ProviderMetadata`

Defined in: [packages/provider/provider-sdk/src/conformance/provider-builder.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/conformance/provider-builder.ts#L41)

#### Returns

`ProviderMetadata`

---

### validate()

> **validate**(): `Promise`\<`boolean`>>>>\>

Defined in: [packages/provider/provider-sdk/src/conformance/provider-builder.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/conformance/provider-builder.ts#L27)

#### Returns

`Promise`\<`boolean`\>
