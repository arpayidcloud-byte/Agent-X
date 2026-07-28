[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/secrets/src](../README.md) / CredentialResolver

# Interface: CredentialResolver

Defined in: [packages/shared/secrets/src/interfaces.ts:36](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/interfaces.ts#L36)

## Methods

### invalidate()

> **invalidate**(`logicalKey`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/secrets/src/interfaces.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/interfaces.ts#L39)

#### Parameters

##### logicalKey

`string`

#### Returns

`Promise`\<`void`\>

---

### invalidateAll()

> **invalidateAll**(): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/secrets/src/interfaces.ts:40](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/interfaces.ts#L40)

#### Returns

`Promise`\<`void`\>

---

### resolve()

> **resolve**(`logicalKey`): `Promise`\<`string`>>>>\>

Defined in: [packages/shared/secrets/src/interfaces.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/interfaces.ts#L37)

#### Parameters

##### logicalKey

`string`

#### Returns

`Promise`\<`string`\>

---

### resolveMetadata()

> **resolveMetadata**(`logicalKey`): `Promise`\<[`SecretMetadata`](SecretMetadata.md) \| `undefined`>>>>\>

Defined in: [packages/shared/secrets/src/interfaces.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/interfaces.ts#L38)

#### Parameters

##### logicalKey

`string`

#### Returns

`Promise`\<[`SecretMetadata`](SecretMetadata.md) \| `undefined`\>
