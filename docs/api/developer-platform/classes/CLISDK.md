[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / CLISDK

# Class: CLISDK

Defined in: [packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts:140](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts#L140)

## Constructors

### Constructor

> **new CLISDK**(): `CLISDK`

#### Returns

`CLISDK`

## Methods

### generate()

> **generate**(`name`, `version`, `platform`): [`CLIBinary`](../interfaces/CLIBinary.md)

Defined in: [packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts:143](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts#L143)

#### Parameters

##### name

`string`

##### version

`string`

##### platform

`string`

#### Returns

[`CLIBinary`](../interfaces/CLIBinary.md)

---

### get()

> **get**(`binaryId`): [`CLIBinary`](../interfaces/CLIBinary.md) \| `undefined`

Defined in: [packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts:153](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts#L153)

#### Parameters

##### binaryId

`string`

#### Returns

[`CLIBinary`](../interfaces/CLIBinary.md) \| `undefined`

---

### getAll()

> **getAll**(): [`CLIBinary`](../interfaces/CLIBinary.md)[]

Defined in: [packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts:157](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/sdk/SDK.ts#L157)

#### Returns

[`CLIBinary`](../interfaces/CLIBinary.md)[]
