[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / GoSDK

# Class: GoSDK

Defined in: [packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts:42](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts#L42)

## Constructors

### Constructor

> **new GoSDK**(): `GoSDK`

#### Returns

`GoSDK`

## Methods

### generate()

> **generate**(`name`, `version`): [`SDKPackage`](../interfaces/SDKPackage.md)

Defined in: [packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts#L45)

#### Parameters

##### name

`string`

##### version

`string`

#### Returns

[`SDKPackage`](../interfaces/SDKPackage.md)

---

### get()

> **get**(`packageId`): [`SDKPackage`](../interfaces/SDKPackage.md) \| `undefined`

Defined in: [packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts:63](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts#L63)

#### Parameters

##### packageId

`string`

#### Returns

[`SDKPackage`](../interfaces/SDKPackage.md) \| `undefined`

---

### getAll()

> **getAll**(): [`SDKPackage`](../interfaces/SDKPackage.md)[]

Defined in: [packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts:67](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts#L67)

#### Returns

[`SDKPackage`](../interfaces/SDKPackage.md)[]
