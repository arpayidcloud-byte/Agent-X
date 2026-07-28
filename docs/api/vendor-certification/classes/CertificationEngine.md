[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [vendor-certification](../README.md) / CertificationEngine

# Class: CertificationEngine

Defined in: [packages/provider/vendor-certification/src/certification-engine.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/vendor-certification/src/certification-engine.ts#L23)

## Constructors

### Constructor

> **new CertificationEngine**(): `CertificationEngine`

#### Returns

`CertificationEngine`

## Properties

### history

> **history**: [`CertificationHistory`](CertificationHistory.md)

Defined in: [packages/provider/vendor-certification/src/certification-engine.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/vendor-certification/src/certification-engine.ts#L25)

---

### registry

> **registry**: [`ProviderRegistry`](ProviderRegistry.md)

Defined in: [packages/provider/vendor-certification/src/certification-engine.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/vendor-certification/src/certification-engine.ts#L24)

## Methods

### certify()

> **certify**(`provider`, `config`): `Promise`\<[`CertificationCertificate`](../interfaces/CertificationCertificate.md)>>>>\>

Defined in: [packages/provider/vendor-certification/src/certification-engine.ts:40](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/vendor-certification/src/certification-engine.ts#L40)

#### Parameters

##### provider

[`IProvider`](../interfaces/IProvider.md)

##### config

[`CertificationConfig`](../interfaces/CertificationConfig.md)

#### Returns

`Promise`\<[`CertificationCertificate`](../interfaces/CertificationCertificate.md)\>
