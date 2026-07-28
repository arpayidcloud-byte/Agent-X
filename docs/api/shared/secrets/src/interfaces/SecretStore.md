[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/secrets/src](../README.md) / SecretStore

# Interface: SecretStore

Defined in: [packages/shared/secrets/src/interfaces.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/interfaces.ts#L21)

## Properties

### backendId

> `readonly` **backendId**: `string`

Defined in: [packages/shared/secrets/src/interfaces.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/interfaces.ts#L22)

## Methods

### delete()

> **delete**(`key`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/secrets/src/interfaces.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/interfaces.ts#L25)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`void`\>

---

### get()

> **get**(`key`): `Promise`\<[`SecretEntry`](SecretEntry.md)>>>>\>

Defined in: [packages/shared/secrets/src/interfaces.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/interfaces.ts#L23)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<[`SecretEntry`](SecretEntry.md)\>

---

### has()

> **has**(`key`): `Promise`\<`boolean`>>>>\>

Defined in: [packages/shared/secrets/src/interfaces.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/interfaces.ts#L27)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`boolean`\>

---

### list()

> **list**(): `Promise`\<`string`[]\>

Defined in: [packages/shared/secrets/src/interfaces.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/interfaces.ts#L26)

#### Returns

`Promise`\<`string`[]\>

---

### set()

> **set**(`key`, `value`, `metadata?`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/secrets/src/interfaces.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/interfaces.ts#L24)

#### Parameters

##### key

`string`

##### value

`string`

##### metadata?

[`SecretMetadata`](SecretMetadata.md)

#### Returns

`Promise`\<`void`\>
