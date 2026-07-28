[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / RustSDK

# Class: RustSDK

Defined in: [packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts:102](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts#L102)

## Constructors

### Constructor

> **new RustSDK**(): `RustSDK`

#### Returns

`RustSDK`

## Methods

### generate()

> **generate**(`name`, `version`): [`SDKPackage`](../interfaces/SDKPackage.md)

Defined in: [packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts:105](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts#L105)

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

Defined in: [packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts:123](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts#L123)

#### Parameters

##### packageId

`string`

#### Returns

[`SDKPackage`](../interfaces/SDKPackage.md) \| `undefined`

---

### getAll()

> **getAll**(): [`SDKPackage`](../interfaces/SDKPackage.md)[]

Defined in: [packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts:127](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts#L127)

#### Returns

[`SDKPackage`](../interfaces/SDKPackage.md)[]
