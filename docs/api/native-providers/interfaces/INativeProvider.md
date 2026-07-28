[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [native-providers](../README.md) / INativeProvider

# ~~Interface: INativeProvider~~

Defined in: [packages/provider/native-providers/src/interfaces.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/interfaces.ts#L12)

## Properties

### ~~id~~

> **id**: `string`

Defined in: [packages/provider/native-providers/src/interfaces.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/interfaces.ts#L13)

---

### ~~name~~

> **name**: `string`

Defined in: [packages/provider/native-providers/src/interfaces.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/interfaces.ts#L14)

## Methods

### ~~connect()~~

> **connect**(): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/interfaces.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/interfaces.ts#L16)

#### Returns

`Promise`\<`void`\>

---

### ~~disconnect()~~

> **disconnect**(): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/interfaces.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/interfaces.ts#L17)

#### Returns

`Promise`\<`void`\>

---

### ~~getHealth()~~

> **getHealth**(): `Promise`\<\{ `latencyMs`: `number`; `status`: `"UP"` \| `"DOWN"` \| `"DEGRADED"`; \}\>

Defined in: [packages/provider/native-providers/src/interfaces.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/interfaces.ts#L19)

#### Returns

`Promise`\<\{ `latencyMs`: `number`; `status`: `"UP"` \| `"DOWN"` \| `"DEGRADED"`; \}\>

---

### ~~initialize()~~

> **initialize**(`config`): `Promise`\<`void`>>>>\>

Defined in: [packages/provider/native-providers/src/interfaces.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/interfaces.ts#L15)

#### Parameters

##### config

[`IConfigurationProvider`](IConfigurationProvider.md)

#### Returns

`Promise`\<`void`\>

---

### ~~isConnected()~~

> **isConnected**(): `boolean`

Defined in: [packages/provider/native-providers/src/interfaces.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/native-providers/src/interfaces.ts#L18)

#### Returns

`boolean`
