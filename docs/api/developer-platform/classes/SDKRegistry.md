[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / SDKRegistry

# Class: SDKRegistry

Defined in: [packages/platform/developer-platform/src/domain/sdk/SDKManager.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/sdk/SDKManager.ts#L13)

## Constructors

### Constructor

> **new SDKRegistry**(): `SDKRegistry`

#### Returns

`SDKRegistry`

## Methods

### deprecate()

> **deprecate**(`sdkId`): `void`

Defined in: [packages/platform/developer-platform/src/domain/sdk/SDKManager.ts:42](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/sdk/SDKManager.ts#L42)

#### Parameters

##### sdkId

`string`

#### Returns

`void`

---

### findByLanguage()

> **findByLanguage**(`language`): [`SDKEntry`](../interfaces/SDKEntry.md)[]

Defined in: [packages/platform/developer-platform/src/domain/sdk/SDKManager.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/sdk/SDKManager.ts#L38)

#### Parameters

##### language

`string`

#### Returns

[`SDKEntry`](../interfaces/SDKEntry.md)[]

---

### get()

> **get**(`sdkId`): [`SDKEntry`](../interfaces/SDKEntry.md) \| `undefined`

Defined in: [packages/platform/developer-platform/src/domain/sdk/SDKManager.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/sdk/SDKManager.ts#L34)

#### Parameters

##### sdkId

`string`

#### Returns

[`SDKEntry`](../interfaces/SDKEntry.md) \| `undefined`

---

### getAll()

> **getAll**(): [`SDKEntry`](../interfaces/SDKEntry.md)[]

Defined in: [packages/platform/developer-platform/src/domain/sdk/SDKManager.ts:49](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/sdk/SDKManager.ts#L49)

#### Returns

[`SDKEntry`](../interfaces/SDKEntry.md)[]

---

### register()

> **register**(`name`, `language`, `version`): [`SDKEntry`](../interfaces/SDKEntry.md)

Defined in: [packages/platform/developer-platform/src/domain/sdk/SDKManager.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/sdk/SDKManager.ts#L16)

#### Parameters

##### name

`string`

##### language

`string`

##### version

`string`

#### Returns

[`SDKEntry`](../interfaces/SDKEntry.md)
