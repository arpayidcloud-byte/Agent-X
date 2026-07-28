[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [provider-qualification](../README.md) / QualificationRegistry

# Class: QualificationRegistry

Defined in: [packages/provider/provider-qualification/src/qualification-registry.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-qualification/src/qualification-registry.ts#L9)

## Constructors

### Constructor

> **new QualificationRegistry**(): `QualificationRegistry`

#### Returns

`QualificationRegistry`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/provider/provider-qualification/src/qualification-registry.ts:44](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-qualification/src/qualification-registry.ts#L44)

#### Returns

`void`

---

### isCertified()

> **isCertified**(`providerId`): `boolean`

Defined in: [packages/provider/provider-qualification/src/qualification-registry.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-qualification/src/qualification-registry.ts#L39)

#### Parameters

##### providerId

`string`

#### Returns

`boolean`

---

### listSnapshots()

> **listSnapshots**(): [`QualificationSnapshot`](../interfaces/QualificationSnapshot.md)[]

Defined in: [packages/provider/provider-qualification/src/qualification-registry.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-qualification/src/qualification-registry.ts#L35)

#### Returns

[`QualificationSnapshot`](../interfaces/QualificationSnapshot.md)[]

---

### register()

> **register**(`report`): `void`

Defined in: [packages/provider/provider-qualification/src/qualification-registry.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-qualification/src/qualification-registry.ts#L13)

#### Parameters

##### report

[`CertificationReport`](../interfaces/CertificationReport.md)

#### Returns

`void`

---

### resolve()

> **resolve**(`providerId`): [`CertificationReport`](../interfaces/CertificationReport.md) \| `undefined`

Defined in: [packages/provider/provider-qualification/src/qualification-registry.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-qualification/src/qualification-registry.ts#L27)

#### Parameters

##### providerId

`string`

#### Returns

[`CertificationReport`](../interfaces/CertificationReport.md) \| `undefined`

---

### saveSnapshot()

> **saveSnapshot**(`snapshot`): `void`

Defined in: [packages/provider/provider-qualification/src/qualification-registry.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-qualification/src/qualification-registry.ts#L31)

#### Parameters

##### snapshot

[`QualificationSnapshot`](../interfaces/QualificationSnapshot.md)

#### Returns

`void`

---

### unregister()

> **unregister**(`providerId`): `void`

Defined in: [packages/provider/provider-qualification/src/qualification-registry.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-qualification/src/qualification-registry.ts#L23)

#### Parameters

##### providerId

`string`

#### Returns

`void`
