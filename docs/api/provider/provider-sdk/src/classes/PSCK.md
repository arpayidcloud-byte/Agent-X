[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [provider/provider-sdk/src](../README.md) / PSCK

# Class: PSCK

Defined in: [packages/provider/provider-sdk/src/conformance/sdk.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/conformance/sdk.ts#L14)

## Constructors

### Constructor

> **new PSCK**(): `PSCK`

#### Returns

`PSCK`

## Methods

### packageBundle()

> **packageBundle**(`manifest`, `report`): [`ProviderBundle`](../interfaces/ProviderBundle.md)

Defined in: [packages/provider/provider-sdk/src/conformance/sdk.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/conformance/sdk.ts#L33)

#### Parameters

##### manifest

[`ProviderManifest`](../interfaces/ProviderManifest.md)

##### report

[`ConformanceReport`](../interfaces/ConformanceReport.md)

#### Returns

[`ProviderBundle`](../interfaces/ProviderBundle.md)

---

### validateAndRun()

> **validateAndRun**(`provider`, `manifest`): `Promise`\<[`ConformanceReport`](../interfaces/ConformanceReport.md)>>>>\>

Defined in: [packages/provider/provider-sdk/src/conformance/sdk.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/conformance/sdk.ts#L19)

#### Parameters

##### provider

`IProvider`

##### manifest

[`ProviderManifest`](../interfaces/ProviderManifest.md)

#### Returns

`Promise`\<[`ConformanceReport`](../interfaces/ConformanceReport.md)\>
