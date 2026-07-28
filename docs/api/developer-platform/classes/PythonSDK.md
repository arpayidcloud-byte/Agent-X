[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / PythonSDK

# Class: PythonSDK

Defined in: [packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts:72](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts#L72)

## Constructors

### Constructor

> **new PythonSDK**(): `PythonSDK`

#### Returns

`PythonSDK`

## Methods

### generate()

> **generate**(`name`, `version`): [`SDKPackage`](../interfaces/SDKPackage.md)

Defined in: [packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts:75](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts#L75)

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

Defined in: [packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts:93](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts#L93)

#### Parameters

##### packageId

`string`

#### Returns

[`SDKPackage`](../interfaces/SDKPackage.md) \| `undefined`

---

### getAll()

> **getAll**(): [`SDKPackage`](../interfaces/SDKPackage.md)[]

Defined in: [packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts:97](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts#L97)

#### Returns

[`SDKPackage`](../interfaces/SDKPackage.md)[]
