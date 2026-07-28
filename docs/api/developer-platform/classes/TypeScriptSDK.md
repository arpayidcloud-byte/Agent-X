[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / TypeScriptSDK

# Class: TypeScriptSDK

Defined in: [packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts#L12)

## Constructors

### Constructor

> **new TypeScriptSDK**(): `TypeScriptSDK`

#### Returns

`TypeScriptSDK`

## Methods

### generate()

> **generate**(`name`, `version`): [`SDKPackage`](../interfaces/SDKPackage.md)

Defined in: [packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts#L15)

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

Defined in: [packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts#L33)

#### Parameters

##### packageId

`string`

#### Returns

[`SDKPackage`](../interfaces/SDKPackage.md) \| `undefined`

---

### getAll()

> **getAll**(): [`SDKPackage`](../interfaces/SDKPackage.md)[]

Defined in: [packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts#L37)

#### Returns

[`SDKPackage`](../interfaces/SDKPackage.md)[]
